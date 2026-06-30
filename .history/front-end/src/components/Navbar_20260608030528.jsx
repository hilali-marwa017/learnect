import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setTimeout(() => {
      setIsLoggingOut(false);
      navigate('/');
    }, 500);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'enseignant') return '/enseignant/dashboard';
    return '/etudiant/dashboard';
  };

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      
      <Link to={getDashboardLink()} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: '#0d6efd', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="bi bi-mortarboard" style={{ color: 'white' }}></i>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Learnect<span style={{ color: '#0d6efd' }}>.ma</span></div>
          <div style={{ fontSize: 8, color: '#94a3b8' }}>COURS PARTICULIERS · MAROC</div>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontSize: 13 }}>{user.prenom} {user.nom}</span>
            <span style={{ fontSize: 10, color: '#0d6efd' }}>{user.role === 'admin' ? 'ADMIN' : user.role === 'enseignant' ? 'TUTEUR' : 'ÉLÈVE'}</span>
            <button onClick={handleLogout} disabled={isLoggingOut} style={{ background: '#dc2626', border: 'none', borderRadius: 6, padding: '6px 14px', color: 'white', fontSize: 12, cursor: 'pointer', minWidth: '100px' }}>
              {isLoggingOut ? <span className="spinner-border spinner-border-sm"></span> : 'Déconnexion'}
            </button>
          </>
        ) : (
          <>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowRegisterMenu(!showRegisterMenu)} style={{ background: '#0d6efd', border: 'none', borderRadius: 6, padding: '6px 14px', color: 'white', fontSize: 12, cursor: 'pointer' }}>
                S'inscrire
              </button>
              {showRegisterMenu && (
                <div style={{ position: 'absolute', top: 35, right: 0, background: 'white', border: '1px solid #ddd', borderRadius: 6, width: 160 }}>
                  <Link to="/register?role=etudiant" onClick={() => setShowRegisterMenu(false)} style={{ display: 'block', padding: '8px 12px', textDecoration: 'none', color: '#333', fontSize: 13 }}>👨‍🎓 Étudiant</Link>
                  <Link to="/register?role=enseignant" onClick={() => setShowRegisterMenu(false)} style={{ display: 'block', padding: '8px 12px', textDecoration: 'none', color: '#333', fontSize: 13 }}>👨‍🏫 Enseignant</Link>
                </div>
              )}
            </div>
            <Link to="/login" style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: '6px 18px', textDecoration: 'none', color: '#333', fontSize: 12 }}>Se connecter</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;