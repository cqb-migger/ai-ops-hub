import json
import time
import uuid

from fastapi import Request
from starlette.datastructures import MutableHeaders

from app.core.logging.logger import request_logger


async def log_request(request: Request, call_next):
    request_id = request.headers.get('X-Request-Id')
    if not request_id:
        request_id = str(uuid.uuid4())
    headers = MutableHeaders(scope=request.scope)
    headers.append('X-Request-Id', request_id)

    start_time = time.time()
    method = request.method
    url = request.url
    headers = dict(request.headers)

    if request.method in ['POST', 'PUT', 'PATCH']:
        content_type = request.headers.get('content-type', '')
        if 'multipart/form-data' in content_type:
            body = f"<multipart/form-data: {request.headers.get('content-length', 'unknown')} bytes>"
        else:
            body_bytes = await request.body()
            try:
                body = body_bytes.decode('utf-8')
                if 'password' in body:
                    try:
                        body_data = json.loads(body)
                        if isinstance(body_data, dict) and 'password' in body_data:
                            body_data['password'] = '********'
                            body = json.dumps(body_data)
                    except Exception:
                        pass
            except UnicodeDecodeError:
                body = f"<binary data: {len(body_bytes)} bytes>"
    else:
        body = None

    request_logger.info(f'Request ID: {request_id} - Method: {method} - URL: {url} - Headers: {headers} - Body: {body}')

    response = await call_next(request)
    status_code = response.status_code
    response_time = round((time.time() - start_time) * 1000, 2)

    request_logger.info(f'Request ID: {request_id} - Status Code: {status_code} - Response Time: {response_time}ms')

    return response
