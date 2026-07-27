from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.dependencies import get_db
from app.core.modules.auth.auth_dependencies import require_admin
from app.core.modules.category import category_service
from app.core.modules.category.category_schemas import (
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
)
from app.core.modules.user.models.user import User

router = APIRouter(prefix='/categories', tags=['[Private] Categories'])


@router.get('/', response_model=List[CategoryResponse], summary='Get list of categories (hubs)')
async def get_categories(db: AsyncSession = Depends(get_db)):
    """Lấy danh sách tất cả categories (hub) theo thứ tự order."""
    return await category_service.get_categories_service(db=db)


@router.get('/slug/{slug}', response_model=CategoryResponse, summary='Get a category by slug')
async def get_category_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """Resolve a category by its slug (used by the dynamic hub pages)."""
    category = await category_service.get_category_by_slug_service(db=db, slug=slug)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
    return category


@router.post('/', response_model=CategoryResponse, summary='Create a category')
async def create_category(
    category_in: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only: create a new category (optionally shown as a sidebar menu)."""
    return await category_service.create_category_service(db=db, category_in=category_in)


@router.put('/{category_id}', response_model=CategoryResponse, summary='Update a category')
async def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only: update a category's names, menu labels, icon or nav visibility."""
    category = await category_service.update_category_service(
        db=db, category_id=category_id, category_in=category_in
    )
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
    return category


@router.delete('/{category_id}', status_code=status.HTTP_204_NO_CONTENT, summary='Delete a category')
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only: delete a category (blocked if any tool still uses it)."""
    category = await category_service.delete_category_service(db=db, category_id=category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
    return None
