import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const unreadCount = 0;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    await new Promise(resolve => setTimeout(resolve, 300));
    navigate('/');
    setIsLoggingOut(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'enseignant') return '/enseignant/dashboard';
    return '/etudiant/dashboard';
  };

  const btnStyle = { background: 'transparent', border: '1.5px solid #dc2626', borderRadius: 10, fontSize: 14, padding: '9px 20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', minWidth: '130px', justifyContent: 'center' };

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      <div style={{ width: '100%', padding: '0 48px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <Link to={getDashboardLink()} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-mortarboard" style={{ fontSize: '1.2rem', color: 'white' }}></i>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', letterSpacing: -0.5 }}>Learnect<span style={{ color: '#0d6efd' }}>.ma</span></div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Cours Particuliers · Maroc</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {user ? (
            <>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowNotif(!showNotif)} style={{ width: 40, height: 40, border: '1.5px solid #e5e7eb', borderRadius: '50%', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <i className="bi bi-bell" style={{ fontSize: '1rem' }}></i>
                  {unreadCount > 0 && <span style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>{unreadCount}</span>}
                </button>
                {showNotif && (
                  <div style={{ position: 'absolute', top: 50, right: 0, background: 'white', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb', width: 300, zIndex: 100, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Notifications</span>
                      <button style={{ background: 'none', border: 'none', color: '#0d6efd', fontSize: '0.72rem', cursor: 'pointer' }}>Tout marquer lu</button>
                    </div>
                    <div style={{ padding: '24px 18px', textAlign: 'center', color: '#94a3b8' }}><i className="bi bi-bell-slash" style={{ fontSize: '2rem' }}></i><div>Aucune notification</div></div>
                  </div>
                )}
              </div>
              <div style={{ width: 1, height: 28, background: '#e5e7eb' }} />
              <Link to={getDashboardLink()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 50, border: '1.5px solid #e5e7eb', background: '#f8fafc', textDecoration: 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>{user?.prenom?.[0]?.toUpperCase() || user?.nom?.[0]?.toUpperCase() || 'A'}</div>
                <div><div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>{user?.prenom} {user?.nom}</div><div style={{ fontSize: 9, fontWeight: 700, color: '#0d6efd', textTransform: 'uppercase' }}>{user?.role === 'admin' ? 'ADMIN' : user?.role === 'enseignant' ? 'TUTEUR' : 'ÉLÈVE'}</div></div>
              </Link>
              <button onClick={handleLogout} disabled={isLoggingOut} style={{ ...btnStyle, cursor: isLoggingOut ? 'not-allowed' : 'pointer', opacity: isLoggingOut ? 0.7 : 1 }}>
                {isLoggingOut ? <><span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px' }}></span><span>Déconnexion...</span></> : <><i className="bi bi-box-arrow-right"></i><span>Déconnexion</span></>}
              </button>
            </>
          ) : (
            <>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowRegisterMenu(!showRegisterMenu)} style={{ background: '#0d6efd', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, padding: '9px 20px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  S'inscrire <i className={`bi bi-chevron-${showRegisterMenu ? 'up' : 'down'}`} style={{ fontSize: 11 }} />
                </button>
                {showRegisterMenu && (
                  <div style={{ position: 'absolute', top: 48, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb', width: 260, zIndex: 200 }}>
                    <Link to="/register?role=etudiant" onClick={() => setShowRegisterMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', textDecoration: 'none', color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e2e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#000000' }}><i className="bi bi-journal-bookmark-fill"></i></div>
                      <div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Je suis étudiant</div><div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Trouver un professeur</div></div>
                    </Link>
                    <Link to="/register?role=enseignant" onClick={() => setShowRegisterMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#1565c0' }}><i className="bi bi-person-workspace"></i></div>
                      <div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Je suis enseignant</div><div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Partager mes connaissances</div></div>
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/login" style={{ background: 'transparent', color: '#1a1a1a', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, padding: '9px 24px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-box-arrow-in-right"></i> Se connecter
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;