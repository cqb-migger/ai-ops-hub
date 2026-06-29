from typing import Optional
from pydantic import BaseModel, ConfigDict

class StepBase(BaseModel):
    id: str
    order: int
    icon: Optional[str] = None
    title: str
    description: Optional[str] = None

class StepCreate(StepBase):
    pass

class StepUpdate(BaseModel):
    order: Optional[int] = None
    icon: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None

class StepResponse(StepBase):
    model_config = ConfigDict(from_attributes=True)
