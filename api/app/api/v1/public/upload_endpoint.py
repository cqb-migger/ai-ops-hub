import os
import re
import uuid
from urllib.parse import urljoin, urlparse

import httpx
from fastapi import APIRouter, File, HTTPException, UploadFile, status
from pydantic import BaseModel

router = APIRouter(prefix='/upload', tags=['[Public] Upload'])

UPLOAD_DIR = os.path.join("static", "uploads", "icons")
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


# ─── Schema ──────────────────────────────────────────────────────────────────

class IconUrlRequest(BaseModel):
    url: str  # Website URL to extract favicon from


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _normalize_url(url: str) -> str:
    """Ensure URL has a scheme."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url


def _origin(url: str) -> str:
    """Return scheme + netloc (e.g. https://example.com)."""
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"


async def _fetch_favicon_from_html(client: httpx.AsyncClient, site_url: str) -> str | None:
    """
    Parse the site HTML <head> looking for:
      <link rel="icon" href="...">
      <link rel="shortcut icon" href="...">
      <link rel="apple-touch-icon" href="...">
    Returns absolute favicon URL, or None.
    """
    try:
        resp = await client.get(site_url, follow_redirects=True, timeout=8)
        resp.raise_for_status()
    except Exception:
        return None

    html = resp.text
    origin = _origin(str(resp.url))

    # rel before href
    pat1 = re.compile(
        r'<link[^>]+rel=["\'](?:shortcut icon|icon|apple-touch-icon)["\'][^>]*href=["\']([^"\']+)["\']',
        re.IGNORECASE,
    )
    # href before rel
    pat2 = re.compile(
        r'<link[^>]+href=["\']([^"\']+)["\'][^>]*rel=["\'](?:shortcut icon|icon|apple-touch-icon)["\']',
        re.IGNORECASE,
    )

    for pat in (pat1, pat2):
        m = pat.search(html)
        if m:
            href = m.group(1).strip()
            return urljoin(origin + "/", href)

    return None


async def _check_url_alive(client: httpx.AsyncClient, url: str) -> bool:
    """HEAD request to verify the URL returns a 2xx/3xx."""
    try:
        r = await client.head(url, follow_redirects=True, timeout=5)
        return r.status_code < 400
    except Exception:
        return False


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post('/icon-from-url', summary='Get favicon from website URL')
async def get_favicon_from_url(body: IconUrlRequest):
    """
    Nhận vào URL website, tự động tìm và trả về URL favicon.

    **Chiến lược (theo thứ tự ưu tiên):**
    1. Parse HTML `<link rel="icon">` trong `<head>`
    2. Thử `/favicon.ico` tại root domain
    3. Fallback: Google Favicon API `https://www.google.com/s2/favicons?domain=...&sz=64`
    """
    site_url = _normalize_url(body.url.strip())

    parsed = urlparse(site_url)
    if not parsed.netloc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="URL không hợp lệ. Ví dụ: https://example.com",
        )

    async with httpx.AsyncClient(
        headers={"User-Agent": "Mozilla/5.0 (compatible; FaviconBot/1.0)"},
    ) as client:

        # Strategy 1: parse <link rel="icon"> from HTML
        favicon_url = await _fetch_favicon_from_html(client, site_url)
        if favicon_url and await _check_url_alive(client, favicon_url):
            return {"url": favicon_url, "source": "html_link_tag"}

        # Strategy 2: /favicon.ico at root domain
        origin = _origin(site_url)
        ico_url = f"{origin}/favicon.ico"
        if await _check_url_alive(client, ico_url):
            return {"url": ico_url, "source": "favicon_ico"}

    # Strategy 3: Google Favicon API (always returns something)
    domain = parsed.netloc
    google_favicon = f"https://www.google.com/s2/favicons?domain={domain}&sz=64"
    return {"url": google_favicon, "source": "google_favicon_api"}


@router.post('/icon', summary='Upload icon file')
async def upload_icon(file: UploadFile = File(...)):
    """Upload file ảnh icon (PNG, JPG, JPEG, WEBP — tối đa 2MB)."""
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
