from typing import List, Optional, Tuple

from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.public.users.schemas.user_request import UserCreate, UserUpdate
from app.core.modules.auth.auth_securities import get_password_hash
from app.core.modules.user.models.user import User


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
        role=user_in.role or 'sale',
    )
    db.add(db_user)
    try:
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
    user = result.scalars().first()
    return user

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
        base_query = base_query.where(User.role == role)

    if search:
        search_filter = f"%{search}%"
        base_query = base_query.where(
            or_(
                User.name.ilike(search_filter),
                User.email.ilike(search_filter)
            )
        )

    # Get total count
    count_query = select(func.count()).select_from(base_query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Get paginated items
    query = base_query.order_by(User.id).offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()

    return list(users), total

async def update_user_service(db: AsyncSession, user_id: int, user_in: UserUpdate) -> Optional[User]:
    """Updates an existing user."""
    db_user = await get_user_service(db, user_id)
    if not db_user:
        return None

    update_data = user_in.model_dump(exclude_unset=True)
    if 'role' in update_data and update_data['role'] == 'sale' and db_user.role == 'admin':
        result = await db.execute(select(User).where(User.role == 'admin', User.deleted_at.is_(None)))
        admins = result.scalars().all()
        if len(admins) <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='少なくとも1人の管理者アカウントが必要です。',
            )

    for field, value in update_data.items():
        if field == 'password':
            hashed_password = get_password_hash(value)
            setattr(db_user, field, hashed_password)
        else:
            setattr(db_user, field, value)

    db.add(db_user)
    try:
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

    if db_user.role == 'admin':
        result = await db.execute(select(User).where(User.role == 'admin', User.deleted_at.is_(None)))
        admins = result.scalars().all()
        if len(admins) <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='少なくとも1人の管理者アカウントが必要です。',
            )

    db_user.deleted_at = func.now()
    db.add(db_user)
    await db.flush()
    return db_user
