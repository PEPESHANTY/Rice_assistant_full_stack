import asyncio
from database.config import get_database

async def check_user_farms():
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
            else:
                print('  No farms found')
        else:
            print('User not found')
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(check_user_farms())
