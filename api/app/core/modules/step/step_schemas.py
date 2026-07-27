from typing import Optional

from pydantic import BaseModel, ConfigDict


class StepBase(BaseModel):
    category_id: Optional[int] = None
    order: int
    icon: Optional[str] = None
    title: str
    description: Optional[str] = None

class StepCreate(StepBase):
    id: Optional[int] = None

class StepUpdate(BaseModel):
    order: Optional[int] = None
    icon: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None

class StepResponse(StepBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
