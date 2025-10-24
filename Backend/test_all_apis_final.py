#!/usr/bin/env python3
"""
Comprehensive API Test Script
Tests all API endpoints systematically
"""

import requests
import json
import time
import sys

BASE_URL = "http://localhost:8000"

def print_section(title):
    print(f"\n{'='*50}")
    print(f" {title}")
    print(f"{'='*50}")

def test_server():
    """Test if server is running"""
    print_section("SERVER STATUS")
    try:
        r = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"✓ Server is running (Status: {r.status_code})")
        return True
    except Exception as e:
        print(f"✗ Server is not running: {e}")
        return False

def test_login():
    """Test login endpoint"""
    print_section("LOGIN TEST")
    login_data = {'phone': '+84123456789', 'password': 'demo123'}
    
    try:
        r = requests.post(f"{BASE_URL}/api/auth/login", json=login_data, timeout=10)
        print(f"Login Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            token = data.get('token')
            if token:
                print(f"✓ Login successful")
                print(f"  Token: {token[:30]}...")
                print(f"  Message: {data.get('message', 'No message')}")
                return token
            else:
                print(f"✗ Login failed - No token received")
                return None
        else:
            print(f"✗ Login failed: {r.text}")
            return None
            
    except Exception as e:
        print(f"✗ Login exception: {e}")
        return None

def test_register():
    """Test register endpoint"""
    print_section("REGISTER TEST")
    register_data = {
        'name': 'Test User',
        'phone': '+84987654321',
        'password': 'test123',
        'language': 'vi'
    }
    
    try:
        r = requests.post(f"{BASE_URL}/api/auth/register", json=register_data, timeout=10)
        print(f"Register Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"✓ Register successful")
            print(f"  Message: {data.get('message', 'No message')}")
            return True
        else:
            print(f"✗ Register failed: {r.text}")
            return False
            
    except Exception as e:
        print(f"✗ Register exception: {e}")
        return False

def test_get_current_user(token):
    """Test get current user endpoint"""
    print_section("GET CURRENT USER")
    if not token:
        print("✗ No token provided")
        return False
    
    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=headers, timeout=10)
        print(f"Get User Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"✓ Get user successful")
            print(f"  User: {data.get('name', 'No name')} ({data.get('email', 'No email')})")
            return True
        else:
            print(f"✗ Get user failed: {r.text}")
            return False
            
    except Exception as e:
        print(f"✗ Get user exception: {e}")
        return False

def test_farms_endpoints(token):
    """Test farms endpoints"""
    print_section("FARMS ENDPOINTS")
    if not token:
        print("✗ No token provided")
        return False
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # Get farms
    try:
        r = requests.get(f"{BASE_URL}/api/farms", headers=headers, timeout=10)
        print(f"Get Farms Status: {r.status_code}")
        
        if r.status_code == 200:
            farms = r.json()
            print(f"✓ Get farms successful - {len(farms)} farms found")
            for farm in farms:
                print(f"  - {farm.get('name', 'No name')} ({farm.get('plotCount', 0)} plots)")
            return farms
        else:
            print(f"✗ Get farms failed: {r.text}")
            return []
            
    except Exception as e:
        print(f"✗ Get farms exception: {e}")
        return []

def test_plots_endpoints(token):
    """Test plots endpoints"""
    print_section("PLOTS ENDPOINTS")
    if not token:
        print("✗ No token provided")
        return False
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # Get plots
    try:
        r = requests.get(f"{BASE_URL}/api/plots", headers=headers, timeout=10)
        print(f"Get Plots Status: {r.status_code}")
        
        if r.status_code == 200:
            plots = r.json()
            print(f"✓ Get plots successful - {len(plots)} plots found")
            for plot in plots:
                print(f"  - {plot.get('name', 'No name')} ({plot.get('area', 0)} m²)")
            return plots
        else:
            print(f"✗ Get plots failed: {r.text}")
            return []
            
    except Exception as e:
        print(f"✗ Get plots exception: {e}")
        return []

def test_tasks_endpoints(token):
    """Test tasks endpoints"""
    print_section("TASKS ENDPOINTS")
    if not token:
        print("✗ No token provided")
        return False
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # Get tasks
    try:
        r = requests.get(f"{BASE_URL}/api/tasks", headers=headers, timeout=10)
        print(f"Get Tasks Status: {r.status_code}")
        
        if r.status_code == 200:
            tasks = r.json()
            print(f"✓ Get tasks successful - {len(tasks)} tasks found")
            for task in tasks:
                print(f"  - {task.get('title', 'No title')} (Due: {task.get('dueDate', 'No date')})")
            return tasks
        else:
            print(f"✗ Get tasks failed: {r.text}")
            return []
            
    except Exception as e:
        print(f"✗ Get tasks exception: {e}")
        return []

def test_journal_endpoints(token):
    """Test journal endpoints"""
    print_section("JOURNAL ENDPOINTS")
    if not token:
        print("✗ No token provided")
        return False
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # Get journal entries
    try:
        r = requests.get(f"{BASE_URL}/api/journal", headers=headers, timeout=10)
        print(f"Get Journal Status: {r.status_code}")
        
        if r.status_code == 200:
            entries = r.json()
            print(f"✓ Get journal successful - {len(entries)} entries found")
            for entry in entries:
                print(f"  - {entry.get('title', 'No title')} ({entry.get('date', 'No date')})")
            return entries
        else:
            print(f"✗ Get journal failed: {r.text}")
            return []
            
    except Exception as e:
        print(f"✗ Get journal exception: {e}")
        return []

def test_weather_endpoint():
    """Test weather endpoint"""
    print_section("WEATHER ENDPOINT")
    
    try:
        r = requests.get(f"{BASE_URL}/api/weather", timeout=10)
        print(f"Weather Status: {r.status_code}")
        
        if r.status_code == 200:
            weather = r.json()
            print(f"✓ Weather successful")
            print(f"  Location: {weather.get('location', 'Unknown')}")
            current = weather.get('current', {})
            print(f"  Current: {current.get('temperature', 'N/A')}°C, {current.get('condition', 'Unknown')}")
            return True
        else:
            print(f"✗ Weather failed: {r.text}")
            return False
            
    except Exception as e:
        print(f"✗ Weather exception: {e}")
        return False

def test_users_endpoint(token):
    """Test users endpoint"""
    print_section("USERS ENDPOINT")
    if not token:
        print("✗ No token provided")
        return False
    
    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        r = requests.get(f"{BASE_URL}/api/users", headers=headers, timeout=10)
        print(f"Users Status: {r.status_code}")
        
        if r.status_code == 200:
            users = r.json()
            print(f"✓ Users successful - {len(users)} users found")
            for user in users:
                print(f"  - {user.get('name', 'No name')} ({user.get('email', 'No email')})")
            return True
        else:
            print(f"✗ Users failed: {r.text}")
            return False
            
    except Exception as e:
        print(f"✗ Users exception: {e}")
        return False

def test_assistant_endpoint(token):
    """Test assistant endpoint"""
    print_section("ASSISTANT ENDPOINT")
    if not token:
        print("✗ No token provided")
        return False
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # Test conversation
    message_data = {
        'message': 'Hello, I need help with my rice farm',
        'plot_id': '33333333-3333-3333-3333-333333333333'
    }
    
    try:
        r = requests.post(f"{BASE_URL}/api/assistant/chat", headers=headers, json=message_data, timeout=30)
        print(f"Assistant Status: {r.status_code}")
        
        if r.status_code == 200:
            response = r.json()
            print(f"✓ Assistant successful")
            print(f"  Response: {response.get('response', 'No response')[:100]}...")
            return True
        else:
            print(f"✗ Assistant failed: {r.text}")
            return False
            
    except Exception as e:
        print(f"✗ Assistant exception: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 AIRRVie API Comprehensive Test Suite")
    print("="*50)
    
    # Test server
    if not test_server():
        print("\n❌ Server is not running. Please start the server first.")
        print("   Run: cd Backend && venv\\Scripts\\activate && python main.py")
        return
    
    # Test authentication
    token = test_login()
    
    if token:
        # Test authenticated endpoints
        test_get_current_user(token)
        test_farms_endpoints(token)
        test_plots_endpoints(token)
        test_tasks_endpoints(token)
        test_journal_endpoints(token)
        test_users_endpoint(token)
        test_assistant_endpoint(token)
    
    # Test public endpoints
    test_weather_endpoint()
    
    print("\n" + "="*50)
    print("✅ API Testing Complete")
    print("="*50)

if __name__ == "__main__":
    main()
