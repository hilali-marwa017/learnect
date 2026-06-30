import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getProfileLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/profile';
    if (user.role === 'enseignant') return '/enseignant/profil';
    return '/etudiant/profil';
  };

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#0d6efd', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-mortarboard" style={{ color: 'white' }}></i>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>Learnect<span style={{ color: '#0d6efd' }}>.ma</span></div>
            <div style={{ fontSize: '8px', color: '#94a3b8' }}>COURS PARTICULIERS · MAROC</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAuthenticated && user ? (
            <>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowMenu(!showMenu)} 
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '40px', padding: '6px 16px', cursor: 'pointer' }}
                >
                  <div style={{ width: '32px', height: '32px', background: '#0d6efd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    {user.prenom?.[0]}{user.nom?.[0]}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{user.prenom} {user.nom}</div>
                    <div style={{ fontSize: '9px', color: '#0d6efd', textTransform: 'uppercase' }}>{user.role === 'admin' ? 'ADMIN' : user.role === 'enseignant' ? 'ENSEIGNANT' : 'ÉTUDIANT'}</div>
                  </div>
                  <i className="bi bi-chevron-down" style={{ fontSize: '10px' }}></i>
                </button>

                {showMenu && (
                  <div style={{ position: 'absolute', top: '50px', right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '200px', zIndex: 100 }}>
                    <Link to={getProfileLink()} onClick={() => setShowMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', textDecoration: 'none', color: '#000', borderBottom: '1px solid #e2e8f0' }}>
                      <i className="bi bi-person"></i>
                      <span>Mon profil</span>
                    </Link>
                    <button onClick={handleLogout} disabled={isLoggingOut} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', width: '100%', border: 'none', background: 'white', textAlign: 'left', cursor: 'pointer' }}>
                      <i className="bi bi-box-arrow-right"></i>
                      <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" style={{ padding: '6px 16px', border: '1px solid #0d6efd', borderRadius: '8px', textDecoration: 'none', color: '#0d6efd', fontSize: '13px' }}>Connexion</Link>
              <Link to="/register" style={{ padding: '6px 16px', background: '#0d6efd', borderRadius: '8px', textDecoration: 'none', color: 'white', fontSize: '13px' }}>Inscription</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;