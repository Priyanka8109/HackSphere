import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

// Helper component using useEffect to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  // Experiment 2: useEffect for window scroll side effect on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    // Experiment 2: AuthProvider for User Authentication Context
    <AuthProvider>
      {/* Experiment 3: TaskProvider for Global Task State Management (Context API) */}
      <TaskProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}
