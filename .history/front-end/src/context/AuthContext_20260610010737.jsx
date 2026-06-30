// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      } catch (error) {
        console.error('Erreur:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    try {
      const response = await api.post('/login', { email: email, password: password });
      const token = response.data.token;
      const userData = response.data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      // ✅ CORRECTION : redirection vers '/' sans passer par /login
      window.location.href = '/';
    }
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user: user, login: login, logout: logout, loading: loading, isAuthenticated: isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = function() {
  return useContext(AuthContext);
};