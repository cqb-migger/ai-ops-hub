from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.api.middlewares.logging_middleware import log_request


def setup_middlewares(app: FastAPI):
    # CORSMiddleware is used to allow all origins (e.g. for development purposes)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    # GZipMiddleware is used to compress the response body to reduce the size of the response
    # and improve the performance of the API when the response is large (e.g. images)
    # minimum_size is the minimum size of the response body to compress (default is 1000 bytes = 1KB)
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    # Log request middleware
    app.middleware('http')(log_request)
