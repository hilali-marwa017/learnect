import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme, user, onLogout }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const ink = isDark ? '#fcfdff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';
  const orange = '#e04f00';

  const navLinks = [
    { label: 'Trouver un Prof', action: function() { navigate('/teachers'); } },
    { label: 'Comment ça marche', action: function() { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); } },
    { label: 'Qualité certifiée', action: function() { document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' }); } },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 99,
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
            gap: 6
          }}
        >
          <GraduationCap size={24} color={orange} />
          <span>Learn<span style={{ color: orange }}>ect.ma</span></span>
        </div>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          fontSize: '0.85rem'
        }}>
          {navLinks.map(function(link) {
            return (
              <span
                key={link.label}
                onClick={link.action}
                style={{
                  color: muted,
                  cursor: 'pointer',
                  transition: 'color .15s'
                }}
                onMouseEnter={function(e) { e.target.style.color = orange; }}
                onMouseLeave={function(e) { e.target.style.color = muted; }}
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
              padding: '6px 12px',
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
            {isDark ? 'Clair' : 'Sombre'}
          </button>

          {user ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={function() { navigate('/dashboard'); }}
                style={{
                  background: 'none',
                  border: `1px solid ${bdr}`,
                  borderRadius: 8,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  color: ink,
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <User size={14} />
                {user.name}
              </button>
              <button
                onClick={onLogout}
                style={{
                  background: 'none',
                  border: `1px solid ${bdr}`,
                  borderRadius: 8,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: '#da1f1f',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <LogOut size={12} />
                Quitter
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}

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
                onClick={function() { 
                  link.action(); 
                  setIsMobileMenuOpen(false); 
                }}
                style={{ color: muted, cursor: 'pointer', padding: '0.5rem' }}
              >
                {link.label}
              </span>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .desktop-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}