from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.public.users.schemas.user_request import UserCreate, UserUpdate
from app.core.modules.auth.auth_securities import get_password_hash
from app.core.modules.user.models.user import User

async def create_user_service(db: AsyncSession, user_in: UserCreate) -> User:
    """Creates a new user in the database."""
    result = await db.execute(select(User).where(User.email == user_in.email))
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
        role=user_in.role or 'Member',
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
    """Gets a single user by ID."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    return user

async def get_users_service(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[User]:
    """Gets a list of users with pagination."""
    result = await db.execute(select(User).order_by(User.id).offset(skip).limit(limit))
    users = result.scalars().all()
    return list(users)

async def update_user_service(db: AsyncSession, user_id: int, user_in: UserUpdate) -> Optional[User]:
    """Updates an existing user."""
    db_user = await get_user_service(db, user_id)
    if not db_user:
        return None

    update_data = user_in.model_dump(exclude_unset=True)
    if 'role' in update_data and update_data['role'] == 'Member' and db_user.role == 'Admin':
        result = await db.execute(select(User).where(User.role == 'Admin'))
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
    """Deletes a user by ID."""
    db_user = await get_user_service(db, user_id)
    if not db_user:
        return None

    if db_user.role == 'Admin':
        result = await db.execute(select(User).where(User.role == 'Admin'))
        admins = result.scalars().all()
        if len(admins) <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='少なくとも1人の管理者アカウントが必要です。',
            )

    await db.delete(db_user)
    await db.flush()
    return db_user
