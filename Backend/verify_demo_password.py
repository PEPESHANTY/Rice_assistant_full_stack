#!/usr/bin/env python3
"""
Script to verify demo user password
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv
from utils.auth import verify_password

# Load environment variables
load_dotenv()

async def verify_demo_password():
    """Verify the demo user password"""
    try:
        print("Verifying demo user password...")
        
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
            
            # Test common demo passwords
            test_passwords = ['demo123', 'demo', 'password', '123456', '000000']
            
            for password in test_passwords:
                is_valid = verify_password(password, user['password_hash'])
                print(f"Password '{password}': {'VALID' if is_valid else 'INVALID'}")
            
            if not any(verify_password(pw, user['password_hash']) for pw in test_passwords):
                print("None of the common demo passwords work. The password might be different.")
                
        else:
            print("Demo user not found")
        
        await conn.close()
        
    except Exception as e:
        print(f"ERROR verifying password: {e}")

if __name__ == "__main__":
    asyncio.run(verify_demo_password())
