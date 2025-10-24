# AirrVie Database Setup and Schema Guide

## Quick Start Commands

### 1. Initialize Database (First Time Setup)
```bash
cd Backend
python database/init_db.py
```
This creates all tables, indexes, and inserts initial demo data.

### 2. Check All Data (Verify Setup)
```bash
cd Backend
python check_all_data.py
```
Runs SELECT * on all tables to verify data is visible.

### 3. Add Complete Demo Data
```bash
cd Backend
python add_complete_demo_data.py
```
Adds comprehensive demo data to all tables.

### 4. Verify Database State
```bash
cd Backend
python verify_db.py
```
Checks table existence and demo data.

### 5. Test Database Connection
```bash
cd Backend
python test_db.py
```
Tests basic database connectivity and operations.

## Database Connection Details

**Connection String:**
```
postgresql://rice_assistant:Sustain420@localhost:5432/airrvie_db
```

**pgAdmin Connection:**
- Host: `localhost`
- Port: `5432`
- Database: `airrvie_db`
- Username: `rice_assistant`
- Password: `Sustain420`

## Complete Schema Documentation

### Database Overview
- **PostgreSQL Version**: 16
- **Schemas**: `core` (application data), `sys` (system operations)
- **Extensions**: uuid-ossp, citext, pgcrypto, pg_trgm, vector (optional), postgis (optional), pg_cron (optional)

---

## Core Schema Tables

### 1. core.user
**Purpose**: User authentication and preferences

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| phone | CITEXT | UNIQUE, NULLABLE | Phone number for authentication |
| email | CITEXT | UNIQUE, NULLABLE | Email for authentication |
| password_hash | TEXT | NOT NULL | Bcrypt hashed password |
| display_name | TEXT | NOT NULL | User's display name |
| locale | TEXT | NOT NULL, DEFAULT 'vi' | Language preference ('en', 'vi') |
| font_scale | TEXT | NOT NULL, DEFAULT 'medium' | UI font size ('small', 'medium', 'large', 'xlarge') |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete timestamp |

**Indexes:**
- `user_phone_active_idx` - Partial unique index for active phone numbers
- `user_email_active_idx` - Partial unique index for active emails
- `user_phone_idx` - Index for phone queries
- `user_email_idx` - Index for email queries

**Constraints:**
- At least one contact method required (phone OR email)

### 2. core.farm
**Purpose**: Farm information management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique farm identifier |
| user_id | UUID | FK → user.id, NOT NULL | Farm owner |
| name | TEXT | NOT NULL | Farm name |
| province | TEXT | NOT NULL | Vietnamese province |
| district | TEXT | NOT NULL | District within province |
| address_text | TEXT | NULLABLE | Detailed address |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete timestamp |

**Indexes:**
- `farm_user_id_idx` - Index for user's farms
- `farm_province_idx` - Index for location-based queries

### 3. core.plot
**Purpose**: Agricultural plot management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique plot identifier |
| farm_id | UUID | FK → farm.id, NOT NULL | Parent farm |
| name | TEXT | NOT NULL | Plot name |
| area_m2 | NUMERIC(10,2) | NOT NULL, > 0 | Area in square meters |
| soil_type | TEXT | NULLABLE | Soil classification |
| variety | TEXT | NULLABLE | Rice variety planted |
| planting_date | DATE | NULLABLE | Planting date |
| harvest_date | DATE | NULLABLE | Expected harvest date |
| irrigation_method | TEXT | NULLABLE | Irrigation technique |
| notes | TEXT | NULLABLE | Additional notes |
| photos | JSONB[] | DEFAULT '{}' | Array of photo references |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete timestamp |

**Constraints:**
- `plot_date_check` - Ensures harvest_date >= planting_date

**Indexes:**
- `plot_farm_id_idx` - Index for farm's plots
- `plot_planting_date_idx` - Index for planting date queries
- `plot_harvest_date_idx` - Index for harvest date queries

### 4. core.task
**Purpose**: Farming task management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique task identifier |
| plot_id | UUID | FK → plot.id, NOT NULL | Associated plot |
| user_id | UUID | FK → user.id, NOT NULL | Task owner |
| title | TEXT | NOT NULL | Task title |
| description | TEXT | NULLABLE | Detailed description |
| due_date | DATE | NOT NULL | Due date |
| priority | TEXT | NOT NULL, DEFAULT 'medium' | Priority level ('low', 'medium', 'high') |
| status | TEXT | NOT NULL, DEFAULT 'pending' | Status ('pending', 'in_progress', 'done') |
| type | TEXT | NOT NULL | Task type ('planting', 'weeding', 'fertilizer', 'irrigation', 'pest', 'harvest', 'other') |
| source | TEXT | NOT NULL, DEFAULT 'manual' | Source ('manual', 'calendar', 'system') |
| reminder | BOOLEAN | DEFAULT FALSE | Reminder enabled |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete timestamp |

**Indexes:**
- `task_plot_id_status_due_date_idx` - Composite index for plot tasks
- `task_user_id_due_date_idx` - Index for user's tasks by due date
- `task_status_idx` - Index for status queries
- `task_type_idx` - Index for task type queries
- `task_due_date_idx` - Index for due date queries

### 5. core.journal_entry
**Purpose**: Farm activity logging

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique entry identifier |
| plot_id | UUID | FK → plot.id, NOT NULL | Associated plot |
| user_id | UUID | FK → user.id, NOT NULL | Entry author |
| entry_date | DATE | NOT NULL, DEFAULT CURRENT_DATE | Entry date |
| type | TEXT | NOT NULL | Entry type ('planting', 'fertilizer', 'irrigation', 'pest', 'harvest', 'other') |
| title | TEXT | NOT NULL | Entry title |
| content | TEXT | NULLABLE | Detailed content |
| photos | JSONB | DEFAULT '[]' | Array of photo URLs/keys |
| audio_url | TEXT | NULLABLE | Audio recording URL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete timestamp |

**Indexes:**
- `journal_plot_id_idx` - Index for plot's journal entries
- `journal_user_id_idx` - Index for user's journal entries
- `journal_entry_date_idx` - Index for date-based queries
- `journal_type_idx` - Index for entry type queries
- `journal_content_gin_idx` - GIN index for full-text search
- `journal_content_trgm_idx` - Trigram index for fuzzy search

### 6. core.weather_daily
**Purpose**: Weather data cache

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Auto-incrementing ID |
| plot_id | UUID | FK → plot.id, NOT NULL | Associated plot |
| for_date | DATE | NOT NULL | Forecast date |
| max_temp | NUMERIC(4,1) | NULLABLE | Maximum temperature (°C) |
| min_temp | NUMERIC(4,1) | NULLABLE | Minimum temperature (°C) |
| precipitation_mm | NUMERIC(6,2) | NULLABLE | Precipitation in mm |
| wind_kph | NUMERIC(5,2) | NULLABLE | Wind speed in km/h |
| payload | JSONB | NOT NULL | Complete weather API response |
| fetched_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data fetch timestamp |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Constraints:**
- `UNIQUE(plot_id, for_date)` - Prevents duplicate weather data

**Indexes:**
- `weather_plot_id_date_idx` - Composite index for plot weather
- `weather_for_date_idx` - Index for date queries
- `weather_fetched_at_idx` - Index for data freshness

### 7. core.conversation
**Purpose**: AI assistant conversation tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique conversation identifier |
| user_id | UUID | FK → user.id, NOT NULL | Conversation owner |
| started_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Conversation start time |
| context | JSONB | DEFAULT '{}' | Conversation context/metadata |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete timestamp |

**Indexes:**
- `conversation_user_id_idx` - Index for user's conversations
- `conversation_started_at_idx` - Index for time-based queries

### 8. core.message
**Purpose**: Individual messages within conversations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique message identifier |
| conversation_id | UUID | FK → conversation.id, NOT NULL | Parent conversation |
| role | TEXT | NOT NULL | Message role ('user', 'assistant', 'system') |
| content | TEXT | NOT NULL | Message content |
| metadata | JSONB | DEFAULT '{}' | Message metadata |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Message creation timestamp |

**Indexes:**
- `message_conversation_id_idx` - Index for conversation messages
- `message_created_at_idx` - Index for chronological ordering
- `message_role_idx` - Index for role-based queries

### 9. core.knowledge_chunk
**Purpose**: Knowledge base for RAG (Retrieval Augmented Generation)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique chunk identifier |
| source | TEXT | NOT NULL | Source document/URL |
| title | TEXT | NOT NULL | Chunk title |
| content | TEXT | NOT NULL | Chunk content |
| lang | TEXT | NOT NULL, DEFAULT 'vi' | Language ('en', 'vi') |
| tags | TEXT[] | DEFAULT '{}' | Content tags |
| embedding | BYTEA | NULLABLE | Vector embedding (1536 dimensions) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete timestamp |

**Indexes:**
- `knowledge_chunk_lang_idx` - Index for language queries
- `knowledge_chunk_tags_idx` - GIN index for tag queries
- `knowledge_chunk_content_gin_idx` - GIN index for full-text search
- `knowledge_chunk_content_trgm_idx` - Trigram index for fuzzy search

### 10. core.media_asset
**Purpose**: File storage references

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique asset identifier |
| user_id | UUID | FK → user.id, NOT NULL | Asset owner |
| kind | TEXT | NOT NULL | Asset type ('photo', 'audio', 'other') |
| storage_provider | TEXT | NOT NULL, DEFAULT 's3' | Storage provider |
| bucket | TEXT | NULLABLE | Storage bucket |
| key | TEXT | NOT NULL | Storage key/path |
| url | TEXT | NULLABLE | Direct access URL |
| bytes | BIGINT | NULLABLE | File size in bytes |
| sha256 | TEXT | NULLABLE | File hash for integrity |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete timestamp |

---

## System Schema Tables

### 11. sys.job_queue
**Purpose**: Background job processing

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Auto-incrementing job ID |
| job_type | TEXT | NOT NULL | Job type identifier |
| payload | JSONB | NOT NULL | Job parameters |
| status | TEXT | NOT NULL, DEFAULT 'queued' | Status ('queued', 'running', 'done', 'failed') |
| attempts | INTEGER | NOT NULL, DEFAULT 0 | Number of execution attempts |
| error | TEXT | NULLABLE | Error message if failed |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Job creation timestamp |
| started_at | TIMESTAMPTZ | NULLABLE | Job start timestamp |
| finished_at | TIMESTAMPTZ | NULLABLE | Job completion timestamp |

**Indexes:**
- `job_queue_status_idx` - Index for status queries
- `job_queue_job_type_status_idx` - Composite index for job processing
- `job_queue_created_at_idx` - Index for job age queries

---

## Database Features

### Row Level Security (RLS)
All user-scoped tables have RLS enabled with commented policies:
- `farm_isolation` - Users can only access their own farms
- `plot_isolation` - Users can only access plots from their farms
- `task_isolation` - Users can only access their own tasks
- `journal_isolation` - Users can only access their own journal entries
- `media_isolation` - Users can only access their own media assets
- `conversation_isolation` - Users can only access their own conversations
- `weather_isolation` - Users can only access weather for their plots

### Automatic Timestamps
- `created_at` - Set automatically on INSERT
- `updated_at` - Updated automatically on UPDATE via triggers
- `deleted_at` - Used for soft deletion

### Text Search
- **GIN indexes** for full-text search on content fields
- **Trigram indexes** for fuzzy search with pg_trgm
- **JSONB indexing** for metadata queries

### Performance Optimizations
- Strategic composite indexes for common query patterns
- Partial indexes for active records only
- Foreign key indexes for join performance

---

## Demo Data Overview

The database includes comprehensive demo data:

**User**: `demo@airrvie.app` / `demo123`
- Vietnamese farmer with one farm and plot

**Farm**: "Trang Trại Mẫu" in An Giang province
- Located in Châu Thành district

**Plot**: "Lô Lúa Chính" (5000 m²)
- OM 5451 variety, phù sa soil type
- Planting and harvest dates set

**Tasks**: Multiple farming tasks
- Fertilizer application, pest control, irrigation checks
- Various priorities and statuses

**Journal**: Activity logs
- Planting and irrigation entries with photos

**Weather**: 7-day forecast
- Temperature, precipitation, wind data

**Conversation**: AI assistant interaction
- User question about yellowing rice leaves
- Assistant response with suggested actions

**Knowledge**: Agricultural knowledge base
- Vietnamese and English content
- Tagged for easy retrieval

**Media**: File references
- Photo and audio storage examples

**Jobs**: Background processing
- Weather sync, task reminders, knowledge indexing

---

## Troubleshooting

### Common Issues:

1. **Connection refused**: Ensure PostgreSQL is running on port 5432
2. **Database not found**: Run `python database/init_db.py`
3. **Encoding issues**: Data is stored correctly, terminal may not display Unicode properly
4. **Permission denied**: Check DATABASE_URL in .env file

### Verification Steps:

1. Run `python check_all_data.py` - Should show data in all tables
2. Run `python verify_db.py` - Should show all tables exist with demo data
3. Check pgAdmin - All tables should be visible with data

### Reset Database:

To completely reset:
1. Drop database: `DROP DATABASE airrvie_db;`
2. Recreate: `python database/init_db.py`
3. Add demo data: `python add_complete_demo_data.py`

This completes the comprehensive database setup and schema documentation.
