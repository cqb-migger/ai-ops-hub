import io
import os
import urllib.parse
import zipfile
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import ValidationError
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db.dependencies import get_db
from app.core.config import settings
from app.core.modules.auth.auth_securities import decode_token
from app.core.modules.user.models.user import User
from app.core.modules.tool.models.tool import Tool
from app.core.modules.tool.models.tool_category import ToolCategory
from app.core.modules.tool.models.tool_role import ToolRole
from app.core.modules.tool.models.tool_step import ToolStep
from app.core.modules.tool.models.tool_guide_file import ToolGuideFile
from app.core.modules.category.models.category import Category
from app.core.utils.s3 import get_s3_client

router = APIRouter(prefix='/tools', tags=['[Public] Downloads'])

security = HTTPBearer(auto_error=False)

async def get_current_user_with_query_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    actual_token = None
    if credentials:
        actual_token = credentials.credentials
    elif token:
        actual_token = token

    if not actual_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Could not validate credentials',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    payload = decode_token(actual_token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Could not validate credentials',
        )

    user_id = payload.get('sub')
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Could not validate credentials',
        )

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')

    return user

def read_file_bytes(file_path: str) -> bytes:
    aws_configured = settings.AWS_ACCESS_KEY_ID and settings.AWS_ACCESS_KEY_ID != 'mock'
    if aws_configured:
        try:
            s3_client = get_s3_client()
            bucket_name = settings.AWS_S3_BUCKET_NAME or 'ai-ops-hub-guides'
            res = s3_client.get_object(Bucket=bucket_name, Key=file_path)
            return res['Body'].read()
        except Exception:
            pass

    # Try local
    for prefix in ['static/uploads', 'app/static/uploads']:
        full_path = os.path.join(prefix, file_path)
        if os.path.exists(full_path):
            with open(full_path, 'rb') as f:
                return f.read()
    raise FileNotFoundError(f"File not found in S3 or locally: {file_path}")

@router.get('/{tool_id}/guide-files/{file_id}/download', summary='Download a single reference file')
async def download_guide_file(
    tool_id: int,
    file_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_with_query_token),
):
    """Tải một file tài liệu tham khảo của tool (đúng tên gốc)."""
    result = await db.execute(
        select(ToolGuideFile).where(
            ToolGuideFile.id == file_id,
            ToolGuideFile.tool_id == tool_id,
        )
    )
    gf = result.scalars().first()
    if gf is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Guide file not found')

    # Non-admin users may only access files of public tools
    if current_user.role != 'admin':
        tool_res = await db.execute(
            select(Tool).where(Tool.id == tool_id, Tool.deleted_at.is_(None), Tool.visibility == 'public')
        )
        if tool_res.scalars().first() is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Guide file not found')

    try:
        file_data = read_file_bytes(gf.file_path)
    except FileNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='File no longer exists')

    filename = gf.original_name or gf.stored_name
    quoted = urllib.parse.quote(filename)
    return StreamingResponse(
        io.BytesIO(file_data),
        media_type=gf.mime_type or 'application/octet-stream',
        headers={'Content-Disposition': f"attachment; filename*=UTF-8''{quoted}"},
    )

@router.get('/download-guides', summary='Download guidance and reference files as ZIP')
async def download_guides(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_with_query_token),
    category_id: Optional[int] = None,
    hub: Optional[str] = None,
    role: Optional[str] = None,
    search: Optional[str] = None,
    step_id: Optional[int] = None,
):
    base_q = (
        select(Tool)
        .where(Tool.deleted_at.is_(None))
        .options(
            selectinload(Tool.tool_categories),
            selectinload(Tool.tool_roles),
            selectinload(Tool.tool_steps),
            selectinload(Tool.guide_files),
        )
    )

    # For security, normal users can only access visible public/active tools
    if current_user.role != 'admin':
        base_q = base_q.where(Tool.visibility == 'public')

    if category_id:
        sub = select(ToolCategory.tool_id).where(ToolCategory.category_id == category_id)
        base_q = base_q.where(Tool.id.in_(sub))
    elif hub:
        slug_map = {'creative': 'クリエイティブ', 'compliance': 'コンプライアンス', 'data': 'データ'}
        keyword = slug_map.get(hub.lower(), hub)
        cat_sub = select(Category.id).where(Category.name.ilike(f'%{keyword}%'))
        tc_sub = select(ToolCategory.tool_id).where(ToolCategory.category_id.in_(cat_sub))
        base_q = base_q.where(Tool.id.in_(tc_sub))

    if role:
        role_sub = select(ToolRole.tool_id).where(ToolRole.role == role)
        no_restriction_sub = select(Tool.id).where(~Tool.id.in_(select(ToolRole.tool_id)))
        base_q = base_q.where(or_(Tool.id.in_(role_sub), Tool.id.in_(no_restriction_sub)))

    if search:
        like = f'%{search}%'
        base_q = base_q.where(or_(Tool.name.ilike(like), Tool.description.ilike(like)))

    if step_id:
        step_sub = select(ToolStep.tool_id).where(ToolStep.step_id == step_id)
        base_q = base_q.where(Tool.id.in_(step_sub))

    res = await db.execute(base_q)
    tools = res.scalars().all()

    zip_buffer = io.BytesIO()
    has_files = False

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for tool in tools:
            if not tool.guide_files:
                continue

            sanitized_tool_name = tool.name.replace('/', '_').replace('\\', '_').strip()

            for gf in tool.guide_files:
                try:
                    file_data = read_file_bytes(gf.file_path)
                    zip_path = f"{sanitized_tool_name}/{gf.original_name}"
                    zip_file.writestr(zip_path, file_data)
                    has_files = True
                except Exception as e:
                    import logging
                    logging.error(f"Failed to read file {gf.file_path}: {str(e)}")
                    continue

    if not has_files:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No guide files found for the selected filters."
        )

    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type='application/x-zip-compressed',
        headers={'Content-Disposition': 'attachment; filename=compliance_guides.zip'}
    )
