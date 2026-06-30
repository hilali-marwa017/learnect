import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  // Mode clair par défaut
  const [isDark, setIsDark] = useState(false);

  const location = useLocation();

  useEffect(function() {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('learnect_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  function toggleTheme() {
    setIsDark(!isDark);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer isDark={isDark} />
    </div>
  );
}