from pydantic import BaseModel


class ToolInputSchema(BaseModel):
    tool_input: str


class ToolOutputSchema(BaseModel):
    tool_output: str
