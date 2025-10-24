#!/usr/bin/env python3
"""
Simple login test script
"""

import requests

def test_login():
    print("Testing Login Endpoint...")
    print("=" * 40)
    
    login_data = {'phone': '+84123456789', 'password': 'demo123'}
    
    try:
        r = requests.post('http://localhost:8000/api/auth/login', json=login_data)
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

if __name__ == "__main__":
    test_login()
