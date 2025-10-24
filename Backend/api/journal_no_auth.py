from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
import asyncpg
import json
import uuid

from database.config import get_database

router = APIRouter(prefix="/api/journal-no-auth", tags=["journal"])

# Pydantic models
class JournalEntryCreate(BaseModel):
    plotId: str
    date: str
    type: str
    title: str
    content: Optional[str] = None
    photos: Optional[List[str]] = []
    audioNote: Optional[str] = None

class JournalEntryUpdate(BaseModel):
    date: Optional[str] = None
    type: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    photos: Optional[List[str]] = None
    audioNote: Optional[str] = None

@router.get("")
async def get_journal_entries():
    """Get all journal entries (no auth)"""
    conn = await get_database()
    try:
        entries = await conn.fetch('''
            SELECT j.id, j.plot_id, j.entry_date, j.type, j.title, j.content, 
                   j.photos, j.audio_url, j.created_at,
                   p.name as plot_name, f.name as farm_name
            FROM core.journal_entry j
            JOIN core.plot p ON j.plot_id = p.id
            JOIN core.farm f ON p.farm_id = f.id
            WHERE j.deleted_at IS NULL 
            AND p.deleted_at IS NULL AND f.deleted_at IS NULL
            ORDER BY j.entry_date DESC, j.created_at DESC
        ''')
        
        return [
            {
                "id": str(entry["id"]),
                "plotId": str(entry["plot_id"]),
                "date": entry["entry_date"].isoformat(),
                "type": entry["type"],
                "title": entry["title"],
                "content": entry["content"],
                "photos": entry["photos"] or [],
                "audioNote": entry["audio_url"],
                "plotName": entry["plot_name"],
                "farmName": entry["farm_name"],
                "createdAt": entry["created_at"].isoformat()
            }
            for entry in entries
        ]
    finally:
        await conn.close()

@router.get("/plot/{plot_id}")
async def get_journal_entries_by_plot(plot_id: str):
    """Get journal entries for a specific plot (no auth)"""
    conn = await get_database()
    try:
        entries = await conn.fetch('''
            SELECT j.id, j.plot_id, j.entry_date, j.type, j.title, j.content, 
                   j.photos, j.audio_url, j.created_at,
                   p.name as plot_name, f.name as farm_name
            FROM core.journal_entry j
            JOIN core.plot p ON j.plot_id = p.id
            JOIN core.farm f ON p.farm_id = f.id
            WHERE j.plot_id = $1 AND j.deleted_at IS NULL 
            AND p.deleted_at IS NULL AND f.deleted_at IS NULL
            ORDER BY j.entry_date DESC, j.created_at DESC
        ''', plot_id)
        
        return [
            {
                "id": str(entry["id"]),
                "plotId": str(entry["plot_id"]),
                "date": entry["entry_date"].isoformat(),
                "type": entry["type"],
                "title": entry["title"],
                "content": entry["content"],
                "photos": entry["photos"] or [],
                "audioNote": entry["audio_url"],
                "plotName": entry["plot_name"],
                "farmName": entry["farm_name"],
                "createdAt": entry["created_at"].isoformat()
            }
            for entry in entries
        ]
    finally:
        await conn.close()

@router.post("")
async def create_journal_entry(entry: JournalEntryCreate):
    """Create a new journal entry (no auth)"""
    conn = await get_database()
    try:
        # Use demo user ID
        demo_user_id = '11111111-1111-1111-1111-111111111111'
        
        # Convert date
        entry_date = date.fromisoformat(entry.date)
        
        # Convert photos to JSON array
        photos_json = json.dumps(entry.photos) if entry.photos else '[]'
        
        entry_id = await conn.fetchval('''
            INSERT INTO core.journal_entry (plot_id, user_id, entry_date, type, title, content, photos, audio_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        ''', entry.plotId, demo_user_id, entry_date, entry.type, entry.title, 
            entry.content, photos_json, entry.audioNote)
        
        return {"id": str(entry_id), "message": "Journal entry created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create journal entry: {str(e)}")
    finally:
        await conn.close()

@router.put("/{entry_id}")
async def update_journal_entry(entry_id: str, entry_update: JournalEntryUpdate):
    """Update a journal entry (no auth)"""
    conn = await get_database()
    try:
        # Build update query dynamically
        update_fields = []
        update_values = []
        field_count = 1
        
        if entry_update.date is not None:
            update_fields.append(f"entry_date = ${field_count}")
            update_values.append(date.fromisoformat(entry_update.date))
            field_count += 1
            
        if entry_update.type is not None:
            update_fields.append(f"type = ${field_count}")
            update_values.append(entry_update.type)
            field_count += 1
            
        if entry_update.title is not None:
            update_fields.append(f"title = ${field_count}")
            update_values.append(entry_update.title)
            field_count += 1
            
        if entry_update.content is not None:
            update_fields.append(f"content = ${field_count}")
            update_values.append(entry_update.content)
            field_count += 1
            
        if entry_update.photos is not None:
            update_fields.append(f"photos = ${field_count}")
            update_values.append(json.dumps(entry_update.photos))
            field_count += 1
            
        if entry_update.audioNote is not None:
            update_fields.append(f"audio_url = ${field_count}")
            update_values.append(entry_update.audioNote)
            field_count += 1
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_values.append(entry_id)
        
        await conn.execute(f'''
            UPDATE core.journal_entry SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${field_count}
        ''', *update_values)
        
        return {"message": "Journal entry updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update journal entry: {str(e)}")
    finally:
        await conn.close()

@router.delete("/{entry_id}")
async def delete_journal_entry(entry_id: str):
    """Delete a journal entry (soft delete, no auth)"""
    conn = await get_database()
    try:
        result = await conn.execute('''
            UPDATE core.journal_entry SET deleted_at = CURRENT_TIMESTAMP 
            WHERE id = $1 AND deleted_at IS NULL
        ''', entry_id)
        
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Journal entry not found")
        
        return {"message": "Journal entry deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete journal entry: {str(e)}")
    finally:
        await conn.close()

@router.get("/stats")
async def get_journal_stats():
    """Get journal statistics (no auth)"""
    conn = await get_database()
    try:
        stats = await conn.fetchrow('''
            SELECT 
                COUNT(*) as total_entries,
                COUNT(*) FILTER (WHERE entry_date = CURRENT_DATE) as today_entries,
                COUNT(*) FILTER (WHERE entry_date >= CURRENT_DATE - 7) as last_week_entries,
                COUNT(*) FILTER (WHERE type = 'planting') as planting_entries,
                COUNT(*) FILTER (WHERE type = 'fertilizer') as fertilizer_entries,
                COUNT(*) FILTER (WHERE type = 'irrigation') as irrigation_entries,
                COUNT(*) FILTER (WHERE type = 'pest') as pest_entries,
                COUNT(*) FILTER (WHERE type = 'harvest') as harvest_entries
            FROM core.journal_entry 
            WHERE deleted_at IS NULL
        ''')
        
        return {
            "total": stats["total_entries"],
            "today": stats["today_entries"],
            "lastWeek": stats["last_week_entries"],
            "byType": {
                "planting": stats["planting_entries"],
                "fertilizer": stats["fertilizer_entries"],
                "irrigation": stats["irrigation_entries"],
                "pest": stats["pest_entries"],
                "harvest": stats["harvest_entries"]
            }
        }
    finally:
        await conn.close()
