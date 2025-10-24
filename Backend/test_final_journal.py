import requests
import json
import os
from pathlib import Path

# Test configuration
BASE_URL = "http://localhost:8000"

def test_api_status():
    """Test API status endpoint"""
    print("🧪 Testing API Status...")
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

def test_journal_api():
    """Test the journal API with a simple text entry"""
    print("\n🧪 Testing Journal API...")
    
    # Test data for a simple journal entry
    journal_data = {
        "plotId": "33333333-3333-3333-3333-333333333333",  # Demo plot ID
        "date": "2025-01-23",
        "type": "planting",
        "title": "Test Journal Entry - Simple Text",
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

def test_no_auth_uploads():
    """Test upload endpoints without authentication"""
    print("\n🧪 Testing No-Auth Upload API...")
    
    # Create a simple test image file (1x1 pixel JPEG)
    dummy_image = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $. \' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x10\x00\x02\x01\x03\x03\x02\x04\x03\x05\x05\x04\x04\x00\x00\x01}\x01\x02\x03\x00\x04\x11\x05\x12!1A\x06\x13Qa\x07"q\x142\x81\x91\xa1\x08#B\xb1\xc1\x15R\xd1\xf0$3br\x82\t\n\x16\x17\x18\x19\x1a%&\'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xab\x00\x00\x00\x00'
    
    try:
        # Test image upload without auth
        files = {'file': ('test_image.jpg', dummy_image, 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/api/uploads/images/no-auth", files=files)
        print(f"🖼️ No-Auth Image Upload Response: {response.status_code}")
        if response.status_code == 200:
            image_result = response.json()
            print(f"✅ Image uploaded: {image_result['filename']}")
            print(f"   URL: {image_result['url']}")
            return image_result['url']
        else:
            print(f"❌ Image upload failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Upload API error: {e}")
        return None

def test_journal_with_media():
    """Test creating a journal entry with uploaded media"""
    print("\n🧪 Testing Journal with Media...")
    
    # First upload an image
    image_url = test_no_auth_uploads()
    if not image_url:
        print("❌ Cannot test journal with media - image upload failed")
        return False
    
    # Create journal entry with the uploaded image
    journal_data = {
        "plotId": "33333333-3333-3333-3333-333333333333",
        "date": "2025-01-23",
        "type": "planting",
        "title": "Test Journal Entry with Media",
        "content": "This is a test journal entry with uploaded media files",
        "photos": [image_url],
        "audioNote": ""
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/journal", json=journal_data)
        print(f"📝 Journal with Media POST Response: {response.status_code}")
        print(f"📝 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Journal entry with media created successfully!")
            return True
        else:
            print(f"❌ Journal entry with media failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Journal with media error: {e}")
        return False

def test_get_journal_entries():
    """Test retrieving journal entries"""
    print("\n🧪 Testing GET Journal Entries...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/journal")
        print(f"📖 GET Journal Response: {response.status_code}")
        
        if response.status_code == 200:
            entries = response.json()
            print(f"✅ Found {len(entries)} journal entries")
            if entries:
                print(f"📖 Latest entry: {entries[0]['title']}")
            return True
        else:
            print(f"❌ GET Journal failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ GET Journal error: {e}")
        return False

def main():
    print("🧪 FINAL Journal and Uploads Test")
    print("=" * 60)
    
    # Test API status first
    if not test_api_status():
        print("❌ API is not responding properly")
        return
    
    # Test journal API with simple text
    journal_success = test_journal_api()
    
    # Test uploads without auth
    upload_success = test_no_auth_uploads() is not None
    
    # Test journal with media
    media_success = test_journal_with_media()
    
    # Test retrieving entries
    get_success = test_get_journal_entries()
    
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY:")
    print(f"✅ Journal API (text): {'PASS' if journal_success else 'FAIL'}")
    print(f"✅ Upload API (no-auth): {'PASS' if upload_success else 'FAIL'}")
    print(f"✅ Journal with Media: {'PASS' if media_success else 'FAIL'}")
    print(f"✅ GET Journal Entries: {'PASS' if get_success else 'FAIL'}")
    
    if journal_success and upload_success and media_success and get_success:
        print("\n🎉 ALL TESTS PASSED! Journal section is working correctly!")
        print("✅ Image uploads are working")
        print("✅ Journal entries are being saved")
        print("✅ Media integration is functional")
    else:
        print("\n⚠️ Some tests failed. Check the logs above for details.")

if __name__ == "__main__":
    main()
