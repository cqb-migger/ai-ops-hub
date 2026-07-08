from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.dependencies import get_db
from app.core.modules.tool import tool_service
from app.core.modules.tool.tool_schemas import ToolCreate, ToolDetailResponse, ToolListResponse, ToolUpdate

router = APIRouter(prefix='/tools', tags=['[Private] Tools'])

@router.get('/', response_model=ToolListResponse, summary='Get list of tools')
async def get_tools(
    db: AsyncSession = Depends(get_db),
    category_id: Optional[int] = None,
    hub: Optional[str] = None,
    role: Optional[str] = None,
    search: Optional[str] = None,
    visibility: Optional[str] = 'all',
    skip: int = 0,
    limit: int = 20,
):
    """Lấy danh sách tools có filter và phân trang."""
    items, total = await tool_service.get_tools_service(
        db=db,
        category_id=category_id,
        hub=hub,
        role=role,
        search=search,
        visibility=visibility,
        skip=skip,
        limit=limit,
    )
    return ToolListResponse(items=items, total=total, skip=skip, limit=limit)

@router.get('/{tool_id}', response_model=ToolDetailResponse, summary='Get tool details')
async def get_tool(tool_id: int, db: AsyncSession = Depends(get_db)):
    """Lấy chi tiết tool kèm prompts, categories, roles, guide_files."""
    tool = await tool_service.get_tool_service(db=db, tool_id=tool_id)
    if tool is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Tool not found')
    return tool

@router.post('/', response_model=ToolDetailResponse, status_code=status.HTTP_201_CREATED, summary='Create new tool')
async def create_tool(tool_in: ToolCreate, db: AsyncSession = Depends(get_db)):
    """Tạo tool kèm categories, roles, prompts trong 1 transaction."""
    return await tool_service.create_tool_service(db=db, tool_in=tool_in)

@router.put('/{tool_id}', response_model=ToolDetailResponse, summary='Update tool')
async def update_tool(tool_id: int, tool_in: ToolUpdate, db: AsyncSession = Depends(get_db)):
    """Cập nhật tool + rebuild join tables."""
    tool = await tool_service.update_tool_service(db=db, tool_id=tool_id, tool_in=tool_in)
    if tool is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Tool not found')
    return tool

@router.delete('/{tool_id}', status_code=status.HTTP_204_NO_CONTENT, summary='Delete tool (soft)')
async def delete_tool(tool_id: int, db: AsyncSession = Depends(get_db)):
    """Soft delete tool."""
    deleted = await tool_service.delete_tool_service(db=db, tool_id=tool_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Tool not found')
    return None
