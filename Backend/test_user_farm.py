import requests
import json

def test_login_and_farm():
    # First login to get a valid token
    login_url = 'http://localhost:8000/api/auth/login'
    login_data = {
        'phone': '09970058788',
        'password': 'shanty'
    }

    print('Logging in...')
    login_response = requests.post(login_url, json=login_data)
    print(f'Login Status: {login_response.status_code}')
    print(f'Login Response: {login_response.text}')

    if login_response.status_code == 200:
        token = login_response.json().get('token')
        print(f'Token: {token}')
        
        # Now test farm creation with real token
        farm_url = 'http://localhost:8000/api/farms'
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
        farm_data = {
            'name': 'English Test Farm',
            'province': 'An Giang', 
            'district': 'Chau Thanh'
        }
        
        print('\nTesting farm creation...')
        farm_response = requests.post(farm_url, headers=headers, json=farm_data)
        print(f'Farm Status: {farm_response.status_code}')
        print(f'Farm Response: {farm_response.text}')
        
        if farm_response.status_code == 200:
            print('✅ Farm creation successful!')
        else:
            print('❌ Farm creation failed!')
    else:
        print('Login failed!')

if __name__ == "__main__":
    test_login_and_farm()
