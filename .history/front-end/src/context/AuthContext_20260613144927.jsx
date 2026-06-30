import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('learnect_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('learnect_role') || null;
  });

  const [loading, setLoading] = useState(false);

  // Mapper le role Laravel -> role frontend
  const mapRole = (laravelRole) => {
    if (laravelRole === 'admin') return 'admin';
    if (laravelRole === 'enseignant') return 'teacher';
    return 'student';
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { user: userData, token } = response.data;

      const mappedRole = mapRole(userData.role);

      localStorage.setItem('learnect_token', token);
      localStorage.setItem('learnect_current_user', JSON.stringify(userData));
      localStorage.setItem('learnect_role', mappedRole);

      setUser(userData);
      setRole(mappedRole);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur de connexion';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { user: userData, token } = response.data;

      const mappedRole = mapRole(userData.role);

      localStorage.setItem('learnect_token', token);
      localStorage.setItem('learnect_current_user', JSON.stringify(userData));
      localStorage.setItem('learnect_role', mappedRole);

      setUser(userData);
      setRole(mappedRole);
      return { user: userData, role: mappedRole };
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de l'inscription";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // ignorer erreur réseau
    }
    setUser(null);
    setRole(null);
    localStorage.removeItem('learnect_token');
    localStorage.removeItem('learnect_current_user');
    localStorage.removeItem('learnect_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}