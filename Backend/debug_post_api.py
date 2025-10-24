import requests
import json

# Test configuration
BASE_URL = "http://localhost:8000"

def debug_journal_post():
    """Debug the journal POST API"""
    print("🔍 Debugging Journal POST API...")
    
    # Test data for a simple journal entry
    journal_data = {
        "plotId": "33333333-3333-3333-3333-333333333333",  # Demo plot ID
        "date": "2025-01-23",
        "type": "planting",
        "title": "Debug Journal Entry",
        "content": "This is a debug journal entry",
        "photos": [],
        "audioNote": ""
    }
    
    print(f"📝 Sending POST request to: {BASE_URL}/api/journal")
    print(f"📝 Request data: {json.dumps(journal_data, indent=2)}")
    
    try:
        response = requests.post(f"{BASE_URL}/api/journal", json=journal_data)
        print(f"📝 Response Status: {response.status_code}")
        print(f"📝 Response Headers: {dict(response.headers)}")
        print(f"📝 Response Text: {response.text}")
        
        if response.status_code == 200:
            print("✅ POST API is working!")
            return True
        else:
            print(f"❌ POST API failed with status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ POST API error: {e}")
        return False

def test_direct_sql():
    """Test if we can connect to database and insert data"""
    print("\n🔍 Testing Database Connection...")
    try:
        import asyncpg
        import os
        from dotenv import load_dotenv
        import asyncio
        
        load_dotenv()
        
        async def test_db():
            conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
            print("✅ Database connection successful")
            
            # Test inserting a journal entry
            demo_user_id = '11111111-1111-1111-1111-111111111111'
            plot_id = '33333333-3333-3333-3333-333333333333'
            
            result = await conn.fetchval('''
                INSERT INTO core.journal_entry (plot_id, user_id, entry_date, type, title, content, photos, audio_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            ''', plot_id, demo_user_id, '2025-01-23', 'planting', 'Direct SQL Test', 'Testing direct SQL', '[]', '')
            
            print(f"✅ Direct SQL insert successful, entry ID: {result}")
            await conn.close()
            return True
        
        return asyncio.run(test_db())
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def check_api_routes():
    """Check what API routes are available"""
    print("\n🔍 Checking API Routes...")
    try:
        response = requests.get(f"{BASE_URL}/api/status")
        if response.status_code == 200:
            data = response.json()
            print("✅ API Status endpoint working")
            print(f"📊 Available endpoints: {json.dumps(data['endpoints'], indent=2)}")
            return True
        else:
            print(f"❌ API Status failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API Status error: {e}")
        return False

def main():
    print("🔍 Debugging Journal POST API Issues")
    print("=" * 50)
    
    # Check API routes
    if not check_api_routes():
        print("❌ Cannot proceed - API not accessible")
        return
    
    # Debug POST API
    if not debug_journal_post():
        print("\n❌ POST API is not working properly")
        print("🔍 Let me check the backend logs for more details...")
        
        # Check if there might be a route conflict
        print("\n🔍 Checking for route conflicts...")
        print("The no-auth journal API should be available at: /api/journal")
        print("If there's a conflict, the auth version might be taking precedence")
        
    else:
        print("\n✅ POST API is working correctly!")

if __name__ == "__main__":
    main()
