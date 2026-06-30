import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const [isDark, setIsDark] = useState(false); // LIGHT PAR DÉFAUT
  const location = useLocation();

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />
      <main style={{ flex: 1 }}>
        <Outlet context={{ isDark }} />
      </main>
      <Footer isDark={isDark} />
    </div>
  );
}