import asyncio
from database.config import get_database

async def check_users():
    conn = await get_database()
    try:
        # Get users with correct column names
        users = await conn.fetch('SELECT id, display_name, phone FROM core.user')
        print('Users in database:')
        for user in users:
            print(f'  {user["id"]}: {user["display_name"]} ({user["phone"]})')
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(check_users())
