import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // verifer si  est connecté au chargement
  useEffect(function() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch(e) {
        console.error('Erreur parse user:', e);
      }
    }
  }, []);

  // Gestion du thème
  useEffect(function() {
    const saved = localStorage.getItem('learnect_theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.body.style.background = '#000000';
    } else {
      setIsDark(false);
      document.body.style.background = '#f8f9fc';
    }
  }, []);

  useEffect(function() {
    document.body.style.background = isDark ? '#000000' : '#f8f9fc';
    localStorage.setItem('learnect_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  function toggleTheme() {
    setIsDark(function(prev) { return !prev; });
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        isDark={isDark} 
        onToggleTheme={toggleTheme} 
        user={user}
        onLogout={handleLogout}
      />
      <main style={{ flex: 1 }}>
        <Outlet context={{ isDark, user, setUser }} />
      </main>
      <Footer isDark={isDark} />
    </div>
  );
}