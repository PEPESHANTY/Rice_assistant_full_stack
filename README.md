# AIRRVie - Rice Farming Assistant

A full-stack agricultural assistant application designed specifically for rice farmers in Vietnam. AIRRVie provides comprehensive farm management, task tracking, weather monitoring, and AI-powered assistance to help farmers optimize their rice cultivation practices.

## 🌾 Overview

AIRRVie is a bilingual (Vietnamese/English) web application that helps rice farmers manage their farms more efficiently through:

- **Farm & Plot Management**: Track multiple farms and plots with detailed agricultural data
- **Task Management**: Schedule and monitor farming activities with reminders
- **Digital Journal**: Record daily farming activities with photo and audio support
- **Weather Integration**: Get location-specific weather forecasts and alerts
- **AI Assistant**: Get expert advice on rice cultivation practices
- **Multi-language Support**: Full Vietnamese and English interface

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login with phone/email and password
- **Farm Management**: Create and manage multiple farms with location data
- **Plot Tracking**: Detailed plot information including soil type, variety, planting dates
- **Task Scheduling**: Comprehensive task management with priorities and reminders
- **Digital Journal**: Activity logging with multimedia support
- **Weather Forecasts**: Location-based weather data integration
- **AI Chat Assistant**: Context-aware farming advice

### Technical Features
- **Responsive Design**: Mobile-first UI with accessibility features
- **File Upload**: Support for images and audio recordings
- **Real-time Updates**: Live data synchronization
- **Multi-language**: Full Vietnamese and English support
- **Accessibility**: Font scaling and screen reader compatibility

## 🛠 Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL 16
- **Authentication**: JWT with bcrypt password hashing
- **File Storage**: Local file system with S3-ready architecture
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + custom components
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API

### Database Schema
The application uses a comprehensive PostgreSQL schema with:
- User management with phone/email authentication
- Farm and plot hierarchy
- Task management system
- Journal entries with multimedia support
- Weather data caching
- Conversation history for AI assistant
- Knowledge base for RAG (Retrieval Augmented Generation)

## 📁 Project Structure

```
APP_20/
├── Backend/                 # FastAPI backend
│   ├── api/                # API route handlers
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── farms.py        # Farm management
│   │   ├── tasks.py        # Task management
│   │   ├── journal.py      # Journal entries
│   │   ├── weather.py      # Weather API integration
│   │   ├── assistant.py    # AI chat assistant
│   │   └── uploads.py      # File upload handling
│   ├── database/           # Database configuration and setup
│   ├── models/             # Pydantic models and schemas
│   ├── utils/              # Utility functions
│   ├── uploads/            # File upload storage
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── schema.sql          # Database schema
├── Frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # Reusable UI components
│   │   │   ├── AuthPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Journal.tsx
│   │   │   ├── Tasks.tsx
│   │   │   ├── Weather.tsx
│   │   │   └── Assistant.tsx
│   │   ├── services/       # API service layer
│   │   ├── data/           # Static data and configurations
│   │   ├── styles/         # CSS and styling
│   │   └── utils/          # Utility functions
│   ├── package.json        # Node.js dependencies
│   └── vite.config.ts      # Vite configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 16
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd APP_20
   ```

2. **Set up Python environment**
   ```bash
   cd Backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

4. **Set up database**
   ```bash
   # Create database using schema.sql
   psql -U postgres -f schema.sql
   
   # Or use the setup script
   python database/setup_database.py
   ```

5. **Run the backend server**
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/api/docs`
   - Health Check: `http://localhost:8000/health`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend API URL
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### Demo Access
The application comes with demo data:
- **Email**: `demo@airrvie.app`
- **Password**: `demo123`

## 📚 API Documentation

### Available Endpoints

- **Authentication**: `/api/auth/*`
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `GET /api/auth/me` - Get current user

- **Farms**: `/api/farms/*`
  - `GET /api/farms` - List user farms
  - `POST /api/farms` - Create new farm
  - `PUT /api/farms/{id}` - Update farm
  - `DELETE /api/farms/{id}` - Delete farm

- **Tasks**: `/api/tasks/*`
  - `GET /api/tasks` - List user tasks
  - `POST /api/tasks` - Create new task
  - `PUT /api/tasks/{id}` - Update task
  - `DELETE /api/tasks/{id}` - Delete task

- **Journal**: `/api/journal/*`
  - `GET /api/journal` - List journal entries
  - `POST /api/journal` - Create journal entry
  - `POST /api/journal/upload` - Upload journal media

- **Weather**: `/api/weather/*`
  - `GET /api/weather/forecast` - Get weather forecast
  - `GET /api/weather/history` - Get weather history

- **Assistant**: `/api/conversations/*`
  - `POST /api/conversations` - Start new conversation
  - `POST /api/conversations/{id}/messages` - Send message

## 🗃 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **core.user**: User accounts with authentication
- **core.farm**: Farm information and locations
- **core.plot**: Individual rice plots with agricultural details
- **core.task**: Farming tasks and schedules
- **core.journal_entry**: Activity logs with multimedia
- **core.weather_daily**: Cached weather data
- **core.conversation**: AI assistant conversations
- **core.message**: Conversation messages
- **core.knowledge_chunk**: RAG knowledge base

## 🎯 Key Features in Detail

### Farm Management
- Create multiple farms with location data (province, district)
- Track individual plots with area, soil type, rice variety
- Monitor planting and harvest dates
- Store plot-specific notes and photos

### Task System
- Create tasks with priorities (low, medium, high)
- Set due dates and reminders
- Track task status (pending, in_progress, done)
- Categorize tasks by type (planting, weeding, fertilizer, etc.)

### Digital Journal
- Record daily farming activities
- Support for photos and audio recordings
- Categorize entries by activity type
- Search and filter journal history

### Weather Integration
- Location-based weather forecasts
- Historical weather data
- Weather alerts and recommendations
- Plot-specific weather caching

### AI Assistant
- Context-aware farming advice
- Integration with farming knowledge base
- Conversation history
- Multi-language support (Vietnamese/English)

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd Backend
python -m pytest

# Frontend tests  
cd Frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd Frontend
npm run build

# Backend deployment
cd Backend
# Use production WSGI server like uvicorn with --reload=false
```

### Code Style
- Backend: Follow PEP 8 with Black formatter
- Frontend: ESLint and Prettier configuration
- TypeScript: Strict type checking enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- International Rice Research Institute (IRRI) for agricultural knowledge
- Vietnam Ministry of Agriculture for local farming practices
- Open-source community for the amazing tools and libraries

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the API documentation at `/api/docs`

---

**AIRRVie** - Empowering rice farmers with technology 🌾
