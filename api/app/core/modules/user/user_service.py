from typing import List, Optional, Tuple

from fastapi import HTTPException, status
from sqlalchemy import delete, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.public.users.schemas.user_request import UserCreate, UserUpdate
from app.core.modules.auth.auth_securities import get_password_hash
from app.core.modules.user.models.user import User
from app.core.modules.user.models.user_role import UserRole

DEFAULT_ROLE = 'sale'


def _normalize_roles(roles: Optional[List[str]]) -> List[str]:
    """Clean role codes; 'admin' is exclusive (wins over everything else)."""
    cleaned = [r.strip() for r in (roles or []) if r and r.strip()]
    # de-duplicate, keep order
    seen = []
    for r in cleaned:
        if r not in seen:
            seen.append(r)
    if 'admin' in seen:
        return ['admin']
    return seen or [DEFAULT_ROLE]


async def _count_admins(db: AsyncSession) -> int:
    result = await db.execute(
        select(func.count(func.distinct(UserRole.user_id)))
        .select_from(UserRole)
        .join(User, User.id == UserRole.user_id)
        .where(UserRole.role == 'admin', User.deleted_at.is_(None))
    )
    return result.scalar_one()


async def _set_user_roles(db: AsyncSession, user_id: int, roles: List[str]) -> None:
    """Replace a user's roles with the given (normalized) set."""
    await db.execute(delete(UserRole).where(UserRole.user_id == user_id))
    for code in _normalize_roles(roles):
        db.add(UserRole(user_id=user_id, role=code))


async def create_user_service(db: AsyncSession, user_in: UserCreate) -> User:
    """Creates a new user in the database."""
    result = await db.execute(select(User).where(User.email == user_in.email, User.deleted_at.is_(None)))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Email already registered.',
        )

    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        password=hashed_password,
        name=user_in.name,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
    )
    db.add(db_user)
    try:
        await db.flush()
        # Roles come from `roles` (multi) or the legacy single `role`.
        initial_roles = user_in.roles if user_in.roles else ([user_in.role] if user_in.role else [DEFAULT_ROLE])
        await _set_user_roles(db, db_user.id, initial_roles)
        await db.flush()
        await db.refresh(db_user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Email already exists or another integrity error occurred.',
        )
    except Exception:
        await db.rollback()
        raise
    return db_user


async def get_user_service(db: AsyncSession, user_id: int) -> Optional[User]:
    """Gets a single user by ID (active only)."""
    result = await db.execute(select(User).where(User.id == user_id, User.deleted_at.is_(None)))
    return result.scalars().first()


async def get_users_service(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    search: Optional[str] = None
) -> Tuple[List[User], int]:
    """Gets a list of active users with pagination, filters, and total count."""
    base_query = select(User).where(User.deleted_at.is_(None))

    if role:
        role_sub = select(UserRole.user_id).where(UserRole.role == role)
        base_query = base_query.where(User.id.in_(role_sub))

    if search:
        search_filter = f"%{search}%"
        base_query = base_query.where(
            or_(
                User.name.ilike(search_filter),
                User.email.ilike(search_filter)
            )
        )

    count_query = select(func.count()).select_from(base_query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    query = base_query.order_by(User.id).offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()

    return list(users), total


async def update_user_service(db: AsyncSession, user_id: int, user_in: UserUpdate) -> Optional[User]:
    """Updates an existing user (including its role set)."""
    db_user = await get_user_service(db, user_id)
    if not db_user:
        return None

    update_data = user_in.model_dump(exclude_unset=True)

    # Determine the incoming role set (roles[] wins; falls back to legacy single role).
    new_roles: Optional[List[str]] = None
    if 'roles' in update_data:
        new_roles = _normalize_roles(update_data.pop('roles'))
    elif 'role' in update_data and update_data['role']:
        new_roles = _normalize_roles([update_data['role']])
    update_data.pop('role', None)

    # Guard the last administrator when demoting away from admin.
    if new_roles is not None and 'admin' in db_user.roles and 'admin' not in new_roles:
        if await _count_admins(db) <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='少なくとも1人の管理者アカウントが必要です。',
            )

    for field, value in update_data.items():
        if field == 'password':
            setattr(db_user, field, get_password_hash(value))
        else:
            setattr(db_user, field, value)

    try:
        if new_roles is not None:
            await _set_user_roles(db, user_id, new_roles)
        db.add(db_user)
        await db.flush()
        await db.refresh(db_user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Update failed due to data conflict (e.g., email already exists).',
        )
    except Exception:
        await db.rollback()
        raise
    return db_user


async def delete_user_service(db: AsyncSession, user_id: int) -> Optional[User]:
    """Soft deletes a user by ID."""
    db_user = await get_user_service(db, user_id)
    if not db_user:
        return None

    if 'admin' in db_user.roles and await _count_admins(db) <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='少なくとも1人の管理者アカウントが必要です。',
        )

    db_user.deleted_at = func.now()
    db.add(db_user)
    await db.flush()
    return db_user
