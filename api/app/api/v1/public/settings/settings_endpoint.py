from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.dependencies import get_db
from app.core.modules.auth.auth_dependencies import require_admin
from app.core.modules.setting import setting_service
from app.core.modules.setting.setting_schemas import AppSettingResponse, AppSettingUpdate
from app.core.modules.user.models.user import User

router = APIRouter(prefix='/settings', tags=['[Public] Settings'])


@router.get('/app', response_model=AppSettingResponse, summary='Get application settings')
async def get_app_settings(db: AsyncSession = Depends(get_db)):
    """Public: application name and logo used for branding across the app and login page."""
    return await setting_service.get_app_setting_service(db=db)


@router.put('/app', response_model=AppSettingResponse, summary='Update application settings')
async def update_app_settings(
    setting_in: AppSettingUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only: update the application name and/or logo."""
    return await setting_service.update_app_setting_service(db=db, setting_in=setting_in)
