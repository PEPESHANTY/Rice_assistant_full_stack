#!/usr/bin/env python3
"""
Script to add complete demo data for all tables
"""

import asyncio
import asyncpg
import os
from datetime import date, datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

async def add_complete_demo_data():
    """Add complete demo data for all tables"""
    try:
        print("Adding complete demo data...")
        
        if not DATABASE_URL:
            print("ERROR: DATABASE_URL not set")
            return
        
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Get existing demo IDs
        demo_user_id = '11111111-1111-1111-1111-111111111111'
        demo_farm_id = '22222222-2222-2222-2222-222222222222'
        demo_plot_id = '33333333-3333-3333-3333-333333333333'
        
        # First, add the basic demo data (user, farm, plot, task)
        print("Adding basic demo data...")
        await conn.execute('''
            INSERT INTO core.user (id, phone, email, password_hash, display_name, locale, font_scale)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO NOTHING
        ''', demo_user_id, '+84123456789', 'demo@airrvie.app', 
            'demo123_hash_placeholder', 'Demo Farmer', 'vi', 'medium')
        
        await conn.execute('''
            INSERT INTO core.farm (id, user_id, name, province, district, address_text)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING
        ''', demo_farm_id, demo_user_id, 'Trang Trại Mẫu', 'An Giang', 'Châu Thành', 'Ấp Mỹ Hòa, Xã Mỹ Hòa Hưng')
        
        await conn.execute('''
            INSERT INTO core.plot (id, farm_id, name, area_m2, soil_type, variety, planting_date, harvest_date, irrigation_method, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id) DO NOTHING
        ''', demo_plot_id, demo_farm_id, 'Lô Lúa Chính', 5000.00, 'Phù sa', 'OM 5451', 
            date.today() - timedelta(days=30), date.today() + timedelta(days=90), 'Tưới ngập', 'Lô đất chính trồng giống lúa OM 5451')
        
        await conn.execute('''
            INSERT INTO core.task (id, plot_id, user_id, title, description, due_date, priority, status, type, source, reminder)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (id) DO NOTHING
        ''', '44444444-4444-4444-4444-444444444444', demo_plot_id, demo_user_id, 
            'Bón phân đợt 1', 'Bón phân NPK 20-20-15 với liều lượng 80kg/ha', 
            date.today() + timedelta(days=2), 'high', 'pending', 'fertilizer', 'calendar', True)
        
        # Now add journal entries
        print("Adding journal entries...")
        await conn.execute('''
            INSERT INTO core.journal_entry (
                id, plot_id, user_id, entry_date, type, title, content, photos
            ) VALUES 
            (
                '77777777-7777-7777-7777-777777777777',
                $1, $2, $3, 'planting', 'Gieo sạ giống lúa',
                'Đã gieo sạ giống OM 5451 với mật độ 120kg/ha. Thời tiết thuận lợi, đất đủ ẩm.',
                '["photo1.jpg", "photo2.jpg"]'::jsonb
            ),
            (
                '88888888-8888-8888-8888-888888888888',
                $1, $2, $4, 'irrigation', 'Tưới nước lần đầu',
                'Tưới ngập nước lần đầu tiên sau khi gieo sạ. Mực nước duy trì 3-5cm.',
                '["irrigation1.jpg"]'::jsonb
            )
            ON CONFLICT (id) DO NOTHING
        ''', demo_plot_id, demo_user_id, date.today() - timedelta(days=7), date.today() - timedelta(days=3))
        
        # Add weather data
        print("Adding weather data...")
        for i in range(7):
            weather_date = date.today() + timedelta(days=i)
            await conn.execute('''
                INSERT INTO core.weather_daily (
                    plot_id, for_date, max_temp, min_temp, precipitation_mm, wind_kph, payload
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                ) ON CONFLICT (plot_id, for_date) DO NOTHING
            ''', demo_plot_id, weather_date, 32.5 - i, 25.0 + i, 2.5 + i*0.5, 15.0 + i*2, 
                f'{{"condition": "partly_cloudy", "humidity": {60 + i}, "pressure": 1013}}')
        
        # Add conversation
        print("Adding conversation...")
        await conn.execute('''
            INSERT INTO core.conversation (
                id, user_id, started_at, context
            ) VALUES (
                '99999999-9999-9999-9999-999999999999',
                $1, $2, '{"current_plot": "33333333-3333-3333-3333-333333333333"}'
            ) ON CONFLICT (id) DO NOTHING
        ''', demo_user_id, datetime.now() - timedelta(hours=1))
        
        # Add messages
        print("Adding messages...")
        await conn.execute('''
            INSERT INTO core.message (
                id, conversation_id, role, content, metadata
            ) VALUES 
            (
                'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                '99999999-9999-9999-9999-999999999999',
                'user', 'Tôi nên làm gì khi lúa bị vàng lá?',
                '{"plot_id": "33333333-3333-3333-3333-333333333333"}'
            ),
            (
                'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
                '99999999-9999-9999-9999-999999999999',
                'assistant', 'Lúa bị vàng lá có thể do nhiều nguyên nhân: thiếu dinh dưỡng, ngập úng, hoặc sâu bệnh. Bạn nên kiểm tra mực nước và xem xét bón phân bổ sung. Nếu tình trạng nghiêm trọng, hãy chụp ảnh gửi cho tôi để phân tích kỹ hơn.',
                '{"suggested_actions": ["kiểm tra mực nước", "bón phân", "chụp ảnh"]}'
            )
            ON CONFLICT (id) DO NOTHING
        ''')
        
        # Add knowledge chunks
        print("Adding knowledge chunks...")
        await conn.execute('''
            INSERT INTO core.knowledge_chunk (
                id, source, title, content, lang, tags
            ) VALUES 
            (
                'cccccccc-cccc-cccc-cccc-cccccccccccc',
                'IRRI_Knowledge_Base', 'Kỹ thuật bón phân cho lúa',
                'Bón phân cho lúa cần chia làm 3 đợt chính: đợt 1 (7-10 ngày sau sạ), đợt 2 (18-22 ngày), đợt 3 (40-45 ngày). Sử dụng phân NPK cân đối và bón theo nhu cầu của từng giai đoạn sinh trưởng.',
                'vi', ARRAY['bón phân', 'dinh dưỡng', 'NPK', 'lúa']
            ),
            (
                'dddddddd-dddd-dddd-dddd-dddddddddddd',
                'IRRI_Knowledge_Base', 'Phòng trừ sâu bệnh hại lúa',
                'Các loại sâu bệnh chính trên lúa: sâu cuốn lá, rầy nâu, bệnh đạo ôn, bệnh khô vằn. Sử dụng thuốc bảo vệ thực vật sinh học khi mật độ sâu bệnh đạt ngưỡng gây hại.',
                'vi', ARRAY['sâu bệnh', 'phòng trừ', 'thuốc BVTV', 'lúa']
            ),
            (
                'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
                'IRRI_Knowledge_Base', 'Rice planting techniques',
                'Rice planting requires proper water management, soil preparation, and timing. The best planting time depends on the rice variety and local climate conditions.',
                'en', ARRAY['planting', 'techniques', 'rice']
            )
            ON CONFLICT (id) DO NOTHING
        ''')
        
        # Add media assets
        print("Adding media assets...")
        await conn.execute('''
            INSERT INTO core.media_asset (
                id, user_id, kind, storage_provider, bucket, key, url, bytes, sha256
            ) VALUES 
            (
                'ffffffff-ffff-ffff-ffff-ffffffffffff',
                $1, 'photo', 's3', 'airrvie-photos', 'plots/33333333-3333-3333-3333-333333333333/photo1.jpg',
                'https://s3.amazonaws.com/airrvie-photos/plots/33333333-3333-3333-3333-333333333333/photo1.jpg',
                2048576, 'abc123def456'
            ),
            (
                '11111111-1111-1111-1111-111111111112',
                $1, 'audio', 's3', 'airrvie-audio', 'conversations/99999999-9999-9999-9999-999999999999/audio1.mp3',
                'https://s3.amazonaws.com/airrvie-audio/conversations/99999999-9999-9999-9999-999999999999/audio1.mp3',
                5123456, 'def456abc123'
            )
            ON CONFLICT (id) DO NOTHING
        ''', demo_user_id)
        
        # Add job queue entries
        print("Adding job queue entries...")
        await conn.execute('''
            INSERT INTO sys.job_queue (
                job_type, payload, status, attempts
            ) VALUES 
            (
                'weather_sync', '{"plot_id": "33333333-3333-3333-3333-333333333333"}', 'done', 1
            ),
            (
                'task_reminder', '{"user_id": "11111111-1111-1111-1111-111111111111"}', 'queued', 0
            ),
            (
                'knowledge_index', '{"chunk_ids": ["cccccccc-cccc-cccc-cccc-cccccccccccc"]}', 'running', 2
            )
        ''')
        
        await conn.close()
        print("Complete demo data added successfully!")
        
    except Exception as e:
        print(f"ERROR adding demo data: {e}")

if __name__ == "__main__":
    asyncio.run(add_complete_demo_data())
