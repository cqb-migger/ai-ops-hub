from typing import List, Optional
from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.tool.models.tool import Tool
from app.core.modules.tool.tool_schemas import ToolCreate, ToolUpdate

async def get_tools_service(
    db: AsyncSession, 
    hub: Optional[str] = None, 
    category: Optional[str] = None, 
    search: Optional[str] = None
) -> List[Tool]:
    """Retrieve all tools with optional filtering."""
    query = select(Tool).where(Tool.deleted_at.is_(None)).order_by(Tool.name)
    
    # Since hubs was renamed to category in database, both inputs query the category column
    filter_val = category or hub
    if filter_val:
        query = query.where(Tool.category.contains([filter_val]))
        
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            or_(
                Tool.name.ilike(search_filter),
                Tool.description.ilike(search_filter)
            )
        )
        
    result = await db.execute(query)
    return list(result.scalars().all())

async def get_tool_service(db: AsyncSession, tool_id: str) -> Optional[Tool]:
    """Get a tool by ID."""
    result = await db.execute(select(Tool).where(Tool.id == tool_id, Tool.deleted_at.is_(None)))
    return result.scalars().first()

async def create_tool_service(db: AsyncSession, tool_in: ToolCreate) -> Tool:
    """Create a new tool."""
    db_tool = Tool(
        name=tool_in.name,
        description=tool_in.description,
        icon=tool_in.icon,
        url=tool_in.url,
        status=tool_in.status or '公開中',
        category=tool_in.category,
        details=tool_in.details
    )
    db.add(db_tool)
    await db.flush()
    await db.refresh(db_tool)
    return db_tool

async def update_tool_service(db: AsyncSession, tool_id: str, tool_in: ToolUpdate) -> Optional[Tool]:
    """Update an existing tool."""
    db_tool = await get_tool_service(db, tool_id)
    if not db_tool:
        return None
        
    update_data = tool_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_tool, field, value)
        
    db.add(db_tool)
    await db.flush()
    await db.refresh(db_tool)
    return db_tool

async def delete_tool_service(db: AsyncSession, tool_id: str) -> Optional[Tool]:
    """Soft delete a tool."""
    db_tool = await get_tool_service(db, tool_id)
    if not db_tool:
        return None
        
    db_tool.deleted_at = func.now()
    db.add(db_tool)
    await db.flush()
    return db_tool
