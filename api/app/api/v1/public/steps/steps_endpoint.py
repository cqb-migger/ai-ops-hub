from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.step.step_schemas import StepCreate, StepUpdate, StepResponse
from app.core.db.dependencies import get_db
from app.core.modules.step import step_service

router = APIRouter(prefix='/steps', tags=['[Public] Steps'])

@router.get('/', response_model=List[StepResponse])
async def get_steps(db: AsyncSession = Depends(get_db)):
    """Retrieve all steps ordered by their sequence order."""
    return await step_service.get_steps_service(db=db)

@router.post('/', response_model=List[StepResponse])
async def save_steps(steps_in: List[StepCreate], db: AsyncSession = Depends(get_db)):
    """Bulk save steps (replaces existing step sequence)."""
    return await step_service.bulk_save_steps_service(db=db, steps_in=steps_in)

@router.get('/{step_id}', response_model=StepResponse)
async def get_step(step_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve a specific step by ID."""
    step = await step_service.get_step_service(db=db, step_id=step_id)
    if step is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Step not found')
    return step

@router.put('/{step_id}', response_model=StepResponse)
async def update_step(step_id: str, step_in: StepUpdate, db: AsyncSession = Depends(get_db)):
    """Update a step by ID."""
    step = await step_service.update_step_service(db=db, step_id=step_id, step_in=step_in)
    if step is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Step not found')
    return step

@router.delete('/{step_id}', response_model=StepResponse)
async def delete_step(step_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a step by ID."""
    step = await step_service.delete_step_service(db=db, step_id=step_id)
    if step is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Step not found')
    return step
