from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
import os
import uuid
from datetime import datetime
import aiofiles
from typing import List

from database.config import get_database
from api.auth import get_current_user

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

@router.post("/images")
async def upload_image(
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user)
):
    """Upload an image file"""
    
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
        
        # Store file reference in database (use demo user if no auth)
        conn = await get_database()
        try:
            user_id_to_use = current_user_id if current_user_id else '11111111-1111-1111-1111-111111111111'
            
            media_id = await conn.fetchval('''
                INSERT INTO core.media_asset (user_id, kind, storage_provider, key, url, bytes)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            ''', user_id_to_use, 'photo', 'local', unique_filename, f"/uploads/images/{unique_filename}", len(content))
            
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

@router.post("/audio")
async def upload_audio(
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user)
):
    """Upload an audio file"""
    
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
        
        # Store file reference in database (use demo user if no auth)
        conn = await get_database()
        try:
            user_id_to_use = current_user_id if current_user_id else '11111111-1111-1111-1111-111111111111'
            
            media_id = await conn.fetchval('''
                INSERT INTO core.media_asset (user_id, kind, storage_provider, key, url, bytes)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            ''', user_id_to_use, 'audio', 'local', unique_filename, f"/uploads/audio/{unique_filename}", len(content))
            
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

@router.get("/images/{filename}")
async def get_image(filename: str):
    """Serve an image file"""
    file_path = os.path.join(UPLOADS_DIR, "images", filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    # In a real implementation, you'd use FileResponse
    # For now, we'll just return the file path
    return {"file_path": file_path}

@router.get("/audio/{filename}")
async def get_audio(filename: str):
    """Serve an audio file"""
    file_path = os.path.join(UPLOADS_DIR, "audio", filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    # In a real implementation, you'd use FileResponse
    # For now, we'll just return the file path
    return {"file_path": file_path}

@router.delete("/{media_id}")
async def delete_media(media_id: str, current_user_id: str = Depends(get_current_user)):
    """Delete a media file"""
    conn = await get_database()
    try:
        # Get media info
        media = await conn.fetchrow('''
            SELECT id, kind, key, url FROM core.media_asset 
            WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        ''', media_id, current_user_id)
        
        if not media:
            raise HTTPException(status_code=404, detail="Media not found")
        
        # Delete file from storage
        try:
            if media["kind"] == "photo":
                file_path = os.path.join(UPLOADS_DIR, "images", media["key"])
            else:
                file_path = os.path.join(UPLOADS_DIR, "audio", media["key"])
            
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Warning: Could not delete file {file_path}: {str(e)}")
        
        # Soft delete from database
        await conn.execute('''
            UPDATE core.media_asset SET deleted_at = CURRENT_TIMESTAMP 
            WHERE id = $1 AND user_id = $2
        ''', media_id, current_user_id)
        
        return {"message": "Media deleted successfully"}
        
    finally:
        await conn.close()
