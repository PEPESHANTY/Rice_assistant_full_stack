#!/usr/bin/env python3
"""
Debug login issues
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv
from utils.auth import verify_password

# Load environment variables
load_dotenv()

async def debug_login():
    """Debug login issues"""
    print("Debugging login issues...")
    
    if not os.getenv('DATABASE_URL'):
        print("ERROR: DATABASE_URL not set")
        return
    
    try:
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        
        # Check demo user
        user = await conn.fetchrow('''
            SELECT id, phone, email, password_hash, display_name, deleted_at
            FROM core.user WHERE phone = $1
        ''', '+84123456789')
        
        if user:
            print(f"✅ Demo user found:")
            print(f"   ID: {user['id']}")
            print(f"   Phone: {user['phone']}")
            print(f"   Name: {user['display_name']}")
            print(f"   Deleted: {user['deleted_at']}")
            print(f"   Password Hash: {user['password_hash']}")
            
            # Test password verification
            is_valid = verify_password('demo123', user['password_hash'])
            print(f"   Password 'demo123' valid: {is_valid}")
            
            if not is_valid:
                print("   ❌ Password verification failed!")
                print("   Let's check the hash...")
                print(f"   Hash length: {len(user['password_hash'])}")
                print(f"   Hash starts with: {user['password_hash'][:10]}")
                
        else:
            print("❌ Demo user not found!")
            
        await conn.close()
        
    except Exception as e:
        print(f"❌ Database error: {e}")

if __name__ == "__main__":
    asyncio.run(debug_login())
