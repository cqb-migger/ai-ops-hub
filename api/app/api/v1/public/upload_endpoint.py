import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status

router = APIRouter(prefix='/upload', tags=['upload'])

UPLOAD_DIR = os.path.join("static", "uploads", "icons")
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}

@router.post('/icon')
async def upload_icon(file: UploadFile = File(...)):
    _, ext = os.path.splitext(file.filename or "")
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Allowed image formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    try:
        contents = await file.read(MAX_FILE_SIZE + 1)
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File size exceeds the limit of 2MB"
            )
        await file.seek(0)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reading file: {str(e)}"
        )

    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    try:
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )

    return {"url": f"/static/uploads/icons/{filename}"}
