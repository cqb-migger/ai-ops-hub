from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


from typing import Optional


class GoogleAuthRequest(BaseModel):
    code: Optional[str] = None
    redirect_uri: Optional[str] = None
    credential: Optional[str] = None


