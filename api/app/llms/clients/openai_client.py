from typing import Dict, Optional

from openai import APIConnectionError, AuthenticationError, OpenAI, RateLimitError

from app.core.common.exceptions import ConfigurationError
from app.llms.clients.base_client import BaseLLMClient


class OpenAIClient(BaseLLMClient):
    """OpenAI client."""

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        if not api_key:
            raise ConfigurationError('API key is required')
        if not model_name:
            raise ConfigurationError('Model name is required')

        try:
            self.client = OpenAI(api_key=api_key)
            self.model_name = model_name
            print(f'OpenAI client initialized with model {self.model_name}')
        except AuthenticationError as e:
            raise ConfigurationError(f'OpenAI API key is invalid: {e}')
        except Exception as e:
            raise ConfigurationError(f'Failed to initialize OpenAI client: {e}')

    def invoke(self, prompt: str, **kwargs) -> str:
        """Invoke the OpenAI client."""
        messages = ([{'role': 'user', 'content': prompt}],)
        return self.chat(messages, **kwargs)

    def chat(self, messages: list[Dict[str, str]], **kwargs) -> str:
        """Chat with the OpenAI client."""
        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                temperature=kwargs.get('temperature', 0.7),
                max_tokens=kwargs.get('max_tokens', 1000),
                top_p=kwargs.get('top_p', 1),
                frequency_penalty=kwargs.get('frequency_penalty', 0),
                presence_penalty=kwargs.get('presence_penalty', 0),
            )
            return completion.choices[0].message.content or ''
        except AuthenticationError as e:
            raise ConfigurationError(f'OpenAI API key is invalid: {e}')
        except RateLimitError:
            return 'OpenAI API rate limit exceeded'
        except APIConnectionError:
            return 'OpenAI API connection error'
        except Exception as e:
            return f'OpenAI client error: {e}'

    def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text with the OpenAI client."""
        messages = ([{'role': 'user', 'content': prompt}],)
        return self.chat(messages, **kwargs)
