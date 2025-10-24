import requests
import json

# Test tasks API
BASE_URL = 'http://localhost:8000'

# Login
login_data = {'phone': '+84123456789', 'password': 'demo123'}
login_response = requests.post(f'{BASE_URL}/api/auth/login', json=login_data)
print(f'Login Status: {login_response.status_code}')

if login_response.status_code == 200:
    token = login_response.json().get('token')
    headers = {'Authorization': f'Bearer {token}'}
    
    # Get plots
    plots_response = requests.get(f'{BASE_URL}/api/plots', headers=headers)
    print(f'Plots Status: {plots_response.status_code}')
    
    if plots_response.status_code == 200:
        plots = plots_response.json()
        if plots:
            plot_id = plots[0]['id']
            
            # Test creating a task with snake_case
            task_data = {
                'plot_id': plot_id,
                'title': 'Test Task',
                'description': 'This is a test task',
                'due_date': '2025-10-25',
                'type': 'fertilizer',
                'priority': 'medium',
                'reminder': False
            }
            
            print(f'Creating task with data: {json.dumps(task_data, indent=2)}')
            task_response = requests.post(f'{BASE_URL}/api/tasks', json=task_data, headers=headers)
            print(f'Task Creation Status: {task_response.status_code}')
            print(f'Task Response: {task_response.text}')
