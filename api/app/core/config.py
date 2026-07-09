from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = 'Base'
    DEBUG: bool = Field(..., env='DEBUG')

    # Database Settings
    DATABASE_URL: str = Field(..., env='DATABASE_URL')

    # JWT Settings
    JWT_SECRET_KEY: str = Field(..., env='JWT_SECRET_KEY')
    JWT_ALGORITHM: str = Field(..., env='JWT_ALGORITHM')
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(..., env='JWT_ACCESS_TOKEN_EXPIRE_MINUTES')
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = Field(..., env='JWT_REFRESH_TOKEN_EXPIRE_DAYS')

    # LLM Settings
    OPENAI_API_KEY: Optional[str] = Field(None, env='OPENAI_API_KEY')
    ANTHROPIC_API_KEY: Optional[str] = Field(None, env='ANTHROPIC_API_KEY')
    GEMINI_API_KEY: Optional[str] = Field(None, env='GEMINI_API_KEY')
    GROK_API_KEY: Optional[str] = Field(None, env='GROK_API_KEY')

    # Agent Settings
    MAX_AGENT_ITERATIONS: int = Field(..., env='MAX_AGENT_ITERATIONS')

    # Google OAuth Settings
    GOOGLE_CLIENT_ID: Optional[str] = Field(None, env='GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET: Optional[str] = Field(None, env='GOOGLE_CLIENT_SECRET')

    # AWS S3 Settings
    AWS_ACCESS_KEY_ID: Optional[str] = Field(None, env='AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY: Optional[str] = Field(None, env='AWS_SECRET_ACCESS_KEY')
    AWS_REGION: Optional[str] = Field(None, env='AWS_REGION')
    AWS_S3_BUCKET_NAME: Optional[str] = Field(None, env='AWS_S3_BUCKET_NAME')
    AWS_S3_ENDPOINT_URL: Optional[str] = Field(None, env='AWS_S3_ENDPOINT_URL')
    AWS_S3_TENANT_ID: Optional[str] = Field(None, env='AWS_S3_TENANT_ID')

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')


settings = Settings()

