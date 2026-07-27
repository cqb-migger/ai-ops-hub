from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.setting.models.app_setting import (
    APP_SETTING_ID,
    DEFAULT_APP_NAME,
    AppSetting,
)
from app.core.modules.setting.setting_schemas import AppSettingUpdate


async def get_app_setting_service(db: AsyncSession) -> AppSetting:
    """
    Return the singleton app-settings row, creating it with defaults on first
    access so callers never have to deal with a missing configuration.
    """
    result = await db.execute(select(AppSetting).where(AppSetting.id == APP_SETTING_ID))
    setting = result.scalars().first()
    if setting is None:
        setting = AppSetting(id=APP_SETTING_ID, app_name=DEFAULT_APP_NAME)
        db.add(setting)
        await db.flush()
        await db.refresh(setting)
    return setting


async def update_app_setting_service(db: AsyncSession, setting_in: AppSettingUpdate) -> AppSetting:
    """Update the singleton app-settings row (admin only)."""
    setting = await get_app_setting_service(db)

    update_data = setting_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(setting, field, value)

    db.add(setting)
    await db.flush()
    await db.refresh(setting)
    return setting
