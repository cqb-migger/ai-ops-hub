from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.dependencies import get_db
from app.core.modules.category import category_service
from app.core.modules.category.category_schemas import CategoryResponse

router = APIRouter(prefix='/categories', tags=['[Private] Categories'])

@router.get('/', response_model=List[CategoryResponse], summary='Get list of categories (hubs)')
async def get_categories(db: AsyncSession = Depends(get_db)):
    """Lấy danh sách tất cả categories (hub) theo thứ tự order."""
    return await category_service.get_categories_service(db=db)
