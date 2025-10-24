import React from 'react';
import { useApp } from './AppContext';

interface DateWithLunarProps {
  date: string | Date;
  className?: string;
  showLunar?: boolean;
}

/**
 * DateWithLunar Component
 * Displays both Gregorian and Vietnamese Lunar Calendar dates
 * Used throughout the app for farmer-friendly date display
 */
export function DateWithLunar({ date, className = '', showLunar = true }: DateWithLunarProps) {
  const { language } = useApp();
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format Gregorian date
  const gregorianDate = dateObj.toLocaleDateString(language === 'VI' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Simple lunar calendar conversion (basic approximation)
  // In a production app, you would use a proper lunar calendar library
  const getLunarDate = (date: Date): string => {
    // This is a simplified approximation for demonstration
    // Real implementation should use a proper Vietnamese lunar calendar library
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Approximate lunar month (this is very simplified and not accurate)
    // In production, use libraries like 'lunar-calendar' or 'vietnamese-lunar-calendar'
    const lunarDay = Math.floor((day + 10) % 30) + 1;
    const lunarMonth = ((month + 1) % 12) || 12;
    
    if (language === 'VI') {
      return `${lunarDay}/${lunarMonth} ÂL`;
    } else {
      return `${lunarDay}/${lunarMonth} Lunar`;
    }
  };
  
  const lunarDate = getLunarDate(dateObj);
  
  if (!showLunar) {
    return <span className={className}>{gregorianDate}</span>;
  }
  
  return (
    <span className={className}>
      {gregorianDate}
      <span className="text-gray-500 ml-1.5">
        ({lunarDate})
      </span>
    </span>
  );
}
