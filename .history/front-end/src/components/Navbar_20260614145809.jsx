import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const orange = '#e04f00';

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav style={{ background: bg, borderBottom: `1px solid ${border}`, padding: '0 2rem', height: '70px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <GraduationCap size={24} color={orange} />
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: text }}>Learn<span style={{ color: orange }}>ect</span>.ma</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button onClick={() => scrollTo('tutors-section')} style={{ color: muted, cursor: 'pointer' }}>Trouver un Prof</button>
          <button onClick={() => scrollTo('how-it-works')} style={{ color: muted, cursor: 'pointer' }}>Comment ça marche</button>
          <button onClick={() => scrollTo('features-section')} style={{ color: muted, cursor: 'pointer' }}>Qualité certifiée</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={onToggleTheme} style={{ background: isDark ? '#1a1a1c' : '#f1f3f5', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>{isDark ? <Sun size={16} /> : <Moon size={16} />}</button>
          <button onClick={() => navigate('/login')} style={{ color: text, cursor: 'pointer' }}>Connexion</button>
          <button onClick={() => navigate('/register')} style={{ background: orange, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}>Devenir Tuteur</button>
          <button onClick={() => setIsOpen(!isOpen)} style={{ display: 'none' }} className="mobile-menu-btn">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      {isOpen && (
        <div style={{ position: 'absolute', top: '70px', left: 0, right: 0, background: bg, borderBottom: `1px solid ${border}`, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={() => { scrollTo('tutors-section'); setIsOpen(false); }} style={{ color: muted }}>Trouver un Prof</button>
          <button onClick={() => { scrollTo('how-it-works'); setIsOpen(false); }} style={{ color: muted }}>Comment ça marche</button>
          <button onClick={() => { scrollTo('features-section'); setIsOpen(false); }} style={{ color: muted }}>Qualité certifiée</button>
        </div>
      )}
      <style>{`@media (max-width: 768px) { .mobile-menu-btn { display: block !important; } .desktop-nav { display: none; } }`}</style>
    </nav>
  );
}