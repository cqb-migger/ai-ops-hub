from fastapi import APIRouter, Depends

from app.api.v1.public.auth.auth_endpoint import router as auth_router
from app.api.v1.public.categories.categories_endpoint import router as categories_router
from app.api.v1.public.steps.steps_endpoint import router as steps_router
from app.api.v1.public.tools.guide_files_endpoint import router as guide_files_router
from app.api.v1.public.tools.tools_endpoint import router as tools_router
from app.api.v1.public.upload_endpoint import router as upload_router
from app.api.v1.public.users.users_endpoint import router as users_router
from app.core.modules.auth.auth_dependencies import get_current_user

router = APIRouter(prefix='')

# Public Auth routers (except /auth/me which checks internally)
router.include_router(auth_router)

# Authenticated routers
router.include_router(users_router, dependencies=[Depends(get_current_user)])
router.include_router(tools_router, dependencies=[Depends(get_current_user)])
router.include_router(categories_router, dependencies=[Depends(get_current_user)])
router.include_router(guide_files_router, dependencies=[Depends(get_current_user)])
router.include_router(steps_router, dependencies=[Depends(get_current_user)])
router.include_router(upload_router, dependencies=[Depends(get_current_user)])

