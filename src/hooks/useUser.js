// src/hooks/useUser.js
// Experiment 2 – Custom Hook demonstration
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

// Custom hook: encapsulates useContext(UserContext) call so any
// component can access user data without knowing about UserContext directly.
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default useUser;
