from abc import ABC, abstractmethod
from typing import Dict


class BaseLLMClient(ABC):
    """Base class for all LLM clients."""

    @abstractmethod
    def invoke(self, prompt: str, **kwargs) -> str:
        pass

    @abstractmethod
    def chat(self, messages: list[Dict[str, str]], **kwargs) -> str:
        pass

    @abstractmethod
    def generate_text(self, prompt: str, **kwargs) -> str:
        pass

    @abstractmethod
    def generate_image(self, prompt: str, **kwargs) -> str:
        pass
