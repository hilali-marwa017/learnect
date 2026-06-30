import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('learnect_theme');
    return saved === 'dark';
  });
  
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('learnect_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: isDark ? '#000000' : '#f8f9fc'
    }}>
      {/* UN SEUL NAVBAR */}
      <Navbar 
        isDark={isDark}
        onToggleTheme={toggleTheme}
        user={null}
        onLogout={() => {}}
      />
      
      {/* Contenu principal */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
      {/* UN SEUL FOOTER */}
      <Footer isDark={isDark} />
    </div>
  );
}