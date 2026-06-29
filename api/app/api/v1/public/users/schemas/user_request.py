from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr = Field(..., description='The email address of the user')
    password: str = Field(..., description='The password of the user')
    name: Optional[str] = Field(None, description='The full name of the user')
    first_name: Optional[str] = Field(None, description='The first name of the user')
    last_name: Optional[str] = Field(None, description='The last name of the user')
    role: Optional[str] = Field('Member', description='The role of the user')

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = Field(None, description='The email address of the user')
    password: Optional[str] = Field(None, description='The password of the user')
    name: Optional[str] = Field(None, description='The full name of the user')
    first_name: Optional[str] = Field(None, description='The first name of the user')
    last_name: Optional[str] = Field(None, description='The last name of the user')
    role: Optional[str] = Field(None, description='The role of the user')
