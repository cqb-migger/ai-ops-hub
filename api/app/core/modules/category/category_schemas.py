from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator


class CategoryResponse(BaseModel):
    id: int
    order: int
    name_ja: Optional[str] = None
    name_en: Optional[str] = None
    menu_name_ja: Optional[str] = None
    menu_name_en: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None
    has_step_flow: bool = False

    model_config = ConfigDict(from_attributes=True)


def _required(v: Optional[str]) -> str:
    v = (v or '').strip()
    if not v:
        raise ValueError('This field is required')
    return v


class CategoryCreate(BaseModel):
    order: Optional[int] = 0
    name_ja: str
    name_en: str
    menu_name_ja: str
    menu_name_en: str
    slug: Optional[str] = None
    icon: Optional[str] = None
    has_step_flow: Optional[bool] = False

    @field_validator('name_ja', 'name_en', 'menu_name_ja', 'menu_name_en')
    @classmethod
    def _not_blank(cls, v: str) -> str:
        return _required(v)


class CategoryUpdate(BaseModel):
    order: Optional[int] = None
    name_ja: Optional[str] = None
    name_en: Optional[str] = None
    menu_name_ja: Optional[str] = None
    menu_name_en: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None
    has_step_flow: Optional[bool] = None

    @field_validator('name_ja', 'name_en', 'menu_name_ja', 'menu_name_en')
    @classmethod
    def _not_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return _required(v)
        return v
