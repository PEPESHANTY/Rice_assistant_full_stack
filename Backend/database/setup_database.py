#!/usr/bin/env python3
"""
Script to setup database - runs init_db if needed, then adds demo data
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

async def check_database_exists():
    """Check if database tables exist"""
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Check if core.user table exists
        table_exists = await conn.fetchval("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'core' AND table_name = 'user'
            )
        """)
        
        await conn.close()
        return table_exists
    except Exception:
        return False

async def setup_database():
    """Setup database - run init_db to create tables only"""
    try:
        print("Setting up database (creating tables only)...")
        
        if not DATABASE_URL:
            print("ERROR: DATABASE_URL not set")
            return
        
        # Check if database already exists
        if await check_database_exists():
            print("Database already exists - tables are ready")
        else:
            print("Database not found, running initialization...")
            # Import and run init_db
            from database.init_db import init_db
            await init_db()
            
        print("Database setup completed successfully!")
        print("Run 'python add_complete_demo_data.py' to add demo data")
        
    except Exception as e:
        print(f"ERROR setting up database: {e}")

if __name__ == "__main__":
    asyncio.run(setup_database())
