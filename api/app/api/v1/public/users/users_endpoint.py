from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.public.users.schemas.user_request import UserCreate, UserUpdate
from app.api.v1.public.users.schemas.user_response import UserListResponse, UserResponse
from app.core.db.dependencies import get_db
from app.core.modules.auth.auth_dependencies import require_admin
from app.core.modules.user import user_service
from app.core.modules.user.models.user import User

router = APIRouter(prefix='/users', tags=['[Private] Users'])


async def _assert_not_last_admin(db: AsyncSession, user_id: int) -> None:
    """Block the change if it would leave the system with no administrator at all."""
    target = await user_service.get_user_service(db=db, user_id=user_id)
    if target is None or target.role != 'admin':
        return

    result = await db.execute(
        select(func.count()).select_from(User).where(User.role == 'admin', User.deleted_at.is_(None))
    )
    if result.scalar_one() <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Cannot remove the last administrator. Grant the admin role to someone else first.',
        )

@router.get('/', response_model=UserListResponse, summary='Get list of users')
async def get_users(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    search: Optional[str] = None
):
    """Lấy danh sách users có phân trang, lọc theo role và tìm kiếm."""
    users, total = await user_service.get_users_service(
        db=db, skip=skip, limit=limit, role=role, search=search
    )
    return UserListResponse(items=users, total=total, skip=skip, limit=limit)

@router.post('/', response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary='Create new user')
async def create_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Tạo user mới. Chỉ admin."""
    user = await user_service.create_user_service(db=db, user_in=user_in)
    return user

@router.get('/{user_id}', response_model=UserResponse, summary='Get user details')
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """Lấy thông tin chi tiết của một user theo ID."""
    user = await user_service.get_user_service(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return user

@router.put('/{user_id}', response_model=UserResponse, summary='Update user')
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Cập nhật thông tin user (đổi role). Chỉ admin."""
    if user_in.role is not None and user_in.role != 'admin':
        await _assert_not_last_admin(db, user_id)

    user = await user_service.update_user_service(db=db, user_id=user_id, user_in=user_in)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return user

@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT, summary='Delete user (soft)')
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Xóa user (soft delete). Chỉ admin."""
    await _assert_not_last_admin(db, user_id)
    user = await user_service.delete_user_service(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return None
