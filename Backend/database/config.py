import asyncpg
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

async def get_database():
    """Get database connection"""
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")
    
    return await asyncpg.connect(DATABASE_URL)

async def close_database(conn):
    """Close database connection"""
    await conn.close()
