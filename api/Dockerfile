FROM python:3.11-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
RUN uv sync --frozen --no-install-project --no-dev

FROM python:3.11-slim
RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser
WORKDIR /app
COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"
COPY app/ ./app/
COPY alembic/ ./alembic/
COPY alembic.ini ./
RUN mkdir -p static/uploads/icons static/uploads/guides logs && \
    chown -R appuser:appgroup /app
USER appuser
EXPOSE 8000
CMD ["uvicorn", "app.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
