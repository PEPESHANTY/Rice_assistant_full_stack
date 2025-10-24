#!/usr/bin/env python3
"""
Script to check all data in each table
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

async def check_all_data():
    """Check all data in each table"""
    try:
        print("Checking all data in tables...")
        
        if not DATABASE_URL:
            print("ERROR: DATABASE_URL not set")
            return
        
        conn = await asyncpg.connect(DATABASE_URL)
        
        # List of tables to check
        tables = [
            'core.user',
            'core.farm', 
            'core.plot',
            'core.task',
            'core.journal_entry',
            'core.weather_daily',
            'core.conversation',
            'core.message',
            'core.knowledge_chunk',
            'core.media_asset',
            'sys.job_queue'
        ]
        
        for table in tables:
            print(f"\n{table}:")
            try:
                # Check if table has deleted_at column
                has_deleted_at = await conn.fetchval("""
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.columns 
                        WHERE table_schema = $1 AND table_name = $2 AND column_name = 'deleted_at'
                    )
                """, table.split('.')[0], table.split('.')[1])
                
                if has_deleted_at:
                    rows = await conn.fetch(f"SELECT * FROM {table} WHERE deleted_at IS NULL")
                else:
                    rows = await conn.fetch(f"SELECT * FROM {table}")
                
                if rows:
                    print(f"   FOUND {len(rows)} rows")
                    for row in rows:
                        # Show key fields for each table
                        if table == 'core.user':
                            print(f"     - {row['display_name']} ({row['email']})")
                        elif table == 'core.farm':
                            print(f"     - {row['name']} in {row['province']}")
                        elif table == 'core.plot':
                            print(f"     - {row['name']} ({row['area_m2']} m²)")
                        elif table == 'core.task':
                            print(f"     - {row['title']} (Due: {row['due_date']})")
                        elif table == 'core.journal_entry':
                            print(f"     - {row['title']} on {row['entry_date']}")
                        elif table == 'core.weather_daily':
                            print(f"     - Weather for {row['for_date']}")
                        elif table == 'core.conversation':
                            print(f"     - Conversation started at {row['started_at']}")
                        elif table == 'core.message':
                            print(f"     - {row['role']}: {row['content'][:50]}...")
                        elif table == 'core.knowledge_chunk':
                            print(f"     - {row['title']} ({row['lang']})")
                        elif table == 'core.media_asset':
                            print(f"     - {row['kind']}: {row['key']}")
                        elif table == 'sys.job_queue':
                            print(f"     - {row['job_type']} ({row['status']})")
                else:
                    print(f"   NO DATA FOUND")
            except Exception as e:
                print(f"   ERROR querying {table}: {e}")
        
        # Also check with deleted_at not null to see if there are any soft-deleted records
        print(f"\nChecking soft-deleted records:")
        for table in tables:
            if table not in ['core.weather_daily', 'sys.job_queue']:  # These don't have deleted_at
                try:
                    deleted_count = await conn.fetchval(f"SELECT COUNT(*) FROM {table} WHERE deleted_at IS NOT NULL")
                    if deleted_count > 0:
                        print(f"   {table}: {deleted_count} deleted records")
                except:
                    pass
        
        await conn.close()
        print("\nData check completed!")
        
    except Exception as e:
        print(f"ERROR checking data: {e}")

if __name__ == "__main__":
    asyncio.run(check_all_data())
