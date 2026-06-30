import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(function() {
    const saved = localStorage.getItem('learnect_theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    }
  }, []);

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
    setIsDark(function(prev) { return !prev; });
  }

  const bg = isDark ? '#000000' : '#f8f9fc';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: bg, transition: 'background 0.2s' }}>
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />
      <main style={{ flex: 1 }}>
        <Outlet context={{ isDark }} />
      </main>
      <Footer isDark={isDark} />
    </div>
  );
}