// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';  // ← Change ici : ../api/axios

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setRole(userData.role);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      } catch(error) {
        console.error(error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await api.post('/login', { email: email, password: password });
    const token = response.data.token;
    const userData = response.data.user;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    setUser(userData);
    setRole(userData.role);
    
    return userData;
  }

  async function logout() {
    try {
      await api.post('/logout');
    } catch(error) {
      console.error(error);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setRole(null);
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user: user, role: role, login: login, logout: logout, loading: loading, isAuthenticated: isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}