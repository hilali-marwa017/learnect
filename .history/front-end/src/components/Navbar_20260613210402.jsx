import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme, user, onLogout }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ink = isDark ? '#f0f0f0' : '#111111';
  const muted = isDark ? '#888888' : '#666666';
  const bgCard = isDark ? '#1a1a1a' : '#ffffff';
  const bdr = isDark ? '#2a2a2a' : '#e9ecef';
  const orange = '#e96f2a';

  const navLinks = [
    { label: 'Trouver un Prof', path: '/teachers' },
    { label: 'Comment ça marche', anchor: 'how-it-works' },
    { label: 'Qualité certifiée', anchor: 'features-section' },
  ];

  const handleNavClick = (link) => {
    setIsMobileMenuOpen(false);
    if (link.path) {
      navigate(link.path);
    } else if (link.anchor) {
      document.getElementById(link.anchor)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          onClick={() => navigate('/')}
          style={{
            fontWeight: 800,
            fontSize: '1.25rem',
            color: ink,
            cursor: 'pointer'
          }}
        >
          Learn<span style={{ color: orange }}>ect.ma</span>
        </div>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          fontSize: '0.85rem'
        }}>
          {navLinks.map((link) => (
            <span
              key={link.label}
              onClick={() => handleNavClick(link)}
              style={{
                color: muted,
                cursor: 'pointer',
                transition: 'color .15s'
              }}
              onMouseEnter={e => e.target.style.color = orange}
              onMouseLeave={e => e.target.style.color = muted}
            >
              {link.label}
            </span>
          ))}
        </div>

        {/* Right side buttons */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={onToggleTheme}
            style={{
              background: isDark ? '#141414' : '#f7f8fa',
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
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => navigate('/dashboard')}
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
                  color: '#e24b4a',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  marginLeft: 8,
                  display: 'inline-flex',
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
                onClick={() => navigate('/login')}
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
                onClick={() => navigate('/register')}
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: ink,
              '@media (max-width: 768px)': { display: 'block' }
            }}
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
          {navLinks.map((link) => (
            <span
              key={link.label}
              onClick={() => handleNavClick(link)}
              style={{ color: muted, cursor: 'pointer', padding: '0.5rem' }}
            >
              {link.label}
            </span>
          ))}
        </div>
      )}
    </nav>
  );
}