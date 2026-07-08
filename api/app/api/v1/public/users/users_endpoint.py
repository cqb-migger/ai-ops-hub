from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.public.users.schemas.user_request import UserCreate, UserUpdate
from app.api.v1.public.users.schemas.user_response import UserListResponse, UserResponse
from app.core.db.dependencies import get_db
from app.core.modules.user import user_service

router = APIRouter(prefix='/users', tags=['[Public] Users'])

@router.get('/', response_model=UserListResponse, summary='Lấy danh sách users')
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

@router.post('/', response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary='Tạo user mới')
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Tạo user mới."""
    user = await user_service.create_user_service(db=db, user_in=user_in)
    return user

@router.get('/{user_id}', response_model=UserResponse, summary='Lấy thông tin chi tiết user')
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """Lấy thông tin chi tiết của một user theo ID."""
    user = await user_service.get_user_service(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return user

@router.put('/{user_id}', response_model=UserResponse, summary='Cập nhật thông tin user')
async def update_user(user_id: int, user_in: UserUpdate, db: AsyncSession = Depends(get_db)):
    """Cập nhật thông tin user (đổi role)."""
    user = await user_service.update_user_service(db=db, user_id=user_id, user_in=user_in)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return user

@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT, summary='Xóa user (soft delete)')
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """Xóa user (soft delete)."""
    user = await user_service.delete_user_service(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return None
