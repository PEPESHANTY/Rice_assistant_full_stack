import os
import httpx
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import asyncpg

from database.config import get_database
from api.auth import get_current_user

router = APIRouter(prefix="/api", tags=["weather"])

# Pydantic models
class WeatherData(BaseModel):
    location: str
    current: dict
    forecast: List[dict]
    alerts: List[dict]

async def get_location_from_coordinates(lat: float, lon: float) -> str:
    """Get proper location name from coordinates using OpenWeather reverse geocoding"""
    try:
        api_key = os.getenv("WEATHER_API")
        if not api_key:
            return f"Location ({lat:.4f}, {lon:.4f})"
        
        # Use OpenWeather Geocoding API for reverse geocoding
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={api_key}"
            )
            if response.status_code == 200:
                data = response.json()
                if data and len(data) > 0:
                    location = data[0]
                    name = location.get('name', '')
                    country = location.get('country', '')
                    state = location.get('state', '')
                    
                    # Build location name with available information
                    if name and country:
                        if state:
                            return f"{name}, {state}, {country}"
                        else:
                            return f"{name}, {country}"
                    elif name:
                        return name
                    elif country:
                        return country
        
        # Fallback to coordinates if reverse geocoding fails
        return f"Location ({lat:.4f}, {lon:.4f})"
        
    except Exception:
        return f"Location ({lat:.4f}, {lon:.4f})"

async def get_location_from_ip(request: Request) -> tuple[float, float, str]:
    """Get location coordinates and city name from client IP address"""
    try:
        # Get client IP from request
        client_ip = request.client.host
        
        # For local development, use a fallback location (Mekong Delta, Vietnam)
        if client_ip in ['127.0.0.1', 'localhost']:
            lat, lon = 10.0, 106.0
            location_name = await get_location_from_coordinates(lat, lon)
            return lat, lon, location_name
        
        # Use ipapi.co service to get location from IP
        async with httpx.AsyncClient() as client:
            response = await client.get(f"http://ipapi.co/{client_ip}/json/")
            if response.status_code == 200:
                data = response.json()
                lat = data.get('latitude', 10.0)
                lon = data.get('longitude', 106.0)
                location_name = await get_location_from_coordinates(lat, lon)
                return lat, lon, location_name
        
        # Fallback to default location if IP lookup fails
        lat, lon = 10.0, 106.0
        location_name = await get_location_from_coordinates(lat, lon)
        return lat, lon, location_name
        
    except Exception:
        # Fallback to default location on any error
        lat, lon = 10.0, 106.0
        location_name = await get_location_from_coordinates(lat, lon)
        return lat, lon, location_name

def get_weather_condition(weather_id: int) -> str:
    """Convert OpenWeather weather ID to condition string"""
    if weather_id < 300:
        return "Thunderstorm"
    elif weather_id < 400:
        return "Drizzle"
    elif weather_id < 600:
        return "Rain"
    elif weather_id < 700:
        return "Snow"
    elif weather_id < 800:
        return "Atmosphere"
    elif weather_id == 800:
        return "Clear"
    elif weather_id < 900:
        return "Clouds"
    else:
        return "Unknown"

async def fetch_openweather_data(lat: float = 10.0, lon: float = 106.0):
    """Fetch real-time weather data from OpenWeather API"""
    api_key = os.getenv("WEATHER_API")
    if not api_key:
        raise HTTPException(status_code=500, detail="Weather API key not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            # Current weather
            current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
            current_response = await client.get(current_url)
            current_response.raise_for_status()
            current_data = current_response.json()
            
            # 5-day forecast
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"
            forecast_response = await client.get(forecast_url)
            forecast_response.raise_for_status()
            forecast_data = forecast_response.json()
            
            return current_data, forecast_data
            
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Weather API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def process_weather_data(current_data: dict, forecast_data: dict, location_name: str) -> dict:
    """Process OpenWeather data into our application format"""
    
    # Process current weather
    current_weather = {
        "temperature": round(current_data["main"]["temp"]),
        "humidity": current_data["main"]["humidity"],
        "rainfall": current_data.get("rain", {}).get("1h", 0) if current_data.get("rain") else 0,
        "windSpeed": round(current_data["wind"]["speed"] * 3.6),  # Convert m/s to km/h
        "condition": get_weather_condition(current_data["weather"][0]["id"])
    }
    
    # Process forecast
    forecast_days = {}
    for item in forecast_data["list"]:
        date = datetime.fromtimestamp(item["dt"]).strftime("%Y-%m-%d")
        if date not in forecast_days:
            forecast_days[date] = {
                "temps": [],
                "rainfall": 0,
                "conditions": []
            }
        
        forecast_days[date]["temps"].append(item["main"]["temp"])
        forecast_days[date]["rainfall"] += item.get("rain", {}).get("3h", 0) if item.get("rain") else 0
        forecast_days[date]["conditions"].append(get_weather_condition(item["weather"][0]["id"]))
    
    # Format forecast for 5 days
    forecast = []
    today = datetime.now().date()
    for i in range(5):
        date = (today + timedelta(days=i)).strftime("%Y-%m-%d")
        if date in forecast_days:
            day_data = forecast_days[date]
            # Get most common condition
            condition_counts = {}
            for cond in day_data["conditions"]:
                condition_counts[cond] = condition_counts.get(cond, 0) + 1
            most_common_condition = max(condition_counts.items(), key=lambda x: x[1])[0]
            
            forecast.append({
                "date": date,
                "high": round(max(day_data["temps"])),
                "low": round(min(day_data["temps"])),
                "rainfall": round(day_data["rainfall"], 1),
                "condition": most_common_condition
            })
        else:
            # Fallback data if forecast not available
            forecast.append({
                "date": date,
                "high": current_weather["temperature"] + 2,
                "low": current_weather["temperature"] - 4,
                "rainfall": 0,
                "condition": current_weather["condition"]
            })
    
    # Generate alerts based on weather conditions
    alerts = []
    if current_weather["rainfall"] > 20:
        alerts.append({
            "type": "Heavy Rain Warning",
            "message": "Heavy rainfall detected. Consider drainage preparations.",
            "severity": "high" if current_weather["rainfall"] > 50 else "medium"
        })
    
    if current_weather["windSpeed"] > 30:
        alerts.append({
            "type": "Strong Wind Warning",
            "message": "Strong winds detected. Secure equipment and structures.",
            "severity": "medium"
        })
    
    if current_weather["temperature"] > 35:
        alerts.append({
            "type": "Heat Warning",
            "message": "High temperatures detected. Ensure proper irrigation.",
            "severity": "medium"
        })
    
    return {
        "location": location_name,
        "current": current_weather,
        "forecast": forecast,
        "alerts": alerts
    }

@router.get("/weather", response_model=WeatherData)
async def get_weather(request: Request, lat: float = None, lon: float = None, city: str = None):
    """Get real-time weather data from OpenWeather API"""
    try:
        # Use provided coordinates or city name, otherwise detect from IP
        if lat is not None and lon is not None:
            # Use provided coordinates with proper location name
            location_name = await get_location_from_coordinates(lat, lon)
        elif city:
            # Use provided city name (you could add geocoding here)
            location_name = city
            # For now, fallback to IP detection for city lookup
            lat, lon, location_name = await get_location_from_ip(request)
        else:
            # Detect location from IP
            lat, lon, location_name = await get_location_from_ip(request)
        
        # Fetch weather data for the location
        current_data, forecast_data = await fetch_openweather_data(lat, lon)
        weather_data = process_weather_data(current_data, forecast_data, location_name)
        return weather_data
    except HTTPException:
        raise
    except Exception as e:
        # Fallback to mock data if API fails
        return {
            "location": "Mekong Delta, Vietnam",
            "current": {
                "temperature": 28,
                "humidity": 78,
                "rainfall": 0,
                "windSpeed": 12,
                "condition": "Partly Cloudy"
            },
            "forecast": [
                {"date": (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d"), 
                 "high": 32, "low": 24, "rainfall": 0, "condition": "Sunny"}
                for i in range(5)
            ],
            "alerts": []
        }

@router.get("/weather/plot/{plot_id}")
async def get_weather_for_plot(plot_id: str, current_user_id: str = Depends(get_current_user)):
    """Get weather data for a specific plot's location"""
    conn = await get_database()
    try:
        # Get plot location information
        plot = await conn.fetchrow('''
            SELECT p.id, f.province, f.district
            FROM core.plot p
            JOIN core.farm f ON p.farm_id = f.id
            WHERE p.id = $1 AND f.user_id = $2 AND p.deleted_at IS NULL AND f.deleted_at IS NULL
        ''', plot_id, current_user_id)
        
        if not plot:
            raise HTTPException(status_code=404, detail="Plot not found")
        
        # For now, use a simple mapping of Vietnamese provinces to coordinates
        # In a real implementation, you'd use a geocoding service
        province_coords = {
            "An Giang": (10.5, 105.0),
            "Đồng Tháp": (10.7, 105.8),
            "Long An": (10.7, 106.2),
            "Tiền Giang": (10.4, 106.2),
            "Vĩnh Long": (10.3, 106.0),
            "Cần Thơ": (10.0, 105.8),
            "Hậu Giang": (9.8, 105.8),
            "Sóc Trăng": (9.6, 105.9),
            "Bạc Liêu": (9.3, 105.7),
            "Cà Mau": (9.2, 105.2)
        }
        
        province = plot["province"]
        lat, lon = province_coords.get(province, (10.0, 106.0))
        
        # Fetch weather data
        current_data, forecast_data = await fetch_openweather_data(lat, lon)
        location_name = f"{plot['district']}, {province}"
        weather_data = process_weather_data(current_data, forecast_data, location_name)
        
        return weather_data
        
    except HTTPException:
        raise
    except Exception as e:
        # Fallback to general weather data
        return await get_weather(None)
    finally:
        await conn.close()

@router.get("/weather/forecast")
async def get_weather_forecast(request: Request, days: int = 5):
    """Get extended weather forecast"""
    try:
        # Detect location from IP
        lat, lon, location_name = await get_location_from_ip(request)
        
        # Fetch weather data
        current_data, forecast_data = await fetch_openweather_data(lat, lon)
        weather_data = process_weather_data(current_data, forecast_data, location_name)
        
        # Limit forecast to requested number of days
        if days < len(weather_data["forecast"]):
            weather_data["forecast"] = weather_data["forecast"][:days]
        
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get weather forecast: {str(e)}")
