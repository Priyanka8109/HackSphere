import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Experiment 2: React Context API (useContext & useEffect)
 * AuthContext provides global authentication state and user session management across all components.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hacksphere_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Experiment 2: useEffect to synchronize user session with localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('hacksphere_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('hacksphere_auth_user');
      }
    } catch (err) {
      console.error('Failed to sync auth state with localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Login handler
  const login = (userData) => {
    const authData = {
      name: userData.name || 'Priyanka Rajpal',
      email: userData.email || 'priyanka@hacksphere.edu',
      role: userData.role || 'user',
      token: userData.token || localStorage.getItem('hacksphere_token') || '',
      team: 'Team Alpha',
      avatar: (userData.name || 'Priyanka').charAt(0).toUpperCase(),
      loggedInAt: new Date().toLocaleTimeString(),
    };
    setUser(authData);
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('hacksphere_token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom Hook: useAuth
 * Simplifies consuming AuthContext using useContext hook.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
