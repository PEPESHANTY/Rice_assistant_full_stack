#!/usr/bin/env python3
"""
Comprehensive API test script
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_root():
    print("Testing Root Endpoint...")
    print("=" * 40)
    try:
        r = requests.get(f"{BASE_URL}/")
        print(f'Status: {r.status_code}')
        print(f'Response: {r.text}')
        return r.status_code == 200
    except Exception as e:
        print(f'Exception: {e}')
        return False

def test_login():
    print("\nTesting Login Endpoint...")
    print("=" * 40)
    
    login_data = {'phone': '+84123456789', 'password': 'demo123'}
    
    try:
        r = requests.post(f'{BASE_URL}/api/auth/login', json=login_data, timeout=10)
        print(f'Login Status: {r.status_code}')
        
        if r.status_code == 200:
            data = r.json()
            token = data.get('token', 'No token')
            print(f'Token: {token[:30]}...' if token else 'No token')
            print(f'Message: {data.get("message", "No message")}')
            return token
        else:
            print(f'Error: {r.text}')
            return None
            
    except Exception as e:
        print(f'Exception: {e}')
        return None

def test_protected_endpoints(token):
    if not token:
        print("No token available, skipping protected endpoints")
        return
    
    headers = {'Authorization': f'Bearer {token}'}
    
    print("\nTesting Protected Endpoints...")
    print("=" * 40)
    
    # Test farms endpoint
    print("\n1. Testing /api/farms...")
    try:
        r = requests.get(f'{BASE_URL}/api/farms', headers=headers, timeout=10)
        print(f'Status: {r.status_code}')
        if r.status_code == 200:
            farms = r.json()
            print(f'Found {len(farms)} farms')
            for farm in farms:
                print(f"  - {farm.get('name')} ({farm.get('plotCount', 0)} plots)")
    except Exception as e:
        print(f'Exception: {e}')
    
    # Test tasks endpoint
    print("\n2. Testing /api/tasks...")
    try:
        r = requests.get(f'{BASE_URL}/api/tasks', headers=headers, timeout=10)
        print(f'Status: {r.status_code}')
        if r.status_code == 200:
            tasks = r.json()
            print(f'Found {len(tasks)} tasks')
            for task in tasks[:3]:  # Show first 3
                print(f"  - {task.get('title')} (Due: {task.get('dueDate')})")
    except Exception as e:
        print(f'Exception: {e}')
    
    # Test journal endpoint
    print("\n3. Testing /api/journal...")
    try:
        r = requests.get(f'{BASE_URL}/api/journal', headers=headers, timeout=10)
        print(f'Status: {r.status_code}')
        if r.status_code == 200:
            entries = r.json()
            print(f'Found {len(entries)} journal entries')
            for entry in entries[:2]:  # Show first 2
                print(f"  - {entry.get('title')} ({entry.get('date')})")
    except Exception as e:
        print(f'Exception: {e}')
    
    # Test weather endpoint
    print("\n4. Testing /api/weather...")
    try:
        r = requests.get(f'{BASE_URL}/api/weather', headers=headers, timeout=10)
        print(f'Status: {r.status_code}')
        if r.status_code == 200:
            weather = r.json()
            print(f'Location: {weather.get("location")}')
            current = weather.get('current', {})
            print(f'Current: {current.get("temperature")}°C, {current.get("condition")}')
    except Exception as e:
        print(f'Exception: {e}')
    
    # Test users endpoint
    print("\n5. Testing /api/users...")
    try:
        r = requests.get(f'{BASE_URL}/api/users', headers=headers, timeout=10)
        print(f'Status: {r.status_code}')
        if r.status_code == 200:
            users = r.json()
            print(f'Found {len(users)} users')
            for user in users:
                print(f"  - {user.get('name')} ({user.get('email')})")
    except Exception as e:
        print(f'Exception: {e}')

def main():
    print("AIRRVie API Comprehensive Test")
    print("=" * 50)
    
    # Test root endpoint
    if not test_root():
        print("Root endpoint failed. Is the server running?")
        return
    
    # Test login
    token = test_login()
    
    # Test protected endpoints
    test_protected_endpoints(token)
    
    print("\n" + "=" * 50)
    print("API Testing Complete!")

if __name__ == "__main__":
    main()
