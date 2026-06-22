from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class BaseAgent(ABC):
    """Base class for all agents."""

    def __init__(self):
        self.tools = {}

    def add_tool(self, tool_name: str, tool_description: str):
        self.tools[tool_name] = tool_description

        # TODO: Add tool to the agent dynamically

    @abstractmethod
    def run(self, task: str, options: Optional[Dict[str, Any]] = None) -> str:
        pass
