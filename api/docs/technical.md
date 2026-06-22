# Technical

## Code Organization and Structure

### Naming Conventions
- Use snake_case for directories and files (e.g., `user_routes.py`)
- Use PascalCase for classes (e.g., `UserModel`, `UserService`)
- Use snake_case for functions and variables (e.g., `get_user`, `user_id`)
- Suffix files based on their type where appropriate:
  - `_router.py` or within `endpoints/` directory for API routers/endpoints
  - `_service.py` or `services.py` for services
  - `_model.py` or `models.py` for database models/entities
  - `_schema.py` or `schemas.py` for Pydantic schemas (DTOs)
  - `_repo.py` or `repositories.py` for repositories (optional, often part of service)
  - `_config.py` for configurations
  - `_utils.py` for utility functions

### Import Paths
- Always use absolute paths relative to the `app` root for imports:
  - Use `from app.core.modules.users.services import UserService` instead of relative paths like `../../users/services`
  - This improves code maintainability and readability, especially when files are moved
  - Exception: Relative imports (`from . import models`) are acceptable within the same module/package.

### Core Module Structure (`app/core/modules/`)
Each logical domain (module) should have its own folder within `app/core/modules/` (e.g., `app/core/modules/users/`). A typical structure includes:
- `models/`: Contains SQLAlchemy/SQLModel database models (e.g., `user_model.py`).
- `services/`: Contains business logic implementations (e.g., `user_service.py`). Interacts with models/repositories.
- `schemas/`: Contains Pydantic schemas for data validation and serialization (request/response DTOs). Often split into `request/` and `response/` subdirectories or files like `user_schema.py`.
- `repositories/`: (Optional) Contains database access logic, abstracting database operations. Often integrated into services for simpler applications.
- `constants/`: (Optional) Module-specific constants or enums.
- `utils/`: (Optional) Module-specific utility functions.
- `__init__.py`: Makes the directory a Python package.

## API Endpoints and Controllers (Routers)

### Routing and Router Organization (`app/api/`)
- Routers are typically organized under `app/api/v1/` (or other versions).
- Within a version, routers can be grouped by functionality or access level (e.g., `public/`, `internal/`, `auth/').
- Endpoint logic is defined in files usually located within an `endpoints/` subdirectory (e.g., `app/api/v1/public/endpoints/users_router.py`).

- When creating a new router/endpoint file:
  1. Name the file descriptively, often ending with `_router.py` or placed in an `endpoints` directory (e.g., `app/api/v1/public/endpoints/users_router.py`).
  2. Define an `APIRouter` instance within the file.
  3. Implement path operation functions (using decorators like `@router.get`, `@router.post`).
  4. Include the new router in the main API aggregation file (e.g., `app/api/v1/endpoints.py` or directly in `app/api/main.py`).

### Router Examples

#### Public Router Example
```python
# app/api/v1/public/endpoints/example_router.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.example.services import ExampleService # Assuming service exists
from app.core.modules.example.schemas.response import ExampleResponseSchema # Assuming schema exists
from app.core.db.dependencies import get_db

router = APIRouter()
example_service = ExampleService() # In reality, use Depends for service injection

@router.get("/examples", response_model=list[ExampleResponseSchema])
async def get_all_examples(db: AsyncSession = Depends(get_db)):
    """
    Retrieve all examples.
    """
    examples = await example_service.get_all(db=db)
    return examples

@router.get("/examples/{example_id}", response_model=ExampleResponseSchema)
async def get_example_by_id(example_id: int, db: AsyncSession = Depends(get_db)):
    """
    Retrieve a specific example by its ID.
    """
    example = await example_service.get_by_id(db=db, item_id=example_id)
    # Error handling for not found should be added here
    return example
```

#### Admin Router Example (Illustrative - Requires Authentication)
```python
# app/api/v1/admin/endpoints/example_router.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.modules.example.services import ExampleService
from app.core.modules.example.schemas.request import CreateExampleSchema # Assuming schema exists
from app.core.modules.example.schemas.response import ExampleResponseSchema
from app.core.db.dependencies import get_db
# from app.api.v1.auth.dependencies import get_current_admin_user # Placeholder for auth

router = APIRouter()
example_service = ExampleService() # Use Depends

@router.post(
    "/examples",
    response_model=ExampleResponseSchema,
    status_code=status.HTTP_201_CREATED,
    # dependencies=[Depends(get_current_admin_user)] # Add auth dependency
)
async def create_example(
    example_in: CreateExampleSchema,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new example (Admin Only).
    """
    new_example = await example_service.create(db=db, obj_in=example_in)
    return new_example
```

#### Router Aggregation Example
```python
# app/api/v1/endpoints.py
from fastapi import APIRouter

# Import routers from different modules/endpoints
from app.api.v1.public.endpoints import example_router as public_example_router
from app.api.v1.admin.endpoints import example_router as admin_example_router
from app.api.v1.auth import endpoints as auth_router # Assuming auth router exists

api_router = APIRouter()

# Include routers with prefixes
api_router.include_router(public_example_router.router, prefix="/public", tags=["Public Examples"])
api_router.include_router(admin_example_router.router, prefix="/admin", tags=["Admin Examples"])
api_router.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])

# Add more routers as needed
```
```python
# app/api/main.py
from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core.db.database import engine, dispose_engine
from app.api.v1.endpoints import api_router as api_v1_router
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize resources if needed
    # e.g., connect to database (engine is usually created at import time)
    yield
    # Shutdown: Release resources
    await dispose_engine()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Include the main API router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

# Add middleware, exception handlers etc. here if needed
```

## Data Models and Database Access

### Data Transfer Objects (DTOs) / Schemas (`app/core/modules/*/schemas/`)
- Schemas (using Pydantic) define the shape of data for API requests and responses.
- They are typically located within the corresponding module's `schemas/` directory.
- Often separated into `request/` and `response/` subdirectories or grouped by model in files (e.g., `user_schema.py`).

- When creating Schemas:
  1. For request schemas (incoming data):
     - Create files in `app/core/modules/[module_name]/schemas/request/` or a combined schema file.
     - Name classes descriptively, often ending with `Base`, `Create`, `Update`, `Filter` (e.g., `UserCreate`, `UserFilter`).
     - Define fields with type hints and use `pydantic.Field` for validation rules or examples.
  
  2. For response schemas (outgoing data):
     - Create files in `app/core/modules/[module_name]/schemas/response/` or a combined schema file.
     - Name classes descriptively, often ending with `Response` or mirroring the model name (e.g., `UserResponse`).
     - Often inherit from a base schema or directly define exposed fields.
     - Can inherit from SQLModel base classes if using SQLModel to share fields with DB models.
     - Control which fields are included/excluded using standard Pydantic features or SQLModel configurations.

### Request Schema Example
```python
# app/core/modules/users/schemas/request/user_request_schema.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreateSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserUpdateSchema(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None

class UserFilterSchema(BaseModel):
    email: Optional[str] = None
    is_active: Optional[bool] = None
    # Add other filter fields as needed
```

### Response Schema Example
```python
# app/core/modules/users/schemas/response/user_response_schema.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBaseResponseSchema(BaseModel):
    id: int
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool
    # Use Config class for ORM mode if using SQLAlchemy models directly
    class Config:
        orm_mode = True # or from_attributes = True for Pydantic v2

class UserDetailsResponseSchema(UserBaseResponseSchema):
    created_at: datetime
    updated_at: Optional[datetime] = None
    verified_at: Optional[datetime] = None
    # Add related data if needed

# Example using SQLModel (Combines DB model and Schema)
# from sqlmodel import SQLModel, Field
# from datetime import datetime
# from typing import Optional

# class UserResponse(SQLModel): # Inherit from SQLModel if User model is SQLModel
#     id: int
#     email: EmailStr
#     first_name: Optional[str] = None
#     last_name: Optional[str] = None
#     is_active: bool
#     created_at: datetime
#     updated_at: Optional[datetime] = None
#     verified_at: Optional[datetime] = None
```

### Database Models (`app/core/modules/*/models/`)
- Define database table structures using SQLAlchemy's Declarative Base or SQLModel.
- Located in `app/core/modules/[module_name]/models/`.

```python
# app/core/modules/users/models/user_model.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.db.database import Base # Use your declarative base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    verified_at = Column(DateTime, nullable=True)

    # Define relationships if needed
    # items = relationship("Item", back_populates="owner")
```

### Database Access Pattern (Service/Repository)
- Business logic resides in Services (`app/core/modules/*/services/`).
- Services interact with database Models, often directly using the SQLAlchemy session or through an optional Repository layer.
- FastAPI's dependency injection (`Depends(get_db)`) provides the `AsyncSession`.

#### Service Example (without explicit Repository)
```python
# app/core/modules/users/services/user_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from app.core.modules.users.models.user_model import User
from app.core.modules.users.schemas.request.user_request_schema import UserCreateSchema, UserUpdateSchema
from app.core.auth.auth_securities import get_password_hash # Assuming security utils exist

class UserService:
    async def get_user_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

    async def get_user(self, db: AsyncSession, user_id: int) -> Optional[User]:
        result = await db.execute(select(User).filter(User.id == user_id))
        return result.scalars().first()

    async def get_users(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[User]:
        result = await db.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()

    async def create_user(self, db: AsyncSession, user_in: UserCreateSchema) -> User:
        hashed_password = get_password_hash(user_in.password)
        db_user = User(
            email=user_in.email,
            hashed_password=hashed_password,
            first_name=user_in.first_name,
            last_name=user_in.last_name,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    async def update_user(self, db: AsyncSession, db_user: User, user_in: UserUpdateSchema) -> User:
        update_data = user_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    async def delete_user(self, db: AsyncSession, user_id: int) -> Optional[User]:
        db_user = await self.get_user(db, user_id)
        if db_user:
            await db.delete(db_user)
            await db.commit()
            return db_user
        return None

# Note: Error handling (e.g., user not found, email exists) should be added.
```

#### Key Benefits of This Structure
- Clear separation between API layer (`app/api`) and core logic (`app/core`).
- Modular design within `app/core/modules`.
- Consistent use of Pydantic schemas for validation and serialization.
- Standardized database access via SQLAlchemy session and services.
- Type safety with Python type hints.

## AI / LLM / Agent Components

This section describes the structure and patterns used for integrating Large Language Models (LLMs), autonomous agents, and associated tools.

### LLM Module (`app/llms/`)
- **Purpose**: Handles direct interactions with LLMs.
- **Structure**:
  - `clients/`: Contains specific client implementations or wrappers for various LLM providers (e.g., OpenAI, Anthropic, local models). These clients abstract the API calls.
  - `prompts/`: Stores and manages prompt templates. This could involve simple string formatting or more complex prompt engineering techniques.
- **Patterns**:
  - LLM clients might be designed as injectable dependencies (using FastAPI's `Depends`) for use in services or agents.
  - Prompt management could utilize libraries or custom logic for dynamic prompt construction.

### Agent Module (`app/agents/`)
- **Purpose**: Implements agentic logic, enabling autonomous task execution potentially using LLMs and tools.
- **Structure**:
  - `base_agent.py`: Defines a base class or interface for all agents, establishing common methods (e.g., `run`, `process_input`).
  - `llm_agent.py` (or similar): Specific agent implementations, likely inheriting from `base_agent.py` and utilizing LLM clients and tools.
  - `memory/`: Contains components for managing agent state and conversation history (e.g., simple list buffers, vector stores for long-term memory).
- **Patterns**:
  - Agents often follow a cycle (e.g., ReAct - Reason, Act): receive input, reason about the next step (potentially using an LLM), select a tool, execute the tool, process the result, repeat.
  - Agent memory is crucial and can be implemented in various ways depending on complexity.
  - Agents would typically depend on LLM clients and tool registries/executors.

### Tool Module (`app/tools/`)
- **Purpose**: Defines discrete capabilities or functions that agents can utilize to interact with the external world or perform specific tasks.
- **Structure**:
  - `base_tool.py`: Defines a base class or interface for tools, often including metadata (name, description, input schema) and an execution method (e.g., `_run`).
  - `schemas.py`: Contains Pydantic models defining the expected input arguments for tools, used for validation and potentially by LLMs for reasoning about tool usage.
  - `items/`: Contains the actual implementation of specific tools (e.g., a database query tool, a web search tool, a file system tool), likely inheriting from `base_tool.py`.
- **Patterns**:
  - Tools should be designed to be modular and reusable.
  - The description and input schema are critical for LLMs/agents to understand how and when to use a tool.
  - A mechanism (like a registry or a specific agent component) is usually needed to make tools available to an agent and to execute the chosen tool with validated arguments.

## General Guidelines

### Rules and Best Practices
- Use FastAPI's exception handling mechanisms. Define custom exception handlers in `app/api/main.py` or a dedicated exceptions module for consistent error responses. Avoid generic try/except blocks in endpoint functions unless necessary for specific cleanup.
- Always validate incoming data using Pydantic schemas defined in path operation function parameters.
- Use FastAPI's automatic OpenAPI documentation features. Ensure schemas and path operations have clear descriptions, examples, and tags.
- Favor dependency injection (`Depends`) for accessing database sessions, services, configurations, and current user information.
- Keep router/endpoint functions concise. Delegate complex business logic to Service classes/functions (`app/core/modules/*/services/`).
- Use asynchronous (`async def`) functions for all I/O-bound operations (database access, external API calls) to leverage FastAPI's performance benefits.
- Follow PEP 8 style guidelines. Use tools like Ruff or Black for automated formatting and linting (configured via `pyproject.toml` and pre-commit hooks).