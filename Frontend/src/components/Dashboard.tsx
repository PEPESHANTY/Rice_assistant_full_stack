import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useApp } from './AppContext';
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle,
  CheckSquare,
  Clock,
  Plus,
  TrendingUp,
  Leaf,
  Calendar,
  BookOpen
} from 'lucide-react';

export function Dashboard() {
  const { user, language, weather, tasks, journalEntries } = useApp();
  const navigate = useNavigate();

  const texts = {
    EN: {
      welcome: 'Welcome back',
      myFarms: 'My Farms & Plots',
      weatherAlerts: 'Weather & Alerts',
      upcomingTasks: 'Upcoming Tasks',
      recentEntries: 'Recent Journal Entries',
      quickActions: 'Quick Actions',
      addEntry: 'Add Journal Entry',
      addTask: 'Add Task',
      askAssistant: 'Ask Assistant',
      viewWeather: 'View Full Weather',
      viewTasks: 'View All Tasks',
      viewJournal: 'View Full Journal',
      noTasks: 'No upcoming tasks',
      noEntries: 'No recent entries',
      temperature: 'Temperature',
      humidity: 'Humidity',
      rainfall: 'Rainfall',
      windSpeed: 'Wind Speed',
      alerts: 'Alerts',
      completed: 'Completed',
      pending: 'Pending',
      overdue: 'Overdue',
      daysAfterSowing: 'days after sowing',
      viewDetails: 'View Details',
      addPlot: 'Add New Plot',
      hectares: 'hectares'
    },
    VI: {
      welcome: 'Chào mừng trở lại',
      myFarms: 'Trang Trại & Lô Đất',
      weatherAlerts: 'Thời Tiết & Cảnh Báo',
      upcomingTasks: 'Công Việc Sắp Tới',
      recentEntries: 'Nhật Ký Gần Đây',
      quickActions: 'Thao Tác Nhanh',
      addEntry: 'Thêm Nhật Ký',
      addTask: 'Thêm Công Việc',
      askAssistant: 'Hỏi Trợ Lý',
      viewWeather: 'Xem Đầy Đủ Thời Tiết',
      viewTasks: 'Xem Tất Cả Công Việc',
      viewJournal: 'Xem Đầy Đủ Nhật Ký',
      noTasks: 'Không có công việc sắp tới',
      noEntries: 'Không có nhật ký gần đây',
      temperature: 'Nhiệt Độ',
      humidity: 'Độ Ẩm',
      rainfall: 'Lượng Mưa',
      windSpeed: 'Tốc Độ Gió',
      alerts: 'Cảnh Báo',
      completed: 'Hoàn Thành',
      pending: 'Đang Chờ',
      overdue: 'Quá Hạn',
      daysAfterSowing: 'ngày sau khi gieo',
      viewDetails: 'Xem Chi Tiết',
      addPlot: 'Thêm Lô Đất Mới',
      hectares: 'héc-ta'
    }
  };

  const t = texts[language];

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const recentEntries = journalEntries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const getTaskStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays <= 3) return 'soon';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'destructive';
      case 'today': return 'default';
      case 'soon': return 'secondary';
      default: return 'outline';
    }
  };

  const getDaysAfterSowing = (sowingDate: string) => {
    const today = new Date();
    const sowing = new Date(sowingDate);
    const diffTime = today.getTime() - sowing.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Add extra padding-bottom on mobile to account for bottom nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.welcome}, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString(language === 'VI' ? 'vi-VN' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              {t.quickActions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/journal')}
                className="flex items-center justify-center space-x-2 h-16"
                variant="outline"
              >
                <Plus className="h-5 w-5" />
                <span>{t.addEntry}</span>
              </Button>
              <Button 
                onClick={() => navigate('/tasks')}
                className="flex items-center justify-center space-x-2 h-16"
                variant="outline"
              >
                <Calendar className="h-5 w-5" />
                <span>{t.addTask}</span>
              </Button>
              <Button 
                onClick={() => navigate('/assistant')}
                className="flex items-center justify-center space-x-2 h-16 bg-green-600 hover:bg-green-700 text-white"
              >
                <BookOpen className="h-5 w-5" />
                <span>{t.askAssistant}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Farms & Plots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {t.myFarms}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.farms.length === 0 ? (
                  <div className="text-center py-8">
                    <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No farms added yet</p>
                    <Button onClick={() => navigate('/profile')}>
                      {t.addPlot}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user?.farms.map(farm => (
                      <div key={farm.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{farm.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {farm.location}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {farm.plots.map(plot => (
                            <div key={plot.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">{plot.name}</h4>
                                <Badge variant="outline">{plot.riceVariety}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {plot.area} {t.hectares} • {plot.soilType}
                              </p>
                              <p className="text-sm text-green-600">
                                {getDaysAfterSowing(plot.sowingDate)} {t.daysAfterSowing}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2" />
                  {t.upcomingTasks}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
                  {t.viewTasks}
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">{t.noTasks}</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingTasks.map(task => {
                      const status = getTaskStatus(task.dueDate);
                      return (
                        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              <Badge variant={getStatusColor(status) as any}>
                                {status === 'overdue' ? t.overdue : 
                                 status === 'today' ? 'Today' :
                                 status === 'soon' ? 'Soon' : t.pending}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Weather & Alerts */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2" />
                  {t.weatherAlerts}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/weather')}>
                  {t.viewWeather}
                </Button>
              </CardHeader>
              <CardContent>
                {weather ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {weather.current.temperature}°C
                      </div>
                      <p className="text-gray-600">{weather.current.condition}</p>
                      <p className="text-sm text-gray-500 mt-1">{weather.location}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                        <span>{weather.current.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <Wind className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{weather.current.windSpeed} km/h</span>
                      </div>
                    </div>

                    {weather.alerts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                          {t.alerts}
                        </h4>
                        {weather.alerts.map((alert, index) => (
                          <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-orange-800">{alert.type}</p>
                            <p className="text-sm text-orange-700">{alert.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Loading weather data...</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Journal Entries */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {t.recentEntries}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/journal')}>
                  {t.viewJournal}
                </Button>
              </CardHeader>
              <CardContent>
                {recentEntries.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">{t.noEntries}</p>
                ) : (
                  <div className="space-y-3">
                    {recentEntries.map(entry => (
                      <div key={entry.id} className="border-l-4 border-green-500 pl-4 py-2">
                        <h4 className="font-medium text-gray-900 mb-1">{entry.title}</h4>
                        <p className="text-sm text-gray-600 mb-1 line-clamp-2">{entry.content}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{entry.type}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}