from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr = Field(..., description='The email address of the user')
    password: str = Field(..., description='The password of the user')
    name: Optional[str] = Field(None, description='The full name of the user')
    first_name: Optional[str] = Field(None, description='The first name of the user')
    last_name: Optional[str] = Field(None, description='The last name of the user')
    role: Optional[str] = Field(None, description='Legacy single role (fallback)')
    roles: Optional[List[str]] = Field(None, description='Role codes assigned to the user')

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = Field(None, description='The email address of the user')
    password: Optional[str] = Field(None, description='The password of the user')
    name: Optional[str] = Field(None, description='The full name of the user')
    first_name: Optional[str] = Field(None, description='The first name of the user')
    last_name: Optional[str] = Field(None, description='The last name of the user')
    role: Optional[str] = Field(None, description='Legacy single role (fallback)')
    roles: Optional[List[str]] = Field(None, description='Role codes assigned to the user')
