import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X, LogIn, UserPlus, LogOut, User, Bell, ChevronDown } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme, user, onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const orange = '#e04f00';
  const themeBtnBg = isDark ? '#1a1a1c' : '#f1f3f5';

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const isLoggedIn = user !== null && user !== undefined;

  return (
    <nav style={{ background: bg, borderBottom: `1px solid ${border}`, padding: '0 1rem', height: '60px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <GraduationCap size={22} color={orange} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: text }}>Learn<span style={{ color: orange }}>ect</span>.ma</span>
        </div>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '1.5rem' }} className="nav-links-desktop">
          <button onClick={() => scrollTo('tutors-section')} style={{ color: muted, cursor: 'pointer', fontSize: '0.85rem' }}>Trouver un Prof</button>
          <button onClick={() => scrollTo('how-it-works')} style={{ color: muted, cursor: 'pointer', fontSize: '0.85rem' }}>Comment ça marche</button>
          <button onClick={() => scrollTo('features-section')} style={{ color: muted, cursor: 'pointer', fontSize: '0.85rem' }}>Qualité certifiée</button>
        </div>

        {/* Desktop Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="nav-buttons-desktop">
          {/* Theme Toggle */}
          <button onClick={onToggleTheme} style={{ background: themeBtnBg, borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px' }} title={isDark ? 'Mode clair' : 'Mode sombre'}>
            {isDark ? <Sun size={16} color={text} /> : <Moon size={16} color={text} />}
          </button>

          {isLoggedIn ? (
            <>
              {/* Notification Icon */}
              <button onClick={() => navigate('/notifications')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }} title="Notifications">
                <Bell size={18} color={text} />
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: orange, borderRadius: '50%' }}></span>
              </button>

              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px' }}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} color="#fff" />
                    </div>
                  )}
                  <span style={{ color: text, fontSize: '0.85rem' }}>{user?.name || 'Compte'}</span>
                  <ChevronDown size={14} color={muted} />
                </button>
                
                {isProfileOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '0.5rem', minWidth: '180px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <button onClick={() => { navigate('/profile'); setIsProfileOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: text, textAlign: 'left', borderRadius: '8px' }}>Mon profil</button>
                    <button onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: text, textAlign: 'left', borderRadius: '8px' }}>Tableau de bord</button>
                    <div style={{ height: '1px', background: border, margin: '4px 0' }} />
                    <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', textAlign: 'left', borderRadius: '8px' }}>
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Bouton Connexion - comme dans l'image */}
              <button 
                onClick={() => navigate('/login')} 
                style={{ 
                  background: 'transparent', 
                  color: text, 
                  cursor: 'pointer', 
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${border}`
                }}
              >
                Connexion
              </button>
              
              {/* Bouton Devenir Tuteur / Élève - comme dans l'image */}
              <button 
                onClick={() => navigate('/register')} 
                style={{ 
                  background: text, 
                  color: bg, 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '8px 16px', 
                  cursor: 'pointer', 
                  fontWeight: 600, 
                  fontSize: '0.85rem'
                }}
              >
                Devenir Tuteur / Élève
              </button>
            </>
          )}
        </div>

        {/* Mobile Burger Button */}
        <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: text, padding: '8px' }} className="burger-btn">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div style={{ position: 'absolute', top: '60px', left: 0, right: 0, background: bg, borderBottom: `1px solid ${border}`, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 99 }} className="mobile-menu">
          <button onClick={() => { scrollTo('tutors-section'); setIsOpen(false); }} style={{ color: muted, padding: '8px', textAlign: 'left', cursor: 'pointer' }}>Trouver un Prof</button>
          <button onClick={() => { scrollTo('how-it-works'); setIsOpen(false); }} style={{ color: muted, padding: '8px', textAlign: 'left', cursor: 'pointer' }}>Comment ça marche</button>
          <button onClick={() => { scrollTo('features-section'); setIsOpen(false); }} style={{ color: muted, padding: '8px', textAlign: 'left', cursor: 'pointer' }}>Qualité certifiée</button>
          <hr style={{ borderColor: border, margin: '4px 0' }} />
          
          {/* Theme Toggle Mobile */}
          <button onClick={onToggleTheme} style={{ background: themeBtnBg, borderRadius: '8px', padding: '10px', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />} {isDark ? 'Mode clair' : 'Mode sombre'}
          </button>

          {isLoggedIn ? (
            <>
              <button onClick={() => { navigate('/notifications'); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', color: text }}><Bell size={16} /> Notifications</button>
              <button onClick={() => { navigate('/profile'); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', color: text }}><User size={16} /> Mon profil</button>
              <button onClick={() => { navigate('/dashboard'); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', color: text }}>Tableau de bord</button>
              <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', color: '#dc2626' }}><LogOut size={16} /> Déconnexion</button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate('/login'); setIsOpen(false); }} style={{ padding: '10px', cursor: 'pointer', color: text, textAlign: 'center', border: `1px solid ${border}`, borderRadius: '8px', marginBottom: '4px' }}>Connexion</button>
              <button onClick={() => { navigate('/register'); setIsOpen(false); }} style={{ background: text, color: bg, border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}>Devenir Tuteur / Élève</button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-buttons-desktop { display: none !important; }
          .burger-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .burger-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}