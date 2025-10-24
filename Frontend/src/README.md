# Rice Farming Assistant Web Application

A comprehensive, bilingual (English ↔ Vietnamese) farming assistant designed specifically for rice farmers in Vietnam. Built with a mobile-first approach and accessibility features to serve farmers of all education levels and ages.

## 🌾 Overview

This application provides rice farmers with a complete digital toolkit including farm management, AI-powered assistance based on IRRI (International Rice Research Institute) expertise, weather monitoring, task management, and a digital farming journal. The app prioritizes ease of use for less educated and elderly farmers through simplified interfaces, larger touch targets, and Vietnamese language support with local conventions.

## ✨ Key Features

### 🔐 User Authentication
- **Phone Number Registration**: Simplified registration using mobile phone numbers (Vietnamese format)
- **Demo Account**: Quick access with demo credentials for testing
- **Secure Session Management**: Mock authentication system with persistent sessions

### 🚜 Farm & Plot Management
- **Multiple Farms**: Create and manage multiple farm locations
- **Plot Tracking**: Organize farms into individual plots with detailed information
- **Vietnamese Location Integration**: 
  - Province and district dropdowns with Vietnamese names
  - Area measurements in Vietnamese units (sào, công, hecta)
  - Automatic unit conversion
- **Crop Information**: Track crop varieties, planting dates, and growth stages

### 🤖 AI Assistant with IRRI Knowledge Base
- **25 Expert Questions**: Comprehensive coverage of rice farming topics from IRRI
- **8 Demo Conversation Flows**: Practical farming scenarios with context-aware responses
  - Alternate Wetting and Drying (AWD) management
  - Pest identification and management (Brown planthoppers, stem borers)
  - Nutrient deficiency diagnosis
  - Fertilizer recommendations
  - Harvest timing optimization
- **Multi-modal Input**: 
  - Text queries with conversational interface
  - Photo analysis for pest/disease identification (simulated)
  - Voice input support (future enhancement)
- **Progressive Disclosure UX**: Topic cards for easy navigation of expert questions
- **Fallback System**: Helpful handbook responses when questions aren't in the knowledge base

### ☀️ Weather Monitoring
- **Real-time Weather Data**: Powered by Open-Meteo API (no API key required)
- **IP Geolocation**: Automatic location detection using ipapi.co
- **7-Day Forecast**: Detailed daily weather predictions
- **Weather Alerts**: Notifications for adverse conditions
- **Vietnamese Time Display**: Local date/time formatting
- **Responsive Weather Icons**: Visual indicators for all weather conditions

### 📔 Digital Journal
- **Activity Logging**: Record daily farming activities with photos
- **Rich Media Support**: Attach images to journal entries
- **Categorized Entries**: Organize by activity type (planting, fertilizing, pest control, etc.)
- **Timeline View**: Chronological display of farming history
- **Plot Association**: Link entries to specific plots

### ✅ Task Management
- **Automated Crop Calendar**: Pre-populated tasks based on planting dates
- **Custom Tasks**: Create and manage custom farming tasks
- **Priority Levels**: High, medium, low priority assignments
- **Status Tracking**: Mark tasks as pending, in-progress, or completed
- **Due Date Reminders**: Visual indicators for upcoming and overdue tasks

### 🌍 Bilingual Support
- **English ↔ Vietnamese**: Full language switching capability
- **Vietnamese Default**: App loads in Vietnamese by default
- **Culturally Adapted Content**: Localized units, formats, and terminology
- **Persistent Language Preference**: User's language choice is remembered

### ♿ Accessibility Features
- **Font Scaling System**: Global text size adjustment (small, medium, large, extra-large)
- **Simplified Onboarding**: Streamlined registration for less tech-savvy users
- **Larger Touch Targets**: Mobile-optimized button and input sizes
- **High Contrast**: Clear visual hierarchy for better readability
- **Offline-First Design**: Works with mock data when connectivity is limited

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4.0
- **Routing**: React Router v6
- **State Management**: Context API with React hooks
- **UI Components**: Shadcn/ui component library
- **Icons**: Lucide React
- **Weather API**: Open-Meteo (free, no API key required)
- **Geolocation**: ipapi.co (free tier)
- **Date Handling**: date-fns
- **Build Tool**: Vite

## 📱 Mobile-First Design

The application is optimized for mobile devices with:
- Responsive layouts that adapt from mobile to desktop
- Touch-friendly interface elements (minimum 44x44px targets)
- Simplified navigation with bottom tab bar
- Reduced cognitive load through progressive disclosure
- Optimized for slow network connections
- Works with mock data for offline demonstration

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Demo Account

Use these credentials to test the application:
- **Phone**: 0912345678
- **Password**: demo123

## 📂 Project Structure

```
├── components/              # React components
│   ├── AppContext.tsx      # Global state management
│   ├── Assistant.tsx       # AI assistant interface
│   ├── AuthPage.tsx        # Login/registration
│   ├── Dashboard.tsx       # Main dashboard view
│   ├── Journal.tsx         # Digital farming journal
│   ├── Profile.tsx         # User profile and settings
│   ├── Tasks.tsx           # Task management
│   ├── Weather.tsx         # Weather monitoring
│   ├── SuggestedQuestions.tsx  # IRRI expert questions UI
│   └── ui/                 # Shadcn/ui components
│
├── data/                   # Mock data and knowledge base
│   ├── AIRRVie_QA.ts       # 25 IRRI expert questions
│   ├── irriChatFlows.ts    # 8 demo conversation flows
│   ├── imageAnalysisResponses.ts  # Simulated image analysis
│   └── vietnamLocations.ts # Province/district data
│
├── config/                 # Configuration files
│   └── weather.ts          # Weather API settings
│
├── guidelines/             # Development guidelines
│   ├── Guidelines.md
│   ├── Farm-Location-Quick-Guide.md
│   ├── Responsive-Scaling-Guide.md
│   └── Farm-Location-Selector.md
│
├── styles/                 # Global styles
│   └── globals.css         # Tailwind config and custom styles
│
├── utils/                  # Utility functions
│
└── App.tsx                 # Main application component
```

## 🎯 Core Features Explained

### IRRI Knowledge Base System

The AI Assistant uses a hybrid approach combining:

1. **Expert Questions (25 topics)**:
   - AWD (Alternate Wetting and Drying)
   - Nutrient management (N, P, K, Zn)
   - Pest and disease identification
   - Fertilizer recommendations
   - Harvest timing
   - Water management
   - Seedling care
   - And more...

2. **Demo Conversation Flows (8 scenarios)**:
   - Contextual, multi-turn conversations
   - Practical farming scenarios
   - Trigger when user input matches specific patterns
   - Provide step-by-step guidance

3. **Fallback Responses**:
   - When questions aren't covered by expert topics
   - General guidance with IRRI methodology references
   - Encourages farmers to consult local agricultural extension

### Weather System Architecture

- **API**: Open-Meteo (free, unlimited requests, no API key)
- **Location Detection**: Automatic via IP geolocation (ipapi.co)
- **Data Points**:
  - Current temperature and conditions
  - 7-day forecast with high/low temps
  - Precipitation probability
  - Wind speed and humidity
  - Weather code mapping to icons
- **Error Handling**: Graceful fallbacks for network issues
- **Caching**: Local storage of recent weather data

### Font Scaling System

Global typography scaling accessible from Profile page:
- **Small**: 90% base size
- **Medium**: 100% base size (default)
- **Large**: 110% base size
- **Extra Large**: 125% base size

Applied via CSS custom property `--font-scale` affecting all text elements.

### Vietnamese Localization

- **Provinces & Districts**: Complete dataset of Vietnamese administrative divisions
- **Units**: Sào (360m²), công (1000m²), hecta (10,000m²)
- **Date Formats**: Vietnamese conventions (DD/MM/YYYY)
- **Lunar Calendar**: Integration for traditional farming calendar
- **Language Toggle**: Persistent across sessions

## 🔧 Configuration

### Weather API Configuration

Edit `/config/weather.ts` to customize:
```typescript
export const WEATHER_CONFIG = {
  apiUrl: 'https://api.open-meteo.com/v1/forecast',
  geocodingUrl: 'https://geocoding-api.open-meteo.com/v1/search',
  ipLocationUrl: 'https://ipapi.co/json',
  // ... other settings
};
```

### Language Settings

Default language is set to Vietnamese in `/components/AppContext.tsx`:
```typescript
const [language, setLanguage] = useState<'en' | 'vi'>('vi');
```

## 📖 Documentation Files

The project includes comprehensive documentation:

- **QUICK_START_GUIDE.md** - Fast setup instructions
- **DEMO_WALKTHROUGH.md** - Feature demonstrations
- **SUGGESTED_QUESTIONS_IMPLEMENTATION.md** - IRRI questions architecture
- **OPEN_METEO_MIGRATION.md** - Weather system details
- **IP_GEOLOCATION_IMPLEMENTATION.md** - Location detection
- **CHATGPT_SUPABASE_REMOVED.md** - API migration notes
- **DEPLOYMENT_READY.md** - Production deployment guide

## 🎨 Design Philosophy

1. **Farmer-First**: Designed for actual rice farmers, not tech enthusiasts
2. **Mobile-Optimized**: Most farmers access via smartphones
3. **Culturally Appropriate**: Vietnamese language, units, and conventions
4. **Accessible**: Works for elderly farmers and those with limited education
5. **Practical**: Real farming knowledge from IRRI research
6. **Offline-Capable**: Functions with mock data when network is unavailable

## 🧪 Testing

The application includes:
- Demo conversation flows for testing AI responses
- Mock weather data for offline testing
- Sample journal entries and tasks
- Pre-populated farm and plot data

Test the AI assistant by asking:
- "When should I apply AWD?"
- "I see brown insects on my rice"
- "My rice leaves are turning yellow"
- "How do I know when to harvest?"

## 🚀 Deployment

The application is ready for deployment to:
- **Vercel** (recommended for React apps)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `/dist` folder.

## 🔒 Privacy & Data

- **No External Database**: All data stored locally in browser
- **No User Tracking**: No analytics or tracking scripts
- **API Calls**: Only to Open-Meteo (weather) and ipapi.co (location)
- **Mock Authentication**: For demonstration purposes only
- **Not for Production**: This is a prototype - do not collect real PII

## ⚠️ Important Notes

- This is a **demonstration/prototype** application using mock data
- **Not suitable** for production use without proper backend implementation
- Weather data requires internet connectivity
- Location detection may not work in all environments
- IRRI knowledge base is simplified - real agricultural decisions should involve local experts

## 🤝 Contributing

This is a demonstration project. For improvements:
1. Review the guidelines in `/guidelines/`
2. Maintain mobile-first approach
3. Preserve Vietnamese localization
4. Test on mobile devices
5. Keep accessibility in mind

## 📄 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

- **IRRI (International Rice Research Institute)** - Agricultural knowledge base
- **Open-Meteo** - Free weather API
- **Shadcn/ui** - UI component library
- **Lucide** - Icon library
- **Vietnamese Farmers** - Inspiration and user requirements

## 📞 Support

For questions about rice farming practices, consult:
- Local agricultural extension services
- IRRI knowledge products: www.irri.org
- Vietnamese Ministry of Agriculture

For technical issues, refer to the documentation files in the project root.

---

**Built with ❤️ for Vietnamese rice farmers**

*Last Updated: October 2025*
