from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    id: int = Field(..., description='The ID of the user')
    email: EmailStr = Field(..., description='The email address of the user')
    name: Optional[str] = Field(None, description='The full name of the user')
    first_name: Optional[str] = Field(None, description='The first name of the user')
    last_name: Optional[str] = Field(None, description='The last name of the user')
    role: str = Field(..., description='Primary role (admin-aware) for compatibility')
    roles: List[str] = Field(default_factory=list, description='All role codes assigned to the user')
    last_login: Optional[datetime] = Field(None, description='The last login date and time')
    is_active: bool = Field(True, description='Whether the user is active')
    created_at: datetime = Field(..., description='The date and time the user was created')
    updated_at: datetime = Field(..., description='The date and time the user was last updated')

    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    items: List[UserResponse]
    total: int
    skip: int
    limit: int
