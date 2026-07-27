import re
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.dependencies import get_db
from app.core.modules.role.models.role import Role
from app.core.modules.role.schemas.role_schema import RoleCreate, RoleResponse, RoleUpdate

router = APIRouter()


def _slugify_code(value: str) -> str:
    """Build a URL-safe role code from a name (ASCII); falls back to 'role'."""
    value = (value or '').strip().lower()
    value = re.sub(r'[^a-z0-9]+', '_', value).strip('_')
    return value or 'role'


async def _unique_code(db: AsyncSession, base: str) -> str:
    """Return `base`, appending _2, _3, ... until the code is unique."""
    candidate = base
    suffix = 2
    while (await db.execute(select(Role.id).where(Role.code == candidate))).first():
        candidate = f'{base}_{suffix}'
        suffix += 1
    return candidate


@router.get("/", response_model=List[RoleResponse])
async def get_roles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).order_by(Role.id))
    roles = result.scalars().all()
    return roles


@router.post("/", response_model=RoleResponse)
async def create_role(role_in: RoleCreate, db: AsyncSession = Depends(get_db)):
    # Code is auto-generated (admins no longer type it) from EN name / JP name.
    base_code = _slugify_code(role_in.code or role_in.name_en or role_in.name_ja)
    code = await _unique_code(db, base_code)

    # `name` keeps a value for backwards compatibility (defaults to the JP name).
    name = role_in.name or role_in.name_ja or role_in.name_en

    db_role = Role(
        code=code,
        name=name,
        name_ja=role_in.name_ja,
        name_en=role_in.name_en,
        description=role_in.description,
    )
    db.add(db_role)
    await db.commit()
    await db.refresh(db_role)
    return db_role


@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(role_id: int, role_in: RoleUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).where(Role.id == role_id))
    db_role = result.scalars().first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    if role_in.code is not None and role_in.code != db_role.code:
        result_code = await db.execute(select(Role).where(Role.code == role_in.code))
        if result_code.scalars().first():
            raise HTTPException(status_code=400, detail="Role code already exists")

    update_data = role_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_role, field, value)

    # Keep the legacy `name` in sync with the JP name for compatibility.
    if 'name_ja' in update_data and update_data['name_ja']:
        db_role.name = update_data['name_ja']

    await db.commit()
    await db.refresh(db_role)
    return db_role


@router.delete("/{role_id}")
async def delete_role(role_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).where(Role.id == role_id))
    db_role = result.scalars().first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    await db.delete(db_role)
    await db.commit()
    return {"message": "Role deleted successfully"}
