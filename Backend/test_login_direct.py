#!/usr/bin/env python3
"""
Direct login test script
"""

import requests
import json

def test_login():
    """Test login with demo credentials"""
    print("Testing login with demo credentials...")
    
    url = "http://localhost:8000/api/auth/login"
    data = {
        "phone": "+84123456789",
        "password": "demo123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Login successful!")
            print(f"Token: {result.get('token', 'No token')}")
            print(f"User: {result.get('user', {})}")
        else:
            print(f"❌ Login failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login()
