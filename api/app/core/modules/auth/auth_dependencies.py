from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.public.auth.schemas.auth_response import TokenData
from app.core.db.dependencies import get_db
from app.core.modules.auth.auth_securities import decode_refresh_token, decode_token
from app.core.modules.user.models.user import User

security = HTTPBearer()


async def jwt_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)
) -> TokenData:
    """Dependency to get the current user from a JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'},
    )

    token = credentials.credentials
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception

    userId: Optional[str] = payload.get('sub')
    if userId is None:
        raise credentials_exception

    try:
        token_data = TokenData(sub=userId)
    except ValidationError:
        raise credentials_exception

    return token_data


async def refresh_token_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)
) -> User:
    """Dependency to get the current user from a JWT refresh token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'},
    )

    token = credentials.credentials
    payload = decode_refresh_token(token)
    if payload is None:
        raise credentials_exception

    userId: Optional[str] = payload.get('sub')
    if userId is None:
        raise credentials_exception

    try:
        token_data = TokenData(sub=userId)
    except ValidationError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == token_data.sub))
    user = result.scalars().first()

    if user is None:
        raise credentials_exception

    return user


async def get_current_user(token_data: TokenData = Depends(jwt_auth), db: AsyncSession = Depends(get_db)) -> User:
    """Dependency to get the current user from a JWT token."""
    result = await db.execute(select(User).where(User.id == token_data.sub))
    user = result.scalars().first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')

    return user


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency for endpoints only administrators may call.

    get_current_user proves who you are, not what you may do. Anything that grants roles or
    removes accounts needs this on top, otherwise any signed-in user can promote themselves.
    """
    if current_user.role != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='This action requires administrator privileges.',
        )
    return current_user
