import requests

# Simple test to check if backend is responding
BASE_URL = "http://localhost:8000"

def test_backend():
    print("Testing backend API...")
    
    try:
        # Test health endpoint
        response = requests.get(f"{BASE_URL}/")
        print(f"Health check status: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Test tasks endpoint without auth
        response = requests.get(f"{BASE_URL}/api/tasks")
        print(f"Tasks endpoint status: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_backend()
