from fastapi import APIRouter, Depends

from app.api.v1.public.auth.auth_endpoint import router as auth_router
from app.api.v1.public.users.users_endpoint import router as users_router
from app.core.modules.auth.auth_dependencies import jwt_auth

router = APIRouter(prefix='')

router.include_router(auth_router)
router.include_router(users_router, dependencies=[Depends(jwt_auth)])
