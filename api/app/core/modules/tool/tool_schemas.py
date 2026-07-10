from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict


# Category (nested in tool responses)
class CategoryInTool(BaseModel):
    id: int
    name: str
    order: int = 0
    model_config = ConfigDict(from_attributes=True)

# Guide File
class GuideFileCreate(BaseModel):
    original_name: str
    stored_name: str
    file_path: str
    file_url: str
    mime_type: Optional[str] = None
    file_size: Optional[int] = None
    order: int = 0

class GuideFileResponse(BaseModel):
    id: int
    tool_id: int
    original_name: str
    stored_name: str
    file_path: str
    file_url: Optional[str] = None
    mime_type: Optional[str] = None
    file_size: Optional[int] = None
    order: int = 0
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Prompt
class PromptCreate(BaseModel):
    title: str
    description: Optional[str] = None
    content: str
    is_recommended: bool = False
    order: int = 0
    roles: List[str] = []
    category_ids: List[int] = []

class PromptResponse(BaseModel):
    id: int
    tool_id: int
    title: str
    description: Optional[str] = None
    content: str
    is_recommended: bool
    order: int
    roles: List[str] = []
    categories: List[CategoryInTool] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Tool
class ToolCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    url: Optional[str] = None
    status: Optional[str] = '公開中'
    visibility: Optional[str] = 'public'
    category_ids: List[int] = []
    roles: List[str] = []
    login_ids: List[str] = []
    guide_content: Optional[str] = None
    admin_memo: Optional[str] = None
    step_ids: List[int] = []
    details: Optional[Dict[str, Any]] = None
    mcp_name: Optional[str] = None
    mcp_type: Optional[str] = None
    mcp_stdio_command: Optional[str] = None
    mcp_stdio_args: Optional[List[str]] = None
    mcp_stdio_env: Optional[List[dict]] = None
    mcp_stdio_env_passthrough: Optional[List[str]] = None
    mcp_stdio_work_dir: Optional[str] = None
    mcp_http_url: Optional[str] = None
    mcp_http_bearer_token_env: Optional[str] = None
    mcp_http_headers: Optional[List[dict]] = None
    mcp_http_headers_from_env: Optional[List[dict]] = None
    prompts: List[PromptCreate] = []
    guide_files: List[GuideFileCreate] = []

class ToolUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    url: Optional[str] = None
    status: Optional[str] = None
    visibility: Optional[str] = None
    category_ids: Optional[List[int]] = None
    roles: Optional[List[str]] = None
    login_ids: Optional[List[str]] = None
    guide_content: Optional[str] = None
    admin_memo: Optional[str] = None
    step_ids: Optional[List[int]] = None
    details: Optional[Dict[str, Any]] = None
    mcp_name: Optional[str] = None
    mcp_type: Optional[str] = None
    mcp_stdio_command: Optional[str] = None
    mcp_stdio_args: Optional[List[str]] = None
    mcp_stdio_env: Optional[List[dict]] = None
    mcp_stdio_env_passthrough: Optional[List[str]] = None
    mcp_stdio_work_dir: Optional[str] = None
    mcp_http_url: Optional[str] = None
    mcp_http_bearer_token_env: Optional[str] = None
    mcp_http_headers: Optional[List[dict]] = None
    mcp_http_headers_from_env: Optional[List[dict]] = None
    prompts: Optional[List[PromptCreate]] = None
    guide_files: Optional[List[GuideFileCreate]] = None

class ToolListItem(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    url: Optional[str] = None
    status: str
    visibility: str
    categories: List[CategoryInTool] = []
    roles: List[str] = []
    login_ids: List[str] = []
    step_ids: List[int] = []
    is_favorite: bool = False
    mcp_name: Optional[str] = None
    mcp_type: Optional[str] = None
    mcp_stdio_command: Optional[str] = None
    mcp_stdio_args: Optional[List[str]] = None
    mcp_stdio_env: Optional[List[dict]] = None
    mcp_stdio_env_passthrough: Optional[List[str]] = None
    mcp_stdio_work_dir: Optional[str] = None
    mcp_http_url: Optional[str] = None
    mcp_http_bearer_token_env: Optional[str] = None
    mcp_http_headers: Optional[List[dict]] = None
    mcp_http_headers_from_env: Optional[List[dict]] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ToolDetailResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    url: Optional[str] = None
    status: str
    visibility: str
    login_ids: List[str] = []
    guide_content: Optional[str] = None
    admin_memo: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    mcp_name: Optional[str] = None
    mcp_type: Optional[str] = None
    mcp_stdio_command: Optional[str] = None
    mcp_stdio_args: Optional[List[str]] = None
    mcp_stdio_env: Optional[List[dict]] = None
    mcp_stdio_env_passthrough: Optional[List[str]] = None
    mcp_stdio_work_dir: Optional[str] = None
    mcp_http_url: Optional[str] = None
    mcp_http_bearer_token_env: Optional[str] = None
    mcp_http_headers: Optional[List[dict]] = None
    mcp_http_headers_from_env: Optional[List[dict]] = None
    step_ids: List[int] = []
    is_favorite: bool = False
    categories: List[CategoryInTool] = []
    roles: List[str] = []
    guide_files: List[GuideFileResponse] = []
    prompts: List[PromptResponse] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ToolListResponse(BaseModel):
    items: List[ToolListItem]
    total: int
    skip: int
    limit: int
