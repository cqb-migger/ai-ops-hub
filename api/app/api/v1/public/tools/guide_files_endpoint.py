import os
import uuid
from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.dependencies import get_db
from app.core.modules.tool.models.tool import Tool
from app.core.modules.tool.models.tool_guide_file import ToolGuideFile
from app.core.modules.tool.tool_schemas import GuideFileResponse
from app.core.utils.s3 import upload_file_to_s3_or_local

router = APIRouter(tags=['[Private] Tool Guide Files'])

GUIDE_UPLOAD_DIR = os.path.join('static', 'uploads', 'guides')
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {'.pdf', '.docx', '.xlsx', '.pptx', '.ppt', '.txt', '.md'}

async def _get_tool_or_404(tool_id: int, db: AsyncSession) -> Tool:
    result = await db.execute(select(Tool).where(Tool.id == tool_id, Tool.deleted_at.is_(None)))
    tool = result.scalars().first()
    if not tool:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Tool not found')
    return tool

@router.post('/tools/{tool_id}/guide-files', response_model=GuideFileResponse, status_code=status.HTTP_201_CREATED, summary='Upload guide file')
async def upload_guide_file(
    tool_id: int,
    file: UploadFile = File(...),
    order: int = Form(0),
    db: AsyncSession = Depends(get_db)
):
    """Upload file hướng dẫn đính kèm vào tool (PDF, DOCX, XLSX, PPTX, TXT, MD — max 10MB)."""
    await _get_tool_or_404(tool_id, db)

    _, ext = os.path.splitext(file.filename or '')
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Allowed formats: {", ".join(ALLOWED_EXTENSIONS)}'
        )

    contents = await file.read(MAX_FILE_SIZE + 1)
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail='File size exceeds the limit of 10MB'
        )

    stored_name = f"{uuid.uuid4()}{ext}"
    s3_key = f"guides/{tool_id}/{stored_name}"

    file_url, file_path = upload_file_to_s3_or_local(
        file_data=contents,
        key=s3_key,
        mime_type=file.content_type
    )

    db_file = ToolGuideFile(
        tool_id=tool_id,
        original_name=file.filename or stored_name,
        stored_name=stored_name,
        file_path=file_path,
        file_url=file_url,
        mime_type=file.content_type,
        file_size=len(contents),
        order=order
    )
    db.add(db_file)
    await db.flush()
    await db.refresh(db_file)
    return db_file

@router.get('/tools/{tool_id}/guide-files', response_model=List[GuideFileResponse], summary='Get guide files list')
async def list_guide_files(tool_id: int, db: AsyncSession = Depends(get_db)):
    """Lấy danh sách file đính kèm của tool theo thứ tự."""
    await _get_tool_or_404(tool_id, db)
    result = await db.execute(
        select(ToolGuideFile).where(ToolGuideFile.tool_id == tool_id).order_by(ToolGuideFile.order)
    )
    return list(result.scalars().all())

@router.delete('/tools/{tool_id}/guide-files/{file_id}', status_code=status.HTTP_204_NO_CONTENT, summary='Delete guide file')
async def delete_guide_file(tool_id: int, file_id: int, db: AsyncSession = Depends(get_db)):
    """Xóa file đính kèm — xóa cả file vật lý."""
    await _get_tool_or_404(tool_id, db)
    result = await db.execute(
        select(ToolGuideFile).where(ToolGuideFile.id == file_id, ToolGuideFile.tool_id == tool_id)
    )
    db_file = result.scalars().first()
    if not db_file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Guide file not found')

    local_path = os.path.join('static', 'uploads', db_file.file_path.replace('guides/', 'guides/', 1))
    if os.path.exists(local_path):
        os.remove(local_path)

    await db.execute(delete(ToolGuideFile).where(ToolGuideFile.id == file_id))
    return None
