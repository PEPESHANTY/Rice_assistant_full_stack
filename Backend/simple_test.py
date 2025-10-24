import requests

# Test login with demo credentials
login_url = 'http://localhost:8000/api/auth/login'
login_data = {
    'phone': '+84123456789',
    'password': 'demo123'
}

print('Testing login...')
try:
    response = requests.post(login_url, json=login_data, timeout=10)
    print(f'Status: {response.status_code}')
    print(f'Response: {response.text}')
except Exception as e:
    print(f'Error: {e}')
