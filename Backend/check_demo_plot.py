import asyncpg
import asyncio
from database.config import get_database

async def check_demo_plot():
    """Check if the demo plot exists"""
    conn = await get_database()
    try:
        # Check if demo plot exists
        plot = await conn.fetchrow('''
            SELECT id, name, farm_id 
            FROM core.plot 
            WHERE id = $1 AND deleted_at IS NULL
        ''', '33333333-3333-3333-3333-333333333333')
        
        if plot:
            print(f"✅ Demo plot found: {plot['name']} (ID: {plot['id']})")
            print(f"   Farm ID: {plot['farm_id']}")
        else:
            print("❌ Demo plot not found!")
            
        # Check all plots for demo user
        plots = await conn.fetch('''
            SELECT p.id, p.name, f.name as farm_name
            FROM core.plot p
            JOIN core.farm f ON p.farm_id = f.id
            WHERE f.user_id = $1 AND p.deleted_at IS NULL AND f.deleted_at IS NULL
        ''', '11111111-1111-1111-1111-111111111111')
        
        print(f"\n📊 All plots for demo user:")
        for plot in plots:
            print(f"  - {plot['name']} (ID: {plot['id']}) - Farm: {plot['farm_name']}")
            
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(check_demo_plot())
