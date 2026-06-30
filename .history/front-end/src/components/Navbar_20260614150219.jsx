import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const orange = '#e04f00';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <GraduationCap size={24} color={orange} />
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: text }}>Learn<span style={{ color: orange }}>ect</span>.ma</span>
        </div>

        {/* Desktop Links */}
        <div className="nav-links">
          <button onClick={() => scrollTo('tutors-section')} style={{ color: muted, cursor: 'pointer' }}>Trouver un Prof</button>
          <button onClick={() => scrollTo('how-it-works')} style={{ color: muted, cursor: 'pointer' }}>Comment ça marche</button>
          <button onClick={() => scrollTo('features-section')} style={{ color: muted, cursor: 'pointer' }}>Qualité certifiée</button>
        </div>

        {/* Desktop Buttons */}
        <div className="nav-buttons">
          <button onClick={onToggleTheme} style={{ background: isDark ? '#1a1a1c' : '#f1f3f5', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => navigate('/login')} style={{ color: text, cursor: 'pointer' }}>Connexion</button>
          <button onClick={() => navigate('/register')} style={{ background: orange, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}>Devenir Tuteur</button>
        </div>

        {/* Burger Button */}
        <button className="burger-btn" onClick={() => setIsOpen(!isOpen)} style={{ color: text }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <button onClick={() => { scrollTo('tutors-section'); setIsOpen(false); }} style={{ color: muted, padding: '0.5rem', textAlign: 'left', cursor: 'pointer' }}>Trouver un Prof</button>
        <button onClick={() => { scrollTo('how-it-works'); setIsOpen(false); }} style={{ color: muted, padding: '0.5rem', textAlign: 'left', cursor: 'pointer' }}>Comment ça marche</button>
        <button onClick={() => { scrollTo('features-section'); setIsOpen(false); }} style={{ color: muted, padding: '0.5rem', textAlign: 'left', cursor: 'pointer' }}>Qualité certifiée</button>
        <hr style={{ borderColor: border, margin: '0.5rem 0' }} />
        <button onClick={onToggleTheme} style={{ background: isDark ? '#1a1a1c' : '#f1f3f5', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>{isDark ? '☀️ Mode clair' : '🌙 Mode sombre'}</button>
        <button onClick={() => { navigate('/login'); setIsOpen(false); }} style={{ padding: '10px', cursor: 'pointer', color: text }}>Connexion</button>
        <button onClick={() => { navigate('/register'); setIsOpen(false); }} style={{ background: orange, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontWeight: 600 }}>Devenir Tuteur</button>
      </div>
    </nav>
  );
}