# Base structure for a new project

This is a template for a new project

## Setup

### Create virtual environment  

```bash
uv venv
```

### Install dependencies

```bash
uv sync
```

## Run the project

```bash
uv run uvicorn app.api.main:app --port 8000 --reload
```

## Run the CLI

```bash
python -m app.cli.main
```

## Run linting

- Run linting
```bash
ruff check
```

- Run linting and formatting in one command
```bash
ruff check --fix
```

## Run migrations

```bash
alembic revision --autogenerate -m "message"
alembic upgrade head
```
