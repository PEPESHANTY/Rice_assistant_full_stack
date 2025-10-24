import asyncpg
import bcrypt
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

async def init_db():
    """Initialize database tables and demo data"""
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")
    
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        print("Initializing database schema...")
        
        # Enable required extensions
        await conn.execute('''
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE EXTENSION IF NOT EXISTS "citext";
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
            CREATE EXTENSION IF NOT EXISTS "pg_trgm";
        ''')
        
        # Create schemas
        await conn.execute('CREATE SCHEMA IF NOT EXISTS core')
        await conn.execute('CREATE SCHEMA IF NOT EXISTS sys')
        
        # User table with phone/email authentication
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS core.user (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                phone CITEXT UNIQUE,
                email CITEXT UNIQUE,
                password_hash TEXT NOT NULL,
                display_name TEXT NOT NULL,
                locale TEXT NOT NULL DEFAULT 'vi' CHECK (locale IN ('en', 'vi')),
                font_scale TEXT NOT NULL DEFAULT 'medium' CHECK (font_scale IN ('small', 'medium', 'large', 'xlarge')),
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMPTZ,
                
                CONSTRAINT user_contact_check CHECK (
                    (phone IS NOT NULL) OR (email IS NOT NULL)
                )
            )
        ''')
        
        # Create partial unique indexes for phone/email authentication
        await conn.execute('''
            CREATE UNIQUE INDEX IF NOT EXISTS user_phone_active_idx ON core.user (phone) 
            WHERE phone IS NOT NULL AND deleted_at IS NULL
        ''')
        await conn.execute('''
            CREATE UNIQUE INDEX IF NOT EXISTS user_email_active_idx ON core.user (email) 
            WHERE email IS NOT NULL AND deleted_at IS NULL
        ''')
        
        # Farm table
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS core.farm (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES core.user(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                province TEXT NOT NULL,
                district TEXT NOT NULL,
                address_text TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMPTZ
            )
        ''')
        
        # Plot table with agricultural details
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS core.plot (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                farm_id UUID NOT NULL REFERENCES core.farm(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                area_m2 NUMERIC(10,2) NOT NULL CHECK (area_m2 > 0),
                soil_type TEXT,
                variety TEXT,
                planting_date DATE,
                harvest_date DATE,
                irrigation_method TEXT,
                notes TEXT,
                photos JSONB[] DEFAULT '{}',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMPTZ,
                
                CONSTRAINT plot_date_check CHECK (
                    planting_date IS NULL OR 
                    harvest_date IS NULL OR 
                    harvest_date >= planting_date
                )
            )
        ''')
        
        # Task table with comprehensive task management
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS core.task (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                plot_id UUID NOT NULL REFERENCES core.plot(id) ON DELETE CASCADE,
                user_id UUID NOT NULL REFERENCES core.user(id) ON DELETE CASCADE,
                title TEXT NOT NULL,
                description TEXT,
                due_date DATE NOT NULL,
                priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
                status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
                type TEXT NOT NULL CHECK (type IN ('planting', 'weeding', 'fertilizer', 'irrigation', 'pest', 'harvest', 'other')),
                source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'calendar', 'system')),
                reminder BOOLEAN DEFAULT FALSE,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMPTZ
            )
        ''')
        
        # Journal entry table for farm activities
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS core.journal_entry (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                plot_id UUID NOT NULL REFERENCES core.plot(id) ON DELETE CASCADE,
                user_id UUID NOT NULL REFERENCES core.user(id) ON DELETE CASCADE,
                entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
                type TEXT NOT NULL CHECK (type IN ('planting', 'fertilizer', 'irrigation', 'pest', 'harvest', 'other')),
                title TEXT NOT NULL,
                content TEXT,
                photos JSONB DEFAULT '[]',
                audio_url TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMPTZ
            )
        ''')
        
        # Media asset table for storing file references
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS core.media_asset (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES core.user(id) ON DELETE CASCADE,
                kind TEXT NOT NULL CHECK (kind IN ('photo', 'audio', 'other')),
                storage_provider TEXT NOT NULL DEFAULT 's3',
                bucket TEXT,
                key TEXT NOT NULL,
                url TEXT,
                bytes BIGINT,
                sha256 TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMPTZ
            )
        ''')
        
        # Weather cache table for plot-specific weather data
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS core.weather_daily (
                id BIGSERIAL PRIMARY KEY,
                plot_id UUID NOT NULL REFERENCES core.plot(id) ON DELETE CASCADE,
                for_date DATE NOT NULL,
                max_temp NUMERIC(4,1),
                min_temp NUMERIC(4,1),
                precipitation_mm NUMERIC(6,2),
                wind_kph NUMERIC(5,2),
                payload JSONB NOT NULL,
                fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMPTZ,
                
                UNIQUE(plot_id, for_date)
            )
        ''')
        
        # Conversation table for assistant interactions
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS core.conversation (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES core.user(id) ON DELETE CASCADE,
                started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                context JSONB DEFAULT '{}',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMPTZ
            )
        ''')
        
        # Message table for conversation history
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS core.message (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                conversation_id UUID NOT NULL REFERENCES core.conversation(id) ON DELETE CASCADE,
                role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
                content TEXT NOT NULL,
                metadata JSONB DEFAULT '{}',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ''')
        
        # Knowledge chunk table for RAG (Retrieval Augmented Generation)
        # Use BYTEA for embedding if vector extension is not available
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS core.knowledge_chunk (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                source TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                lang TEXT NOT NULL DEFAULT 'vi' CHECK (lang IN ('en', 'vi')),
                tags TEXT[] DEFAULT '{}',
                embedding BYTEA,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMPTZ
            )
        ''')
        
        # Job queue for background processing
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS sys.job_queue (
                id BIGSERIAL PRIMARY KEY,
                job_type TEXT NOT NULL,
                payload JSONB NOT NULL,
                status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'done', 'failed')),
                attempts INTEGER NOT NULL DEFAULT 0,
                error TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                started_at TIMESTAMPTZ,
                finished_at TIMESTAMPTZ
            )
        ''')
        
        # Create indexes for performance
        await create_indexes(conn)
        
        # Create triggers for updated_at
        await create_triggers(conn)
        
        print("Database initialized successfully - tables created")
        print("Run 'python add_complete_demo_data.py' to add demo data")
        
    except Exception as e:
        print(f"ERROR initializing database: {e}")
        raise
    finally:
        await conn.close()

async def create_indexes(conn):
    """Create performance indexes"""
    print("Creating indexes...")
    
    # User indexes
    await conn.execute('CREATE INDEX IF NOT EXISTS user_phone_idx ON core.user (phone) WHERE deleted_at IS NULL')
    await conn.execute('CREATE INDEX IF NOT EXISTS user_email_idx ON core.user (email) WHERE deleted_at IS NULL')
    
    # Farm indexes
    await conn.execute('CREATE INDEX IF NOT EXISTS farm_user_id_idx ON core.farm (user_id) WHERE deleted_at IS NULL')
    await conn.execute('CREATE INDEX IF NOT EXISTS farm_province_idx ON core.farm (province) WHERE deleted_at IS NULL')
    
    # Plot indexes
    await conn.execute('CREATE INDEX IF NOT EXISTS plot_farm_id_idx ON core.plot (farm_id) WHERE deleted_at IS NULL')
    await conn.execute('CREATE INDEX IF NOT EXISTS plot_planting_date_idx ON core.plot (planting_date) WHERE deleted_at IS NULL')
    
    # Task indexes
    await conn.execute('CREATE INDEX IF NOT EXISTS task_plot_id_status_due_date_idx ON core.task (plot_id, status, due_date) WHERE deleted_at IS NULL')
    await conn.execute('CREATE INDEX IF NOT EXISTS task_user_id_due_date_idx ON core.task (user_id, due_date DESC) WHERE deleted_at IS NULL')
    await conn.execute('CREATE INDEX IF NOT EXISTS task_status_idx ON core.task (status) WHERE deleted_at IS NULL')
    
    # Journal entry indexes
    await conn.execute('CREATE INDEX IF NOT EXISTS journal_plot_id_idx ON core.journal_entry (plot_id) WHERE deleted_at IS NULL')
    await conn.execute('CREATE INDEX IF NOT EXISTS journal_user_id_idx ON core.journal_entry (user_id) WHERE deleted_at IS NULL')
    
    # Weather indexes
    await conn.execute('CREATE INDEX IF NOT EXISTS weather_plot_id_date_idx ON core.weather_daily (plot_id, for_date)')
    await conn.execute('CREATE INDEX IF NOT EXISTS weather_for_date_idx ON core.weather_daily (for_date)')
    
    # Conversation indexes
    await conn.execute('CREATE INDEX IF NOT EXISTS conversation_user_id_idx ON core.conversation (user_id) WHERE deleted_at IS NULL')
    
    # Message indexes
    await conn.execute('CREATE INDEX IF NOT EXISTS message_conversation_id_idx ON core.message (conversation_id)')
    
    # Knowledge chunk indexes
    await conn.execute('CREATE INDEX IF NOT EXISTS knowledge_chunk_lang_idx ON core.knowledge_chunk (lang) WHERE deleted_at IS NULL')
    await conn.execute('CREATE INDEX IF NOT EXISTS knowledge_chunk_tags_idx ON core.knowledge_chunk USING GIN (tags) WHERE deleted_at IS NULL')
    
    # Job queue indexes
    await conn.execute('CREATE INDEX IF NOT EXISTS job_queue_status_idx ON sys.job_queue (status)')
    await conn.execute('CREATE INDEX IF NOT EXISTS job_queue_job_type_status_idx ON sys.job_queue (job_type, status)')

async def create_triggers(conn):
    """Create triggers for updated_at timestamps"""
    print("Creating triggers...")
    
    # Function to update updated_at timestamp
    await conn.execute('''
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql'
    ''')
    
    # Apply triggers to all tables with updated_at column
    tables_with_updated_at = [
        'core.user', 'core.farm', 'core.plot', 'core.task', 
        'core.journal_entry', 'core.media_asset', 'core.conversation', 
        'core.knowledge_chunk'
    ]
    
    for table in tables_with_updated_at:
        await conn.execute(f'''
            DROP TRIGGER IF EXISTS update_{table.replace('.', '_')}_updated_at ON {table};
            CREATE TRIGGER update_{table.replace('.', '_')}_updated_at 
            BEFORE UPDATE ON {table}
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        ''')
    
    # Function to sync task.completed with task.status
    await conn.execute('''
        CREATE OR REPLACE FUNCTION sync_task_status_completed()
        RETURNS TRIGGER AS $$
        BEGIN
            IF NEW.status = 'done' THEN
                NEW.completed = TRUE;
            ELSIF NEW.status IN ('pending', 'in_progress') THEN
                NEW.completed = FALSE;
            END IF;
            RETURN NEW;
        END;
        $$ language 'plpgsql'
    ''')
    
    await conn.execute('''
        DROP TRIGGER IF EXISTS sync_task_status_completed_trigger ON core.task;
        CREATE TRIGGER sync_task_status_completed_trigger
        BEFORE INSERT OR UPDATE ON core.task
        FOR EACH ROW EXECUTE FUNCTION sync_task_status_completed()
    ''')

async def seed_demo_data(conn):
    """Insert demo data for testing"""
    print("Seeding demo data...")
    
    # Import datetime for proper date handling
    from datetime import date
    
    # Insert demo user (password: demo123)
    demo_password_hash = bcrypt.hashpw("demo123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    await conn.execute('''
        INSERT INTO core.user (id, phone, email, password_hash, display_name, locale, font_scale)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO NOTHING
    ''', 
    '11111111-1111-1111-1111-111111111111',
    '+84123456789',
    'demo@airrvie.app',
    demo_password_hash,
    'Demo Farmer',
    'vi',
    'medium'
    )
    
    # Insert demo farm
    await conn.execute('''
        INSERT INTO core.farm (id, user_id, name, province, district, address_text)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
    ''',
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Trang Trại Mẫu',
    'An Giang',
    'Châu Thành',
    'Ấp Mỹ Hòa, Xã Mỹ Hòa Hưng'
    )
    
    # Insert demo plot (5000 m² = 0.5 hectare)
    await conn.execute('''
        INSERT INTO core.plot (id, farm_id, name, area_m2, soil_type, variety, planting_date, harvest_date, irrigation_method, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING
    ''',
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'Lô Lúa Chính',
    5000.00,
    'Phù sa',
    'OM 5451',
    date(2025, 1, 1),  # Use date object instead of string
    date(2025, 4, 1),  # Use date object instead of string
    'Tưới ngập',
    'Lô đất chính trồng giống lúa OM 5451'
    )
    
    # Insert demo tasks
    await conn.execute('''
        INSERT INTO core.task (id, plot_id, user_id, title, description, due_date, priority, status, type, source, reminder)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING
    ''',
    '44444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Bón phân đợt 1',
    'Bón phân NPK 20-20-15 với liều lượng 80kg/ha',
    date(2025, 1, 15),  # Use date object instead of string
    'high',
    'pending',
    'fertilizer',
    'calendar',
    True
    )
    
    print("Demo data seeded successfully")

async def get_db_connection():
    """Get database connection"""
    return await asyncpg.connect(DATABASE_URL)

if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db())
