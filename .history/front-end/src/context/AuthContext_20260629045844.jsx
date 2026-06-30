import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token      = localStorage.getItem('token');
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
      const data = error.response?.data;
      return {
        success: false,
        message: data?.message || 'Email ou mot de passe incorrect',
        statut:  data?.statut  || null,
        raison:  data?.raison  || null,
      };
    }
  }

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

  async function registerMultipart(formData) {
    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      let data;
      try {
        data = await res.json();
      } catch {
        return { success: false, message: "Réponse invalide du serveur" };
      }
      if (!res.ok) {
        let msg = data.message || "Erreur d'inscription";
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          if (Array.isArray(firstError)) msg = firstError[0];
        }
        return { success: false, message: msg };
      }
      const { token, user: newUser } = data;
      if (!token || !newUser) {
        return { success: false, message: "Réponse incomplète du serveur" };
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      setUser(newUser); // ✅ FIX : était manquant pour le rôle enseignant
      if (newUser.role === 'enseignant') {
        return { success: true, role: 'enseignant', pending: true };
      }
      return { success: true, role: newUser.role, pending: false };
    } catch (error) {
      return { success: false, message: "Erreur réseau — vérifiez que le serveur est démarré" };
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  function updateUser(newData) {
    setUser(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      registerMultipart,
      logout,
      updateUser,
      isAuthenticated: !!user,
      role: user?.role
    }}>
      {children}
    </AuthContext.Provider>
  );
}