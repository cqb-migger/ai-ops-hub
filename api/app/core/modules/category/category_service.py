import re
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.category.category_schemas import CategoryCreate, CategoryUpdate
from app.core.modules.category.models.category import Category
from app.core.modules.tool.models.tool_category import ToolCategory


def _slugify(value: str) -> str:
    """Turn a name into a URL-safe slug; ASCII-only, so non-latin falls back to a stub."""
    value = (value or '').strip().lower()
    value = re.sub(r'[^a-z0-9]+', '-', value).strip('-')
    return value or 'category'


async def _ensure_unique_slug(db: AsyncSession, base: str, exclude_id: Optional[int] = None) -> str:
    """Return `base`, appending -2, -3, ... until it is unique across categories."""
    candidate = base
    suffix = 2
    while True:
        q = select(Category.id).where(Category.slug == candidate)
        if exclude_id is not None:
            q = q.where(Category.id != exclude_id)
        exists = (await db.execute(q)).first()
        if not exists:
            return candidate
        candidate = f'{base}-{suffix}'
        suffix += 1


async def get_categories_service(db: AsyncSession) -> List[Category]:
    """Retrieve all categories ordered by order."""
    result = await db.execute(select(Category).order_by(Category.order, Category.id))
    return list(result.scalars().all())


async def get_category_service(db: AsyncSession, category_id: int) -> Optional[Category]:
    result = await db.execute(select(Category).where(Category.id == category_id))
    return result.scalars().first()


async def get_category_by_slug_service(db: AsyncSession, slug: str) -> Optional[Category]:
    result = await db.execute(select(Category).where(Category.slug == slug))
    return result.scalars().first()


async def create_category_service(db: AsyncSession, category_in: CategoryCreate) -> Category:
    base_slug = _slugify(category_in.slug or category_in.name_en)
    slug = await _ensure_unique_slug(db, base_slug)

    order = category_in.order
    if order is None or order == 0:
        max_order = (await db.execute(select(func.coalesce(func.max(Category.order), 0)))).scalar_one()
        order = max_order + 1

    db_category = Category(
        order=order,
        name_ja=category_in.name_ja,
        name_en=category_in.name_en,
        menu_name_ja=category_in.menu_name_ja,
        menu_name_en=category_in.menu_name_en,
        slug=slug,
        icon=category_in.icon,
        has_step_flow=bool(category_in.has_step_flow),
    )
    db.add(db_category)
    await db.flush()
    await db.refresh(db_category)
    return db_category


async def update_category_service(
    db: AsyncSession, category_id: int, category_in: CategoryUpdate
) -> Optional[Category]:
    db_category = await get_category_service(db, category_id)
    if not db_category:
        return None

    update_data = category_in.model_dump(exclude_unset=True)

    # Normalise/uniquify the slug if it (or the English name it derives from) changed.
    if 'slug' in update_data:
        base = _slugify(update_data['slug'] or update_data.get('name_en') or db_category.name_en or '')
        update_data['slug'] = await _ensure_unique_slug(db, base, exclude_id=category_id)

    for field, value in update_data.items():
        setattr(db_category, field, value)

    db.add(db_category)
    await db.flush()
    await db.refresh(db_category)
    return db_category


async def delete_category_service(db: AsyncSession, category_id: int) -> Optional[Category]:
    db_category = await get_category_service(db, category_id)
    if not db_category:
        return None

    in_use = await db.execute(
        select(func.count()).select_from(ToolCategory).where(ToolCategory.category_id == category_id)
    )
    if in_use.scalar_one() > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='This category is assigned to one or more tools. Remove it from all tools before deleting.',
        )

    await db.delete(db_category)
    await db.flush()
    return db_category
