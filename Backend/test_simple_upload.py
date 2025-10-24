import requests
import json

# Test configuration
BASE_URL = "http://localhost:8000"

def test_journal_api():
    """Test the journal API with a simple text entry"""
    print("🧪 Testing Journal API...")
    
    # Test data for a simple journal entry
    journal_data = {
        "plotId": "33333333-3333-3333-3333-333333333333",  # Demo plot ID
        "date": "2025-01-23",
        "type": "planting",
        "title": "Test Journal Entry",
        "content": "This is a test journal entry without media",
        "photos": [],
        "audioNote": ""
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/journal", json=journal_data)
        print(f"📝 Journal POST Response: {response.status_code}")
        print(f"📝 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Journal entry created successfully!")
            return True
        else:
            print(f"❌ Journal entry failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Journal API error: {e}")
        return False

def test_uploads_without_auth():
    """Test upload endpoints without authentication"""
    print("\n🧪 Testing Upload API without auth...")
    
    # Create a simple test file
    test_content = b"test file content"
    
    try:
        # Test image upload
        files = {'file': ('test.txt', test_content, 'text/plain')}
        response = requests.post(f"{BASE_URL}/api/uploads/images", files=files)
        print(f"🖼️ Image Upload Response: {response.status_code}")
        print(f"🖼️ Response: {response.text}")
        
        # Test audio upload
        files = {'file': ('test.txt', test_content, 'text/plain')}
        response = requests.post(f"{BASE_URL}/api/uploads/audio", files=files)
        print(f"🎵 Audio Upload Response: {response.status_code}")
        print(f"🎵 Response: {response.text}")
        
    except Exception as e:
        print(f"❌ Upload API error: {e}")

def test_api_status():
    """Test API status endpoint"""
    print("\n🧪 Testing API Status...")
    try:
        response = requests.get(f"{BASE_URL}/api/status")
        print(f"📊 API Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"📊 API Data: {json.dumps(data, indent=2)}")
            return True
        return False
    except Exception as e:
        print(f"❌ API Status error: {e}")
        return False

def main():
    print("🧪 Simple API Tests")
    print("=" * 50)
    
    # Test API status first
    if not test_api_status():
        print("❌ API is not responding properly")
        return
    
    # Test journal API
    if test_journal_api():
        print("✅ Journal API is working!")
    else:
        print("❌ Journal API needs fixing")
    
    # Test uploads
    test_uploads_without_auth()
    
    print("=" * 50)
    print("🎉 Test completed!")

if __name__ == "__main__":
    main()
