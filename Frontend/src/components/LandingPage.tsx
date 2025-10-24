import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useApp } from './AppContext';
import { 
  Cloud, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Mic, 
  Camera, 
  Globe,
  Sprout,
  CloudRain,
  CheckSquare,
  Megaphone
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const { user, language, toggleLanguage } = useApp();

  const texts = {
    EN: {
      title: 'Smart Rice Farming Assistant',
      askAssistant: 'Ask the Assistant',
      assistantSubtitle: 'Instant help with your farming questions — no login needed.',
      tryAssistant: 'Try the Assistant',
      signUpLater: 'You can sign up later to save your chats and data.',
      textInput: 'Text',
      voiceInput: 'Voice',
      imageInput: 'Image',
      getStarted: 'Get Started',
      featuresTitle: 'What You Can Do in FarmAssist',
      featuresSubtitle: 'Explore tools that make your daily farming activities easier and smarter.',
      smartAssistant: 'AI Assistant',
      smartAssistantDesc: 'Ask questions via text, voice, or image',
      weatherTracking: 'Weather Forecast',
      weatherTrackingDesc: 'Get daily and seasonal updates.',
      taskManagement: 'Tasks & Journal',
      taskManagementDesc: 'Track and plan your farming work.',
      digitalAdvisory: 'Advisories',
      digitalAdvisoryDesc: 'Receive expert alerts and tips.'
    },
    VI: {
      title: 'Trợ Lý Thông Minh Trồng Lúa',
      askAssistant: 'Hỏi Trợ Lý',
      assistantSubtitle: 'Trợ giúp tức thì cho câu hỏi nông nghiệp — không cần đăng nhập.',
      tryAssistant: 'Thử Trợ Lý',
      signUpLater: 'Bạn có thể đăng ký sau để lưu cuộc trò chuyện và dữ liệu.',
      textInput: 'Văn bản',
      voiceInput: 'Giọng nói',
      imageInput: 'Hình ảnh',
      getStarted: 'Bắt Đầu',
      featuresTitle: 'Bạn Có Thể Làm Gì Trong FarmAssist',
      featuresSubtitle: 'Khám phá các công cụ giúp hoạt động nông nghiệp hàng ngày của bạn dễ dàng và thông minh hơn.',
      smartAssistant: 'Trợ Lý AI',
      smartAssistantDesc: 'Hỏi câu hỏi qua văn bản, giọng nói hoặc hình ảnh',
      weatherTracking: 'Dự Báo Thời Tiết',
      weatherTrackingDesc: 'Nhận cập nhật hàng ngày và theo mùa.',
      taskManagement: 'Công Việc & Nhật Ký',
      taskManagementDesc: 'Theo dõi và lập kế hoạch công việc nông trại.',
      digitalAdvisory: 'Tư Vấn',
      digitalAdvisoryDesc: 'Nhận cảnh báo và mẹo từ chuyên gia.'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-xl font-semibold text-gray-900">FarmAssist</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-1"
              >
                <Globe className="h-4 w-4" />
                <span>{language === 'EN' ? 'VI' : 'EN'}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section (Top Fold — Features Beside Hero Text) */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: App Title & CTA */}
            <div className="lg:pt-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">
                {t.title}
              </h1>

              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 px-8 py-3"
                onClick={() => navigate('/auth')}
              >
                {t.getStarted}
              </Button>
            </div>

            {/* Right Column: Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* AI Assistant Card */}
              <Card className="bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer" onClick={() => user ? navigate('/assistant') : navigate('/assistant?guest=true')}>
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">💬 {t.smartAssistant}</h3>
                  <p className="text-sm text-gray-600">{t.smartAssistantDesc}</p>
                </CardContent>
              </Card>

              {/* Weather Forecast Card */}
              <Card className="bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer" onClick={() => user ? navigate('/weather') : navigate('/auth')}>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Cloud className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">🌦️ {t.weatherTracking}</h3>
                  <p className="text-sm text-gray-600">{t.weatherTrackingDesc}</p>
                </CardContent>
              </Card>

              {/* Tasks & Journal Card */}
              <Card className="bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer" onClick={() => user ? navigate('/tasks') : navigate('/auth')}>
                <CardContent className="p-6 text-center">
                  <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <CheckSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">📋 {t.taskManagement}</h3>
                  <p className="text-sm text-gray-600">{t.taskManagementDesc}</p>
                </CardContent>
              </Card>

              {/* Advisories Card */}
              <Card className="bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer" onClick={() => user ? navigate('/assistant') : navigate('/assistant?guest=true')}>
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Megaphone className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">📢 {t.digitalAdvisory}</h3>
                  <p className="text-sm text-gray-600">{t.digitalAdvisoryDesc}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>



      {/* AI Assistant Section - Updated Logic & Layout */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.askAssistant}</h2>
              <p className="text-xl text-gray-600">
                {t.assistantSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Button 
                variant="outline" 
                className="flex flex-col items-center space-y-2 py-6 h-auto"
                onClick={() => navigate('/assistant?guest=true')}
              >
                <MessageSquare className="h-8 w-8" />
                <span className="font-medium">{t.textInput}</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center space-y-2 py-6 h-auto"
                onClick={() => navigate('/assistant?guest=true')}
              >
                <Mic className="h-8 w-8" />
                <span className="font-medium">{t.voiceInput}</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center space-y-2 py-6 h-auto"
                onClick={() => navigate('/assistant?guest=true')}
              >
                <Camera className="h-8 w-8" />
                <span className="font-medium">{t.imageInput}</span>
              </Button>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 active:bg-green-800 mb-4 w-full sm:w-auto"
                style={{
                  padding: 'clamp(12px, 3vw, 16px) clamp(32px, 8vw, 48px)',
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  minHeight: 'clamp(48px, 12vw, 56px)'
                }}
                onClick={() => navigate('/assistant?guest=true')}
              >
                {t.tryAssistant}
              </Button>
              <p className="text-sm text-gray-500">
                {t.signUpLater}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Sprout className="h-5 w-5 text-green-400 mr-2" />
              <span className="font-semibold">FarmAssist</span>
            </div>
            <p className="text-gray-400 text-sm">
              {language === 'EN' 
                ? 'Empowering farmers with AI-driven insights for sustainable cultivation.' 
                : 'Trao quyền cho nông dân với thông tin từ AI cho canh tác bền vững.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
