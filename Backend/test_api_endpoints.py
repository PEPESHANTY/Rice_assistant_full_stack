#!/usr/bin/env python3
"""
Test script to verify all API endpoints are working
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_root():
    """Test root endpoint"""
    print("Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_auth_register():
    """Test user registration"""
    print("\nTesting user registration...")
    try:
        data = {
            "name": "Test User",
            "phone": "+84123456780",
            "password": "test123",
            "language": "vi"
        }
        response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Success: {result.get('message')}")
            print(f"User ID: {result.get('user', {}).get('id')}")
            return result.get('token')
        else:
            print(f"Error: {response.text}")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_auth_login():
    """Test user login"""
    print("\nTesting user login...")
    try:
        data = {
            "phone": "+84123456780",
            "password": "test123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Success: {result.get('message')}")
            return result.get('token')
        else:
            print(f"Error: {response.text}")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_protected_endpoints(token):
    """Test endpoints that require authentication"""
    if not token:
        print("No token available, skipping protected endpoints")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test farms endpoint
    print("\nTesting farms endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/farms", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            farms = response.json()
            print(f"Found {len(farms)} farms")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test tasks endpoint
    print("\nTesting tasks endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            tasks = response.json()
            print(f"Found {len(tasks)} tasks")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test journal endpoint
    print("\nTesting journal endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/journal", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            entries = response.json()
            print(f"Found {len(entries)} journal entries")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test weather endpoint
    print("\nTesting weather endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/weather", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            weather = response.json()
            print(f"Weather data: {weather.get('location')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_assistant_endpoint():
    """Test assistant endpoint"""
    print("\nTesting assistant endpoint...")
    try:
        data = {
            "message": "Hello, how are you?",
            "conversation_id": None
        }
        response = requests.post(f"{BASE_URL}/api/assistant/chat", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Assistant response: {result.get('response')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def main():
    print("=== AIRRVie API Endpoint Tests ===")
    
    # Test root endpoint
    if not test_root():
        print("Root endpoint test failed!")
        sys.exit(1)
    
    # Test authentication
    token = test_auth_register()
    if not token:
        token = test_auth_login()
    
    # Test protected endpoints
    test_protected_endpoints(token)
    
    # Test assistant endpoint
    test_assistant_endpoint()
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    main()
