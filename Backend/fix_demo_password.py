#!/usr/bin/env python3
"""
Script to fix demo user password to match frontend expectation
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv
from utils.auth import hash_password

# Load environment variables
load_dotenv()

async def fix_demo_password():
    """Fix the demo user password to 'demo123'"""
    try:
        print("Fixing demo user password...")
        
        if not os.getenv('DATABASE_URL'):
            print("ERROR: DATABASE_URL not set")
            return
        
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        
        # Hash the demo password
        demo_password = "demo123"
        password_hash = hash_password(demo_password)
        
        # Update the demo user password
        result = await conn.execute('''
            UPDATE core.user 
            SET password_hash = $1
            WHERE phone = $2
        ''', password_hash, '+84123456789')
        
        print(f"Password updated for demo user: {result}")
        print(f"Demo user can now login with phone: +84123456789 and password: {demo_password}")
        
        await conn.close()
        
    except Exception as e:
        print(f"ERROR fixing password: {e}")

if __name__ == "__main__":
    asyncio.run(fix_demo_password())
