from app.tools.base_tool import BaseTool


class CalculatorTool(BaseTool):
    name = 'calculator'
    description: str = (
        'Useful for performing simple arithmetic calculations '
        '(addition, subtraction, multiplication, division). '
        "Input should be a mathematical expression string (e.g., '2 + 2', '10 * 5 / 2')."
    )

    def _calculate(self, expression: str) -> float | str:
        """Tries to safely evaluate a simple math expression."""
        try:
            # WARNING: eval() is generally unsafe. This is a simplified example.
            # In a real app, use a safer math expression parser (like asteval, numexpr).
            # Basic validation to limit operations:
            allowed_chars = '0123456789+-*/(). '
            if not all(c in allowed_chars for c in expression):
                return 'Error: Invalid characters in expression.'

            # Basic check for dangerous keywords (though limited)
            if any(kw in expression for kw in ['import', 'os', 'sys', '__']):
                return 'Error: Potentially unsafe expression.'

            # Using eval IS DANGEROUS in production with untrusted input.
            result = eval(expression, {'__builtins__': {}}, {})  # Limit builtins significantly
            return float(result)
        except Exception as e:
            return f"Error calculating '{expression}': {e}"

    def run(self, expression: str) -> str:
        """
        Executes the calculator tool.
        :param expression: A string containing the mathematical expression.
        :return: The result of the calculation as a string, or an error message.
        """
        result = self._calculate(expression)
        return str(result)  # Trả về string


# Create an instance for easy import/use
calculator = CalculatorTool()
