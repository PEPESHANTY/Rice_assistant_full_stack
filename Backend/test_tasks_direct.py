import requests
import json

# Test the tasks API directly
BASE_URL = "http://localhost:8000"

def test_tasks_api():
    print("Testing tasks API directly...")
    
    try:
        # First test without auth
        print("\n1. Testing tasks endpoint without auth:")
        response = requests.get(f"{BASE_URL}/api/tasks")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Test with demo login
        print("\n2. Testing login:")
        login_data = {
            "phone": "+84123456789",
            "password": "demo123"
        }
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login status: {login_response.status_code}")
        if login_response.status_code == 200:
            login_data = login_response.json()
            print(f"Login response: {json.dumps(login_data, indent=2)}")
            
            # Test tasks with auth token
            if 'token' in login_data:
                token = login_data['token']
                headers = {'Authorization': f'Bearer {token}'}
                
                print("\n3. Testing tasks endpoint with auth:")
                tasks_response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
                print(f"Tasks status: {tasks_response.status_code}")
                if tasks_response.status_code == 200:
                    tasks_data = tasks_response.json()
                    print(f"Tasks data: {json.dumps(tasks_data, indent=2)}")
                else:
                    print(f"Tasks error: {tasks_response.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_tasks_api()
