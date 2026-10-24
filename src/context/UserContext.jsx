import React, { createContext, useState, useEffect } from 'react';

// Experiment 2 – useContext demonstration
export const UserContext = createContext(null);

// Basic HackSphere user data shared across the app
const defaultHackerUser = {
  name: 'Priyanka Rajpal',
  role: 'Hacker / Team Lead',
  team: 'Team Alpha',
  email: 'priyanka@hacksphere.edu',
  status: 'Active'
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(defaultHackerUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
