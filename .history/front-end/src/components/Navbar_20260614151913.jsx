import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X, LogOut, User, Bell, ChevronDown } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme, user, onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isLoggedIn = user !== null && user !== undefined;

  return (
    <>
      <nav style={{ 
        background: isDark ? '#0a0a0c' : '#ffffff', 
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, 
        padding: '0 1rem', 
        height: '60px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Logo */}
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <GraduationCap size={22} color="#e04f00" />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isDark ? '#ffffff' : '#07090d' }}>Learn<span style={{ color: '#e04f00' }}>ect</span>.ma</span>
          </div>

          {/* Desktop Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Theme Toggle */}
            <button onClick={onToggleTheme} style={{ background: isDark ? '#1a1a1c' : '#e5e7eb', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px' }}>
              {isDark ? <Sun size={16} color="#ffffff" /> : <Moon size={16} color="#07090d" />}
            </button>

            {isLoggedIn ? (
              <>
                <button onClick={() => navigate('/notifications')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                  <Bell size={18} color={isDark ? '#ffffff' : '#07090d'} />
                  <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#e04f00', borderRadius: '50%' }}></span>
                </button>

                <div style={{ position: 'relative' }}>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px' }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color="#fff" />
                      </div>
                    )}
                    <span style={{ color: isDark ? '#ffffff' : '#07090d', fontSize: '0.85rem' }}>{user?.name || 'Compte'}</span>
                    <ChevronDown size={14} color={isDark ? '#a1a4a5' : '#4a5568'} />
                  </button>
                  
                  {isProfileOpen && (
                    <div style={{ 
                      position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: isDark ? '#0a0a0c' : '#ffffff', 
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: '12px', 
                      padding: '0.5rem', minWidth: '200px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      <button onClick={() => { navigate('/profile'); setIsProfileOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#ffffff' : '#07090d', textAlign: 'left', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <User size={16} /> Mon profil
                      </button>
                      <button onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#ffffff' : '#07090d', textAlign: 'left', borderRadius: '8px', fontSize: '0.85rem' }}>
                        Tableau de bord
                      </button>
                      <div style={{ height: '1px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', margin: '8px 0' }} />
                      <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', textAlign: 'left', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <LogOut size={16} /> Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: isDark ? '#ffffff' : '#374151', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, padding: '8px 16px', borderRadius: '8px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db'}` }}>
                  Connexion
                </button>
                <button onClick={() => navigate('/register')} style={{ background: isDark ? '#ffffff' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                  Devenir Tuteur / Élève
                </button>
              </>
            )}
          </div>

          {/* Mobile Burger Button */}
          <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#ffffff' : '#07090d', padding: '8px', display: 'none' }} className="burger-btn">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div style={{ 
            position: 'absolute', top: '60px', left: 0, right: 0, background: isDark ? '#0a0a0c' : '#ffffff', 
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, 
            padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 99 
          }}>
            <button onClick={onToggleTheme} style={{ background: isDark ? '#1a1a1c' : '#e5e7eb', borderRadius: '8px', padding: '10px', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />} {isDark ? 'Mode clair' : 'Mode sombre'}
            </button>

            {isLoggedIn ? (
              <>
                <button onClick={() => { navigate('/notifications'); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', color: isDark ? '#ffffff' : '#07090d' }}><Bell size={16} /> Notifications</button>
                <button onClick={() => { navigate('/profile'); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', color: isDark ? '#ffffff' : '#07090d' }}><User size={16} /> Mon profil</button>
                <button onClick={() => { navigate('/dashboard'); setIsOpen(false); }} style={{ padding: '10px', cursor: 'pointer', color: isDark ? '#ffffff' : '#07090d', textAlign: 'left' }}>Tableau de bord</button>
                <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', color: '#dc2626', textAlign: 'left' }}><LogOut size={16} /> Déconnexion</button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate('/login'); setIsOpen(false); }} style={{ padding: '10px', cursor: 'pointer', color: isDark ? '#ffffff' : '#374151', textAlign: 'center', border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db'}`, borderRadius: '8px', marginBottom: '4px' }}>
                  Connexion
                </button>
                <button onClick={() => { navigate('/register'); setIsOpen(false); }} style={{ background: isDark ? '#ffffff' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}>
                  Devenir Tuteur / Élève
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .burger-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}