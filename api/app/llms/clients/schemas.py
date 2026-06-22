from typing import Optional

from pydantic import BaseModel, Field


class LLMOptions(BaseModel):
    temperature: float = 0.7
    max_tokens: int = 1000
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0


class LLMRequest(BaseModel):
    prompt: str
    provider: Optional[str] = Field(default='openai')
    options: Optional[LLMOptions] = Field(default_factory=LLMOptions)


class LLMResponse(BaseModel):
    content: str
    usage: dict
    model: str
    response_time: float
    error: str | None = None
