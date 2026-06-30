import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  // ✅ CORRIGE : état initial lu directement depuis localStorage (lazy init)
  // au lieu d'un useEffect après le 1er rendu -> supprime le flash / désync
  // qui causait le "dark mode ne marche pas" sur l'espace étudiant.
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('learnect_theme') === 'dark';
  });

  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('learnect_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  function toggleTheme() {
    setIsDark(prev => !prev);
  }

  function handleLogout() {
    setTimeout(() => {
      logout();
      navigate('/');
    }, 1200);
  }

  if (loading) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} user={user} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>
        <Outlet context={{ isDark }} />
      </main>
      <Footer isDark={isDark} />
    </div>
  );
}