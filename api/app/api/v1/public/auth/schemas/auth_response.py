from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class RefreshTokenResponse(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    sub: Optional[int] = None


class GoogleUserInfo(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str


class GoogleAuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: GoogleUserInfo
