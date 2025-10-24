import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useApp } from './AppContext';
import { WEATHER_CONFIG } from '../config/weather';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain,
  AlertTriangle,
  Eye,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Navigation as NavigationIcon
} from 'lucide-react';

export function Weather() {
  const { weather, language, refreshWeather, isLoadingWeather } = useApp();
  const [selectedDay, setSelectedDay] = useState(0);

  const handleRefresh = async () => {
    try {
      await refreshWeather();
      toast.success(texts[language].weatherUpdated);
    } catch (error) {
      console.error('Failed to refresh weather:', error);
    }
  };

  const texts = {
    EN: {
      weather: 'Weather & Field Conditions',
      description: 'Monitor weather conditions and get farming alerts',
      currentWeather: 'Current Weather',
      forecast: '5-Day Forecast',
      alerts: 'Weather Alerts',
      temperature: 'Temperature',
      humidity: 'Humidity',
      rainfall: 'Rainfall',
      windSpeed: 'Wind Speed',
      visibility: 'Visibility',
      uvIndex: 'UV Index',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      feelsLike: 'Feels like',
      noAlerts: 'No active weather alerts',
      high: 'High',
      low: 'Low',
      today: 'Today',
      tomorrow: 'Tomorrow',
      goodConditions: 'Good Farming Conditions',
      fairConditions: 'Fair Conditions',
      poorConditions: 'Poor Conditions',
      recommendations: 'Recommendations',
      bestTimeSpray: 'Best time to spray: Early morning (5-8 AM)',
      bestTimeIrrigate: 'Good conditions for irrigation',
      avoidFieldWork: 'Avoid field work during rain',
      mm: 'mm',
      kmh: 'km/h',
      km: 'km',
      day: 'Day',
      additionalInfo: 'Additional Information',
      sunny: 'Sunny',
      partlyCloudy: 'Partly Cloudy',
      cloudy: 'Cloudy',
      lightRain: 'Light Rain',
      rain: 'Rain',
      heavyRain: 'Heavy Rain',
      heavyRainWarning: 'Heavy Rain Warning',
      heavyRainfallExpected: 'Heavy rainfall expected in next 2 days. Consider drainage preparations.',
      lastUpdated: 'Last Updated',
      refreshWeather: 'Refresh Weather',
      useCurrentLocation: 'Use My Location',
      loadingWeather: 'Loading weather data...',
      weatherUpdated: 'Weather updated successfully',
      apiNotConfigured: 'Real-Time Weather Active',
      apiNotConfiguredDesc: 'Using Open-Meteo API - completely free, no API key required! Weather data updates automatically with your location.'
    },
    VI: {
      weather: 'Thời Tiết & Điều Kiện Ruộng',
      description: 'Theo dõi điều kiện thời tiết và nhận cảnh báo nông nghiệp',
      currentWeather: 'Thời Tiết Hiện Tại',
      forecast: 'Dự Báo 5 Ngày',
      alerts: 'Cảnh Báo Thời Tiết',
      temperature: 'Nhiệt Độ',
      humidity: 'Độ Ẩm',
      rainfall: 'Lượng Mưa',
      windSpeed: 'Tốc Độ Gió',
      visibility: 'Tầm Nhìn',
      uvIndex: 'Chỉ Số UV',
      sunrise: 'Mặt Trời Mọc',
      sunset: 'Mặt Trời Lặn',
      feelsLike: 'Cảm giác như',
      noAlerts: 'Không có cảnh báo thời tiết',
      high: 'Cao',
      low: 'Thấp',
      today: 'Hôm nay',
      tomorrow: 'Ngày mai',
      goodConditions: 'Điều Kiện Nông Nghiệp Tốt',
      fairConditions: 'Điều Kiện Khá',
      poorConditions: 'Điều Kiện Kém',
      recommendations: 'Khuyến Nghị',
      bestTimeSpray: 'Thời gian tốt nhất để phun: Sáng sớm (5-8 giờ)',
      bestTimeIrrigate: 'Điều kiện tốt cho tưới nước',
      avoidFieldWork: 'Tránh làm việc ngoài ruộng khi mưa',
      mm: 'mm',
      kmh: 'km/h',
      km: 'km',
      day: 'Ngày',
      additionalInfo: 'Thông Tin Thêm',
      sunny: 'Nắng',
      partlyCloudy: 'Có Mây',
      cloudy: 'U Ám',
      lightRain: 'Mưa Nhẹ',
      rain: 'Mưa',
      heavyRain: 'Mưa To',
      heavyRainWarning: 'Cảnh Báo Mưa Lớn',
      heavyRainfallExpected: 'Dự báo mưa lớn trong 2 ngày tới. Cần chuẩn bị hệ thống thoát nước.',
      lastUpdated: 'Cập Nhật Lần Cuối',
      refreshWeather: 'Làm Mới Thời Tiết',
      useCurrentLocation: 'Dùng Vị Trí Của Tôi',
      loadingWeather: 'Đang tải dữ liệu thời tiết...',
      weatherUpdated: 'Đã cập nhật thời tiết thành công',
      apiNotConfigured: 'Thời Tiết Thực Đã Kích Hoạt',
      apiNotConfiguredDesc: 'Sử dụng API Open-Meteo - hoàn toàn miễn phí, không cần khóa API! Dữ liệu thời tiết tự động cập nhật theo vị trí của bạn.'
    }
  };

  const t = texts[language];

  // Get current date and time based on detected location timezone
  const getCurrentDateTime = () => {
    const now = new Date();
    // Use timezone from weather data (detected from IP location), fallback to UTC if not available
    const timezone = weather?.timezone || 'UTC';
    
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone
    };
    
    const locale = language === 'VI' ? 'vi-VN' : 'en-US';
    const date = now.toLocaleDateString(locale, dateOptions);
    const time = now.toLocaleTimeString(locale, timeOptions);
    
    return { date, time };
  };

  const { date: currentDate, time: currentTime } = getCurrentDateTime();

  const translateWeatherCondition = (condition: string): string => {
    if (language === 'EN') return condition;
    
    const cond = condition.toLowerCase();
    if (cond.includes('sunny') || cond === 'sunny') return t.sunny;
    if (cond.includes('partly cloudy') || cond === 'partly cloudy') return t.partlyCloudy;
    if (cond.includes('cloudy') && !cond.includes('partly')) return t.cloudy;
    if (cond.includes('light rain') || cond === 'light rain') return t.lightRain;
    if (cond.includes('heavy rain') || cond === 'heavy rain') return t.heavyRain;
    if (cond.includes('rain') && !cond.includes('light') && !cond.includes('heavy')) return t.rain;
    
    return condition;
  };

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('sunny') || cond.includes('clear')) return Sun;
    if (cond.includes('rain')) return CloudRain;
    if (cond.includes('cloud')) return Cloud;
    return Sun;
  };

  const getConditionColor = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('sunny') || cond.includes('clear')) return 'text-yellow-600';
    if (cond.includes('rain')) return 'text-blue-600';
    if (cond.includes('cloud')) return 'text-gray-600';
    return 'text-gray-600';
  };

  const getFarmingConditions = () => {
    if (!weather) return { status: 'fair', color: 'yellow' };
    
    const temp = weather.current.temperature;
    const rainfall = weather.current.rainfall;
    const humidity = weather.current.humidity;
    
    if (rainfall > 10 || temp < 15 || temp > 40) {
      return { status: 'poor', color: 'red' };
    } else if (temp >= 20 && temp <= 35 && humidity >= 50 && humidity <= 80 && rainfall === 0) {
      return { status: 'good', color: 'green' };
    } else {
      return { status: 'fair', color: 'yellow' };
    }
  };

  const farmingConditions = getFarmingConditions();

  const getRecommendations = () => {
    if (!weather) return [];
    
    const recommendations = [];
    const conditions = getFarmingConditions();
    
    if (conditions.status === 'good') {
      recommendations.push(t.bestTimeSpray);
      recommendations.push(t.bestTimeIrrigate);
    } else if (conditions.status === 'poor') {
      recommendations.push(t.avoidFieldWork);
    }
    
    return recommendations;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return t.today;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return t.tomorrow;
    } else {
      return date.toLocaleDateString(language === 'VI' ? 'vi-VN' : 'en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (!weather || isLoadingWeather) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Cloud className={`h-16 w-16 text-gray-400 mx-auto mb-4 ${isLoadingWeather ? 'animate-pulse' : ''}`} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.loadingWeather}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Add extra padding-bottom on mobile to account for bottom nav */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.weather}</h1>
            <p className="text-gray-600">{t.description}</p>
          </div>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="icon"
            className="shrink-0 h-10 w-10 touch-target-large"
            disabled={isLoadingWeather}
            title={t.refreshWeather}
          >
            <RefreshCw className={`h-5 w-5 ${isLoadingWeather ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Weather */}
          <div className="lg:col-span-2">
            <Card className="mb-8 overflow-hidden">
              <CardHeader>
                <CardDescription className="space-y-1">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{weather.location}</span>
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{currentDate} • {currentTime}</span>
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  {/* Weather Icon and Temperature */}
                  <div className="flex items-center mb-4">
                    {React.createElement(getWeatherIcon(weather.current.condition), {
                      className: `h-16 w-16 ${getConditionColor(weather.current.condition)} mr-4 flex-shrink-0`
                    })}
                    <div className="flex-1 min-w-0">
                      <div className="text-4xl font-bold text-gray-900">
                        {weather.current.temperature}°C
                      </div>
                      <p className="text-gray-600 truncate">{translateWeatherCondition(weather.current.condition)}</p>
                      <p className="text-sm text-gray-500">
                        {t.feelsLike} {weather.current.temperature + 2}°C
                      </p>
                    </div>
                  </div>
                  
                  {/* Farming Status Label - Centered with animation */}
                  <div 
                    className="flex justify-center mb-6"
                    style={{
                      animation: 'fadeIn 0.5s ease-in-out'
                    }}
                  >
                    <div
                      className="inline-flex items-center justify-center text-white transition-all duration-300"
                      style={{
                        backgroundColor: '#1F2937',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: 'clamp(12px, 2.5vw, 13px)',
                        fontWeight: '500',
                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                        maxWidth: 'calc(100% - 32px)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      role="status"
                      aria-label="Farming conditions status"
                    >
                      {farmingConditions.status === 'good' ? t.goodConditions :
                       farmingConditions.status === 'fair' ? t.fairConditions : t.poorConditions}
                    </div>
                  </div>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">{t.humidity}</p>
                    <p className="font-semibold">{weather.current.humidity}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <CloudRain className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">{t.rainfall}</p>
                    <p className="font-semibold">{weather.current.rainfall} {t.mm}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Wind className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">{t.windSpeed}</p>
                    <p className="font-semibold">{weather.current.windSpeed} {t.kmh}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5-Day Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {t.forecast}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {weather.forecast.map((day, index) => {
                    const WeatherIcon = getWeatherIcon(day.condition);
                    const isSelected = selectedDay === index;
                    
                    return (
                      <Card 
                        key={index} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''
                        }`}
                        onClick={() => setSelectedDay(index)}
                      >
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            {formatDate(day.date)}
                          </p>
                          <WeatherIcon className={`h-8 w-8 mx-auto mb-2 ${getConditionColor(day.condition)}`} />
                          <p className="text-sm text-gray-600 mb-2">{translateWeatherCondition(day.condition)}</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-center space-x-1">
                              <TrendingUp className="h-3 w-3 text-red-500" />
                              <span className="text-sm font-semibold">{day.high}°</span>
                            </div>
                            <div className="flex items-center justify-center space-x-1">
                              <TrendingDown className="h-3 w-3 text-blue-500" />
                              <span className="text-sm text-gray-600">{day.low}°</span>
                            </div>
                            {day.rainfall > 0 && (
                              <div className="flex items-center justify-center space-x-1">
                                <Droplets className="h-3 w-3 text-blue-500" />
                                <span className="text-xs text-blue-600">{day.rainfall}{t.mm}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weather Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {t.alerts}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weather.alerts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">{t.noAlerts}</p>
                ) : (
                  <div className="space-y-3">
                    {weather.alerts.map((alert, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border ${
                          alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                          alert.severity === 'medium' ? 'bg-orange-50 border-orange-200' :
                          'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex items-start">
                          <AlertTriangle className={`h-4 w-4 mt-0.5 mr-2 ${
                            alert.severity === 'high' ? 'text-red-600' :
                            alert.severity === 'medium' ? 'text-orange-600' :
                            'text-yellow-600'
                          }`} />
                          <div>
                            <p className={`font-medium text-sm ${
                              alert.severity === 'high' ? 'text-red-800' :
                              alert.severity === 'medium' ? 'text-orange-800' :
                              'text-yellow-800'
                            }`}>
                              {alert.type === 'Heavy Rain Warning' ? t.heavyRainWarning : alert.type}
                            </p>
                            <p className={`text-sm ${
                              alert.severity === 'high' ? 'text-red-700' :
                              alert.severity === 'medium' ? 'text-orange-700' :
                              'text-yellow-700'
                            }`}>
                              {alert.type === 'Heavy Rain Warning' ? t.heavyRainfallExpected : alert.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="h-5 w-5 mr-2" />
                  {t.recommendations}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecommendations().map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                  {getRecommendations().length === 0 && (
                    <p className="text-gray-500 text-sm">No specific recommendations for current conditions</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t.additionalInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{t.visibility}</span>
                  </div>
                  <span className="font-medium">10 {t.km}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>{t.uvIndex}</span>
                  </div>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>{t.sunrise}</span>
                  <span className="font-medium">6:15 AM</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>{t.sunset}</span>
                  <span className="font-medium">6:45 PM</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}