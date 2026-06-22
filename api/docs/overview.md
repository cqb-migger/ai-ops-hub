# Base API Project Description

## Project Overview

This project implements a robust API foundation built with Python and FastAPI, providing core functionality for user management, JWT-based authentication (including token refresh), basic API health checks, request logging, and structured exception handling. The Base API focuses on essential features using modern Python practices, asynchronous capabilities, PostgreSQL database integration via SQLAlchemy, and secure authentication.

## Core Technology Stack

### Backend Framework
- **FastAPI**: A modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.
- **Pydantic**: Data validation and settings management using Python type annotations. Used extensively for request/response models and configuration.
- **Uvicorn**: ASGI server for running FastAPI applications.

### Database and ORM
- **SQLAlchemy**: SQL toolkit and Object Relational Mapper for Python (using async extension).
- **asyncpg**: PostgreSQL database adapter for Python (async).
- **Alembic**: Lightweight database migration tool for SQLAlchemy.
- **PostgreSQL**: Target relational database system.

### Authentication and Security
- **PyJWT[crypto]**: For handling JSON Web Tokens (JWT) creation and validation.
- **passlib[bcrypt]**: For secure password hashing.
- **FastAPI Security Utilities**: Using `HTTPBearer` for extracting Bearer tokens from headers.

### AI / LLM Integration (Potential Libraries - Specify if known, e.g., Langchain, LlamaIndex)
- **LLM Interaction**: Modules for interfacing with Large Language Models.
- **Agent Framework**: Components for defining and running autonomous agents.
- **Tool Definitions**: Implementation of tools that agents or LLMs can utilize.

### Logging & Error Handling
- **Standard Logging / Loguru**: Configured for application logging (e.g., `request_logger`, `error_logger`).
- **Custom Middleware**: For logging incoming requests (`log_request`).
- **Custom Exception Handlers**: Specific handlers registered in `main.py` for `HTTPException`, `ValidationError`, and generic `Exception` to provide consistent error responses.

### Validation and Transformation
- **Pydantic**: Handles data validation via type hints.
- **FastAPI Dependencies**: Used for injecting dependencies and handling validation logic (e.g., `get_db`, `jwt_auth`, `refresh_token_auth`).

### API Documentation
- **FastAPI built-in**: Automatic interactive API documentation generation using Swagger UI and ReDoc.

## Development Tools

### Testing (Potential - To be implemented)
- **pytest**: A mature full-featured Python testing tool.
- **httpx**: A fully featured HTTP client for Python 3, used for testing FastAPI applications.

### Code Quality
- **Ruff**: An extremely fast Python linter and code formatter, written in Rust.
- **uv**: An extremely fast Python package installer and resolver, written in Rust.
- **mypy**: Optional static type checker for Python.

### Development Utilities
- **Virtual Environments**: Using `venv` or tools like `uv` for dependency isolation.
- **python-dotenv**: For loading environment variables from `.env` file.

## Core Features

### 1. User Management
- User CRUD operations interacting with PostgreSQL database:
  - Get Users (List)
  - Create User (with hashed password)
  - Get User (by ID)
  - Update User (by ID)
  - Delete User (by ID)
- Input validation using Pydantic models.
- Protected endpoint `/users/me` to get current user profile.

### 2. Authentication
- JWT-based authentication using HS256 algorithm.
- Login endpoint for obtaining tokens (exact path depends on implementation).
- Token refresh endpoint.
- Secure password hashing using `bcrypt` via `passlib`.
- Generation and validation of Access and Refresh Tokens (with distinct `type` claims).
- Dependencies (`jwt_auth`, `refresh_token_auth`) to verify tokens and retrieve authenticated user for protected endpoints.

### 3. API Health Monitoring
- `/` Root endpoint for basic welcome message.
- `/health` Health check endpoint.

### 4. Logging and Exception Handling
- Middleware to log details of incoming HTTP requests.
- Centralized exception handlers to catch anticipated (`HTTPException`, `ValidationError`) and unexpected (`Exception`) errors, providing standardized JSON error responses.
- Configured loggers for different purposes (e.g., request logs, error logs).

### 5. AI / LLM Features
- Integration points for interacting with configured Large Language Models.
- Framework for executing agentic workflows.
- Definition and usage of custom tools accessible by agents/LLMs.

## Technical Considerations

### Structure
- Modular design using FastAPI `APIRouter` for organizing endpoints (e.g., users, auth, potentially agent/llm related APIs).
- Clear separation of concerns (schemas, models, services, endpoints, core utilities, llms, agents, tools).
- Database models defined using SQLAlchemy ORM.
- Database migrations managed by Alembic.
- Centralized exception handling via `@app.exception_handler` decorators in `main.py`.

### Asynchronous Processing
- Leverages Python's `async`/`await` and FastAPI's async capabilities, including async database sessions.

### Security
- Secure password storage using bcrypt hashing.
- JWT signing with a strong secret key.
- Defined token expiry times (access and refresh).
- Use of HTTPS is assumed for production deployment.
- Standard `HTTPBearer` scheme for extracting tokens from Authorization header.

### API Documentation
- Automatic generation of interactive API documentation (Swagger UI/ReDoc) including authorization support (using Bearer token input).

### Validation
- Robust request/response data validation using Pydantic models.

### Logging Behavior
- Note: When running with `DEBUG=True` or using `uvicorn --reload`, uvicorn may still print stack traces to the console for debugging purposes, even if custom exception handlers are catching errors and returning appropriate responses. Logging behavior in non-debug mode depends on the logger configuration within handlers (e.g., `logger.error` vs `logger.exception`).

## Current Status

The project provides a functional base with:
- User CRUD operations connected to PostgreSQL.
- JWT Authentication system (login, token generation, verification, token refresh).
- Protected endpoint example (`/users/me`).
- Database setup with SQLAlchemy and Alembic migrations.
- Basic API health check endpoints.
- Automatic API documentation.
- Request logging middleware.
- Custom exception handlers for consistent error responses.
- Foundational modules for LLM interaction (`app/llms/`).
- Initial setup for agent execution (`app/agents/`).
- Basic tool definition capabilities (`app/tools/`).

### Future enhancements could include:
- Implementing logout mechanism (e.g., token blacklisting).
- Adding Role-Based Access Control (RBAC).
- Adding comprehensive testing using `pytest` and `httpx`.
- Setting up a CI/CD pipeline.
- Implementing more robust logging and monitoring.
- Implementing more granular logging across services.
- Setting up structured logging for easier parsing (e.g., JSON format).
- Expanding the library of available tools.
- Implementing more sophisticated agent workflows and memory management.
- Optimizing LLM calls and context management.

This base API provides a solid foundation for building secure and scalable applications with FastAPI, including AI-powered features.