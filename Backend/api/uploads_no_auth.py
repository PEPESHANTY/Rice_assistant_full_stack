from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import uuid
from datetime import datetime
import aiofiles
from typing import List

from database.config import get_database

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

# Create uploads directory if it doesn't exist
UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIR, "images"), exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIR, "audio"), exist_ok=True)

# Allowed file types
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/m4a"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/images/no-auth")
async def upload_image_no_auth(file: UploadFile = File(...)):
    """Upload an image file without authentication (for testing)"""
    
    # Validate file type
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file.content_type} not allowed. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOADS_DIR, "images", unique_filename)
    
    try:
        # Read file content
        content = await file.read()
        
        # Check file size
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Store file reference in database (use demo user)
        conn = await get_database()
        try:
            demo_user_id = '11111111-1111-1111-1111-111111111111'
            
            media_id = await conn.fetchval('''
                INSERT INTO core.media_asset (user_id, kind, storage_provider, key, url, bytes)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            ''', demo_user_id, 'photo', 'local', unique_filename, f"/uploads/images/{unique_filename}", len(content))
            
            return {
                "id": str(media_id),
                "filename": unique_filename,
                "url": f"/uploads/images/{unique_filename}",
                "size": len(content),
                "type": file.content_type
            }
        except Exception as db_error:
            # If database fails, still return the file info but without DB reference
            print(f"Database error (continuing without DB): {db_error}")
            return {
                "id": str(uuid.uuid4()),
                "filename": unique_filename,
                "url": f"/uploads/images/{unique_filename}",
                "size": len(content),
                "type": file.content_type
            }
        finally:
            await conn.close()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@router.post("/audio/no-auth")
async def upload_audio_no_auth(file: UploadFile = File(...)):
    """Upload an audio file without authentication (for testing)"""
    
    # Validate file type
    if file.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file.content_type} not allowed. Allowed types: {', '.join(ALLOWED_AUDIO_TYPES)}"
        )
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'mp3'
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOADS_DIR, "audio", unique_filename)
    
    try:
        # Read file content
        content = await file.read()
        
        # Check file size
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Store file reference in database (use demo user)
        conn = await get_database()
        try:
            demo_user_id = '11111111-1111-1111-1111-111111111111'
            
            media_id = await conn.fetchval('''
                INSERT INTO core.media_asset (user_id, kind, storage_provider, key, url, bytes)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            ''', demo_user_id, 'audio', 'local', unique_filename, f"/uploads/audio/{unique_filename}", len(content))
            
            return {
                "id": str(media_id),
                "filename": unique_filename,
                "url": f"/uploads/audio/{unique_filename}",
                "size": len(content),
                "type": file.content_type
            }
        except Exception as db_error:
            # If database fails, still return the file info but without DB reference
            print(f"Database error (continuing without DB): {db_error}")
            return {
                "id": str(uuid.uuid4()),
                "filename": unique_filename,
                "url": f"/uploads/audio/{unique_filename}",
                "size": len(content),
                "type": file.content_type
            }
        finally:
            await conn.close()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")
