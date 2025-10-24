# api/journal.py
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import date, datetime
import json

from database.config import get_database
from api.auth import get_current_user

router = APIRouter(prefix="/api/journal", tags=["journal"])

# -------- helpers --------
def parse_date(d: Optional[str]) -> date:
    """Accept 'YYYY-MM-DD' or full ISO datetime, default to today if None/empty."""
    if not d:
        return date.today()
    try:
        return date.fromisoformat(d)  # 'YYYY-MM-DD'
    except ValueError:
        try:
            # handle Z/offset (e.g., 2025-10-23T08:11:22.000Z)
            return datetime.fromisoformat(d.replace("Z", "+00:00")).date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format")

# -------- pydantic models --------
class _CamelAndSnake(BaseModel):
    class Config:
        # allow both camelCase and snake_case in payloads
        populate_by_name = True
        alias_generator = lambda s: ''.join(
            [s.split('_')[0]] + [w.capitalize() for w in s.split('_')[1:]]
        )

class JournalEntryCreate(_CamelAndSnake):
    plot_id: Optional[str] = Field(default=None, alias="plotId")
    date: Optional[str] = None
    type: str
    title: str
    content: Optional[str] = None
    photos: Optional[List[str]] = []
    audio_note: Optional[str] = Field(default=None, alias="audioNote")

class JournalEntryUpdate(_CamelAndSnake):
    date: Optional[str] = None
    type: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    photos: Optional[List[str]] = None
    audio_note: Optional[str] = Field(default=None, alias="audioNote")

# -------- routes --------
@router.get("/", response_model=List[Dict[str, Any]])
async def get_journal_entries(current_user_id: str = Depends(get_current_user)):
    conn = await get_database()
    try:
        rows = await conn.fetch(
            """
            SELECT j.id, j.plot_id, j.entry_date, j.type, j.title, j.content,
                   j.photos, j.audio_url, j.created_at,
                   p.name AS plot_name, f.name AS farm_name
            FROM core.journal_entry j
            JOIN core.plot p ON j.plot_id = p.id
            JOIN core.farm f ON p.farm_id = f.id
            WHERE j.user_id = $1::uuid
              AND j.deleted_at IS NULL
              AND p.deleted_at IS NULL
              AND f.deleted_at IS NULL
            ORDER BY j.entry_date DESC, j.created_at DESC
            """,
            current_user_id,
        )
        return [
            {
                "id": str(r["id"]),
                "plotId": str(r["plot_id"]),
                "date": r["entry_date"].isoformat(),
                "type": r["type"],
                "title": r["title"],
                "content": r["content"],
                "photos": r["photos"] or [],
                "audioNote": r["audio_url"],
                "plotName": r["plot_name"],
                "farmName": r["farm_name"],
                "createdAt": r["created_at"].isoformat(),
            }
            for r in rows
        ]
    finally:
        await conn.close()

@router.get("/plot/{plot_id}", response_model=List[Dict[str, Any]])
async def get_journal_entries_by_plot(plot_id: str, current_user_id: str = Depends(get_current_user)):
    conn = await get_database()
    try:
        # verify ownership
        owns = await conn.fetchrow(
            """
            SELECT 1
            FROM core.plot p
            JOIN core.farm f ON p.farm_id = f.id
            WHERE p.id = $1::uuid
              AND f.user_id = $2::uuid
              AND p.deleted_at IS NULL
              AND f.deleted_at IS NULL
            """,
            plot_id, current_user_id,
        )
        if not owns:
            raise HTTPException(status_code=404, detail="Plot not found")

        rows = await conn.fetch(
            """
            SELECT j.id, j.plot_id, j.entry_date, j.type, j.title, j.content,
                   j.photos, j.audio_url, j.created_at,
                   p.name AS plot_name, f.name AS farm_name
            FROM core.journal_entry j
            JOIN core.plot p ON j.plot_id = p.id
            JOIN core.farm f ON p.farm_id = f.id
            WHERE j.plot_id = $1::uuid
              AND j.user_id = $2::uuid
              AND j.deleted_at IS NULL
              AND p.deleted_at IS NULL
              AND f.deleted_at IS NULL
            ORDER BY j.entry_date DESC, j.created_at DESC
            """,
            plot_id, current_user_id,
        )
        return [
            {
                "id": str(r["id"]),
                "plotId": str(r["plot_id"]),
                "date": r["entry_date"].isoformat(),
                "type": r["type"],
                "title": r["title"],
                "content": r["content"],
                "photos": r["photos"] or [],
                "audioNote": r["audio_url"],
                "plotName": r["plot_name"],
                "farmName": r["farm_name"],
                "createdAt": r["created_at"].isoformat(),
            }
            for r in rows
        ]
    finally:
        await conn.close()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_journal_entry(entry: JournalEntryCreate, current_user_id: str = Depends(get_current_user)):
    conn = await get_database()
    try:
        plot_id = entry.plot_id
        if not plot_id:
            raise HTTPException(status_code=400, detail="Plot ID is required")

        # verify ownership
        owns = await conn.fetchrow(
            """
            SELECT 1
            FROM core.plot p
            JOIN core.farm f ON p.farm_id = f.id
            WHERE p.id = $1::uuid
              AND f.user_id = $2::uuid
              AND p.deleted_at IS NULL
              AND f.deleted_at IS NULL
            """,
            plot_id, current_user_id,
        )
        if not owns:
            raise HTTPException(status_code=404, detail="Plot not found")

        entry_date = parse_date(entry.date)
        photos_list = entry.photos or []
        audio_url = entry.audio_note

        new_id = await conn.fetchval(
            """
            INSERT INTO core.journal_entry
                (plot_id, user_id, entry_date, type, title, content, photos, audio_url)
            VALUES
                ($1::uuid, $2::uuid, $3::date, $4, $5, $6, $7::jsonb, $8)
            RETURNING id
            """,
            plot_id, current_user_id, entry_date, entry.type, entry.title, entry.content,
            json.dumps(photos_list), audio_url,
        )

        # return the created object (helps your test script)
        created = await conn.fetchrow(
            """
            SELECT j.id, j.plot_id, j.entry_date, j.type, j.title, j.content,
                   j.photos, j.audio_url, j.created_at,
                   p.name AS plot_name, f.name AS farm_name
            FROM core.journal_entry j
            JOIN core.plot p ON j.plot_id = p.id
            JOIN core.farm f ON p.farm_id = f.id
            WHERE j.id = $1::uuid
            """,
            new_id,
        )
        return {
            "id": str(created["id"]),
            "plotId": str(created["plot_id"]),
            "date": created["entry_date"].isoformat(),
            "type": created["type"],
            "title": created["title"],
            "content": created["content"],
            "photos": created["photos"] or [],
            "audioNote": created["audio_url"],
            "plotName": created["plot_name"],
            "farmName": created["farm_name"],
            "createdAt": created["created_at"].isoformat(),
            "message": "Journal entry created successfully",
        }
    finally:
        await conn.close()

@router.put("/{entry_id}")
async def update_journal_entry(entry_id: str, entry_update: JournalEntryUpdate, current_user_id: str = Depends(get_current_user)):
    conn = await get_database()
    try:
        exists = await conn.fetchrow(
            """
            SELECT 1 FROM core.journal_entry
            WHERE id = $1::uuid AND user_id = $2::uuid AND deleted_at IS NULL
            """,
            entry_id, current_user_id,
        )
        if not exists:
            raise HTTPException(status_code=404, detail="Journal entry not found")

        sets, vals, n = [], [], 1
        if entry_update.date is not None:
            sets.append(f"entry_date = ${n}::date"); vals.append(parse_date(entry_update.date)); n += 1
        if entry_update.type is not None:
            sets.append(f"type = ${n}"); vals.append(entry_update.type); n += 1
        if entry_update.title is not None:
            sets.append(f"title = ${n}"); vals.append(entry_update.title); n += 1
        if entry_update.content is not None:
            sets.append(f"content = ${n}"); vals.append(entry_update.content); n += 1
        if entry_update.photos is not None:
            sets.append(f"photos = ${n}::jsonb"); vals.append(json.dumps(entry_update.photos)); n += 1
        if entry_update.audio_note is not None:
            sets.append(f"audio_url = ${n}"); vals.append(entry_update.audio_note); n += 1

        if not sets:
            raise HTTPException(status_code=400, detail="No fields to update")

        vals.extend([entry_id, current_user_id])

        await conn.execute(
            f"""
            UPDATE core.journal_entry
            SET {", ".join(sets)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${n}::uuid AND user_id = ${n+1}::uuid
            """,
            *vals,
        )
        return {"message": "Journal entry updated successfully"}
    finally:
        await conn.close()

@router.delete("/{entry_id}")
async def delete_journal_entry(entry_id: str, current_user_id: str = Depends(get_current_user)):
    conn = await get_database()
    try:
        res = await conn.execute(
            """
            UPDATE core.journal_entry
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1::uuid AND user_id = $2::uuid AND deleted_at IS NULL
            """,
            entry_id, current_user_id,
        )
        if res == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Journal entry not found")
        return {"message": "Journal entry deleted successfully"}
    finally:
        await conn.close()

@router.get("/stats")
async def get_journal_stats(current_user_id: str = Depends(get_current_user)):
    conn = await get_database()
    try:
        s = await conn.fetchrow(
            """
            SELECT 
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE entry_date = CURRENT_DATE) AS today,
                COUNT(*) FILTER (WHERE entry_date >= CURRENT_DATE - 7) AS last_week,
                COUNT(*) FILTER (WHERE type = 'planting') AS planting,
                COUNT(*) FILTER (WHERE type = 'fertilizer') AS fertilizer,
                COUNT(*) FILTER (WHERE type = 'irrigation') AS irrigation,
                COUNT(*) FILTER (WHERE type = 'pest') AS pest,
                COUNT(*) FILTER (WHERE type = 'harvest') AS harvest
            FROM core.journal_entry
            WHERE user_id = $1::uuid AND deleted_at IS NULL
            """,
            current_user_id,
        )
        return {
            "total": s["total"],
            "today": s["today"],
            "lastWeek": s["last_week"],
            "byType": {
                "planting": s["planting"],
                "fertilizer": s["fertilizer"],
                "irrigation": s["irrigation"],
                "pest": s["pest"],
                "harvest": s["harvest"],
            },
        }
    finally:
        await conn.close()
