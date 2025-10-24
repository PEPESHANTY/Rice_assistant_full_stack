#!/usr/bin/env python3
"""
Script to check password hash in database
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def check_password_hash():
    """Check the password hash for demo user"""
    try:
        print("Checking password hash...")
        
        if not os.getenv('DATABASE_URL'):
            print("ERROR: DATABASE_URL not set")
            return
        
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        
        # Get user with password hash
        user = await conn.fetchrow('''
            SELECT id, phone, email, password_hash, display_name 
            FROM core.user WHERE phone = $1
        ''', '+84123456789')
        
        if user:
            print(f"User: {user['display_name']} ({user['phone']})")
            print(f"Password hash: {user['password_hash']}")
            print(f"Hash length: {len(user['password_hash'])}")
            print(f"Hash starts with: {user['password_hash'][:10]}")
        else:
            print("User not found")
        
        await conn.close()
        
    except Exception as e:
        print(f"ERROR checking password: {e}")

if __name__ == "__main__":
    asyncio.run(check_password_hash())
