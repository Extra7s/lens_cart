import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('lc_user');
    const token = localStorage.getItem('lc_token');
    if (storedUser && token) {
      try { setUser(JSON.parse(storedUser)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('lc_token', data.token);
    localStorage.setItem('lc_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    localStorage.setItem('lc_token', data.token);
    localStorage.setItem('lc_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('lc_token');
    localStorage.removeItem('lc_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
