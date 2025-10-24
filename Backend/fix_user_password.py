#!/usr/bin/env python3
"""
Script to fix user password hash
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv
from passlib.hash import bcrypt

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

async def fix_user_password():
    """Fix user password hash"""
    try:
        print("Fixing user password hash...")
        
        if not DATABASE_URL:
            print("ERROR: DATABASE_URL not set")
            return
        
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Create proper bcrypt hash for demo123
        password_hash = bcrypt.hash("demo123")
        print(f"Generated bcrypt hash: {password_hash}")
        
        # Update the demo user
        result = await conn.execute('''
            UPDATE core.user 
            SET password_hash = $1
            WHERE phone = '+84123456789'
        ''', password_hash)
        
        print(f"Update result: {result}")
        
        # Verify the update
        user = await conn.fetchrow('''
            SELECT phone, password_hash FROM core.user 
            WHERE phone = '+84123456789'
        ''')
        
        if user:
            print(f"Updated user: {user['phone']}")
            print(f"New password hash: {user['password_hash']}")
            
            # Test the password verification
            is_valid = bcrypt.verify("demo123", user['password_hash'])
            print(f"Password verification test: {is_valid}")
        
        await conn.close()
        print("User password fix completed!")
        
    except Exception as e:
        print(f"ERROR fixing user password: {e}")

if __name__ == "__main__":
    asyncio.run(fix_user_password())
