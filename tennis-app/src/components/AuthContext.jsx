import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserName, getUserAvatar } from '../utils/userUtils';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('isLoggedIn');
    if (stored === 'true') {
      setUser({ name: getUserName(), avatar: getUserAvatar() });
    }
  }, []);

  const login = (name, email) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    setUser({ name, avatar: getUserAvatar() });
  };

  const logout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
