import asyncio
from database.config import get_database

async def check_all_data():
    conn = await get_database()
    try:
        # Get user ID for Shantanu Bhute
        user = await conn.fetchrow('SELECT id FROM core.user WHERE phone = $1', '09970058788')
        if user:
            user_id = user['id']
            print(f'User ID: {user_id}')
            
            # Get farms for this user
            farms = await conn.fetch('''
                SELECT id, name, province, district, address_text, created_at
                FROM core.farm 
                WHERE user_id = $1 AND deleted_at IS NULL
                ORDER BY created_at DESC
            ''', user_id)
            
            print(f'\nFarms for user {user_id}:')
            if farms:
                for farm in farms:
                    print(f'  - {farm["name"]} ({farm["province"]}, {farm["district"]}) - Created: {farm["created_at"]}')
                    
                    # Get plots for this farm
                    plots = await conn.fetch('''
                        SELECT id, name, area_m2, soil_type, variety, planting_date, harvest_date, irrigation_method
                        FROM core.plot 
                        WHERE farm_id = $1 AND deleted_at IS NULL
                        ORDER BY created_at DESC
                    ''', farm['id'])
                    
                    if plots:
                        print(f'    Plots:')
                        for plot in plots:
                            print(f'      - {plot["name"]} ({plot["area_m2"]} m²) - {plot["variety"]}')
                    else:
                        print(f'    No plots found')
            else:
                print('  No farms found')
        else:
            print('User not found')
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(check_all_data())
