import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Journal } from './components/Journal';
import { SimpleAssistant } from './components/SimpleAssistant';
import { Weather } from './components/Weather';
import { Tasks } from './components/Tasks';
import { AppProvider, useApp } from './components/AppContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function HomeRedirect() {
  const { user } = useApp();
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/assistant" 
        element={<SimpleAssistant />} 
      />
      <Route 
        path="/weather" 
        element={
          <ProtectedRoute>
            <Weather />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/journal" 
        element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      {/* Dashboard route */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
