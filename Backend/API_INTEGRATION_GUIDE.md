# AIRRVie API Integration Guide

## Overview
Complete backend API system for the AIRRVie rice farming assistant application with full frontend integration.

## API Endpoints

### Authentication API (`/api/auth`)
- `POST /api/auth/request-otp` - Request OTP for phone authentication
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Farms & Plots API (`/api`)
- `GET /api/farms` - Get all farms for current user
- `POST /api/farms` - Create new farm
- `PUT /api/farms/{farm_id}` - Update farm
- `DELETE /api/farms/{farm_id}` - Delete farm
- `GET /api/plots` - Get all plots for current user
- `POST /api/plots` - Create new plot
- `PUT /api/plots/{plot_id}` - Update plot
- `DELETE /api/plots/{plot_id}` - Delete plot

### Tasks API (`/api/tasks`)
- `GET /api/tasks` - Get all tasks for current user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{task_id}` - Update task
- `DELETE /api/tasks/{task_id}` - Delete task

### Journal API (`/api/journal`)
- `GET /api/journal` - Get all journal entries for current user
- `POST /api/journal` - Create new journal entry
- `PUT /api/journal/{entry_id}` - Update journal entry
- `DELETE /api/journal/{entry_id}` - Delete journal entry

### Weather API (`/api/weather`)
- `GET /api/weather` - Get real-time weather data with location detection
- Supports coordinates (lat, lon) or city name parameters
- Returns current weather, 5-day forecast, and alerts

### Assistant API (`/api/assistant`)
- `POST /api/assistant/chat` - Send message to AI assistant
- `GET /api/assistant/conversations` - Get conversation history
- `GET /api/assistant/conversations/{conversation_id}` - Get specific conversation

### Users API (`/api/users`)
- `GET /api/users` - Get current user information

## Frontend Integration

### API Service Layer (`Frontend/src/services/api.ts`)
- Centralized API client with authentication handling
- Automatic JWT token management
- Error handling and response parsing

### Context Integration (`Frontend/src/components/AppContext.tsx`)
- Global state management for user authentication
- Real-time data synchronization
- Loading states and error handling

### Authentication Flow (`Frontend/src/components/AuthPage.tsx`)
- Phone-based OTP authentication
- JWT token storage and management
- Automatic token refresh handling

### Component Integration
- **Dashboard**: Real-time farm and plot data
- **Tasks**: Task management with real API calls
- **Journal**: Activity logging with photo support
- **Weather**: Real-time weather data display
- **Assistant**: AI-powered conversation interface

## Database Schema

### Core Tables
- `core.user` - User authentication and preferences
- `core.farm` - Farm information with location data
- `core.plot` - Agricultural plots with technical details
- `core.task` - Farming task management
- `core.journal_entry` - Farm activity logging
- `core.weather_daily` - Weather data cache
- `core.conversation` - AI assistant conversations
- `core.message` - Individual conversation messages
- `core.knowledge_chunk` - RAG knowledge base

## Demo Data

The system includes comprehensive demo data:
- User: `demo@airrvie.app` / `demo123`
- Farm: "Trang Trại Mẫu" in An Giang province
- Plot: "Lô Lúa Chính" (5000 m²) with OM 5451 variety
- Tasks: Fertilizer application, pest control, irrigation
- Journal: Planting and irrigation entries
- Weather: 7-day forecast data
- Conversations: Sample AI assistant interactions

## Testing

### Backend Testing
```bash
cd Backend
python test_all_apis.py
```

### Frontend Testing
```bash
cd Frontend
npm run dev
```

### Individual API Tests
- `test_simple.py` - Basic connectivity
- `test_assistant_api.py` - Assistant functionality
- `test_assistant.py` - AI conversation testing

## Running the Application

### Backend (FastAPI)
```bash
cd Backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (React/Vite)
```bash
cd Frontend
npm run dev
```

### Database Setup
```bash
cd Backend
python database/init_db.py
python database/add_complete_demo_data.py
```

## Key Features

### Authentication
- Phone-based OTP authentication
- JWT token security
- Automatic token refresh
- User session management

### Data Management
- Real-time data synchronization
- Soft delete pattern
- Comprehensive error handling
- Optimistic UI updates

### AI Integration
- RAG-powered assistant
- Conversation history
- Context-aware responses
- Knowledge base integration

### Weather Integration
- Real-time weather data
- Location detection
- Weather alerts
- 5-day forecasting

## Security Features

- JWT token authentication
- Row Level Security (RLS) ready
- Input validation with Pydantic
- Password hashing with bcrypt
- CORS protection

## Performance Optimizations

- Database indexing for common queries
- Connection pooling
- Response caching
- Optimized API endpoints
- Efficient data loading patterns

## API Response Format

All APIs follow a consistent response format:
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET_KEY` - JWT signing key
- `WEATHER_API` - OpenWeather API key (optional)

## Deployment Notes

- Backend: FastAPI with Uvicorn
- Frontend: React with Vite
- Database: PostgreSQL 16+
- Production: Use proper CORS settings and environment variables

## Troubleshooting

1. **Database Connection Issues**: Check DATABASE_URL in .env file
2. **Authentication Failures**: Verify JWT_SECRET_KEY
3. **CORS Errors**: Ensure frontend URL is in allowed origins
4. **API Timeouts**: Check database connection pool settings

## Next Steps

1. Implement file upload for photos
2. Add push notifications
3. Implement real-time updates with WebSockets
4. Add advanced analytics and reporting
5. Implement multi-language support
6. Add mobile app with React Native
