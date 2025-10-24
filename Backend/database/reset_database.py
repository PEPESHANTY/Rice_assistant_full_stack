#!/usr/bin/env python3
"""
Script to completely reset the database - drops and recreates everything
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

async def reset_database():
    """Completely reset the database"""
    try:
        print("Resetting database...")
        
        if not DATABASE_URL:
            print("ERROR: DATABASE_URL not set")
            return
        
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Drop all tables in correct order to handle foreign key constraints
        print("Dropping tables...")
        
        # Drop tables in reverse order of dependencies
        tables_to_drop = [
            'sys.job_queue',
            'core.message',
            'core.conversation',
            'core.knowledge_chunk',
            'core.media_asset',
            'core.weather_daily',
            'core.journal_entry',
            'core.task',
            'core.plot',
            'core.farm',
            'core.user'
        ]
        
        for table in tables_to_drop:
            try:
                await conn.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
                print(f"  Dropped {table}")
            except Exception as e:
                print(f"  Error dropping {table}: {e}")
        
        # Drop schemas
        try:
            await conn.execute("DROP SCHEMA IF EXISTS sys CASCADE")
            print("  Dropped sys schema")
        except Exception as e:
            print(f"  Error dropping sys schema: {e}")
            
        try:
            await conn.execute("DROP SCHEMA IF EXISTS core CASCADE")
            print("  Dropped core schema")
        except Exception as e:
            print(f"  Error dropping core schema: {e}")
        
        await conn.close()
        
        print("Database reset completed!")
        print("Run 'python setup_database.py' to create tables")
        print("Run 'python add_complete_demo_data.py' to add demo data")
        
    except Exception as e:
        print(f"ERROR resetting database: {e}")

if __name__ == "__main__":
    asyncio.run(reset_database())
