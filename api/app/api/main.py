from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from scalar_fastapi import AgentScalarConfig, get_scalar_api_reference

from app.api.middlewares.base_middleware import setup_middlewares
from app.api.v1.endpoints import router as v1_router
from app.core.common.exceptions import ValidationError
from app.core.config import settings
from app.core.db.database import engine
from app.core.logging.logger import error_logger


from fastapi.staticfiles import StaticFiles

# Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Application startup: Lifespan started.')
    import os
    os.makedirs(os.path.join("static", "uploads", "icons"), exist_ok=True)
    yield
    print('Application shutdown: Disposing database engine.')
    await engine.dispose()
    print('Application shutdown: Database engine disposed.')


app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None,
)

# Serve uploaded static images/icons
app.mount("/static", StaticFiles(directory="static"), name="static")

setup_middlewares(app)


@app.exception_handler(HTTPException)
async def http_exc_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={'detail': exc.detail})


# Validation error handler
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(status_code=422, content={'detail': exc.errors()})


# Application error handler
@app.exception_handler(Exception)
async def application_exception_handler(request: Request, exc: Exception):
    error_logger.exception(f'Unhandled exception occurred during {request.method} {request.url}: {exc}')
    return JSONResponse(status_code=500, content={'detail': 'Internal server error'})


# Include routers
@app.get('/', tags=['[Public] Base'])
async def root():
    return {'message': 'Welcome Base API!'}


@app.get('/docs', include_in_schema=False)
async def scalar_docs():
    """Interactive API reference (Scalar) at the conventional /docs path."""
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=settings.APP_NAME,
        scalar_proxy_url='https://proxy.scalar.com',
        agent=AgentScalarConfig(disabled=True),
    )


app.include_router(v1_router)
