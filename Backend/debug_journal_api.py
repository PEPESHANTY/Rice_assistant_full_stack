import requests
import json

# Test the journal API directly
BACKEND_URL = "http://localhost:8000"

def test_journal_api():
    print("🧪 Testing Journal API Directly")
    print("=" * 50)
    
    # Test data
    journal_data = {
        "plotId": "33333333-3333-3333-3333-333333333333",
        "date": "2025-01-23",
        "type": "planting",
        "title": "Debug Test Entry",
        "content": "This is a test entry to debug the API",
        "photos": [],
        "audioNote": ""
    }
    
    print("1️⃣ Testing POST to /api/journal-no-auth...")
    try:
        response = requests.post(f"{BACKEND_URL}/api/journal-no-auth", json=journal_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ POST successful!")
            result = response.json()
            print(f"Entry ID: {result.get('id', 'N/A')}")
        else:
            print(f"❌ POST failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ POST request failed: {e}")
    
    print("\n2️⃣ Testing GET from /api/journal-no-auth...")
    try:
        response = requests.get(f"{BACKEND_URL}/api/journal-no-auth")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            entries = response.json()
            print(f"✅ GET successful - Found {len(entries)} entries")
            for entry in entries[:3]:  # Show first 3 entries
                print(f"  - {entry['title']} ({entry['date']})")
        else:
            print(f"❌ GET failed with status {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ GET request failed: {e}")

if __name__ == "__main__":
    test_journal_api()
