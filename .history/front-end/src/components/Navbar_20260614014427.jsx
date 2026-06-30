import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isDark, onToggleTheme }) {
  const navigate = useNavigate();
  const { user, role, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const bg = isDark ? '#000000' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#4a5568';
  const orange = '#e04f00';

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

  const links = [
    { name: 'Trouver un Prof', id: 'tutors-section' },
    { name: 'Comment ça marche', id: 'how-it-works' },
    { name: 'Qualité certifiée', id: 'features-section' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: bg, borderBottom: `1px solid ${border}`,
      padding: '0 1.5rem', height: 64,
      display: 'flex', alignItems: 'center'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <GraduationCap size={24} color={orange} />
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: textColor }}>
            Learn<span style={{ color: orange }}>ect</span>.ma
          </span>
        </div>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden-mobile">
          {links.map(link => (
            <button key={link.name} onClick={() => scrollTo(link.id)}
              style={{ background: 'none', border: 'none', color: textMuted, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              {link.name}
            </button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden-mobile">
          <button onClick={onToggleTheme}
            style={{ background: isDark ? '#1a1a1a' : '#f1f3f5', border: `1px solid ${border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {isDark ? <Sun size={16} color="#ffc53d" /> : <Moon size={16} color="#4a5568" />}
          </button>

          {isAuthenticated ? (
            <>
              <button onClick={() => navigate(getDashboardPath())}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: `1px solid ${border}`, background: 'transparent', color: textColor, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                <User size={14} />
                <span>Mon Espace</span>
              </button>
              <button onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#da1f1f', display: 'flex', alignItems: 'center' }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}
                style={{ background: 'none', border: 'none', color: textColor, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Connexion
              </button>
              <button onClick={() => navigate('/register')}
                style={{ background: orange, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Devenir Tuteur
              </button>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
          className="show-mobile">
          {isOpen ? <X size={24} color={textColor} /> : <Menu size={24} color={textColor} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: bg, borderBottom: `1px solid ${border}`,
          padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 12
        }}>
          {links.map(link => (
            <button key={link.name} onClick={() => scrollTo(link.id)}
              style={{ background: 'none', border: 'none', color: textMuted, textAlign: 'left', padding: '8px 0', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', borderBottom: `1px solid ${border}` }}>
              {link.name}
            </button>
          ))}
          <button onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: textColor, textAlign: 'left', padding: '8px 0', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Connexion
          </button>
          <button onClick={() => navigate('/register')}
            style={{ background: orange, color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
            Devenir Tuteur
          </button>
        </div>
      )}
    </nav>
  );
}