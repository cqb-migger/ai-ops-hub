from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.public.users.schemas.user_request import UserCreate, UserUpdate
from app.api.v1.public.users.schemas.user_response import UserResponse
from app.core.db.dependencies import get_db
from app.core.modules.user import user_service

router = APIRouter(prefix='/users', tags=['[Public] Users'])

@router.get('/', response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db), skip: int = 0, limit: int = 100):
    """Retrieve a list of users."""
    users = await user_service.get_users_service(db=db, skip=skip, limit=limit)
    return users

@router.post('/', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Create a new user."""
    user = await user_service.create_user_service(db=db, user_in=user_in)
    return user

@router.get('/{user_id}', response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """Retrieve a specific user by ID."""
    user = await user_service.get_user_service(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return user

@router.put('/{user_id}', response_model=UserResponse)
async def update_user(user_id: int, user_in: UserUpdate, db: AsyncSession = Depends(get_db)):
    """Update an existing user."""
    user = await user_service.update_user_service(db=db, user_id=user_id, user_in=user_in)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return user

@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a user by ID."""
    user = await user_service.delete_user_service(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return None
