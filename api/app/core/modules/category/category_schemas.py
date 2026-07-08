from pydantic import BaseModel, ConfigDict


class CategoryResponse(BaseModel):
    id: int
    name: str
    order: int

    model_config = ConfigDict(from_attributes=True)
