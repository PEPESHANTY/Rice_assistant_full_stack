import requests
import json

def test_farm_creation():
    url = 'http://localhost:8000/api/farms'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo_token_123'
    }
    data = {
        'name': 'Test Farm',
        'province': 'An Giang', 
        'district': 'Chau Thanh'
    }

    print("Testing farm creation API...")
    print(f"URL: {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f'Status Code: {response.status_code}')
        print(f'Response: {response.text}')
        
        if response.status_code == 200:
            print("✅ Farm creation successful!")
        else:
            print("❌ Farm creation failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_farm_creation()
