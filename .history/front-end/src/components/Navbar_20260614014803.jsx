import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isDark, onToggleTheme }) {
  const navigate = useNavigate();
  const { user, role, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const bg = isDark ? '#000000' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#4a5568';
  const btnBg = isDark ? '#ffffff' : '#07090d';
  const btnText = isDark ? '#07090d' : '#ffffff';

  function handleLogout() {
    logout();
    navigate('/');
    setIsOpen(false);
  }

  function getDashboardPath() {
    if (role === 'admin') return '/admin';
    if (role === 'enseignant') return '/teacher';
    return '/student';
  }

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: bg,
      borderBottom: `1px solid ${border}`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '0 1.5rem', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>

        {/* Logo */}
        <div
          onClick={function() { navigate('/'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
          <GraduationCap size={22} color="#e04f00" />
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: textColor, letterSpacing: '-0.01em' }}>
            Learnect<span style={{ color: '#e04f00' }}>.ma</span>
          </span>
        </div>

        {/* Center links — desktop */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[
            { name: 'Trouver un Prof', id: 'tutors-section' },
            { name: 'Comment ça marche', id: 'how-it-works' },
            { name: 'Qualité certifiée', id: 'features-section' },
          ].map(function(link) {
            return (
              <button
                key={link.name}
                onClick={function() { scrollTo(link.id); }}
                style={{
                  background: 'none', border: 'none',
                  color: textMuted, fontSize: '0.88rem',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'color 0.15s'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = textColor; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
              >
                {link.name}
              </button>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            style={{
              background: isDark ? '#1a1a1a' : '#f1f3f5',
              border: `1px solid ${border}`,
              borderRadius: 8, padding: '7px 9px',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              color: textColor
            }}
          >
            {isDark ? <Sun size={15} color="#ffc53d" /> : <Moon size={15} color="#4a5568" />}
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={function() { navigate(getDashboardPath()); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8,
                  border: `1px solid ${border}`,
                  background: 'transparent', color: textColor,
                  fontSize: '0.8rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                <User size={13} />
                <span>Mon Espace</span>
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#da1f1f',
                  display: 'flex', alignItems: 'center', padding: 6
                }}
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={function() { navigate('/login'); }}
                style={{
                  background: 'none', border: 'none',
                  color: textColor, fontSize: '0.88rem',
                  fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit', padding: '7px 10px'
                }}
              >
                Connexion
              </button>
              <button
                onClick={function() { navigate('/register'); }}
                style={{
                  background: btnBg, color: btnText,
                  border: 'none', borderRadius: 8,
                  padding: '8px 18px', fontSize: '0.82rem',
                  fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit', letterSpacing: '0.01em',
                  transition: 'opacity 0.15s'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={function(e) { e.currentTarget.style.opacity = '1'; }}
              >
                Devenir Tuteur / Élève
              </button>
            </>
          )}

          {/* Mobile burger */}
          <button
            onClick={function() { setIsOpen(!isOpen); }}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', display: 'none',
              color: textColor, padding: 4
            }}
            className="mobile-burger"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div style={{
          background: bg,
          borderTop: `1px solid ${border}`,
          padding: '1rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: 4
        }}>
          {['Trouver un Prof', 'Comment ça marche', 'Qualité certifiée'].map(function(name, i) {
            const ids = ['tutors-section', 'how-it-works', 'features-section'];
            return (
              <button key={name} onClick={function() { scrollTo(ids[i]); }}
                style={{
                  background: 'none', border: 'none',
                  color: textMuted, textAlign: 'left',
                  padding: '10px 0', fontSize: '0.9rem',
                  cursor: 'pointer', fontFamily: 'inherit',
                  borderBottom: `1px solid ${border}`
                }}>
                {name}
              </button>
            );
          })}
          {!isAuthenticated ? (
            <>
              <button onClick={function() { navigate('/login'); setIsOpen(false); }}
                style={{ background: 'none', border: 'none', color: textColor, textAlign: 'left', padding: '10px 0', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Connexion
              </button>
              <button onClick={function() { navigate('/register'); setIsOpen(false); }}
                style={{ background: btnBg, color: btnText, border: 'none', borderRadius: 8, padding: '11px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', marginTop: 4 }}>
                Devenir Tuteur / Élève
              </button>
            </>
          ) : (
            <>
              <button onClick={function() { navigate(getDashboardPath()); setIsOpen(false); }}
                style={{ background: 'none', border: `1px solid ${border}`, color: textColor, borderRadius: 8, padding: '10px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', marginTop: 4 }}>
                Mon Espace
              </button>
              <button onClick={handleLogout}
                style={{ background: 'rgba(218,31,31,0.1)', border: '1px solid rgba(218,31,31,0.2)', color: '#da1f1f', borderRadius: 8, padding: '10px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
                Déconnexion
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}