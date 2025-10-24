# AirrVie - PostgreSQL Schema Documentation

## Overview

This is a production-ready PostgreSQL 16 schema for the AirrVie Rice Farming Assistant application. The schema supports all features visible in the frontend including user authentication, farm/plot management, task tracking, journal entries, weather caching, AI assistant conversations, and knowledge base for RAG.

## Key Features

- **Multi-tenant ready** with user-scoped data isolation
- **Bilingual support** (Vietnamese/English) throughout
- **Phone-first authentication** with optional email
- **Soft delete pattern** for all user data
- **Comprehensive indexing** for performance
- **Row Level Security (RLS)** policies (commented out)
- **Future-ready** with vector embeddings, geospatial data, and job queue support

## Database Setup

### Prerequisites
- PostgreSQL 16
- Required extensions: `uuid-ossp`, `citext`, `pgcrypto`, `pg_trgm`
- Optional extensions: `vector`, `postgis`, `pg_cron`

### Quick Start
```bash
# Execute the schema
psql -U postgres -f Backend/schema.sql

# Or connect and run manually
psql -U postgres
\i Backend/schema.sql
```

## Schema Structure

### Core Schema (Application Data)

#### `core.user`
- Phone/email authentication with password hashing
- User preferences (language, font scale)
- Partial unique indexes for active phone/email

#### `core.farm`
- User-owned farms with location data
- Province/district for Vietnamese locations

#### `core.plot`
- Agricultural plots with technical details
- Area stored in m² (can convert to sào/công/hectare in UI)
- Planting/harvest date tracking

#### `core.task`
- Comprehensive task management
- Types: planting, weeding, fertilizer, irrigation, pest, harvest, other
- Sources: manual, calendar, system
- Automatic sync between status and completed fields

#### `core.journal_entry`
- Farm activity logging with photos/audio support
- Entry types matching task types

#### `core.weather_daily`
- Plot-specific weather cache (7-day forecast)
- Unique constraint on (plot_id, for_date)
- Full API payload + computed columns

#### `core.conversation` & `core.message`
- AI assistant conversation history
- Support for user/assistant/system roles

#### `core.knowledge_chunk`
- RAG (Retrieval Augmented Generation) knowledge base
- Vector embeddings for semantic search
- Bilingual content with tagging

#### `core.media_asset`
- S3/file storage references
- Support for photos, audio, and other media

### Sys Schema (Operations)

#### `sys.job_queue`
- Background job processing
- Status lifecycle: queued → running → done/failed
- Retry mechanism with attempt tracking

## Performance Optimizations

### Indexes
- **Partial indexes** for active records (`deleted_at IS NULL`)
- **Composite indexes** for common query patterns
- **GIN indexes** for text search and array operations
- **Trigram indexes** for fuzzy search
- **Conditional indexes** for phone/email authentication

### Text Search
- Full-text search on `knowledge_chunk.content`, `journal_entry.content`, `task.description`
- Fuzzy search with trigram indexes
- Vector similarity search (when pgvector available)

## Security Features

### Row Level Security (RLS)
RLS is enabled on all user-scoped tables with example policies provided (commented out). To enable:

```sql
-- Set user context in application
SET app.user_id = 'user-uuid-here';

-- Uncomment RLS policies in schema.sql
```

### Authentication
- Phone/email with bcrypt password hashing
- Partial unique indexes prevent duplicate active accounts
- Contact method validation (phone OR email required)

## Demo Data

The schema includes idempotent seed data for testing:

- **User**: `demo@airrvie.app` / `demo123`
- **Farm**: "Trang Trại Mẫu" in An Giang province
- **Plot**: "Lô Lúa Chính" (5000 m²) with OM 5451 variety
- **Tasks**: Fertilizer application, pest control, irrigation check
- **Journal**: Planting and irrigation entries
- **Conversation**: Sample Q&A about yellowing rice leaves
- **Knowledge**: Fertilizer techniques and pest control information

## Data Relationships

```
user (1) → farm (1) → plot (1) → task (many)
                              → journal_entry (many)
                              → weather_daily (many)
                  
user (1) → conversation (many) → message (many)
user (1) → media_asset (many)
```

## Usage Examples

### User Registration
```sql
-- Create user with phone authentication
INSERT INTO core.user (phone, password_hash, display_name, locale)
VALUES ('+84123456789', crypt('password123', gen_salt('bf')), 'Nguyễn Văn A', 'vi');
```

### Task Management
```sql
-- Get upcoming tasks for user
SELECT t.*, p.name as plot_name, f.name as farm_name
FROM core.task t
JOIN core.plot p ON t.plot_id = p.id
JOIN core.farm f ON p.farm_id = f.id
WHERE t.user_id = 'user-uuid' 
  AND t.deleted_at IS NULL
  AND t.due_date >= CURRENT_DATE
  AND t.status != 'done'
ORDER BY t.due_date, t.priority;
```

### Weather Data
```sql
-- Get 7-day forecast for plot
SELECT for_date, max_temp, min_temp, precipitation_mm, payload
FROM core.weather_daily
WHERE plot_id = 'plot-uuid'
  AND for_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 6
ORDER BY for_date;
```

### Assistant Conversations
```sql
-- Get conversation history
SELECT c.started_at, m.role, m.content, m.created_at
FROM core.conversation c
JOIN core.message m ON c.id = m.conversation_id
WHERE c.user_id = 'user-uuid'
  AND c.deleted_at IS NULL
ORDER BY m.created_at;
```

## Maintenance

### Soft Delete Cleanup
```sql
-- Archive deleted records older than 30 days
UPDATE core.task 
SET deleted_at = NOW() 
WHERE deleted_at IS NOT NULL 
  AND deleted_at < NOW() - INTERVAL '30 days';
```

### Job Queue Maintenance
```sql
-- Clean up completed jobs older than 7 days
DELETE FROM sys.job_queue 
WHERE status = 'done' 
  AND finished_at < NOW() - INTERVAL '7 days';
```

## Migration Notes

When deploying updates:

1. Always backup before schema changes
2. Test extensions availability in target environment
3. Consider gradual RLS policy rollout
4. Monitor performance after index changes

## Troubleshooting

### Common Issues

1. **Extension not available**: Install required PostgreSQL extensions
2. **RLS policy conflicts**: Check user context setting in application
3. **Performance issues**: Verify indexes are being used with `EXPLAIN`
4. **Duplicate constraints**: Use `ON CONFLICT` clauses in inserts

### Validation Queries
Uncomment the validation section in `schema.sql` to verify setup:
```sql
-- Check table counts and structure
SELECT schemaname, tablename, tableowner
FROM pg_tables 
WHERE schemaname IN ('core', 'sys');
```

## Future Enhancements

- **Geospatial queries** with PostGIS for plot locations
- **Advanced analytics** with materialized views
- **Real-time notifications** with LISTEN/NOTIFY
- **Data partitioning** for large-scale deployments
- **Audit logging** for compliance requirements

---

**Schema Version**: 1.0  
**Last Updated**: 2025  
**Compatible With**: PostgreSQL 16+
