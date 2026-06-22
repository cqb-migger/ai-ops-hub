from typing import Any, Dict, List, Optional

from app.agents.base_agent import BaseAgent
from app.llms.clients.openai_client import OpenAIClient


class LLMAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.llm = OpenAIClient()  # Default to OpenAI

    async def run(self, task: str, options: Optional[Dict[str, Any]] = None) -> str:
        """Run the agent with LLM to solve a task"""
        options = options or {}

        # If no tools available, just use the LLM directly
        if not self.tools:
            return await self.llm.generate(task, options)

        # With tools, implement a simple planning and execution loop
        plan = await self._create_plan(task)
        result = await self._execute_plan(plan, task)
        return result

    async def _create_plan(self, task: str) -> List[Dict[str, Any]]:
        """Create a plan using LLM"""
        tools_desc = '\n'.join([f'- {name}: {tool.description}' for name, tool in self.tools.items()])

        prompt = f"""
        You need to create a plan to solve this task: {task}
        
        Available tools:
        {tools_desc}
        
        Return a JSON array of steps, where each step has a 'tool' and 'input' field.
        """

        _plan_json = await self.llm.generate_text(prompt, {'output_format': 'json'})
        # In real implementation, parse the JSON and validate it
        # For simplicity, we'll return a mocked plan
        return [{'tool': list(self.tools.keys())[0], 'input': task}]

    async def _execute_plan(self, plan: List[Dict[str, Any]], original_task: str) -> str:
        """Execute a plan"""
        results = []

        for step in plan:
            tool_name = step.get('tool')
            tool_input = step.get('input')

            if tool_name in self.tools:
                tool = self.tools[tool_name]
                result = await tool.run(tool_input)
                results.append(f'Step result: {result}')
            else:
                results.append(f'Tool {tool_name} not found')

        # Synthesize final answer
        synthesis_prompt = f"""
        Original task: {original_task}
        
        Tool results:
        {' '.join(results)}
        
        Based on these results, provide a final answer to the original task.
        """

        return await self.llm.generate_text(synthesis_prompt)
