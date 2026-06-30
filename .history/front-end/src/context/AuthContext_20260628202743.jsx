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
        headers: {
          'Accept': 'application/json',
          // NE PAS mettre Content-Type ici — le browser le fait automatiquement avec le boundary
        },
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
      // enseignant → ne pas connecter, afficher écran attente
      if (newUser.role === 'enseignant') {
        return { success: true, role: 'enseignant', pending: true };
      }
      setUser(newUser);
      return { success: true, role: newUser.role, pending: false };
    } catch (error) {
      return { success: false, message: "Erreur réseau — vérifiez que le serveur est démarré" };
    }
  }

  // ✅ NOUVEAU : permet a un composant (ex: TeacherProfile) de mettre a jour
  // l'utilisateur courant dans le contexte ET dans le localStorage en une fois,
  // pour que la Navbar et tous les composants connectes au contexte se
  // mettent a jour instantanement sans avoir besoin de F5.
  function updateUser(updatedFields) {
    setUser(prev => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{
      user,
      setUser,        // ✅ CORRIGE : expose maintenant setUser, sinon TeacherProfile
                       // recevait undefined et ne mettait jamais a jour le contexte
      updateUser,      // ✅ NOUVEAU : helper pratique pour fusionner+persister en un appel
      loading,
      login,
      register,
      registerMultipart,
      logout,
      isAuthenticated: !!user,
      role: user?.role
    }}>
      {children}
    </AuthContext.Provider>
  );
}