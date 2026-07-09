import os
import boto3
from botocore.config import Config
from typing import Optional, Tuple
from app.core.config import settings

def get_s3_client():
    aws_access_key = settings.AWS_ACCESS_KEY_ID
    aws_secret_key = settings.AWS_SECRET_ACCESS_KEY
    region = settings.AWS_REGION or 'ap-northeast-1'
    endpoint_url = settings.AWS_S3_ENDPOINT_URL

    kwargs = {}
    if aws_access_key and aws_secret_key:
        kwargs['aws_access_key_id'] = aws_access_key
        kwargs['aws_secret_access_key'] = aws_secret_key
    if region:
        kwargs['region_name'] = region
    if endpoint_url:
        kwargs['endpoint_url'] = endpoint_url

    config = Config(signature_version='s3v4')
    return boto3.client('s3', config=config, **kwargs)

def upload_file_to_s3(file_data: bytes, key: str, mime_type: Optional[str] = None) -> str:
    s3_client = get_s3_client()
    bucket_name = settings.AWS_S3_BUCKET_NAME or 'ai-ops-hub-guides'
    
    try:
        s3_client.head_bucket(Bucket=bucket_name)
    except Exception:
        try:
            if settings.AWS_REGION and settings.AWS_REGION != 'us-east-1':
                try:
                    s3_client.create_bucket(
                        Bucket=bucket_name,
                        CreateBucketConfiguration={'LocationConstraint': settings.AWS_REGION}
                    )
                except Exception:
                    s3_client.create_bucket(Bucket=bucket_name)
            else:
                s3_client.create_bucket(Bucket=bucket_name)
        except Exception:
            pass

    extra_args = {}
    if mime_type:
        extra_args['ContentType'] = mime_type

    try:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=key,
            Body=file_data,
            ACL='public-read',
            **extra_args
        )
    except Exception:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=key,
            Body=file_data,
            **extra_args
        )

    if settings.AWS_S3_ENDPOINT_URL:
        endpoint = settings.AWS_S3_ENDPOINT_URL.rstrip('/')
        if settings.AWS_S3_TENANT_ID:
            return f"{endpoint}/{settings.AWS_S3_TENANT_ID}:{bucket_name}/{key}"
        else:
            return f"{endpoint}/{bucket_name}/{key}"
    else:
        region = settings.AWS_REGION or 'ap-northeast-1'
        return f"https://{bucket_name}.s3.{region}.amazonaws.com/{key}"

def upload_file_to_s3_or_local(file_data: bytes, key: str, mime_type: Optional[str] = None, local_path_prefix: str = 'static/uploads') -> Tuple[str, str]:
    # Check if AWS settings are configured properly
    # If access key is set and it's not "mock", we assume real or LocalStack S3 is targeted
    aws_configured = settings.AWS_ACCESS_KEY_ID and settings.AWS_ACCESS_KEY_ID != 'mock'
    
    if aws_configured:
        try:
            url = upload_file_to_s3(file_data, key, mime_type)
            return url, key
        except Exception as e:
            import logging
            logging.warning(f"AWS S3 upload failed: {str(e)}. Falling back to local storage.")
            
    # Local fallback
    local_path = os.path.join(local_path_prefix, key)
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    with open(local_path, 'wb') as f:
        f.write(file_data)
    
    return f"/{local_path}", key
