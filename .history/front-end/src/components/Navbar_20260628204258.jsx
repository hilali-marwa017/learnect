// ====== FICHIER: src/components/Navbar.jsx ======
// METHODE DAIF - 100%

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Menu, X, LogOut, Bell, ChevronDown, Sparkles } from 'lucide-react';
import api from '../api/axios';

const getInitials = (user) => {
  if (!user) return '?';
  const prenom = user.prenom || '';
  const nom = user.nom || '';
  if (prenom && nom) return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  return user.email?.charAt(0).toUpperCase() || '?';
};

const getPhotoUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return 'http://localhost:8000/storage/' + photo;
};

const isLoggedIn = (user) => !!user;
const isAdmin = (user) => user?.role === 'admin';
const getUnreadCount = (notifications) => (notifications || []).filter(n => !n.est_lue).length;
const getHomeRoute = (user) => {
  if (user?.role === 'admin') return '/admin';
  if (user?.role === 'enseignant') return '/teacher';
  if (user?.role === 'etudiant') return '/student';
  return '/';
};

// ====== COMPOSANT AVATAR CORRIGE ======
// CORRECTION : suppression du double-chargement via new Image() qui creait
// une requete reseau fantome en parallele de la vraie balise <img>, causant
// l'erreur "OpaqueResponseBlocking / NS_BINDING_ABORTED" dans la console.
// On laisse maintenant la balise <img> seule gerer le chargement et l'erreur
// via onError, comme dans le reste du projet (ex: ProfilePhotoSection).

function Avatar({ user }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(user);
  const photoUrl = user?.photo ? getPhotoUrl(user.photo) : null;

  // reset l'etat d'erreur quand la photo change (ex: apres un upload),
  // sinon une ancienne erreur reste figee meme avec une nouvelle photo valide
  useEffect(() => {
    setImgError(false);
  }, [user?.photo]);

  return (
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #374151, #111827)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      {photoUrl && !imgError ? (
        <img
          src={photoUrl + '?v=' + Date.now()}
          alt="Profile"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
          {initials}
        </span>
      )}
    </div>
  );
}

function ThemeButton({ isDark, onToggleTheme }) {
  return (
    <button
      onClick={onToggleTheme}
      style={{
        background: isDark ? '#1a1a1c' : '#f1f3f5',
        borderRadius: '8px',
        padding: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        border: 'none'
      }}
    >
      {isDark ? <Sun size={18} color="#ffffff" /> : <Moon size={18} color="#07090d" />}
    </button>
  );
}

function NotificationBell({ unreadCount, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px'
      }}
    >
      <Bell size={20} color="var(--color-text)" />
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          minWidth: '18px',
          height: '18px',
          background: '#e04f00',
          borderRadius: '999px',
          fontSize: '0.6rem',
          fontWeight: 800,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px'
        }}>
          {unreadCount}
        </span>
      )}
    </button>
  );
}

function ProfileDropdown({ user, isOpen, onToggle, onLogout, isDark }) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      onLogout();
      setLoggingOut(false);
    }, 1200);
  };

  const ddBg = isDark ? '#0a0a0c' : '#ffffff';
  const ddBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const mutedColor = isDark ? '#a1a4a5' : '#718096';

  if (!user) return null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '8px'
        }}
      >
        <Avatar user={user} />
        <span style={{ color: textColor, fontSize: '0.9rem' }}>{user?.prenom || 'Compte'}</span>
        <ChevronDown size={14} color={mutedColor} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          background: ddBg,
          border: '1px solid ' + ddBorder,
          borderRadius: '12px',
          padding: '0.5rem',
          minWidth: '220px',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid ' + ddBorder, marginBottom: '4px' }}>
            <div style={{ fontWeight: 700, color: textColor, fontSize: '0.9rem' }}>
              {user?.prenom} {user?.nom}
            </div>
            <div style={{ color: mutedColor, fontSize: '0.7rem' }}>{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              color: '#dc2626',
              textAlign: 'left',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 500,
              opacity: loggingOut ? 0.7 : 1
            }}
          >
            {loggingOut ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(220,38,38,0.25)',
                  borderTopColor: '#dc2626',
                  borderRadius: '50%',
                  animation: 'spin 0.75s linear infinite',
                  flexShrink: 0
                }} />
                Deconnexion...
              </>
            ) : (
              <><LogOut size={16} /> Deconnexion</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function AuthButtons({ onNavigate, isDark }) {
  const textColor = isDark ? '#ffffff' : '#07090d';
  const border = isDark ? 'rgba(255,255,255,0.3)' : '#d1d5db';

  return (
    <>
      <button
        onClick={() => onNavigate('/login')}
        style={{
          background: 'transparent',
          color: textColor,
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 500,
          padding: '8px 20px',
          borderRadius: '8px',
          border: '1px solid ' + border
        }}
      >
        Connexion
      </button>
      <button
        onClick={() => onNavigate('/register')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          color: textColor,
          border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.5)' : '#d1d5db'),
          borderRadius: '20px',
          padding: '8px 20px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}
      >
        <Sparkles size={16} color="#e04f00" /> Devenir Tuteur / Eleve
      </button>
    </>
  );
}

function MobileMenu({ isOpen, isDark, onToggleTheme, isLoggedIn, onLogout, onNavigate }) {
  const navBg = isDark ? '#0a0a0c' : '#ffffff';
  const navBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#ffffff' : '#07090d';

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      left: 0,
      right: 0,
      background: navBg,
      borderBottom: '1px solid ' + navBorder,
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      zIndex: 99
    }}>
      <button
        onClick={onToggleTheme}
        style={{
          background: isDark ? '#1a1a1c' : '#f1f3f5',
          borderRadius: '8px',
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          border: 'none',
          color: textColor
        }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
        {isDark ? 'Mode clair' : 'Mode sombre'}
      </button>

      {isLoggedIn ? (
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px',
            cursor: 'pointer',
            color: '#dc2626',
            background: 'none',
            border: 'none',
            fontSize: '0.9rem'
          }}
        >
          <LogOut size={16} /> Deconnexion
        </button>
      ) : (
        <>
          <button
            onClick={() => { onNavigate('/login'); }}
            style={{
              padding: '10px',
              cursor: 'pointer',
              color: textColor,
              textAlign: 'center',
              border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.3)' : '#d1d5db'),
              borderRadius: '8px',
              background: 'transparent'
            }}
          >
            Connexion
          </button>
          <button
            onClick={() => { onNavigate('/register'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'transparent',
              color: textColor,
              border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.5)' : '#d1d5db'),
              borderRadius: '20px',
              padding: '10px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <Sparkles size={16} color="#e04f00" /> Devenir Tuteur / Eleve
          </button>
        </>
      )}
    </div>
  );
}

export default function Navbar({ isDark, onToggleTheme, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loggedIn = isLoggedIn(user);
  const admin = isAdmin(user);

  useEffect(() => {
    if (!loggedIn || admin) return;

    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications');
        setUnreadCount(getUnreadCount(res.data));
      } catch (e) {
        setUnreadCount(0);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [loggedIn, admin, location.pathname]);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const handleNotificationClick = () => {
    if (user?.role === 'enseignant') navigate('/teacher/notifications');
    else if (user?.role === 'etudiant') navigate('/student/notifications');
  };

  const handleLogoClick = () => {
    navigate(getHomeRoute(user));
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsOpen(false);
    onLogout();
  };

  const navBg = isDark ? '#0a0a0c' : '#ffffff';
  const navBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#ffffff' : '#07090d';

  return (
    <nav style={{
      background: navBg,
      borderBottom: '1px solid ' + navBorder,
      padding: '0 2rem',
      height: '70px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div
          onClick={handleLogoClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <GraduationCap size={24} color="#e04f00" />
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: textColor }}>
            Learn<span style={{ color: '#e04f00' }}>ect</span>.ma
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ThemeButton isDark={isDark} onToggleTheme={onToggleTheme} />
          {loggedIn ? (
            <>
              {!admin && (
                <NotificationBell
                  unreadCount={unreadCount}
                  onClick={handleNotificationClick}
                />
              )}
              <ProfileDropdown
                user={user}
                isOpen={isProfileOpen}
                onToggle={() => setIsProfileOpen(!isProfileOpen)}
                onLogout={handleLogout}
                isDark={isDark}
              />
            </>
          ) : (
            <AuthButtons
              onNavigate={handleNavigate}
              isDark={isDark}
            />
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="burger-btn"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: textColor,
            padding: '8px',
            display: 'none'
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <MobileMenu
        isOpen={isOpen}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        isLoggedIn={loggedIn}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .burger-btn { display: block !important; }
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 769px) {
          .burger-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}