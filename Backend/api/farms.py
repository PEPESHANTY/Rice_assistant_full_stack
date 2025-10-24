from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
import asyncpg
import json

from database.config import get_database
from api.auth import get_current_user

router = APIRouter(prefix="/api", tags=["farms and plots"])

# Pydantic models
class FarmCreate(BaseModel):
    name: str
    province: str
    district: str
    address_text: Optional[str] = None

class FarmUpdate(BaseModel):
    name: Optional[str] = None
    province: Optional[str] = None
    district: Optional[str] = None
    address_text: Optional[str] = None

class PlotCreate(BaseModel):
    farmId: str
    name: str
    area_m2: float
    soil_type: Optional[str] = None
    variety: Optional[str] = None
    planting_date: Optional[str] = None
    harvest_date: Optional[str] = None
    irrigation_method: Optional[str] = None
    notes: Optional[str] = None
    photos: Optional[List[str]] = []

class PlotUpdate(BaseModel):
    name: Optional[str] = None
    area_m2: Optional[float] = None
    soil_type: Optional[str] = None
    variety: Optional[str] = None
    planting_date: Optional[str] = None
    harvest_date: Optional[str] = None
    irrigation_method: Optional[str] = None
    notes: Optional[str] = None
    photos: Optional[List[str]] = None

# Farms endpoints
@router.get("/farms")
async def get_farms(current_user_id: str = Depends(get_current_user)):
    """Get all farms for the current user"""
    conn = await get_database()
    try:
        farms = await conn.fetch('''
            SELECT f.id, f.name, f.province, f.district, f.address_text, f.created_at,
                   COUNT(p.id) as plot_count
            FROM core.farm f
            LEFT JOIN core.plot p ON f.id = p.farm_id AND p.deleted_at IS NULL
            WHERE f.user_id = $1 AND f.deleted_at IS NULL
            GROUP BY f.id, f.name, f.province, f.district, f.address_text, f.created_at
            ORDER BY f.created_at DESC
        ''', current_user_id)
        
        return [
            {
                "id": str(farm["id"]),
                "name": farm["name"],
                "province": farm["province"],
                "district": farm["district"],
                "addressText": farm["address_text"],
                "plotCount": farm["plot_count"],
                "createdAt": farm["created_at"].isoformat()
            }
            for farm in farms
        ]
    finally:
        await conn.close()

@router.post("/farms")
async def create_farm(farm: FarmCreate, current_user_id: str = Depends(get_current_user)):
    """Create a new farm"""
    conn = await get_database()
    try:
        farm_id = await conn.fetchval('''
            INSERT INTO core.farm (user_id, name, province, district, address_text)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        ''', current_user_id, farm.name, farm.province, farm.district, farm.address_text)
        
        return {"id": str(farm_id), "message": "Farm created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create farm: {str(e)}")
    finally:
        await conn.close()

@router.put("/farms/{farm_id}")
async def update_farm(farm_id: str, farm_update: FarmUpdate, current_user_id: str = Depends(get_current_user)):
    """Update a farm"""
    conn = await get_database()
    try:
        # Check if farm belongs to user
        existing_farm = await conn.fetchrow('''
            SELECT id FROM core.farm WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        ''', farm_id, current_user_id)
        
        if not existing_farm:
            raise HTTPException(status_code=404, detail="Farm not found")
        
        # Build update query dynamically
        update_fields = []
        update_values = []
        field_count = 1
        
        if farm_update.name is not None:
            update_fields.append(f"name = ${field_count}")
            update_values.append(farm_update.name)
            field_count += 1
            
        if farm_update.province is not None:
            update_fields.append(f"province = ${field_count}")
            update_values.append(farm_update.province)
            field_count += 1
            
        if farm_update.district is not None:
            update_fields.append(f"district = ${field_count}")
            update_values.append(farm_update.district)
            field_count += 1
            
        if farm_update.address_text is not None:
            update_fields.append(f"address_text = ${field_count}")
            update_values.append(farm_update.address_text)
            field_count += 1
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_values.extend([farm_id, current_user_id])
        
        await conn.execute(f'''
            UPDATE core.farm SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${field_count} AND user_id = ${field_count + 1}
        ''', *update_values)
        
        return {"message": "Farm updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update farm: {str(e)}")
    finally:
        await conn.close()

@router.delete("/farms/{farm_id}")
async def delete_farm(farm_id: str, current_user_id: str = Depends(get_current_user)):
    """Delete a farm (soft delete)"""
    conn = await get_database()
    try:
        result = await conn.execute('''
            UPDATE core.farm SET deleted_at = CURRENT_TIMESTAMP 
            WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        ''', farm_id, current_user_id)
        
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Farm not found")
        
        return {"message": "Farm deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete farm: {str(e)}")
    finally:
        await conn.close()

# Plots endpoints
@router.get("/plots")
async def get_plots(current_user_id: str = Depends(get_current_user)):
    """Get all plots for the current user"""
    conn = await get_database()
    try:
        plots = await conn.fetch('''
            SELECT p.id, p.farm_id, p.name, p.area_m2, p.soil_type, p.variety, 
                   p.planting_date, p.harvest_date, p.irrigation_method,
                   p.notes, p.photos, p.created_at,
                   f.name as farm_name, f.province as farm_province, f.district as farm_district
            FROM core.plot p
            JOIN core.farm f ON p.farm_id = f.id
            WHERE f.user_id = $1 AND p.deleted_at IS NULL AND f.deleted_at IS NULL
            ORDER BY p.created_at DESC
        ''', current_user_id)
        
        return [
            {
                "id": str(plot["id"]),
                "farmId": str(plot["farm_id"]),
                "name": plot["name"],
                "areaM2": float(plot["area_m2"]),
                "soilType": plot["soil_type"],
                "variety": plot["variety"],
                "plantingDate": plot["planting_date"].isoformat() if plot["planting_date"] else None,
                "harvestDate": plot["harvest_date"].isoformat() if plot["harvest_date"] else None,
                "irrigationMethod": plot["irrigation_method"],
                "notes": plot["notes"],
                "photos": plot["photos"] or [],
                "farmName": plot["farm_name"],
                "farmProvince": plot["farm_province"],
                "farmDistrict": plot["farm_district"],
                "createdAt": plot["created_at"].isoformat()
            }
            for plot in plots
        ]
    finally:
        await conn.close()

@router.post("/plots")
async def create_plot(plot: PlotCreate, current_user_id: str = Depends(get_current_user)):
    """Create a new plot"""
    conn = await get_database()
    try:
        # Check if farm belongs to user
        farm = await conn.fetchrow('''
            SELECT id FROM core.farm WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        ''', plot.farmId, current_user_id)
        
        if not farm:
            raise HTTPException(status_code=404, detail="Farm not found")
        
        # Convert dates
        planting_date = None
        harvest_date = None
        
        if plot.planting_date:
            planting_date = date.fromisoformat(plot.planting_date)
        if plot.harvest_date:
            harvest_date = date.fromisoformat(plot.harvest_date)
        
        # Check if planting date is later than harvest date
        if planting_date and harvest_date and planting_date > harvest_date:
            raise HTTPException(
                status_code=400, 
                detail="Planting date cannot be later than harvest date. Please check your dates."
            )
        
        # Convert photos to JSONB array format
        photos_array = plot.photos if plot.photos else []
        
        plot_id = await conn.fetchval('''
            INSERT INTO core.plot (farm_id, name, area_m2, soil_type, variety, planting_date, 
                              harvest_date, irrigation_method, notes, photos)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
        ''', plot.farmId, plot.name, plot.area_m2, plot.soil_type, plot.variety, planting_date,
            harvest_date, plot.irrigation_method, plot.notes, photos_array)
        
        return {"id": str(plot_id), "message": "Plot created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create plot: {str(e)}")
    finally:
        await conn.close()

@router.put("/plots/{plot_id}")
async def update_plot(plot_id: str, plot_update: PlotUpdate, current_user_id: str = Depends(get_current_user)):
    """Update a plot"""
    conn = await get_database()
    try:
        # Check if plot belongs to user
        existing_plot = await conn.fetchrow('''
            SELECT p.id FROM core.plot p
            JOIN core.farm f ON p.farm_id = f.id
            WHERE p.id = $1 AND f.user_id = $2 AND p.deleted_at IS NULL AND f.deleted_at IS NULL
        ''', plot_id, current_user_id)
        
        if not existing_plot:
            raise HTTPException(status_code=404, detail="Plot not found")
        
        # Check date validation for planting and harvest dates
        planting_date = None
        harvest_date = None
        
        if plot_update.planting_date is not None:
            planting_date = date.fromisoformat(plot_update.planting_date)
        if plot_update.harvest_date is not None:
            harvest_date = date.fromisoformat(plot_update.harvest_date)
        
        # If both dates are being updated, check if planting date is later than harvest date
        if planting_date and harvest_date and planting_date > harvest_date:
            raise HTTPException(
                status_code=400, 
                detail="Planting date cannot be later than harvest date. Please check your dates."
            )
        
        # Build update query dynamically
        update_fields = []
        update_values = []
        field_count = 1
        
        if plot_update.name is not None:
            update_fields.append(f"name = ${field_count}")
            update_values.append(plot_update.name)
            field_count += 1
            
        if plot_update.area_m2 is not None:
            update_fields.append(f"area_m2 = ${field_count}")
            update_values.append(plot_update.area_m2)
            field_count += 1
            
        if plot_update.soil_type is not None:
            update_fields.append(f"soil_type = ${field_count}")
            update_values.append(plot_update.soil_type)
            field_count += 1
            
        if plot_update.variety is not None:
            update_fields.append(f"variety = ${field_count}")
            update_values.append(plot_update.variety)
            field_count += 1
            
        if plot_update.planting_date is not None:
            update_fields.append(f"planting_date = ${field_count}")
            update_values.append(planting_date)
            field_count += 1
            
        if plot_update.harvest_date is not None:
            update_fields.append(f"harvest_date = ${field_count}")
            update_values.append(harvest_date)
            field_count += 1
            
        if plot_update.irrigation_method is not None:
            update_fields.append(f"irrigation_method = ${field_count}")
            update_values.append(plot_update.irrigation_method)
            field_count += 1
            
        if plot_update.notes is not None:
            update_fields.append(f"notes = ${field_count}")
            update_values.append(plot_update.notes)
            field_count += 1
            
        if plot_update.photos is not None:
            update_fields.append(f"photos = ${field_count}")
            update_values.append(json.dumps(plot_update.photos))
            field_count += 1
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_values.append(plot_id)
        
        await conn.execute(f'''
            UPDATE core.plot SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${field_count}
        ''', *update_values)
        
        return {"message": "Plot updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update plot: {str(e)}")
    finally:
        await conn.close()

@router.delete("/plots/{plot_id}")
async def delete_plot(plot_id: str, current_user_id: str = Depends(get_current_user)):
    """Delete a plot (soft delete)"""
    conn = await get_database()
    try:
        result = await conn.execute('''
            UPDATE core.plot p SET deleted_at = CURRENT_TIMESTAMP
            FROM core.farm f
            WHERE p.id = $1 AND p.farm_id = f.id AND f.user_id = $2 
            AND p.deleted_at IS NULL AND f.deleted_at IS NULL
        ''', plot_id, current_user_id)
        
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Plot not found")
        
        return {"message": "Plot deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete plot: {str(e)}")
    finally:
        await conn.close()
