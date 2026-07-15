import httpx
import jwt
from jwt import PyJWKClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.modules.user.models.user import User

GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs'
GOOGLE_ISSUERS = ('https://accounts.google.com', 'accounts.google.com')

# Cached across requests: re-fetching Google's signing keys on every login would rate-limit us.
_jwks_client = PyJWKClient(GOOGLE_JWKS_URL, cache_keys=True)


class GoogleAuthError(Exception):
    """Google credential could not be verified."""


class DomainNotAllowedError(Exception):
    """Authenticated Google account is outside the allowed workspace domain."""

    def __init__(self, email: str):
        self.email = email
        super().__init__(f'{email} is not a {settings.GOOGLE_ALLOWED_DOMAIN} account.')


def _require_client_id() -> str:
    if not settings.GOOGLE_CLIENT_ID:
        raise GoogleAuthError('GOOGLE_CLIENT_ID is not configured on the server.')
    return settings.GOOGLE_CLIENT_ID


def verify_google_id_token(credential: str) -> dict:
    """Verify a Google ID token's signature, issuer and audience, then return its claims."""
    client_id = _require_client_id()
    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(credential)
        return jwt.decode(
            credential,
            signing_key.key,
            algorithms=['RS256'],
            audience=client_id,
            issuer=GOOGLE_ISSUERS,
            options={'require': ['exp', 'iat', 'aud', 'iss', 'sub']},
        )
    except jwt.PyJWTError as e:
        raise GoogleAuthError(f'Invalid Google credential token: {e}') from e


def assert_allowed_domain(google_user_info: dict) -> None:
    """Reject any account outside the allowed workspace domain."""
    allowed_domain = (settings.GOOGLE_ALLOWED_DOMAIN or '').lower()
    if not allowed_domain:
        return

    email = (google_user_info.get('email') or '').lower()

    # Google only sets email_verified for addresses it has confirmed; without it the
    # address proves nothing about domain membership.
    if not google_user_info.get('email_verified'):
        raise DomainNotAllowedError(email or 'unknown')

    # `hd` is the Workspace-managed domain claim, and a consumer account can never carry
    # hd=earlybirdjapan.co.jp. That claim is what actually enforces membership; the email
    # suffix is a backstop against a domain alias resolving somewhere unexpected.
    hosted_domain = (google_user_info.get('hd') or '').lower()
    if hosted_domain != allowed_domain or not email.endswith(f'@{allowed_domain}'):
        raise DomainNotAllowedError(email or 'unknown')


def _describe_token_error(response: httpx.Response, redirect_uri: str) -> str:
    """Turn Google's terse token-endpoint error into something actionable."""
    try:
        body = response.json()
    except ValueError:
        body = {}

    code = body.get('error') or f'HTTP {response.status_code}'
    description = body.get('error_description') or ''

    hints = {
        # Google returns invalid_grant for several distinct situations; list them all
        # because the response body does not distinguish between them.
        'invalid_grant': (
            'The authorization code was already used, has expired (they last ~10 minutes), '
            'or was issued to a different client_id. Start a fresh sign-in; do not replay a code.'
        ),
        'redirect_uri_mismatch': (
            f'redirect_uri {redirect_uri!r} is not registered for this OAuth client. '
            'Add it verbatim under Authorized redirect URIs in Google Cloud Console.'
        ),
        'invalid_client': 'GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET do not match a real OAuth client.',
        'unauthorized_client': 'This OAuth client is not allowed to use the authorization_code grant.',
    }
    hint = hints.get(code, '')
    return ' '.join(part for part in (f'Google rejected the authorization code ({code}).', description, hint) if part)


async def exchange_google_code(code: str, redirect_uri: str) -> dict:
    """Exchange a Google authorization code for tokens and return the verified ID token claims."""
    client_id = _require_client_id()
    if not settings.GOOGLE_CLIENT_SECRET:
        raise GoogleAuthError('GOOGLE_CLIENT_SECRET is not configured on the server.')

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            token_response = await client.post(
                GOOGLE_TOKEN_URL,
                data={
                    'code': code,
                    'client_id': client_id,
                    'client_secret': settings.GOOGLE_CLIENT_SECRET,
                    'redirect_uri': redirect_uri,
                    'grant_type': 'authorization_code',
                },
            )
        except httpx.HTTPError as e:
            raise GoogleAuthError(f'Could not reach Google to exchange the authorization code: {e}') from e

    if token_response.status_code != 200:
        # Google puts the actual reason in the body (invalid_grant, redirect_uri_mismatch,
        # invalid_client...). Surfacing only the HTTP status makes this undebuggable.
        raise GoogleAuthError(_describe_token_error(token_response, redirect_uri))

    token_data = token_response.json()

    # Prefer the id_token over the userinfo endpoint: it is signed, and it carries the
    # `hd` and `email_verified` claims that userinfo does not reliably return.
    id_token = token_data.get('id_token')
    if not id_token:
        raise GoogleAuthError('Google token response did not include an id_token.')

    return verify_google_id_token(id_token)


async def upsert_google_user(db: AsyncSession, google_user_info: dict) -> User:
    """
    Upsert a user from verified Google claims.

    - google_id match -> refresh last_login / avatar
    - email match     -> link google_id onto the existing account
    - no match        -> create with role='sale'

    Callers must run assert_allowed_domain() first; this function trusts its input.
    """
    google_id = google_user_info.get('sub')
    email = google_user_info.get('email')
    name = google_user_info.get('name')
    avatar_url = google_user_info.get('picture')

    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalars().first()

    if user is None:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        if user is not None:
            user.google_id = google_id
            user.name = user.name or name

    if user is not None:
        user.avatar_url = avatar_url or user.avatar_url
        user.last_login = func.now()
        await db.commit()
        await db.refresh(user)
        return user

    new_user = User(
        email=email,
        password=None,  # Google-authenticated users never get a local password.
        name=name,
        first_name=google_user_info.get('given_name'),
        last_name=google_user_info.get('family_name'),
        role='sale',
        avatar_url=avatar_url,
        google_id=google_id,
        is_active=1,
        last_login=func.now(),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user
