import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Gestion du theme
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
    logout();
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
        <Outlet context={{ isDark }} />
      </main>
      <Footer isDark={isDark} />
    </div>
  );
}