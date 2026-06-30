import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const orange = '#e04f00';
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: bg, borderBottom: `1px solid ${border}`, padding: '0 2rem', height: 70 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', maxWidth: 1400, margin: '0 auto' }}>
        <div onClick={() => navigate('/')} style={{ fontWeight: 800, fontSize: '1.25rem', color: textColor, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <GraduationCap size={24} color={orange} />
          <span>Learn<span style={{ color: orange }}>ect</span>.ma</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
          {['Trouver un Prof', 'Comment ça marche', 'Qualité certifiée'].map((item, i) => (
            <span key={i} onClick={() => document.getElementById(['tutors-section', 'how-it-works', 'features-section'][i])?.scrollIntoView({ behavior: 'smooth' })} style={{ color: textMuted, cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={(e) => e.target.style.color = orange} onMouseLeave={(e) => e.target.style.color = textMuted}>{item}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={onToggleTheme} style={{ background: isDark ? '#2a2a2a' : '#f1f3f5', border: `1px solid ${border}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: textColor, fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />}<span>{isDark ? 'Clair' : 'Sombre'}</span>
          </button>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: `1px solid ${border}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: textColor, fontWeight: 600, fontSize: '0.78rem' }}>Connexion</button>
          <button onClick={() => navigate('/register')} style={{ background: textColor, color: bg, border: 'none', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>Devenir Tuteur</button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: textColor }} className="mobile-menu-btn">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div style={{ position: 'absolute', top: 70, left: 0, right: 0, background: bg, borderBottom: `1px solid ${border}`, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['Trouver un Prof', 'Comment ça marche', 'Qualité certifiée'].map((item, i) => (
            <span key={i} onClick={() => { document.getElementById(['tutors-section', 'how-it-works', 'features-section'][i])?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }} style={{ color: textMuted, cursor: 'pointer', padding: '0.5rem' }}>{item}</span>
          ))}
        </div>
      )}
      <style>{`@media (max-width: 768px) { .mobile-menu-btn { display: block !important; } }`}</style>
    </nav>
  );
}