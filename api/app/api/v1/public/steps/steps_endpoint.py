from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.dependencies import get_db
from app.core.modules.step import step_service
from app.core.modules.step.step_schemas import StepCreate, StepResponse, StepUpdate

router = APIRouter(prefix='/steps', tags=['[Public] Steps'])

@router.get('/', response_model=List[StepResponse], summary='Lấy danh sách steps')
async def get_steps(db: AsyncSession = Depends(get_db)):
    """Lấy danh sách tất cả các bước trong Compliance Flow, sắp xếp theo order."""
    return await step_service.get_steps_service(db=db)

@router.post('/', response_model=List[StepResponse], summary='Bulk save/reorder steps')
async def save_steps(steps_in: List[StepCreate], db: AsyncSession = Depends(get_db)):
    """Lưu hàng loạt steps (sau khi kéo thả sắp xếp lại)."""
    return await step_service.bulk_save_steps_service(db=db, steps_in=steps_in)

@router.get('/{step_id}', response_model=StepResponse, summary='Chi tiết step')
async def get_step(step_id: int, db: AsyncSession = Depends(get_db)):
    """Lấy chi tiết một step theo ID."""
    step = await step_service.get_step_service(db=db, step_id=step_id)
    if step is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Step not found')
    return step

@router.put('/{step_id}', response_model=StepResponse, summary='Cập nhật step')
async def update_step(step_id: int, step_in: StepUpdate, db: AsyncSession = Depends(get_db)):
    """Cập nhật thông tin của một step."""
    step = await step_service.update_step_service(db=db, step_id=step_id, step_in=step_in)
    if step is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Step not found')
    return step

@router.delete('/{step_id}', status_code=status.HTTP_204_NO_CONTENT, summary='Xóa step')
async def delete_step(step_id: int, db: AsyncSession = Depends(get_db)):
    """Xóa một step theo ID."""
    step = await step_service.delete_step_service(db=db, step_id=step_id)
    if step is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Step not found')
    return None
