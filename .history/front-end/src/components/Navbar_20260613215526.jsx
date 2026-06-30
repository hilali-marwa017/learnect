import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const orange = '#e04f00';
  const ink = isDark ? '#fcfdff' : '#07090d';
  const charcoal = isDark ? 'rgba(252, 253, 255, 0.7)' : '#4a5568';
  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)';

  const navLinks = [
    { label: 'Trouver un Prof', action: function() { document.getElementById('tutors-section')?.scrollIntoView({ behavior: 'smooth' }); } },
    { label: 'Comment ça marche', action: function() { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); } },
    { label: 'Qualité certifiée', action: function() { document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' }); } }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: bgCard,
      borderBottom: `1px solid ${bdr}`,
      padding: '0 2rem',
      height: 70
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        maxWidth: 1400,
        margin: '0 auto'
      }}>
        {/* Logo */}
        <div
          onClick={function() { navigate('/'); }}
          style={{
            fontWeight: 800,
            fontSize: '1.25rem',
            color: ink,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <GraduationCap size={24} color={orange} />
          <span>Learn<span style={{ color: orange }}>ect</span>.ma</span>
        </div>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
          {navLinks.map(function(link) {
            return (
              <span
                key={link.label}
                onClick={link.action}
                style={{
                  color: charcoal,
                  cursor: 'pointer',
                  transition: 'color .15s'
                }}
                onMouseEnter={function(e) { e.target.style.color = orange; }}
                onMouseLeave={function(e) { e.target.style.color = charcoal; }}
              >
                {link.label}
              </span>
            );
          })}
        </div>

        {/* Right side buttons */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={onToggleTheme}
            style={{
              background: isDark ? '#101012' : '#f1f3f5',
              border: `1px solid ${bdr}`,
              borderRadius: 8,
              padding: '6px 14px',
              cursor: 'pointer',
              color: ink,
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDark ? 'Clair' : 'Sombre'}</span>
          </button>

          <button
            onClick={function() { navigate('/login'); }}
            style={{
              background: 'none',
              border: `1px solid ${bdr}`,
              borderRadius: 8,
              padding: '6px 14px',
              cursor: 'pointer',
              color: ink,
              fontWeight: 600,
              fontSize: '0.78rem'
            }}
          >
            Connexion
          </button>

          <button
            onClick={function() { navigate('/register'); }}
            style={{
              background: ink,
              color: bgCard,
              border: 'none',
              borderRadius: 8,
              padding: '7px 16px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.78rem'
            }}
          >
            Devenir Tuteur
          </button>

          {/* Mobile menu button */}
          <button
            onClick={function() { setIsMobileMenuOpen(!isMobileMenuOpen); }}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: ink
            }}
            className="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          background: bgCard,
          borderBottom: `1px solid ${bdr}`,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {navLinks.map(function(link) {
            return (
              <span
                key={link.label}
                onClick={function() { link.action(); setIsMobileMenuOpen(false); }}
                style={{ color: charcoal, cursor: 'pointer', padding: '0.5rem' }}
              >
                {link.label}
              </span>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}