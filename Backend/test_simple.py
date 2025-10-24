#!/usr/bin/env python3
"""
Simple API test script
"""

import asyncio
import aiohttp
import json

async def test_api():
    print("Testing AIRRVie API Endpoints...")
    print("=" * 50)
    
    async with aiohttp.ClientSession() as session:
        # Test health endpoints
        print("1. Testing Health Endpoints:")
        endpoints = [
            ("/", "Root"),
            ("/health", "Health Check"),
            ("/api/status", "API Status")
        ]
        
        for endpoint, name in endpoints:
            try:
                async with session.get(f"http://localhost:8000{endpoint}") as response:
                    print(f"  {name}: {response.status} - {'✓' if response.status == 200 else '✗'}")
            except Exception as e:
                print(f"  {name}: Error - {e}")
        
        print("\n2. Testing Authentication:")
        # Test login
        login_data = {
            'phone': '+84123456789',
            'password': 'demo123'
        }
        
        try:
            async with session.post('http://localhost:8000/api/auth/login', json=login_data) as response:
                print(f"  Login: {response.status} - {'✓' if response.status == 200 else '✗'}")
                if response.status == 200:
                    data = await response.json()
                    token = data.get('token')
                    print(f"  Token obtained: {token[:20]}..." if token else "  No token")
                    
                    # Test authenticated endpoints
                    headers = {'Authorization': f'Bearer {token}'}
                    
                    print("\n3. Testing Authenticated Endpoints:")
                    auth_endpoints = [
                        ("/api/farms", "Get Farms"),
                        ("/api/tasks", "Get Tasks"),
                        ("/api/journal", "Get Journal"),
                        ("/api/users", "Get Users"),
                        ("/api/weather", "Get Weather")
                    ]
                    
                    for endpoint, name in auth_endpoints:
                        try:
                            async with session.get(f"http://localhost:8000{endpoint}", headers=headers) as auth_response:
                                print(f"  {name}: {auth_response.status} - {'✓' if auth_response.status == 200 else '✗'}")
                        except Exception as e:
                            print(f"  {name}: Error - {e}")
                    
                    # Test assistant endpoints
                    print("\n4. Testing Assistant Endpoints:")
                    assistant_endpoints = [
                        ("/api/assistant/conversations", "Get Conversations"),
                        ("/api/assistant/chat", "Chat Endpoint")
                    ]
                    
                    for endpoint, name in assistant_endpoints:
                        try:
                            async with session.get(f"http://localhost:8000{endpoint}", headers=headers) as assistant_response:
                                print(f"  {name}: {assistant_response.status} - {'✓' if assistant_response.status == 200 else '✗'}")
                        except Exception as e:
                            print(f"  {name}: Error - {e}")
                            
        except Exception as e:
            print(f"  Login Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_api())
