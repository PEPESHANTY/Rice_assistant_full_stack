import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/globals.css';
import { Toaster } from './components/ui/sonner';

// Welcome banner
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          🌾 Rice Farming Assistant - v1.0                    ║
║                                                               ║
║  Features:                                                    ║
║  ✅ AI Assistant with IRRI Expert Data                       ║
║  ✅ Real-Time Weather (Open-Meteo API - works now!)          ║
║  ✅ Automatic Location Detection (GPS)                       ║
║  ✅ Digital Journal & Task Management                         ║
║  ✅ Bilingual: Vietnamese ↔ English                          ║
║                                                               ║
║  ✨ NEW: Weather works immediately - no API key needed!      ║
║  📖 Learn more: QUICK_WEATHER_SETUP.md                       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
);
