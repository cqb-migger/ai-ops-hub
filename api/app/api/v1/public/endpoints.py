from fastapi import APIRouter

from app.api.v1.public.auth.auth_endpoint import router as auth_router
from app.api.v1.public.users.users_endpoint import router as users_router
from app.api.v1.public.tools.tools_endpoint import router as tools_router
from app.api.v1.public.steps.steps_endpoint import router as steps_router
from app.api.v1.public.upload_endpoint import router as upload_router

router = APIRouter(prefix='')

router.include_router(auth_router)
router.include_router(users_router)  # Authenticated route temporarily disabled for easy front-end CRUD
router.include_router(tools_router)
router.include_router(steps_router)
router.include_router(upload_router)
