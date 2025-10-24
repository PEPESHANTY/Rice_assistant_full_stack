from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
import asyncpg

from database.config import get_database
from api.auth import get_current_user

router = APIRouter(prefix="/api", tags=["tasks"])

# Pydantic models
class TaskCreate(BaseModel):
    plot_id: str
    title: str
    description: Optional[str] = None
    due_date: str
    priority: str = "medium"
    type: str
    reminder: bool = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None
    reminder: Optional[bool] = None

@router.get("/tasks")
async def get_tasks(current_user_id: str = Depends(get_current_user)):
    """Get all tasks for the current user"""
    conn = await get_database()
    try:
        tasks = await conn.fetch('''
            SELECT t.id, t.plot_id, t.title, t.description, t.due_date, t.priority, 
                   t.status, t.type, t.reminder, t.completed, t.created_at,
                   p.name as plot_name, f.name as farm_name
            FROM core.task t
            JOIN core.plot p ON t.plot_id = p.id
            JOIN core.farm f ON p.farm_id = f.id
            WHERE t.user_id = $1 AND t.deleted_at IS NULL 
            AND p.deleted_at IS NULL AND f.deleted_at IS NULL
            ORDER BY 
                CASE 
                    WHEN t.status = 'pending' THEN 1
                    WHEN t.status = 'in_progress' THEN 2
                    ELSE 3
                END,
                CASE t.priority
                    WHEN 'high' THEN 1
                    WHEN 'medium' THEN 2
                    ELSE 3
                END,
                t.due_date
        ''', current_user_id)
        
        return [
            {
                "id": str(task["id"]),
                "plotId": str(task["plot_id"]),
                "title": task["title"],
                "description": task["description"],
                "dueDate": task["due_date"].isoformat(),
                "priority": task["priority"],
                "status": task["status"],
                "type": task["type"],
                "reminder": task["reminder"],
                "completed": task["completed"],
                "plotName": task["plot_name"],
                "farmName": task["farm_name"],
                "createdAt": task["created_at"].isoformat()
            }
            for task in tasks
        ]
    finally:
        await conn.close()

@router.get("/tasks/upcoming")
async def get_upcoming_tasks(current_user_id: str = Depends(get_current_user)):
    """Get upcoming tasks (due in next 7 days)"""
    conn = await get_database()
    try:
        tasks = await conn.fetch('''
            SELECT t.id, t.plot_id, t.title, t.description, t.due_date, t.priority, 
                   t.status, t.type, t.reminder, t.completed, t.created_at,
                   p.name as plot_name, f.name as farm_name
            FROM core.task t
            JOIN core.plot p ON t.plot_id = p.id
            JOIN core.farm f ON p.farm_id = f.id
            WHERE t.user_id = $1 AND t.deleted_at IS NULL 
            AND p.deleted_at IS NULL AND f.deleted_at IS NULL
            AND t.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
            AND t.status != 'done'
            ORDER BY t.due_date, t.priority
        ''', current_user_id)
        
        return [
            {
                "id": str(task["id"]),
                "plotId": str(task["plot_id"]),
                "title": task["title"],
                "description": task["description"],
                "dueDate": task["due_date"].isoformat(),
                "priority": task["priority"],
                "status": task["status"],
                "type": task["type"],
                "reminder": task["reminder"],
                "completed": task["completed"],
                "plotName": task["plot_name"],
                "farmName": task["farm_name"],
                "createdAt": task["created_at"].isoformat()
            }
            for task in tasks
        ]
    finally:
        await conn.close()

@router.post("/tasks")
async def create_task(task: TaskCreate, current_user_id: str = Depends(get_current_user)):
    """Create a new task"""
    conn = await get_database()
    try:
        # Check if plot belongs to user
        plot = await conn.fetchrow('''
            SELECT p.id FROM core.plot p
            JOIN core.farm f ON p.farm_id = f.id
            WHERE p.id = $1 AND f.user_id = $2 AND p.deleted_at IS NULL AND f.deleted_at IS NULL
        ''', task.plot_id, current_user_id)
        
        if not plot:
            raise HTTPException(status_code=404, detail="Plot not found")
        
        # Convert date
        due_date = date.fromisoformat(task.due_date)
        
        task_id = await conn.fetchval('''
            INSERT INTO core.task (plot_id, user_id, title, description, due_date, priority, type, reminder)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        ''', task.plot_id, current_user_id, task.title, task.description, due_date, 
            task.priority, task.type, task.reminder)
        
        return {"id": str(task_id), "message": "Task created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")
    finally:
        await conn.close()

@router.put("/tasks/{task_id}")
async def update_task(task_id: str, task_update: TaskUpdate, current_user_id: str = Depends(get_current_user)):
    """Update a task"""
    conn = await get_database()
    try:
        # Check if task belongs to user
        existing_task = await conn.fetchrow('''
            SELECT id FROM core.task WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        ''', task_id, current_user_id)
        
        if not existing_task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Build update query dynamically
        update_fields = []
        update_values = []
        field_count = 1
        
        if task_update.title is not None:
            update_fields.append(f"title = ${field_count}")
            update_values.append(task_update.title)
            field_count += 1
            
        if task_update.description is not None:
            update_fields.append(f"description = ${field_count}")
            update_values.append(task_update.description)
            field_count += 1
            
        if task_update.due_date is not None:
            update_fields.append(f"due_date = ${field_count}")
            update_values.append(date.fromisoformat(task_update.due_date))
            field_count += 1
            
        if task_update.priority is not None:
            update_fields.append(f"priority = ${field_count}")
            update_values.append(task_update.priority)
            field_count += 1
            
        if task_update.status is not None:
            update_fields.append(f"status = ${field_count}")
            update_values.append(task_update.status)
            field_count += 1
            
        if task_update.type is not None:
            update_fields.append(f"type = ${field_count}")
            update_values.append(task_update.type)
            field_count += 1
            
        if task_update.reminder is not None:
            update_fields.append(f"reminder = ${field_count}")
            update_values.append(task_update.reminder)
            field_count += 1
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_values.extend([task_id, current_user_id])
        
        await conn.execute(f'''
            UPDATE core.task SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${field_count} AND user_id = ${field_count + 1}
        ''', *update_values)
        
        return {"message": "Task updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update task: {str(e)}")
    finally:
        await conn.close()

@router.put("/tasks/{task_id}/complete")
async def complete_task(task_id: str, current_user_id: str = Depends(get_current_user)):
    """Mark a task as completed"""
    conn = await get_database()
    try:
        # Check if task belongs to user
        existing_task = await conn.fetchrow('''
            SELECT id FROM core.task WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        ''', task_id, current_user_id)
        
        if not existing_task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        await conn.execute('''
            UPDATE core.task SET status = 'done', completed = true, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND user_id = $2
        ''', task_id, current_user_id)
        
        return {"message": "Task marked as completed"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to complete task: {str(e)}")
    finally:
        await conn.close()

@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str, current_user_id: str = Depends(get_current_user)):
    """Delete a task (soft delete)"""
    conn = await get_database()
    try:
        result = await conn.execute('''
            UPDATE core.task SET deleted_at = CURRENT_TIMESTAMP 
            WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        ''', task_id, current_user_id)
        
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Task not found")
        
        return {"message": "Task deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete task: {str(e)}")
    finally:
        await conn.close()

@router.get("/tasks/stats")
async def get_task_stats(current_user_id: str = Depends(get_current_user)):
    """Get task statistics for the current user"""
    conn = await get_database()
    try:
        stats = await conn.fetchrow('''
            SELECT 
                COUNT(*) as total_tasks,
                COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tasks,
                COUNT(*) FILTER (WHERE status = 'done') as completed_tasks,
                COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'done') as overdue_tasks,
                COUNT(*) FILTER (WHERE due_date = CURRENT_DATE AND status != 'done') as due_today_tasks
            FROM core.task 
            WHERE user_id = $1 AND deleted_at IS NULL
        ''', current_user_id)
        
        return {
            "total": stats["total_tasks"],
            "pending": stats["pending_tasks"],
            "inProgress": stats["in_progress_tasks"],
            "completed": stats["completed_tasks"],
            "overdue": stats["overdue_tasks"],
            "dueToday": stats["due_today_tasks"]
        }
    finally:
        await conn.close()
