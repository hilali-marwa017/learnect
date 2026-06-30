import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

var AuthContext = createContext();

export function AuthProvider({ children }) {
  var [user, setUser] = useState(null);
  var [loading, setLoading] = useState(true);

  useEffect(function() {
    var token = localStorage.getItem('token');
    var storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        var userData = JSON.parse(storedUser);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      } catch(e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    var response = await api.post('/login', { email: email, password: password });
    var token = response.data.token;
    var userData = response.data.user;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    setUser(userData);
    return userData;
  }

  async function logout() {
    try {
      await api.post('/logout');
    } catch(e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  var role = user ? user.role : null;
  var isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user: user, role: role, login: login, logout: logout, loading: loading, isAuthenticated: isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export var useAuth = function() {
  return useContext(AuthContext);
};