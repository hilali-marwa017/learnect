import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X, LogOut, Bell, ChevronDown, Sparkles } from 'lucide-react';
import api from '../api/axios';

export default function Navbar({ isDark, onToggleTheme, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isLoggedIn || isAdmin) return;
    async function fetchUnread() {
      try {
        const res = await api.get('/notifications');
        const count = (res.data || []).filter(n => !n.est_lue).length;
        setUnreadCount(count);
      } catch (e) {
        setUnreadCount(0);
      }
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, isAdmin, location.pathname]);

  function getInitials() {
    if (!user) return '?';
    const prenom = user.prenom || '';
    const nom = user.nom || '';
    if (prenom && nom) return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
    return user.email?.charAt(0).toUpperCase() || '?';
  }

  // ✅ fonction pour obtenir l'URL de la photo
  function getPhotoUrl() {
    if (!user?.photo) return null;
    if (user.photo.startsWith('http://') || user.photo.startsWith('https://')) {
      return user.photo;
    }
    return 'http://localhost:8000/storage/' + user.photo;
  }

  function handleLogout() {
    setLoggingOut(true);
    setIsProfileOpen(false);
    setIsOpen(false);
    setTimeout(() => {
      onLogout();
      setLoggingOut(false);
    }, 1200);
  }

  function handleNotificationClick() {
    if (user?.role === 'enseignant') navigate('/teacher/notifications');
    else if (user?.role === 'etudiant') navigate('/student/notifications');
  }

  const navBg = isDark ? '#0a0a0c' : '#ffffff';
  const navBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const mutedColor = isDark ? '#a1a4a5' : '#718096';
  const ddBg = isDark ? '#0a0a0c' : '#ffffff';
  const ddBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const photoUrl = getPhotoUrl();

  return (
    <nav style={{ background: navBg, borderBottom: '1px solid ' + navBorder, padding: '0 2rem', height: '70px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

        <div onClick={() => {
          if (isAdmin) navigate('/admin');
          else if (user?.role === 'enseignant') navigate('/teacher');
          else if (user?.role === 'etudiant') navigate('/student');
          else navigate('/');
        }} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <GraduationCap size={24} color="#e04f00" />
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: textColor }}>
            Learn<span style={{ color: '#e04f00' }}>ect</span>.ma
          </span>
        </div>

        <div className="desktop-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={onToggleTheme} style={{ background: isDark ? '#1a1a1c' : '#f1f3f5', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', border: 'none' }}>
            {isDark ? <Sun size={18} color="#ffffff" /> : <Moon size={18} color="#07090d" />}
          </button>

          {isLoggedIn ? (
            <>
              {!isAdmin && (
                <button onClick={handleNotificationClick} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                  <Bell size={20} color={textColor} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '2px', right: '2px', minWidth: '18px', height: '18px', background: '#e04f00', borderRadius: '999px', fontSize: '0.6rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              <div style={{ position: 'relative' }}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px' }}>
                  {/* ✅ Avatar avec photo si disponible */}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #374151, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {photoUrl ? (
                      <img src={photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{getInitials()}</span>
                    )}
                  </div>
                  <span style={{ color: textColor, fontSize: '0.9rem' }}>{user?.prenom || 'Compte'}</span>
                  <ChevronDown size={14} color={mutedColor} />
                </button>

                {isProfileOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: ddBg, border: '1px solid ' + ddBorder, borderRadius: '12px', padding: '0.5rem', minWidth: '220px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid ' + ddBorder, marginBottom: '4px' }}>
                      <div style={{ fontWeight: 700, color: textColor, fontSize: '0.9rem' }}>{user?.prenom} {user?.nom}</div>
                      <div style={{ color: mutedColor, fontSize: '0.7rem' }}>{user?.email}</div>
                    </div>
                    <button onClick={handleLogout} disabled={loggingOut} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', width: '100%', background: 'none', border: 'none', cursor: loggingOut ? 'not-allowed' : 'pointer', color: '#dc2626', textAlign: 'left', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, opacity: loggingOut ? 0.7 : 1 }}>
                      {loggingOut ? (
                        <>
                          <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(220,38,38,0.25)', borderTopColor: '#dc2626', borderRadius: '50%', animation: 'spin 0.75s linear infinite', flexShrink: 0 }} />
                          Deconnexion...
                        </>
                      ) : (
                        <><LogOut size={16} /> Deconnexion</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: textColor, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, padding: '8px 20px', borderRadius: '8px', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.3)' : '#d1d5db') }}>
                Connexion
              </button>
              <button onClick={() => navigate('/register')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: textColor, border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.5)' : '#d1d5db'), borderRadius: '20px', padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                <Sparkles size={16} color="#e04f00" /> Devenir Tuteur / Eleve
              </button>
            </>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="burger-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, padding: '8px', display: 'none' }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="mobile-menu" style={{ position: 'fixed', top: '70px', left: 0, right: 0, background: navBg, borderBottom: '1px solid ' + navBorder, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 99 }}>
          <button onClick={onToggleTheme} style={{ background: isDark ? '#1a1a1c' : '#f1f3f5', borderRadius: '8px', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', color: textColor }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Mode clair' : 'Mode sombre'}
          </button>
          {isLoggedIn ? (
            <button onClick={handleLogout} disabled={loggingOut} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', color: '#dc2626', background: 'none', border: 'none', opacity: loggingOut ? 0.7 : 1, fontSize: '0.9rem' }}>
              <LogOut size={16} /> {loggingOut ? 'Deconnexion...' : 'Deconnexion'}
            </button>
          ) : (
            <>
              <button onClick={() => { navigate('/login'); setIsOpen(false); }} style={{ padding: '10px', cursor: 'pointer', color: textColor, textAlign: 'center', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.3)' : '#d1d5db'), borderRadius: '8px', background: 'transparent' }}>
                Connexion
              </button>
              <button onClick={() => { navigate('/register'); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', color: textColor, border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.5)' : '#d1d5db'), borderRadius: '20px', padding: '10px', cursor: 'pointer', fontWeight: 600 }}>
                <Sparkles size={16} color="#e04f00" /> Devenir Tuteur / Eleve
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .burger-btn { display: block !important; } .desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .burger-btn { display: none !important; } .mobile-menu { display: none !important; } }
      `}</style>
    </nav>
  );
}