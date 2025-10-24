import React from 'react';

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
}

export function LoadingScreen({ message, showProgress = false }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-4 w-20 h-20 flex items-center justify-center">
        <div className="relative">
          {/* Spinning ring only */}
          <div className="w-8 h-8 border-2 border-green-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
