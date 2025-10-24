/**
 * ========================================
 * 🌦️ WEATHER API CONFIGURATION
 * ========================================
 * 
 * ✨ GOOD NEWS! Using Open-Meteo API
 * 
 * ✅ NO API KEY REQUIRED!
 * ✅ COMPLETELY FREE!
 * ✅ NO SIGNUP NEEDED!
 * ✅ UNLIMITED REQUESTS (fair use)
 * ✅ WORKS IMMEDIATELY!
 * 
 * FEATURES:
 * ✅ Real-time weather for user's location
 * ✅ 7-day forecast with hourly data
 * ✅ Weather alerts based on conditions
 * ✅ Automatic location detection (GPS)
 * ✅ Manual refresh button
 * ✅ Bilingual (Vietnamese/English)
 * 
 * ABOUT OPEN-METEO:
 * - Open-source weather API
 * - High-quality data from national weather services
 * - No rate limits for non-commercial use
 * - Privacy-friendly (no tracking)
 * - Website: https://open-meteo.com
 * 
 * ALTERNATIVE APIs (if you prefer):
 * - WeatherAPI.com (1M calls/month free)
 * - Tomorrow.io (500 calls/day free)
 * - OpenWeatherMap (when signup works)
 * 
 * See WEATHER_API_SETUP.md for more details.
 * ========================================
 */

export const WEATHER_CONFIG = {
  // Weather API provider: 'open-meteo' (default) or 'openweathermap'
  PROVIDER: 'open-meteo' as 'open-meteo' | 'openweathermap',
  
  // OpenWeatherMap API key (only needed if PROVIDER is 'openweathermap')
  OPENWEATHER_API_KEY: 'YOUR_API_KEY_HERE',
  
  // Default location (An Giang Province, Mekong Delta, Vietnam)
  DEFAULT_LOCATION: {
    latitude: 10.0452,
    longitude: 105.4340,
    name: 'An Giang'
  },
  
  // API endpoints
  ENDPOINTS: {
    // Open-Meteo (no API key needed)
    OPEN_METEO: {
      FORECAST: 'https://api.open-meteo.com/v1/forecast',
      GEOCODING: 'https://geocoding-api.open-meteo.com/v1/reverse'
    },
    // OpenWeatherMap (requires API key)
    OPENWEATHER: {
      CURRENT: 'https://api.openweathermap.org/data/2.5/weather',
      FORECAST: 'https://api.openweathermap.org/data/2.5/forecast'
    }
  },
  
  // Check if API is configured
  isConfigured(): boolean {
    // Open-Meteo works without configuration
    if (this.PROVIDER === 'open-meteo') {
      return true;
    }
    // OpenWeatherMap requires API key
    return this.OPENWEATHER_API_KEY !== 'YOUR_API_KEY_HERE' && this.OPENWEATHER_API_KEY.length > 0;
  }
};
