from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.public.auth.schemas.auth_request import GoogleAuthRequest, LoginRequest
from app.api.v1.public.auth.schemas.auth_response import (
    GoogleAuthResponse,
    GoogleUserInfo,
    RefreshTokenResponse,
    Token,
)
from app.api.v1.public.users.schemas.user_response import UserResponse
from app.core.config import settings
from app.core.db.dependencies import get_db
from app.core.modules.auth.auth_dependencies import get_current_user, refresh_token_auth
from app.core.modules.auth.auth_securities import create_access_token, create_refresh_token
from app.core.modules.auth.auth_service import authenticate_user
from app.core.modules.auth.google_auth_service import (
    DomainNotAllowedError,
    GoogleAuthError,
    assert_allowed_domain,
    exchange_google_code,
    upsert_google_user,
    verify_google_id_token,
)
from app.core.modules.user.models.user import User

router = APIRouter(prefix='/auth', tags=['[Private] Auth'])


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
    subject = str(user.id)
    access_token = create_access_token(data={'sub': subject})
    refresh_token = create_refresh_token(data={'sub': subject})
    return {'access_token': access_token, 'refresh_token': refresh_token, 'token_type': 'bearer'}


@router.post('/google', response_model=GoogleAuthResponse)
async def google_oauth_login(body: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    """
    Exchange a Google OAuth code or ID token credential for internal JWT tokens.

    Only verified Google Workspace accounts on GOOGLE_ALLOWED_DOMAIN may sign in.
    First-time sign-ins create a user with role='sale'.
    """
    try:
        if body.credential:
            google_user_info = verify_google_id_token(body.credential)
        elif body.code and body.redirect_uri:
            google_user_info = await exchange_google_code(code=body.code, redirect_uri=body.redirect_uri)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Either credential or (code and redirect_uri) must be provided.',
            )
    except GoogleAuthError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    try:
        assert_allowed_domain(google_user_info)
    except DomainNotAllowedError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f'Sign-in is restricted to {settings.GOOGLE_ALLOWED_DOMAIN} accounts. {e.email} is not eligible.',
        )

    user = await upsert_google_user(db=db, google_user_info=google_user_info)

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='This account has been deactivated.')

    access_token = create_access_token(data={'sub': str(user.id)})
    refresh_token = create_refresh_token(data={'sub': str(user.id)})

    return GoogleAuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type='bearer',
        user=GoogleUserInfo(
            id=user.id,
            email=user.email,
            name=user.name,
            avatar_url=user.avatar_url,
            role=user.role,
        ),
    )


@router.post('/refresh-token', response_model=RefreshTokenResponse)
async def refresh_token(current_user: User = Depends(refresh_token_auth)):
    """Refresh access token using refresh token."""
    access_token = create_access_token(data={'sub': str(current_user.id)})
    return {'access_token': access_token, 'token_type': 'bearer'}


@router.get('/me', response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get details of currently authenticated user."""
    return current_user
