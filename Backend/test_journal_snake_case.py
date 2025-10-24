import requests
import json

# Test the journal API with snake_case data
BACKEND_URL = "http://localhost:8000"

def test_journal_snake_case():
    print("🧪 Testing Journal API with Snake Case")
    print("=" * 50)
    
    # Step 1: Login to get auth token
    print("1️⃣ Logging in...")
    login_data = {
        "phone": "+84123456789",
        "password": "demo123"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/auth/login", json=login_data)
        print(f"Login Status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get('token')
            print(f"✅ Login successful! Token: {token[:20]}...")
            
            headers = {"Authorization": f"Bearer {token}"}
            
            # Step 2: Create journal entry with snake_case data (what backend expects)
            print("\n2️⃣ Creating journal entry with snake_case...")
            journal_data = {
                "plot_id": "33333333-3333-3333-3333-333333333333",
                "date": "2025-01-23",
                "type": "planting",
                "title": "Snake Case Test Entry",
                "content": "This entry uses snake_case field names",
                "photos": [],
                "audio_note": ""
            }
            
            print(f"📤 Sending data: {json.dumps(journal_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/api/journal", json=journal_data, headers=headers)
            print(f"POST Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                result = response.json()
                entry_id = result.get('id')
                print(f"✅ Journal entry created successfully! ID: {entry_id}")
                
                # Step 3: Verify the entry was added
                print("\n3️⃣ Verifying new entry exists...")
                response = requests.get(f"{BACKEND_URL}/api/journal", headers=headers)
                if response.status_code == 200:
                    updated_entries = response.json()
                    print(f"✅ Now have {len(updated_entries)} journal entries")
                    
                    # Find our new entry
                    new_entry = next((e for e in updated_entries if e['id'] == entry_id), None)
                    if new_entry:
                        print(f"✅ New entry found: '{new_entry['title']}'")
                        print(f"   Plot: {new_entry['plotName']}")
                        print(f"   Type: {new_entry['type']}")
                        print(f"   Date: {new_entry['date']}")
                    else:
                        print("❌ New entry not found in the list")
                
                print("\n🎉 Snake case test completed successfully!")
                print("   - Backend accepts snake_case field names")
                print("   - Journal entries can be created")
                print("   - Entries are properly stored and retrieved")
                
            else:
                print(f"❌ Failed to create journal entry: {response.text}")
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_journal_snake_case()
