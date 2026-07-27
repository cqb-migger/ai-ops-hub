from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RoleBase(BaseModel):
    code: str
    name: str
    name_ja: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None


class RoleCreate(BaseModel):
    # `code` is optional: auto-generated from the name when omitted.
    code: Optional[str] = None
    name: Optional[str] = None
    name_ja: str
    name_en: str
    description: Optional[str] = None


class RoleUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    name_ja: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None


class RoleResponse(RoleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
