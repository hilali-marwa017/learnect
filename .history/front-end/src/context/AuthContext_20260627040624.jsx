import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

// creation du contexte d'authentification
const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // charger user depuis localStorage au demarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // connexion
  async function login(email, password) {
    try {
      const res = await api.post('/login', { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      setUser(userData);
      return { success: true, role: userData.role, user: userData };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Email ou mot de passe incorrect' };
    }
  }

  // inscription
  async function register(userData) {
    try {
      const res = await api.post('/register', userData);
      const { token, user: newUser } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      setUser(newUser);
      return { success: true, role: newUser.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Erreur d'inscription" };
    }
  }

  // deconnexion
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user, role: user?.role }}>
      {children}
    </AuthContext.Provider>
  );
}