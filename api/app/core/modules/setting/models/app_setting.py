from sqlalchemy import Column, DateTime, Integer, String, func

from app.core.db.database import Base

# The application only ever keeps a single settings row; this is its fixed id.
APP_SETTING_ID = 1

DEFAULT_APP_NAME = 'AI Navigator'


class AppSetting(Base):
    """Global, admin-editable application configuration (name + logo)."""

    __tablename__ = 'app_settings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    app_name = Column(String, nullable=False, server_default=DEFAULT_APP_NAME)
    logo_url = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<AppSetting(id={self.id}, app_name='{self.app_name}')>"
