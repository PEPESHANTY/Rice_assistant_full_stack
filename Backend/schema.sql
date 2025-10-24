-- ========================================
-- AirrVie - Rice Farming Assistant
-- PostgreSQL 16 Schema
-- ========================================

-- Database setup
CREATE DATABASE airrvie_db;
\c airrvie_db;

-- Create role for the application
CREATE ROLE rice_assistant WITH LOGIN PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE airrvie_db TO rice_assistant;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For RAG embeddings (optional)
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial data (optional)
CREATE EXTENSION IF NOT EXISTS "pg_cron"; -- For scheduled jobs (optional)

-- Create schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS sys;

-- Grant permissions
GRANT USAGE ON SCHEMA core TO rice_assistant;
GRANT USAGE ON SCHEMA sys TO rice_assistant;

-- ========================================
-- CORE SCHEMA - Application Data
-- ========================================

-- User table with phone/email authentication
CREATE TABLE core.user (
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
    
    -- Ensure at least one contact method
    CONSTRAINT user_contact_check CHECK (
        (phone IS NOT NULL) OR (email IS NOT NULL)
    )
);

-- Create partial unique indexes for phone/email authentication
CREATE UNIQUE INDEX user_phone_active_idx ON core.user (phone) 
    WHERE phone IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX user_email_active_idx ON core.user (email) 
    WHERE email IS NOT NULL AND deleted_at IS NULL;

-- Farm table
CREATE TABLE core.farm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.user(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    address_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Plot table with agricultural details
CREATE TABLE core.plot (
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
    
    -- Ensure harvest date is after planting date if both exist
    CONSTRAINT plot_date_check CHECK (
        planting_date IS NULL OR 
        harvest_date IS NULL OR 
        harvest_date >= planting_date
    )
);

-- Task table with comprehensive task management
CREATE TABLE core.task (
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
);

-- Journal entry table for farm activities
CREATE TABLE core.journal_entry (
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
);

-- Media asset table for storing file references
CREATE TABLE core.media_asset (
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
);

-- Weather cache table for plot-specific weather data
CREATE TABLE core.weather_daily (
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
    
    -- Unique constraint to prevent duplicate weather data
    UNIQUE(plot_id, for_date)
);

-- Conversation table for assistant interactions
CREATE TABLE core.conversation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.user(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Message table for conversation history
CREATE TABLE core.message (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES core.conversation(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Knowledge chunk table for RAG (Retrieval Augmented Generation)
-- Use BYTEA for embedding if vector extension is not available
CREATE TABLE core.knowledge_chunk (
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
);

-- ========================================
-- SYS SCHEMA - System Operations
-- ========================================

-- Job queue for background processing
CREATE TABLE sys.job_queue (
    id BIGSERIAL PRIMARY KEY,
    job_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'done', 'failed')),
    attempts INTEGER NOT NULL DEFAULT 0,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- User indexes
CREATE INDEX user_phone_idx ON core.user (phone) WHERE deleted_at IS NULL;
CREATE INDEX user_email_idx ON core.user (email) WHERE deleted_at IS NULL;
CREATE INDEX user_created_idx ON core.user (created_at) WHERE deleted_at IS NULL;

-- Farm indexes
CREATE INDEX farm_user_id_idx ON core.farm (user_id) WHERE deleted_at IS NULL;
CREATE INDEX farm_province_idx ON core.farm (province) WHERE deleted_at IS NULL;
CREATE INDEX farm_created_idx ON core.farm (created_at) WHERE deleted_at IS NULL;

-- Plot indexes
CREATE INDEX plot_farm_id_idx ON core.plot (farm_id) WHERE deleted_at IS NULL;
CREATE INDEX plot_planting_date_idx ON core.plot (planting_date) WHERE deleted_at IS NULL;
CREATE INDEX plot_harvest_date_idx ON core.plot (harvest_date) WHERE deleted_at IS NULL;

-- Task indexes
CREATE INDEX task_plot_id_status_due_date_idx ON core.task (plot_id, status, due_date) WHERE deleted_at IS NULL;
CREATE INDEX task_user_id_due_date_idx ON core.task (user_id, due_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX task_status_idx ON core.task (status) WHERE deleted_at IS NULL;
CREATE INDEX task_type_idx ON core.task (type) WHERE deleted_at IS NULL;
CREATE INDEX task_due_date_idx ON core.task (due_date) WHERE deleted_at IS NULL;
CREATE INDEX task_completed_idx ON core.task (completed) WHERE deleted_at IS NULL;

-- Journal entry indexes
CREATE INDEX journal_plot_id_idx ON core.journal_entry (plot_id) WHERE deleted_at IS NULL;
CREATE INDEX journal_user_id_idx ON core.journal_entry (user_id) WHERE deleted_at IS NULL;
CREATE INDEX journal_entry_date_idx ON core.journal_entry (entry_date) WHERE deleted_at IS NULL;
CREATE INDEX journal_type_idx ON core.journal_entry (type) WHERE deleted_at IS NULL;

-- Weather indexes
CREATE INDEX weather_plot_id_date_idx ON core.weather_daily (plot_id, for_date);
CREATE INDEX weather_for_date_idx ON core.weather_daily (for_date);
CREATE INDEX weather_fetched_at_idx ON core.weather_daily (fetched_at);

-- Conversation indexes
CREATE INDEX conversation_user_id_idx ON core.conversation (user_id) WHERE deleted_at IS NULL;
CREATE INDEX conversation_started_at_idx ON core.conversation (started_at) WHERE deleted_at IS NULL;

-- Message indexes
CREATE INDEX message_conversation_id_idx ON core.message (conversation_id);
CREATE INDEX message_created_at_idx ON core.message (created_at);
CREATE INDEX message_role_idx ON core.message (role);

-- Knowledge chunk indexes
CREATE INDEX knowledge_chunk_lang_idx ON core.knowledge_chunk (lang) WHERE deleted_at IS NULL;
CREATE INDEX knowledge_chunk_tags_idx ON core.knowledge_chunk USING GIN (tags) WHERE deleted_at IS NULL;
CREATE INDEX knowledge_chunk_created_idx ON core.knowledge_chunk (created_at) WHERE deleted_at IS NULL;

-- Text search indexes for content
CREATE INDEX knowledge_chunk_content_gin_idx ON core.knowledge_chunk 
    USING GIN (to_tsvector('simple', content)) WHERE deleted_at IS NULL;
CREATE INDEX journal_content_gin_idx ON core.journal_entry 
    USING GIN (to_tsvector('simple', content)) WHERE deleted_at IS NULL;
CREATE INDEX task_description_gin_idx ON core.task 
    USING GIN (to_tsvector('simple', description)) WHERE deleted_at IS NULL;

-- Trigram indexes for fuzzy search
CREATE INDEX knowledge_chunk_content_trgm_idx ON core.knowledge_chunk 
    USING GIN (content gin_trgm_ops) WHERE deleted_at IS NULL;
CREATE INDEX journal_content_trgm_idx ON core.journal_entry 
    USING GIN (content gin_trgm_ops) WHERE deleted_at IS NULL;

-- Vector index for embeddings (if pgvector extension is available)
-- CREATE INDEX knowledge_chunk_embedding_idx ON core.knowledge_chunk 
--     USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100) WHERE deleted_at IS NULL;

-- Job queue indexes
CREATE INDEX job_queue_status_idx ON sys.job_queue (status);
CREATE INDEX job_queue_job_type_status_idx ON sys.job_queue (job_type, status);
CREATE INDEX job_queue_created_at_idx ON sys.job_queue (created_at);

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on user-scoped tables
ALTER TABLE core.farm ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.plot ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.task ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.journal_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.media_asset ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.conversation ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.weather_daily ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (commented out - enable as needed)
/*
-- Farm isolation policy
CREATE POLICY farm_isolation ON core.farm
  USING (user_id::text = current_setting('app.user_id', true));

-- Plot isolation policy  
CREATE POLICY plot_isolation ON core.plot
  USING (farm_id IN (
    SELECT id FROM core.farm 
    WHERE user_id::text = current_setting('app.user_id', true)
  ));

-- Task isolation policy
CREATE POLICY task_isolation ON core.task
  USING (user_id::text = current_setting('app.user_id', true));

-- Journal entry isolation policy
CREATE POLICY journal_isolation ON core.journal_entry
  USING (user_id::text = current_setting('app.user_id', true));

-- Media asset isolation policy
CREATE POLICY media_isolation ON core.media_asset
  USING (user_id::text = current_setting('app.user_id', true));

-- Conversation isolation policy
CREATE POLICY conversation_isolation ON core.conversation
  USING (user_id::text = current_setting('app.user_id', true));

-- Weather data isolation policy
CREATE POLICY weather_isolation ON core.weather_daily
  USING (plot_id IN (
    SELECT p.id FROM core.plot p
    JOIN core.farm f ON p.farm_id = f.id
    WHERE f.user_id::text = current_setting('app.user_id', true)
  ));
*/

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables with updated_at column
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON core.user
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farm_updated_at BEFORE UPDATE ON core.farm
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plot_updated_at BEFORE UPDATE ON core.plot
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_updated_at BEFORE UPDATE ON core.task
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_updated_at BEFORE UPDATE ON core.journal_entry
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON core.media_asset
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_updated_at BEFORE UPDATE ON core.conversation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_updated_at BEFORE UPDATE ON core.knowledge_chunk
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically sync task.completed with task.status
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
$$ language 'plpgsql';

CREATE TRIGGER sync_task_status_completed_trigger
    BEFORE INSERT OR UPDATE ON core.task
    FOR EACH ROW EXECUTE FUNCTION sync_task_status_completed();

-- ========================================
-- DEMO DATA SEED
-- ========================================

-- Insert demo user (password: demo123)
INSERT INTO core.user (
    id, phone, email, password_hash, display_name, locale, font_scale
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    '+84123456789',
    'demo@airrvie.app',
    crypt('demo123', gen_salt('bf')), -- bcrypt hash for 'demo123'
    'Demo Farmer',
    'vi',
    'medium'
) ON CONFLICT (email) DO NOTHING;

-- Insert demo farm
INSERT INTO core.farm (
    id, user_id, name, province, district, address_text
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Trang Trại Mẫu',
    'An Giang',
    'Châu Thành',
    'Ấp Mỹ Hòa, Xã Mỹ Hòa Hưng'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo plot (5000 m² = 0.5 hectare)
INSERT INTO core.plot (
    id, farm_id, name, area_m2, soil_type, variety, planting_date, harvest_date, irrigation_method, notes
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'Lô Lúa Chính',
    5000.00,
    'Phù sa',
    'OM 5451',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '90 days',
    'Tưới ngập',
    'Lô đất chính trồng giống lúa OM 5451'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo tasks
INSERT INTO core.task (
    id, plot_id, user_id, title, description, due_date, priority, status, type, source, reminder
) VALUES 
(
    '44444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Bón phân đợt 1',
    'Bón phân NPK 20-20-15 với liều lượng 80kg/ha',
    CURRENT_DATE + INTERVAL '2 days',
    'high',
    'pending',
    'fertilizer',
    'calendar',
    true
),
(
    '55555555-5555-5555-5555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Phun thuốc phòng sâu',
    'Phun thuốc trừ sâu sinh học để phòng ngừa sâu cuốn lá',
    CURRENT_DATE + INTERVAL '5 days',
    'medium',
    'pending',
    'pest',
    'system',
    false
),
(
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Kiểm tra mực nước',
    'Kiểm tra và điều chỉnh mực nước trong ruộng',
    CURRENT_DATE - INTERVAL '1 day',
    'low',
    'done',
    'irrigation',
    'manual',
    false
) ON CONFLICT (id) DO NOTHING;

-- Insert demo journal entries
INSERT INTO core.journal_entry (
    id, plot_id, user_id, entry_date, type, title, content
) VALUES 
(
    '77777777-7777-7777-7777-777777777777',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    CURRENT_DATE - INTERVAL '7 days',
    'planting',
    'Gieo sạ giống lúa',
    'Đã gieo sạ giống OM 5451 với mật độ 120kg/ha. Thời tiết thuận lợi, đất đủ ẩm.'
),
(
    '88888888-8888-8888-8888-888888888888',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    CURRENT_DATE - INTERVAL '3 days',
    'irrigation',
    'Tưới nước lần đầu',
    'Tưới ngập nước lần đầu tiên sau khi gieo sạ. Mực nước duy trì 3-5cm.'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo conversation
INSERT INTO core.conversation (
    id, user_id, started_at, context
) VALUES (
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    CURRENT_TIMESTAMP - INTERVAL '1 hour',
    '{"current_plot": "33333333-3333-3333-3333-333333333333"}'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo messages
INSERT INTO core.message (
    id, conversation_id, role, content, metadata
) VALUES 
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '99999999-9999-9999-9999-999999999999',
    'user',
    'Tôi nên làm gì khi lúa bị vàng lá?',
    '{"plot_id": "33333333-3333-3333-3333-333333333333"}'
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '99999999-9999-9999-9999-999999999999',
    'assistant',
    'Lúa bị vàng lá có thể do nhiều nguyên nhân: thiếu dinh dưỡng, ngập úng, hoặc sâu bệnh. Bạn nên kiểm tra mực nước và xem xét bón phân bổ sung. Nếu tình trạng nghiêm trọng, hãy chụp ảnh gửi cho tôi để phân tích kỹ hơn.',
    '{"suggested_actions": ["kiểm tra mực nước", "bón phân", "chụp ảnh"]}'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo knowledge chunks
INSERT INTO core.knowledge_chunk (
    id, source, title, content, lang, tags
) VALUES 
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'IRRI_Knowledge_Base',
    'Kỹ thuật bón phân cho lúa',
    'Bón phân cho lúa cần chia làm 3 đợt chính: đợt 1 (7-10 ngày sau sạ), đợt 2 (18-22 ngày), đợt 3 (40-45 ngày). Sử dụng phân NPK cân đối và bón theo nhu cầu của từng giai đoạn sinh trưởng.',
    'vi',
    ARRAY['bón phân', 'dinh dưỡng', 'NPK', 'lúa']
),
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'IRRI_Knowledge_Base',
    'Phòng trừ sâu bệnh hại lúa',
    'Các loại sâu bệnh chính trên lúa: sâu cuốn lá, rầy nâu, bệnh đạo ôn, bệnh khô vằn. Sử dụng thuốc bảo vệ thực vật sinh học khi mật độ sâu bệnh đạt ngưỡng gây hại.',
    'vi',
    ARRAY['sâu bệnh', 'phòng trừ', 'thuốc BVTV', 'lúa']
) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- FINAL GRANTS AND CLEANUP
-- ========================================

-- Grant table permissions to application role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA core TO rice_assistant;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA sys TO rice_assistant;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core TO rice_assistant;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA sys TO rice_assistant;

-- Set default permissions for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON TABLES TO rice_assistant;
ALTER DEFAULT PRIVILEGES IN SCHEMA sys GRANT ALL ON TABLES TO rice_assistant;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT USAGE, SELECT ON SEQUENCES TO rice_assistant;
ALTER DEFAULT PRIVILEGES IN SCHEMA sys GRANT USAGE, SELECT ON SEQUENCES TO rice_assistant;

-- ========================================
-- SCHEMA VALIDATION QUERIES (Optional)
-- ========================================

-- Uncomment to verify schema setup:
/*
-- Check table counts
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname IN ('core', 'sys')
ORDER BY schemaname, tablename;

-- Check demo data
SELECT 'Users' as type, COUNT(*) as count FROM core.user WHERE deleted_at IS NULL
UNION ALL
SELECT 'Farms', COUNT(*) FROM core.farm WHERE deleted_at IS NULL
UNION ALL
SELECT 'Plots', COUNT(*) FROM core.plot WHERE deleted_at IS NULL
UNION ALL
SELECT 'Tasks', COUNT(*) FROM core.task WHERE deleted_at IS NULL
UNION ALL
SELECT 'Journal Entries', COUNT(*) FROM core.journal_entry WHERE deleted_at IS NULL;
*/

-- ========================================
-- SCHEMA COMPLETE
-- ========================================
