from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field

class ToolBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    url: Optional[str] = None
    status: Optional[str] = '公開中'
    category: List[str] = Field(default_factory=list)
    hubs: List[str] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None

class ToolCreate(ToolBase):
    pass

class ToolUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    url: Optional[str] = None
    status: Optional[str] = None
    category: Optional[List[str]] = None
    hubs: Optional[List[str]] = None
    details: Optional[Dict[str, Any]] = None

class ToolResponse(ToolBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
