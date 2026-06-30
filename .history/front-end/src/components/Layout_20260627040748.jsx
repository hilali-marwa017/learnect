import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [isDark, setIsDark] = useState(false);
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // charger theme sauvegardee
  useEffect(() => {
    const saved = localStorage.getItem('learnect_theme');
    const dark = saved === 'dark';
    setIsDark(dark);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  // appliquer theme quand il changee
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('learnect_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // effet scroll 
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