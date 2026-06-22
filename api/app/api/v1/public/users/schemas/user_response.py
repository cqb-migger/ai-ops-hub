from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    id: int = Field(..., description='The ID of the user')
    email: EmailStr = Field(..., description='The email address of the user')
    first_name: str = Field(..., description='The first name of the user')
    last_name: str = Field(..., description='The last name of the user')
    is_active: bool = Field(..., description='Whether the user is active')
    created_at: datetime = Field(..., description='The date and time the user was created')
    updated_at: datetime = Field(..., description='The date and time the user was last updated')

    class Config:
        from_attributes = True
