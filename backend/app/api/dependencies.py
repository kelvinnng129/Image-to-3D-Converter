from fastapi import UploadFile, HTTPException

# Allowed image types
ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
}

# Max file size (20MB)
MAX_FILE_SIZE = 20 * 1024 * 1024


async def validate_image(file: UploadFile) -> UploadFile:
    """Validate uploaded image file."""
    
    # Check content type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed: JPG, PNG, WebP"
        )
    
    # Check file size
    content = await file.read()
    size = len(content)
    
    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large: {size / 1024 / 1024:.1f}MB. Max: 20MB"
        )
    
    if size == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty file uploaded"
        )
    
    # Reset file position for later reading
    await file.seek(0)
    
    return file
