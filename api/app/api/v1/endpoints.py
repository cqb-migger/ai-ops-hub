from fastapi import APIRouter

from app.api.v1.agents.endpoints import router as agents_router
from app.api.v1.chat.endpoints import router as chat_router
from app.api.v1.internal.endpoints import router as internal_router
from app.api.v1.public.endpoints import router as public_router

router = APIRouter(prefix='/v1')


@router.get('/health', tags=['[Public] Base'])
async def health_check():
    return {'status': 'healthy'}


router.include_router(public_router)
router.include_router(internal_router)
router.include_router(chat_router)
router.include_router(agents_router)
