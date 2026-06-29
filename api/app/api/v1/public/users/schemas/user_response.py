from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserResponse(BaseModel):
    id: int = Field(..., description='The ID of the user')
    email: EmailStr = Field(..., description='The email address of the user')
    name: Optional[str] = Field(None, description='The full name of the user')
    first_name: Optional[str] = Field(None, description='The first name of the user')
    last_name: Optional[str] = Field(None, description='The last name of the user')
    role: str = Field(..., description='The role of the user')
    last_login: Optional[datetime] = Field(None, description='The last login date and time')
    created_at: datetime = Field(..., description='The date and time the user was created')
    updated_at: datetime = Field(..., description='The date and time the user was last updated')

    class Config:
        from_attributes = True
