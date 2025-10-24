import requests
import json
import os
from pathlib import Path

# Test configuration
BASE_URL = "http://localhost:8000"
TEST_IMAGE_PATH = "test_image.jpg"
TEST_AUDIO_PATH = "test_audio.wav"

def create_test_files():
    """Create dummy test files for upload testing"""
    # Create a dummy image file (1x1 pixel JPEG)
    dummy_image = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $. \' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x10\x00\x02\x01\x03\x03\x02\x04\x03\x05\x05\x04\x04\x00\x00\x01}\x01\x02\x03\x00\x04\x11\x05\x12!1A\x06\x13Qa\x07"q\x142\x81\x91\xa1\x08#B\xb1\xc1\x15R\xd1\xf0$3br\x82\t\n\x16\x17\x18\x19\x1a%&\'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xab\x00\x00\x00\x00'
    with open(TEST_IMAGE_PATH, 'wb') as f:
        f.write(dummy_image)
    
    # Create a dummy audio file (empty WAV header)
    dummy_audio = b'RIFF\x24\x08\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x02\x00\x22\x56\x00\x00\x88\x58\x01\x00\x04\x00\x10\x00data\x00\x08\x00\x00'
    with open(TEST_AUDIO_PATH, 'wb') as f:
        f.write(dummy_audio)
    
    print("✅ Test files created")

def cleanup_test_files():
    """Remove test files"""
    if os.path.exists(TEST_IMAGE_PATH):
        os.remove(TEST_IMAGE_PATH)
    if os.path.exists(TEST_AUDIO_PATH):
        os.remove(TEST_AUDIO_PATH)
    print("✅ Test files cleaned up")

def test_api_status():
    """Test API status endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/status")
        if response.status_code == 200:
            data = response.json()
            print("✅ API Status:", data)
            return True
        else:
            print(f"❌ API Status failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API Status error: {e}")
        return False

def test_journal_endpoints():
    """Test journal API endpoints"""
    try:
        # Test GET journal entries
        response = requests.get(f"{BASE_URL}/api/journal")
        if response.status_code == 200:
            print("✅ GET /api/journal: Success")
            entries = response.json()
            print(f"   Found {len(entries)} journal entries")
        else:
            print(f"❌ GET /api/journal failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        # Test journal stats
        response = requests.get(f"{BASE_URL}/api/journal/stats")
        if response.status_code == 200:
            print("✅ GET /api/journal/stats: Success")
            stats = response.json()
            print(f"   Stats: {stats}")
        else:
            print(f"❌ GET /api/journal/stats failed: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"❌ Journal endpoints error: {e}")
        return False

def test_upload_endpoints():
    """Test upload API endpoints"""
    try:
        # Test image upload
        with open(TEST_IMAGE_PATH, 'rb') as f:
            files = {'file': ('test_image.jpg', f, 'image/jpeg')}
            response = requests.post(f"{BASE_URL}/api/uploads/images", files=files)
            
            if response.status_code == 200:
                image_result = response.json()
                print("✅ Image upload: Success")
                print(f"   Uploaded: {image_result['filename']}")
                print(f"   URL: {image_result['url']}")
            else:
                print(f"❌ Image upload failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
        
        # Test audio upload
        with open(TEST_AUDIO_PATH, 'rb') as f:
            files = {'file': ('test_audio.wav', f, 'audio/wav')}
            response = requests.post(f"{BASE_URL}/api/uploads/audio", files=files)
            
            if response.status_code == 200:
                audio_result = response.json()
                print("✅ Audio upload: Success")
                print(f"   Uploaded: {audio_result['filename']}")
                print(f"   URL: {audio_result['url']}")
                return True
            else:
                print(f"❌ Audio upload failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
        
    except Exception as e:
        print(f"❌ Upload endpoints error: {e}")
        return False

def test_journal_entry_with_media():
    """Test creating a journal entry with media"""
    try:
        # First upload an image
        with open(TEST_IMAGE_PATH, 'rb') as f:
            files = {'file': ('test_image.jpg', f, 'image/jpeg')}
            response = requests.post(f"{BASE_URL}/api/uploads/images", files=files)
            image_data = response.json()
        
        # Create journal entry with the uploaded image
        journal_data = {
            "plotId": "33333333-3333-3333-3333-333333333333",  # Demo plot ID
            "date": "2025-01-23",
            "type": "planting",
            "title": "Test Journal Entry with Media",
            "content": "This is a test journal entry with uploaded media files",
            "photos": [image_data['url']],
            "audioNote": ""
        }
        
        response = requests.post(f"{BASE_URL}/api/journal", json=journal_data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Journal entry with media: Success")
            print(f"   Created entry ID: {result['id']}")
            return True
        else:
            print(f"❌ Journal entry creation failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Journal entry with media error: {e}")
        return False

def main():
    print("🧪 Testing Journal and Uploads API...")
    print("=" * 50)
    
    # Create test files
    create_test_files()
    
    try:
        # Test API status
        if not test_api_status():
            print("❌ API status test failed")
            return
        
        # Test journal endpoints
        if not test_journal_endpoints():
            print("❌ Journal endpoints test failed")
            return
        
        # Test upload endpoints
        if not test_upload_endpoints():
            print("❌ Upload endpoints test failed")
            return
        
        # Test journal entry with media
        if not test_journal_entry_with_media():
            print("❌ Journal entry with media test failed")
            return
        
        print("=" * 50)
        print("🎉 All tests completed successfully!")
        print("✅ Journal section with image and audio uploads is working!")
        
    except Exception as e:
        print(f"❌ Test suite failed: {e}")
    
    finally:
        # Cleanup
        cleanup_test_files()

if __name__ == "__main__":
    main()
