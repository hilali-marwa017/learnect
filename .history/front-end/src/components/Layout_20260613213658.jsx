import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('learnect_theme');
    return saved === 'dark';
  });
  
  const location = useLocation();

  // Sauvegarder le thème dans localStorage
  useEffect(() => {
    localStorage.setItem('learnect_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  // Scroll to top on route change
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
      background: isDark ? '#000000' : '#f8f9fc',
      color: isDark ? '#fcfdff' : '#07090d'
    }}>
      {/* UN SEUL NAVBAR - PAS DE DOUBLON */}
      <Navbar 
        isDark={isDark}
        onToggleTheme={toggleTheme}
        user={null}  // Tu passeras l'utilisateur depuis le contexte
        onLogout={() => {}}  // Tu passeras la fonction de déconnexion
      />
      
      {/* Contenu principal - les pages s'affichent ici via Outlet */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
      {/* UN SEUL FOOTER - PAS DE DOUBLON */}
      <Footer isDark={isDark} />
    </div>
  );
}