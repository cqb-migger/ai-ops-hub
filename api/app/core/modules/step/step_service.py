from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.step.models.step import Step
from app.core.modules.step.step_schemas import StepCreate, StepUpdate
from app.core.modules.tool.models.tool_step import ToolStep

_STEP_IN_USE_MESSAGE = (
    'This tool is assigned to one or more compliance steps. '
    'Please remove it from all steps before deleting'
)


async def _assert_step_not_in_use(db: AsyncSession, step_id: int) -> None:
    """Raise 409 if the step is still linked to any tool."""
    count = await db.execute(
        select(func.count()).select_from(ToolStep).where(ToolStep.step_id == step_id)
    )
    if count.scalar_one() > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=_STEP_IN_USE_MESSAGE,
        )


async def get_steps_service(db: AsyncSession, category_id: Optional[int] = None) -> List[Step]:
    """Retrieve all steps ordered by their sort order, optionally filtered by category."""
    query = select(Step)
    if category_id is not None:
        query = query.where(Step.category_id == category_id)
    result = await db.execute(query.order_by(Step.order))
    return list(result.scalars().all())

async def get_step_service(db: AsyncSession, step_id: int) -> Optional[Step]:
    """Retrieve a step by ID."""
    result = await db.execute(select(Step).where(Step.id == step_id))
    return result.scalars().first()

async def create_step_service(db: AsyncSession, step_in: StepCreate, category_id: Optional[int] = None) -> Step:
    """Create a new step."""
    db_step = Step(
        id=step_in.id,
        category_id=step_in.category_id if step_in.category_id is not None else category_id,
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

    await _assert_step_not_in_use(db, step_id)

    await db.delete(db_step)
    await db.flush()
    return db_step

async def bulk_save_steps_service(db: AsyncSession, steps_in: List[StepCreate], category_id: Optional[int] = None) -> List[Step]:
    """
    Saves a list of steps in bulk (useful for reordering).
    Performs smart upsert (updates existing by ID, creates new, deletes those not in list)
    to preserve step_id foreign key references on tools where possible.
    """
    current_steps = await get_steps_service(db, category_id)
    current_map = {s.id: s for s in current_steps}

    incoming_ids = {s_in.id for s_in in steps_in if s_in.id is not None}

    # Delete steps that are not in the incoming list
    for s_id, s_obj in current_map.items():
        if s_id not in incoming_ids:
            await _assert_step_not_in_use(db, s_id)
            await db.delete(s_obj)

    # Process incoming list: update or create
    saved_steps = []
    for s_in in steps_in:
        if s_in.id is not None and s_in.id in current_map:
            db_step = current_map[s_in.id]
            if s_in.category_id is not None:
                db_step.category_id = s_in.category_id
            db_step.order = s_in.order
            db_step.icon = s_in.icon
            db_step.title = s_in.title
            db_step.description = s_in.description
            db.add(db_step)
        else:
            db_step = Step(
                id=s_in.id,
                category_id=s_in.category_id if s_in.category_id is not None else category_id,
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
