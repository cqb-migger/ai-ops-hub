from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator


class AppSettingResponse(BaseModel):
    app_name: str
    logo_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AppSettingUpdate(BaseModel):
    app_name: Optional[str] = None
    logo_url: Optional[str] = None

    @field_validator('app_name')
    @classmethod
    def _app_name_not_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                raise ValueError('app_name must not be empty')
        return v
