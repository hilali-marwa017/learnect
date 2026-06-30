import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Trouver un Prof', id: 'tutors-section' },
    { name: 'Comment ça marche', id: 'how-it-works' },
    { name: 'Qualité certifiée', id: 'features-section' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 h-16 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo */}
        <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
          <GraduationCap size={24} className="text-orange-accent" />
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            Learn<span className="text-orange-accent">ect</span>.ma
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.id)}
              className="text-gray-600 dark:text-gray-400 text-sm cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Connexion
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-1.5 text-sm font-bold text-white bg-orange-accent rounded-lg"
          >
            Devenir Tuteur
          </button>
        </div>

        {/* Mobile button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3 md:hidden">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                scrollTo(link.id);
                setIsOpen(false);
              }}
              className="text-left py-2 text-gray-600 dark:text-gray-400"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => {
              navigate('/login');
              setIsOpen(false);
            }}
            className="py-2 text-left text-gray-700 dark:text-gray-300"
          >
            Connexion
          </button>
          <button
            onClick={() => {
              navigate('/register');
              setIsOpen(false);
            }}
            className="py-2 text-center text-white bg-orange-accent rounded-lg"
          >
            Devenir Tuteur
          </button>
        </div>
      )}
    </nav>
  );
}