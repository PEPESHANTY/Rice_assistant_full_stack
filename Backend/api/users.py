from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import asyncpg

from database.config import get_database
from api.auth import get_current_user

router = APIRouter(prefix="/api", tags=["users"])

# Pydantic models
class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    locale: Optional[str] = None
    font_scale: Optional[str] = None

@router.get("/users")
async def get_users(current_user_id: str = Depends(get_current_user)):
    """Get current user information"""
    conn = await get_database()
    try:
        # Only return the current user's information
        user = await conn.fetchrow('''
            SELECT id, phone, email, display_name, locale, font_scale, created_at
            FROM core.user WHERE id = $1 AND deleted_at IS NULL
        ''', current_user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return [
            {
                "id": str(user["id"]),
                "phone": user["phone"],
                "email": user["email"],
                "displayName": user["display_name"],
                "locale": user["locale"],
                "fontScale": user["font_scale"],
                "createdAt": user["created_at"].isoformat()
            }
        ]
    finally:
        await conn.close()

@router.get("/users/me")
async def get_current_user_info(current_user_id: str = Depends(get_current_user)):
    """Get current user information (alias for /users)"""
    conn = await get_database()
    try:
        user = await conn.fetchrow('''
            SELECT id, phone, email, display_name, locale, font_scale, created_at
            FROM core.user WHERE id = $1 AND deleted_at IS NULL
        ''', current_user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": str(user["id"]),
            "phone": user["phone"],
            "email": user["email"],
            "displayName": user["display_name"],
            "locale": user["locale"],
            "fontScale": user["font_scale"],
            "createdAt": user["created_at"].isoformat()
        }
    finally:
        await conn.close()

@router.put("/users/me")
async def update_current_user(user_update: UserUpdate, current_user_id: str = Depends(get_current_user)):
    """Update current user information"""
    conn = await get_database()
    try:
        # Check if user exists
        existing_user = await conn.fetchrow('''
            SELECT id FROM core.user WHERE id = $1 AND deleted_at IS NULL
        ''', current_user_id)
        
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Build update query dynamically
        update_fields = []
        update_values = []
        field_count = 1
        
        if user_update.display_name is not None:
            update_fields.append(f"display_name = ${field_count}")
            update_values.append(user_update.display_name)
            field_count += 1
            
        if user_update.locale is not None:
            update_fields.append(f"locale = ${field_count}")
            update_values.append(user_update.locale)
            field_count += 1
            
        if user_update.font_scale is not None:
            update_fields.append(f"font_scale = ${field_count}")
            update_values.append(user_update.font_scale)
            field_count += 1
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_values.append(current_user_id)
        
        await conn.execute(f'''
            UPDATE core.user SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${field_count}
        ''', *update_values)
        
        return {"message": "User information updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")
    finally:
        await conn.close()

@router.get("/users/stats")
async def get_user_stats(current_user_id: str = Depends(get_current_user)):
    """Get user statistics (farms, plots, tasks, journal entries)"""
    conn = await get_database()
    try:
        stats = await conn.fetchrow('''
            SELECT 
                -- Farm stats
                (SELECT COUNT(*) FROM core.farm WHERE user_id = $1 AND deleted_at IS NULL) as farm_count,
                -- Plot stats
                (SELECT COUNT(*) FROM core.plot p 
                 JOIN core.farm f ON p.farm_id = f.id 
                 WHERE f.user_id = $1 AND p.deleted_at IS NULL AND f.deleted_at IS NULL) as plot_count,
                -- Task stats
                (SELECT COUNT(*) FROM core.task WHERE user_id = $1 AND deleted_at IS NULL) as task_count,
                (SELECT COUNT(*) FROM core.task WHERE user_id = $1 AND status = 'pending' AND deleted_at IS NULL) as pending_tasks,
                (SELECT COUNT(*) FROM core.task WHERE user_id = $1 AND status = 'done' AND deleted_at IS NULL) as completed_tasks,
                -- Journal stats
                (SELECT COUNT(*) FROM core.journal_entry WHERE user_id = $1 AND deleted_at IS NULL) as journal_count,
                (SELECT COUNT(*) FROM core.journal_entry WHERE user_id = $1 AND entry_date = CURRENT_DATE AND deleted_at IS NULL) as today_journal_entries
        ''', current_user_id)
        
        return {
            "farms": stats["farm_count"],
            "plots": stats["plot_count"],
            "tasks": {
                "total": stats["task_count"],
                "pending": stats["pending_tasks"],
                "completed": stats["completed_tasks"]
            },
            "journal": {
                "total": stats["journal_count"],
                "today": stats["today_journal_entries"]
            }
        }
    finally:
        await conn.close()

@router.get("/users/profile")
async def get_user_profile(current_user_id: str = Depends(get_current_user)):
    """Get comprehensive user profile with all related data"""
    conn = await get_database()
    try:
        # Get user basic info
        user = await conn.fetchrow('''
            SELECT id, phone, email, display_name, locale, font_scale, created_at
            FROM core.user WHERE id = $1 AND deleted_at IS NULL
        ''', current_user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get farms with plot counts
        farms = await conn.fetch('''
            SELECT f.id, f.name, f.province, f.district, f.created_at,
                   COUNT(p.id) as plot_count
            FROM core.farm f
            LEFT JOIN core.plot p ON f.id = p.farm_id AND p.deleted_at IS NULL
            WHERE f.user_id = $1 AND f.deleted_at IS NULL
            GROUP BY f.id, f.name, f.province, f.district, f.created_at
            ORDER BY f.created_at DESC
        ''', current_user_id)
        
        # Get recent tasks
        recent_tasks = await conn.fetch('''
            SELECT t.id, t.title, t.due_date, t.priority, t.status, t.type,
                   p.name as plot_name, f.name as farm_name
            FROM core.task t
            JOIN core.plot p ON t.plot_id = p.id
            JOIN core.farm f ON p.farm_id = f.id
            WHERE t.user_id = $1 AND t.deleted_at IS NULL 
            AND p.deleted_at IS NULL AND f.deleted_at IS NULL
            ORDER BY t.created_at DESC
            LIMIT 5
        ''', current_user_id)
        
        # Get recent journal entries
        recent_journal = await conn.fetch('''
            SELECT j.id, j.title, j.entry_date, j.type,
                   p.name as plot_name, f.name as farm_name
            FROM core.journal_entry j
            JOIN core.plot p ON j.plot_id = p.id
            JOIN core.farm f ON p.farm_id = f.id
            WHERE j.user_id = $1 AND j.deleted_at IS NULL 
            AND p.deleted_at IS NULL AND f.deleted_at IS NULL
            ORDER BY j.entry_date DESC, j.created_at DESC
            LIMIT 5
        ''', current_user_id)
        
        return {
            "user": {
                "id": str(user["id"]),
                "phone": user["phone"],
                "email": user["email"],
                "displayName": user["display_name"],
                "locale": user["locale"],
                "fontScale": user["font_scale"],
                "createdAt": user["created_at"].isoformat()
            },
            "farms": [
                {
                    "id": str(farm["id"]),
                    "name": farm["name"],
                    "province": farm["province"],
                    "district": farm["district"],
                    "plotCount": farm["plot_count"],
                    "createdAt": farm["created_at"].isoformat()
                }
                for farm in farms
            ],
            "recentTasks": [
                {
                    "id": str(task["id"]),
                    "title": task["title"],
                    "dueDate": task["due_date"].isoformat(),
                    "priority": task["priority"],
                    "status": task["status"],
                    "type": task["type"],
                    "plotName": task["plot_name"],
                    "farmName": task["farm_name"]
                }
                for task in recent_tasks
            ],
            "recentJournal": [
                {
                    "id": str(entry["id"]),
                    "title": entry["title"],
                    "date": entry["entry_date"].isoformat(),
                    "type": entry["type"],
                    "plotName": entry["plot_name"],
                    "farmName": entry["farm_name"]
                }
                for entry in recent_journal
            ]
        }
    finally:
        await conn.close()
