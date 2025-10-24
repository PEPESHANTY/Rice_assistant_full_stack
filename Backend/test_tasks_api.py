import requests
import json

# Test tasks API
BASE_URL = "http://localhost:8000"

def test_tasks_api():
    print("Testing tasks API...")
    
    # First login to get token
    login_data = {
        "phone": "+84123456789",
        "password": "demo123"
    }
    
    try:
        # Login
        print("Logging in...")
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            token = login_response.json().get("token")
            print(f"Token received: {token[:20]}...")
            
            # Get farms to get plot IDs
            headers = {"Authorization": f"Bearer {token}"}
            farms_response = requests.get(f"{BASE_URL}/api/farms", headers=headers)
            print(f"Farms Status: {farms_response.status_code}")
            
            if farms_response.status_code == 200:
                farms = farms_response.json()
                print(f"Farms: {farms}")
                
                # Get plots
                plots_response = requests.get(f"{BASE_URL}/api/plots", headers=headers)
                print(f"Plots Status: {plots_response.status_code}")
                
                if plots_response.status_code == 200:
                    plots = plots_response.json()
                    print(f"Plots: {plots}")
                    
                    if plots:
                        plot_id = plots[0]["id"]
                        
                        # Test creating a task
                        task_data = {
                            "plot_id": plot_id,
                            "title": "Test Task",
                            "description": "This is a test task",
                            "due_date": "2025-10-25",
                            "type": "fertilizer",
                            "priority": "medium",
                            "reminder": False
                        }
                        
                        print(f"Creating task with data: {json.dumps(task_data, indent=2)}")
                        task_response = requests.post(f"{BASE_URL}/api/tasks", json=task_data, headers=headers)
                        print(f"Task Creation Status: {task_response.status_code}")
                        print(f"Task Response: {task_response.text}")
                        
                        if task_response.status_code != 200:
                            print(f"Error creating task: {task_response.text}")
                    else:
                        print("No plots available")
                else:
                    print(f"Error getting plots: {plots_response.text}")
            else:
                print(f"Error getting farms: {farms_response.text}")
        else:
            print(f"Login failed: {login_response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_tasks_api()
