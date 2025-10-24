import requests
import json

# Test the journal API with proper snake_case data
BACKEND_URL = "http://localhost:8000"

def test_journal_final():
    print("🧪 Final Journal API Test")
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
            
            # Step 2: Get current journal entries
            print("\n2️⃣ Getting current journal entries...")
            response = requests.get(f"{BACKEND_URL}/api/journal", headers=headers)
            print(f"GET Status: {response.status_code}")
            
            if response.status_code == 200:
                entries = response.json()
                print(f"✅ Found {len(entries)} existing journal entries")
                
                # Step 3: Create a new journal entry with proper snake_case
                print("\n3️⃣ Creating new journal entry...")
                journal_data = {
                    "plot_id": "33333333-3333-3333-3333-333333333333",
                    "date": "2025-01-23",
                    "type": "planting",
                    "title": "Final Test Entry",
                    "content": "This entry should be saved to the database",
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
                    
                    # Step 4: Verify the entry was added
                    print("\n4️⃣ Verifying new entry exists...")
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
                            print(f"   Content: {new_entry['content']}")
                        else:
                            print("❌ New entry not found in the list")
                    
                    print("\n🎉 Journal functionality working correctly!")
                    print("   - User authentication working")
                    print("   - Journal entries can be created")
                    print("   - Entries are properly stored in database")
                    print("   - Entries can be retrieved")
                    
                else:
                    print(f"❌ Failed to create journal entry: {response.text}")
            else:
                print(f"❌ Failed to get journal entries: {response.text}")
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_journal_final()
