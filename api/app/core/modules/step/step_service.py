from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.step.models.step import Step
from app.core.modules.step.step_schemas import StepCreate, StepUpdate


async def get_steps_service(db: AsyncSession) -> List[Step]:
    """Retrieve all steps ordered by their sort order."""
    result = await db.execute(select(Step).order_by(Step.order))
    return list(result.scalars().all())

async def get_step_service(db: AsyncSession, step_id: int) -> Optional[Step]:
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

async def update_step_service(db: AsyncSession, step_id: int, step_in: StepUpdate) -> Optional[Step]:
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

async def delete_step_service(db: AsyncSession, step_id: int) -> Optional[Step]:
    """Hard delete a step."""
    db_step = await get_step_service(db, step_id)
    if not db_step:
        return None

    await db.delete(db_step)
    await db.flush()
    return db_step

async def bulk_save_steps_service(db: AsyncSession, steps_in: List[StepCreate]) -> List[Step]:
    """
    Saves a list of steps in bulk (useful for reordering).
    Performs smart upsert (updates existing by ID, creates new, deletes those not in list)
    to preserve step_id foreign key references on tools where possible.
    """
    current_steps = await get_steps_service(db)
    current_map = {s.id: s for s in current_steps}

    incoming_ids = {s_in.id for s_in in steps_in if s_in.id is not None}

    # Delete steps that are not in the incoming list
    for s_id, s_obj in current_map.items():
        if s_id not in incoming_ids:
            await db.delete(s_obj)

    # Process incoming list: update or create
    saved_steps = []
    for s_in in steps_in:
        if s_in.id is not None and s_in.id in current_map:
            db_step = current_map[s_in.id]
            db_step.order = s_in.order
            db_step.icon = s_in.icon
            db_step.title = s_in.title
            db_step.description = s_in.description
            db.add(db_step)
        else:
            db_step = Step(
                id=s_in.id,
                order=s_in.order,
                icon=s_in.icon,
                title=s_in.title,
                description=s_in.description
            )
            db.add(db_step)

        saved_steps.append(db_step)

    await db.flush()
    for s in saved_steps:
        await db.refresh(s)

    saved_steps.sort(key=lambda x: x.order)
    return saved_steps
