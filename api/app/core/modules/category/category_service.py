from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.category.models.category import Category


async def get_categories_service(db: AsyncSession) -> List[Category]:
    """Retrieve all categories ordered by order."""
    result = await db.execute(select(Category).order_by(Category.order))
    return list(result.scalars().all())
