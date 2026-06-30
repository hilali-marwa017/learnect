import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('learnect_theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('learnect_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink overflow-x-hidden transition-colors duration-200">
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(p => p === 'light' ? 'dark' : 'light')}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer onSectionScroll={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} />
    </div>
  );
}