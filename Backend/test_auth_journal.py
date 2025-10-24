import requests
import json

# Test the authenticated journal API
BACKEND_URL = "http://localhost:8000"

def test_auth_journal_api():
    print("🧪 Testing Authenticated Journal API")
    print("=" * 50)
    
    # First, login to get a token
    print("1️⃣ Logging in to get auth token...")
    try:
        login_data = {
            "phone": "+84123456789",
            "password": "demo123"
        }
        response = requests.post(f"{BACKEND_URL}/api/auth/login", json=login_data)
        print(f"Login Status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get('token')
            print(f"✅ Login successful! Token: {token[:20]}...")
            
            # Test journal API with auth token
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test data
            journal_data = {
                "plotId": "33333333-3333-3333-3333-333333333333",
                "date": "2025-01-23",
                "type": "planting",
                "title": "Authenticated Test Entry",
                "content": "This is a test entry using authenticated API",
                "photos": [],
                "audioNote": ""
            }
            
            print("\n2️⃣ Testing POST to /api/journal with auth...")
            response = requests.post(f"{BACKEND_URL}/api/journal", json=journal_data, headers=headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                print("✅ POST successful!")
                result = response.json()
                print(f"Entry ID: {result.get('id', 'N/A')}")
            else:
                print(f"❌ POST failed with status {response.status_code}")
                
            print("\n3️⃣ Testing GET from /api/journal with auth...")
            response = requests.get(f"{BACKEND_URL}/api/journal", headers=headers)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                entries = response.json()
                print(f"✅ GET successful - Found {len(entries)} entries")
                for entry in entries[:3]:  # Show first 3 entries
                    print(f"  - {entry['title']} ({entry['date']})")
            else:
                print(f"❌ GET failed with status {response.status_code}")
                print(f"Response: {response.text}")
                
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_auth_journal_api()
