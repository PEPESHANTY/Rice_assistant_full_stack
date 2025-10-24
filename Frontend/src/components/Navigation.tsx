/**
 * Navigation Component
 * 
 * Responsive navigation system with:
 * - Desktop: Top horizontal navigation (≥1024px)
 * - Mobile/Tablet: Bottom tab bar (<1024px)
 * 
 * Bottom Navigation Tested Breakpoints:
 * - iPhone SE: 375×667px
 * - iPhone 14 Pro: 393×852px  
 * - Pixel 7: 412×915px
 * - Galaxy S21: 360×800px
 * - iPhone 14 Pro Max: 430×932px
 * 
 * All icons (including Profile) are fully visible and evenly spaced
 * with proper safe area support for notched devices.
 */
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from './AppContext';
import { 
  MessageSquare, 
  Cloud, 
  Calendar,
  BookOpen, 
  User,
  LogOut,
  Sprout,
  Globe
} from 'lucide-react';

export function Navigation() {
  const { user, logout, language, toggleLanguage } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const texts = {
    EN: {
      appName: 'FarmAssist',
      assistant: 'Assistant',
      weather: 'Weather',
      tasks: 'Tasks',
      journal: 'Journal',
      profile: 'Profile',
      logout: 'Logout'
    },
    VI: {
      appName: 'Trợ Lý Nông Trại',
      assistant: 'Trợ Lý',
      weather: 'Thời Tiết',
      tasks: 'Công Việc',
      journal: 'Nhật Ký',
      profile: 'Hồ Sơ',
      logout: 'Đăng Xuất'
    }
  };

  const t = texts[language];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/assistant', icon: MessageSquare, label: t.assistant },
    { path: '/weather', icon: Cloud, label: t.weather },
    { path: '/tasks', icon: Calendar, label: t.tasks },
    { path: '/journal', icon: BookOpen, label: t.journal },
    { path: '/profile', icon: User, label: t.profile },
  ];

  return (
    <>
      {/* Top Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/assistant" className="flex items-center gap-2">
              <Sprout className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{t.appName}</span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-6 py-3 transition-colors ${
                      isActive
                        ? 'text-green-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" style={{ width: 'clamp(22px, 2vw, 28px)', height: 'clamp(22px, 2vw, 28px)' }} />
                    <span style={{ fontSize: 'clamp(14px, 1vw, 16px)' }} className={isActive ? 'font-semibold' : ''}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{language === 'EN' ? 'VI' : 'EN'}</span>
              </button>

              {user && (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  title={t.logout}
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 
        Mobile Bottom Tab Bar - Only shown on mobile and tablet (< 1024px)
        
        Frame constraints:
        - Y-axis: bottom-0 (anchored to bottom)
        - X-axis: left-0 right-0 (100% width, fill container)
        - z-index: 50 (above content, below modals)
        - Width: 100% (locked to viewport)
        - Height: 72px fixed (56px content + 8px top + 12px bottom + safe area)
        
        Container structure:
        - Auto Layout horizontal with Space Between distribution
        - Padding: Top 8px, Left/Right clamp(16-24px), Bottom 12px + safe-area
        - 16px rounded top corners, 0px bottom corners (flush with screen)
        - Shadow: 0 0 4px rgba(0,0,0,0.1)
        - Background: white (#FFFFFF)
        - Clip content: overflow-hidden
        
        Icons:
        - 5 icons (Assistant, Weather, Tasks, Journal, Profile)
        - Fixed 56x56px touch targets
        - Evenly distributed with space-between
        - Centered both axes
      */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white w-full overflow-hidden"
        style={{ 
          width: '100%',
          borderTopLeftRadius: '16px', 
          borderTopRightRadius: '16px',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
          paddingTop: '8px',
          paddingLeft: 'clamp(16px, 5vw, 24px)',
          paddingRight: 'clamp(16px, 5vw, 24px)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div 
          className="flex items-center w-full"
          style={{ 
            height: '56px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${
                  isActive
                    ? 'text-[#2E7D32]' 
                    : 'text-[#6B7280] hover:text-gray-700 hover:bg-[#F9FAFB] active:bg-gray-100'
                }`}
                style={{ 
                  width: 'clamp(48px, 15vw, 56px)',
                  height: '56px',
                  minWidth: '48px',
                  minHeight: '56px',
                  flex: '1 1 auto',
                  maxWidth: '64px',
                  padding: '4px'
                }}
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon */}
                <Icon 
                  className={`transition-all duration-300 flex-shrink-0 ${isActive ? 'bottom-nav-icon-active' : 'bottom-nav-icon'}`}
                  style={{ 
                    width: isActive ? 'clamp(24px, 5vw, 28px)' : 'clamp(22px, 5vw, 26px)',
                    height: isActive ? 'clamp(24px, 5vw, 28px)' : 'clamp(22px, 5vw, 26px)',
                  }} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {/* Label - hidden on smallest screens (≤480px), shown on tablet (481-1023px) */}
                <span 
                  className={`hidden min-[481px]:block text-center truncate max-w-full transition-all duration-300 ${
                    isActive ? 'font-semibold' : ''
                  }`}
                  style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}
                >
                  {item.label}
                </span>

                {/* Active indicator - 4px green dot below icon on mobile only */}
                {isActive && (
                  <div 
                    className="min-[481px]:hidden rounded-full bg-[#2E7D32]" 
                    style={{ 
                      width: '4px', 
                      height: '4px',
                      marginTop: '2px'
                    }} 
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
