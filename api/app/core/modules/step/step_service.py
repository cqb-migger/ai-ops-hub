from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.step.models.step import Step
from app.core.modules.step.step_schemas import StepCreate, StepUpdate

async def get_steps_service(db: AsyncSession) -> List[Step]:
    """Retrieve all steps ordered by their sort order."""
    result = await db.execute(select(Step).order_by(Step.order))
    return list(result.scalars().all())

async def get_step_service(db: AsyncSession, step_id: str) -> Optional[Step]:
    """Retrieve a step by ID."""
    result = await db.execute(select(Step).where(Step.id == step_id))
    return result.scalars().first()

async def create_step_service(db: AsyncSession, step_in: StepCreate) -> Step:
    """Create a new step."""
    db_step = Step(
        id=step_in.id,
        order=step_in.order,
        icon=step_in.icon,
        title=step_in.title,
        description=step_in.description
    )
    db.add(db_step)
    await db.flush()
    await db.refresh(db_step)
    return db_step

async def update_step_service(db: AsyncSession, step_id: str, step_in: StepUpdate) -> Optional[Step]:
    """Update a step's details."""
    db_step = await get_step_service(db, step_id)
    if not db_step:
        return None
        
    update_data = step_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_step, field, value)
        
    db.add(db_step)
    await db.flush()
    await db.refresh(db_step)
    return db_step

async def delete_step_service(db: AsyncSession, step_id: str) -> Optional[Step]:
    """Hard delete a step."""
    db_step = await get_step_service(db, step_id)
    if not db_step:
        return None
        
    await db.delete(db_step)
    await db.flush()
    return db_step

async def bulk_save_steps_service(db: AsyncSession, steps_in: List[StepCreate]) -> List[Step]:
    """Replaces or saves a list of steps in bulk (useful for reordering)."""
    # Delete all existing steps first
    await db.execute(select(Step))  # Warm up / verify
    all_current = await get_steps_service(db)
    for s in all_current:
        await db.delete(s)
        
    db_steps = []
    for s_in in steps_in:
        db_step = Step(
            id=s_in.id,
            order=s_in.order,
            icon=s_in.icon,
            title=s_in.title,
            description=s_in.description
        )
        db.add(db_step)
        db_steps.append(db_step)
        
    await db.flush()
    return db_steps
