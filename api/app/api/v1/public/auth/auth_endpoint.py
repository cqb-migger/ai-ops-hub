from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.public.auth.schemas.auth_request import LoginRequest
from app.api.v1.public.auth.schemas.auth_response import RefreshTokenResponse, Token
from app.api.v1.public.users.schemas.user_response import UserResponse
from app.core.db.dependencies import get_db
from app.core.modules.auth.auth_dependencies import get_current_user, refresh_token_auth
from app.core.modules.auth.auth_securities import create_access_token, create_refresh_token
from app.core.modules.auth.auth_service import authenticate_user
from app.core.modules.user.models.user import User

router = APIRouter(prefix='/auth', tags=['[Public] Auth'])


@router.post('/login', response_model=Token)
async def login_for_access_token(form_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate user and return access and refresh tokens."""
    user = await authenticate_user(db, email=form_data.email, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    # Assuming subject should be user ID
    subject = str(user.id)

    access_token = create_access_token(data={'sub': subject})
    refresh_token = create_refresh_token(data={'sub': subject})

    return {'access_token': access_token, 'refresh_token': refresh_token, 'token_type': 'bearer'}


@router.post('/refresh-token', response_model=RefreshTokenResponse)
async def refresh_token(current_user: User = Depends(refresh_token_auth)):
    """Refresh access token using refresh token."""
    access_token = create_access_token(data={'sub': str(current_user.id)})

    return {'access_token': access_token, 'token_type': 'bearer'}


@router.get('/me', response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get details of currently authenticated user."""
    return current_user
