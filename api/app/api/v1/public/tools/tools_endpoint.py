from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.tool.tool_schemas import ToolCreate, ToolUpdate, ToolResponse
from app.core.db.dependencies import get_db
from app.core.modules.tool import tool_service

router = APIRouter(prefix='/tools', tags=['[Public] Tools'])

@router.get('/', response_model=List[ToolResponse])
async def get_tools(
    db: AsyncSession = Depends(get_db), 
    hub: Optional[str] = None, 
    category: Optional[str] = None, 
    search: Optional[str] = None
):
    """Retrieve list of tools with optional filtering."""
    return await tool_service.get_tools_service(db=db, hub=hub, category=category, search=search)

@router.get('/{tool_id}', response_model=ToolResponse)
async def get_tool(tool_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve a specific tool by ID."""
    tool = await tool_service.get_tool_service(db=db, tool_id=tool_id)
    if tool is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Tool not found')
    return tool

@router.post('/', response_model=ToolResponse, status_code=status.HTTP_201_CREATED)
async def create_tool(tool_in: ToolCreate, db: AsyncSession = Depends(get_db)):
    """Create a new tool."""
    return await tool_service.create_tool_service(db=db, tool_in=tool_in)

@router.put('/{tool_id}', response_model=ToolResponse)
async def update_tool(tool_id: str, tool_in: ToolUpdate, db: AsyncSession = Depends(get_db)):
    """Update an existing tool."""
    tool = await tool_service.update_tool_service(db=db, tool_id=tool_id, tool_in=tool_in)
    if tool is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Tool not found')
    return tool

@router.delete('/{tool_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_tool(tool_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a tool by ID."""
    tool = await tool_service.delete_tool_service(db=db, tool_id=tool_id)
    if tool is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Tool not found')
    return None
