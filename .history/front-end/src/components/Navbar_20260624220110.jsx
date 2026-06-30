  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { GraduationCap, Sun, Moon, Menu, X, LogOut, Bell, ChevronDown, Sparkles } from 'lucide-react';
  import api from '../api/axios';

  export default function Navbar({ isDark, onToggleTheme, user, onLogout }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    
    const isLoggedIn = user !== null && user !== undefined;
    const isAdmin = user?.role === 'admin';

    // Récupérer le nombre de notifications non lues
    useEffect(() => {
      if (!isLoggedIn || isAdmin) return;
      
      async function fetchUnread() {
        try {
          const res = await api.get('/notifications/unread');
          setUnreadCount(res.data.count || 0);
        } catch (e) {
          console.error('Erreur lors du chargement des notifications:', e);
        }
      }

      fetchUnread();
      const interval = setInterval(fetchUnread, 30000); // toutes les 30s
      return () => clearInterval(interval);
    }, [isLoggedIn, isAdmin]);

    const getInitials = () => {
      if (!user) return '?';
      const prenom = user.prenom || '';
      const nom = user.nom || '';
      if (prenom && nom) return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
      if (prenom) return prenom.charAt(0).toUpperCase();
      if (nom) return nom.charAt(0).toUpperCase();
      return user.email?.charAt(0).toUpperCase() || '?';
    };

    function handleLogout() {
      setLoggingOut(true);
      setIsProfileOpen(false);
      setIsOpen(false);
      setTimeout(() => {
        onLogout();
        setLoggingOut(false);
      }, 800);
    }

    // Navigation vers les notifications selon le rôle
    function handleNotificationClick() {
      if (user?.role === 'enseignant') {
        navigate('/teacher/notifications');
      } else if (user?.role === 'etudiant') {
        navigate('/student/notifications');
      }
    }

    const ddBg = isDark ? '#0a0a0c' : '#ffffff';
    const ddBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const ddText = isDark ? '#ffffff' : '#07090d';

    return (
      <nav style={{ 
        background: isDark ? '#0a0a0c' : '#ffffff', 
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, 
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

          {/* Logo */}
          <div
            onClick={() => {
              if (isAdmin) navigate('/admin');
              else if (user?.role === 'enseignant') navigate('/teacher');
              else if (user?.role === 'etudiant') navigate('/student');
              else navigate('/');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <GraduationCap size={24} color="#e04f00" />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: isDark ? '#ffffff' : '#07090d' }}>
              Learn<span style={{ color: '#e04f00' }}>ect</span>.ma
            </span>
          </div>

          {/* Desktop */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

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

            {isLoggedIn ? (
              <>
                {!isAdmin && (
                  <button 
                    onClick={handleNotificationClick} 
                    style={{ 
                      position: 'relative', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      padding: '8px' 
                    }}
                  >
                    <Bell size={20} color={isDark ? '#ffffff' : '#07090d'} />
                    {unreadCount > 0 && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '2px', 
                        right: '2px', 
                        width: '8px', 
                        height: '8px', 
                        background: '#e04f00', 
                        borderRadius: '50%' 
                      }} />
                    )}
                  </button>
                )}

                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
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
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: '#e04f00', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
                        {getInitials()}
                      </span>
                    </div>
                    <span style={{ color: isDark ? '#ffffff' : '#07090d', fontSize: '0.9rem' }}>
                      {user?.prenom || 'Compte'}
                    </span>
                    <ChevronDown size={14} color={isDark ? '#a1a4a5' : '#4a5568'} />
                  </button>

                  {isProfileOpen && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      right: 0, 
                      marginTop: '8px', 
                      background: ddBg, 
                      border: `1px solid ${ddBorder}`, 
                      borderRadius: '12px', 
                      padding: '0.5rem', 
                      minWidth: '220px', 
                      zIndex: 100, 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }}>

                      <div style={{ 
                        padding: '10px 12px', 
                        borderBottom: `1px solid ${ddBorder}`, 
                        marginBottom: '4px' 
                      }}>
                        <div style={{ fontWeight: 700, color: ddText, fontSize: '0.9rem' }}>
                          {user?.prenom} {user?.nom}
                        </div>
                        <div style={{ color: isDark ? '#a1a4a5' : '#718096', fontSize: '0.7rem' }}>
                          {user?.email}
                        </div>
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
                          opacity: loggingOut ? 0.7 : 1, 
                          transition: 'all 0.15s' 
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {loggingOut ? (
                          <><span className="ios-spinner" /> Déconnexion...</>
                        ) : (
                          <><LogOut size={16} /> Déconnexion</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')} 
                  style={{ 
                    background: 'transparent', 
                    color: isDark ? '#ffffff' : '#1f2937', 
                    cursor: 'pointer', 
                    fontSize: '0.9rem', 
                    fontWeight: 500, 
                    padding: '8px 20px', 
                    borderRadius: '8px', 
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : '#d1d5db'}` 
                  }}
                >
                  Connexion
                </button>
                <button 
                  onClick={() => navigate('/register')} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: 'transparent', 
                    color: isDark ? '#ffffff' : '#1f2937', 
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.5)' : '#d1d5db'}`, 
                    borderRadius: '20px', 
                    padding: '8px 20px', 
                    cursor: 'pointer', 
                    fontWeight: 600, 
                    fontSize: '0.9rem' 
                  }}
                >
                  <Sparkles size={16} color="#e04f00" /> Devenir Tuteur / Élève
                </button>
              </>
            )}
          </div>

          {/* Burger */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="burger-btn" 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: isDark ? '#ffffff' : '#07090d', 
              padding: '8px', 
              display: 'none' 
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu" style={{ 
            position: 'fixed', 
            top: '70px', 
            left: 0, 
            right: 0, 
            background: isDark ? '#0a0a0c' : '#ffffff', 
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, 
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
                color: isDark ? '#ffffff' : '#07090d' 
              }}
            >
              {isDark ? <Sun size={16} color="#ffffff" /> : <Moon size={16} color="#07090d" />}
              {isDark ? 'Mode clair' : 'Mode sombre'}
            </button>

            {/* Bouton Notifications dans le menu mobile */}
            {isLoggedIn && !isAdmin && (
              <button 
                onClick={() => {
                  handleNotificationClick();
                  setIsOpen(false);
                }} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '10px', 
                  cursor: 'pointer', 
                  color: isDark ? '#ffffff' : '#07090d', 
                  textAlign: 'left', 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '0.9rem',
                  position: 'relative'
                }}
              >
                <Bell size={18} />
                Notifications
                {unreadCount > 0 && (
                  <span style={{ 
                    marginLeft: 'auto',
                    background: '#e04f00', 
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '10px', 
                  cursor: loggingOut ? 'not-allowed' : 'pointer', 
                  color: '#dc2626', 
                  textAlign: 'left', 
                  background: 'none', 
                  border: 'none', 
                  opacity: loggingOut ? 0.7 : 1, 
                  fontSize: '0.9rem' 
                }}
              >
                {loggingOut ? (
                  <><span className="ios-spinner" /> Déconnexion...</>
                ) : (
                  <><LogOut size={16} /> Déconnexion</>
                )}
              </button>
            ) : (
              <>
                <button 
                  onClick={() => { navigate('/login'); setIsOpen(false); }} 
                  style={{ 
                    padding: '10px', 
                    cursor: 'pointer', 
                    color: isDark ? '#ffffff' : '#1f2937', 
                    textAlign: 'center', 
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : '#d1d5db'}`, 
                    borderRadius: '8px', 
                    background: 'transparent' 
                  }}
                >
                  Connexion
                </button>
                <button 
                  onClick={() => { navigate('/register'); setIsOpen(false); }} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    background: 'transparent', 
                    color: isDark ? '#ffffff' : '#1f2937', 
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.5)' : '#d1d5db'}`, 
                    borderRadius: '20px', 
                    padding: '10px', 
                    cursor: 'pointer', 
                    fontWeight: 600 
                  }}
                >
                  <Sparkles size={16} color="#e04f00" /> Devenir Tuteur / Élève
                </button>
              </>
            )}
          </div>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .ios-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(220, 38, 38, 0.25);
            border-top-color: #dc2626;
            border-radius: 50%;
            animation: spin 0.75s linear infinite;
            flex-shrink: 0;
          }
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