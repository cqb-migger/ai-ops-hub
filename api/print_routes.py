import asyncio
from app.api.main import app

for route in app.routes:
    if hasattr(route, "methods"):
        if "/v1/steps/single" in route.path or "/v1/steps/" in route.path:
            print(f"{route.path} {route.methods}")
