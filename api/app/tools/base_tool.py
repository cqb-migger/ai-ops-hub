from abc import ABC, abstractmethod

from app.tools.schemas import ToolInputSchema, ToolOutputSchema


class BaseTool(ABC):
    def __init__(self, name: str, description: str):
        """Initialize the tool with a name and description."""
        self.name = name
        self.description = description

    @abstractmethod
    def run(self, input: ToolInputSchema) -> ToolOutputSchema:
        """Run the tool with the given input and return the output."""
        pass

    def __call__(self, input: ToolInputSchema) -> ToolOutputSchema:
        """Call the tool with the given input and return the output."""
        print(f'Running tool: {self.name}')
        result = self.run(input)
        print(f'Tool {self.name} returned: {result}')
        return result
