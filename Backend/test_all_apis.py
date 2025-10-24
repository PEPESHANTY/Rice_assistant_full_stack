#!/usr/bin/env python3
"""
Comprehensive API test script for AIRRVie backend
Tests all endpoints with proper authentication
"""

import asyncio
import aiohttp
import json
import sys
from typing import Dict, Any

# API configuration
BASE_URL = "http://localhost:8000"
TEST_PHONE = "+84123456789"
TEST_PASSWORD = "demo123"

class APITester:
    def __init__(self):
        self.session = None
        self.token = None
        self.user_id = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> Dict[str, Any]:
        """Make HTTP request and handle errors"""
        url = f"{BASE_URL}{endpoint}"
        headers = headers or {}
        
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
            
        try:
            async with self.session.request(method, url, json=data, headers=headers) as response:
                response_data = await response.json() if response.content_length else {}
                return {
                    "status": response.status,
                    "data": response_data,
                    "success": response.status < 400
                }
        except Exception as e:
            return {
                "status": 500,
                "data": {"error": str(e)},
                "success": False
            }
    
    async def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n=== Testing Health Endpoints ===")
        
        endpoints = [
            ("GET", "/", "Root endpoint"),
            ("GET", "/health", "Health check"),
            ("GET", "/api/status", "API status")
        ]
        
        for method, endpoint, description in endpoints:
            result = await self.make_request(method, endpoint)
            print(f"{description}: {'✓' if result['success'] else '✗'} - {result['status']}")
            if not result['success']:
                print(f"  Error: {result['data']}")
    
    async def test_auth_flow(self):
        """Test authentication flow"""
        print("\n=== Testing Authentication Flow ===")
        
        # Request OTP
        print("1. Requesting OTP...")
        result = await self.make_request("POST", "/api/auth/request-otp", {
            "phone": TEST_PHONE
        })
        print(f"OTP Request: {'✓' if result['success'] else '✗'} - {result['status']}")
        
        if not result['success']:
            print(f"  Error: {result['data']}")
            return False
        
        # Get OTP from response (in real scenario, this would come from SMS)
        otp = result['data'].get('otp', '553771')  # Using the OTP from logs
        
        # Verify OTP
        print("2. Verifying OTP...")
        result = await self.make_request("POST", "/api/auth/verify-otp", {
            "phone": TEST_PHONE,
            "otp": otp
        })
        print(f"OTP Verification: {'✓' if result['success'] else '✗'} - {result['status']}")
        
        if not result['success']:
            print(f"  Error: {result['data']}")
            return False
        
        # Login with password
        print("3. Logging in...")
        result = await self.make_request("POST", "/api/auth/login", {
            "phone": TEST_PHONE,
            "password": TEST_PASSWORD
        })
        print(f"Login: {'✓' if result['success'] else '✗'} - {result['status']}")
        
        if result['success']:
            self.token = result['data'].get('token')
            self.user_id = result['data'].get('user', {}).get('id')
            print(f"  Token obtained: {self.token[:20]}...")
            print(f"  User ID: {self.user_id}")
            return True
        else:
            print(f"  Error: {result['data']}")
            return False
    
    async def test_weather_api(self):
        """Test weather API"""
        print("\n=== Testing Weather API ===")
        
        result = await self.make_request("GET", "/api/weather")
        print(f"Weather API: {'✓' if result['success'] else '✗'} - {result['status']}")
        
        if result['success']:
            weather_data = result['data']
            print(f"  Location: {weather_data.get('location', 'N/A')}")
            print(f"  Temperature: {weather_data.get('current', {}).get('temperature', 'N/A')}°C")
            print(f"  Condition: {weather_data.get('current', {}).get('condition', 'N/A')}")
        else:
            print(f"  Error: {result['data']}")
    
    async def test_farms_api(self):
        """Test farms API"""
        print("\n=== Testing Farms API ===")
        
        # Get farms
        result = await self.make_request("GET", "/api/farms")
        print(f"Get Farms: {'✓' if result['success'] else '✗'} - {result['status']}")
        
        if result['success']:
            farms = result['data']
            print(f"  Found {len(farms)} farms")
            for farm in farms:
                print(f"  - {farm.get('name')} ({farm.get('plotCount', 0)} plots)")
        else:
            print(f"  Error: {result['data']}")
    
    async def test_tasks_api(self):
        """Test tasks API"""
        print("\n=== Testing Tasks API ===")
        
        # Get tasks
        result = await self.make_request("GET", "/api/tasks")
        print(f"Get Tasks: {'✓' if result['success'] else '✗'} - {result['status']}")
        
        if result['success']:
            tasks = result['data']
            print(f"  Found {len(tasks)} tasks")
            for task in tasks:
                print(f"  - {task.get('title')} (Due: {task.get('dueDate', 'N/A')})")
        else:
            print(f"  Error: {result['data']}")
    
    async def test_journal_api(self):
        """Test journal API"""
        print("\n=== Testing Journal API ===")
        
        # Get journal entries
        result = await self.make_request("GET", "/api/journal")
        print(f"Get Journal Entries: {'✓' if result['success'] else '✗'} - {result['status']}")
        
        if result['success']:
            entries = result['data']
            print(f"  Found {len(entries)} journal entries")
            for entry in entries:
                print(f"  - {entry.get('title')} ({entry.get('date', 'N/A')})")
        else:
            print(f"  Error: {result['data']}")
    
    async def test_assistant_api(self):
        """Test assistant/conversation API"""
        print("\n=== Testing Assistant API ===")
        
        # Get conversations
        result = await self.make_request("GET", "/api/conversations")
        print(f"Get Conversations: {'✓' if result['success'] else '✗'} - {result['status']}")
        
        if result['success']:
            conversations = result['data']
            print(f"  Found {len(conversations)} conversations")
            
            # Create a new conversation if none exist
            if not conversations:
                print("  Creating new conversation...")
                result = await self.make_request("POST", "/api/conversations", {
                    "context": {"current_plot": "33333333-3333-3333-3333-333333333333"}
                })
                if result['success']:
                    conversation_id = result['data']['id']
                    print(f"  Created conversation: {conversation_id}")
                    
                    # Add a message to the conversation
                    print("  Adding message to conversation...")
                    result = await self.make_request("POST", f"/api/conversations/{conversation_id}/messages", {
                        "content": "Tôi nên làm gì khi lúa bị vàng lá?",
                        "plot_id": "33333333-3333-3333-3333-333333333333"
                    })
                    if result['success']:
                        print(f"  Message sent successfully")
                        print(f"  Assistant response: {result['data'].get('assistantMessage', {}).get('content', 'N/A')[:50]}...")
                    else:
                        print(f"  Error sending message: {result['data']}")
        else:
            print(f"  Error: {result['data']}")
        
        # Test suggestions endpoint
        result = await self.make_request("GET", "/api/assistant/suggestions")
        print(f"Get Suggestions: {'✓' if result['success'] else '✗'} - {result['status']}")
        
        if result['success']:
            suggestions = result['data'].get('suggestions', [])
            print(f"  Found {len(suggestions)} suggested questions")
    
    async def test_users_api(self):
        """Test users API"""
        print("\n=== Testing Users API ===")
        
        result = await self.make_request("GET", "/api/users")
        print(f"Get User Info: {'✓' if result['success'] else '✗'} - {result['status']}")
        
        if result['success']:
            users = result['data']
            if users:
                user = users[0]
                print(f"  User: {user.get('name')} ({user.get('phone')})")
                print(f"  Language: {user.get('language', 'N/A')}")
        else:
            print(f"  Error: {result['data']}")
    
    async def run_all_tests(self):
        """Run all API tests"""
        print("Starting AIRRVie API Tests...")
        print(f"Base URL: {BASE_URL}")
        print(f"Test Phone: {TEST_PHONE}")
        
        # Test health endpoints (no auth required)
        await self.test_health_endpoints()
        
        # Test authentication flow
        auth_success = await self.test_auth_flow()
        
        if not auth_success:
            print("\n❌ Authentication failed. Cannot proceed with authenticated tests.")
            return False
        
        # Test all authenticated endpoints
        await self.test_weather_api()
        await self.test_farms_api()
        await self.test_tasks_api()
        await self.test_journal_api()
        await self.test_assistant_api()
        await self.test_users_api()
        
        print("\n✅ All API tests completed!")
        return True

async def main():
    """Main test runner"""
    async with APITester() as tester:
        success = await tester.run_all_tests()
        return 0 if success else 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
