import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('learnect_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  const role = user?.role || null;

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      const { user: userData, token } = res.data;
      localStorage.setItem('learnect_token', token);
      localStorage.setItem('learnect_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch (e) {}
    localStorage.removeItem('learnect_token');
    localStorage.removeItem('learnect_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/me');
      setUser(res.data);
      localStorage.setItem('learnect_user', JSON.stringify(res.data));
    } catch (e) { logout(); }
  };

  const dashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'enseignant') return '/teacher';
    return '/student';
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, refreshUser, dashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}