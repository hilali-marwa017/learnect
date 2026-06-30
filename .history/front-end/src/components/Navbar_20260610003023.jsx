import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleToggleRegisterMenu() {
    setShowRegisterMenu(!showRegisterMenu);
  }

  function handleCloseRegisterMenu() {
    setShowRegisterMenu(false);
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  function getDashboardLink() {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'enseignant') return '/enseignant/dashboard';
    return '/etudiant/dashboard';
  }

  function getInitials() {
    if (!user) return 'A';
    const prenom = user.prenom || '';
    const nom = user.nom || '';
    if (prenom.length > 0 && nom.length > 0) return prenom[0].toUpperCase() + nom[0].toUpperCase();
    if (prenom.length > 0) return prenom[0].toUpperCase();
    if (nom.length > 0) return nom[0].toUpperCase();
    return 'A';
  }

  function getUserRole() {
    if (!user) return '';
    if (user.role === 'admin') return 'ADMIN';
    if (user.role === 'enseignant') return 'TUTEUR';
    return 'ÉLÈVE';
  }

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      <div style={{ width: '100%', padding: '0 48px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link to={getDashboardLink()} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-mortarboard" style={{ fontSize: '1.2rem', color: 'white' }}></i>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', letterSpacing: -0.5 }}>Learnect<span style={{ color: '#0d6efd' }}>.ma</span></div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Cours Particuliers · Maroc</div>
          </div>
        </Link>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {user ? (
            <>
              {/* User Avatar + Dashboard Link */}
              <Link to={getDashboardLink()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 50, border: '1.5px solid #e5e7eb', background: '#f8fafc', textDecoration: 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>
                  {getInitials()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>{user.prenom} {user.nom}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#0d6efd', textTransform: 'uppercase' }}>{getUserRole()}</div>
                </div>
              </Link>

              {/* Logout Button with Icon and Spinner */}
              <button 
                onClick={handleLogout} 
                disabled={isLoggingOut} 
                style={{ 
                  background: 'transparent', 
                  border: '1.5px solid #dc2626', 
                  borderRadius: 10, 
                  fontSize: 14, 
                  padding: '9px 20px', 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  color: '#dc2626', 
                  cursor: isLoggingOut ? 'not-allowed' : 'pointer', 
                  opacity: isLoggingOut ? 0.7 : 1 
                }}
              >
                {isLoggingOut ? (
                  <>
                    <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px' }}></span>
                    <span>Déconnexion...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-right" style={{ fontSize: '1rem' }}></i>
                    <span>Déconnexion</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Register Dropdown */}
              <div style={{ position: 'relative' }}>
                <button onClick={handleToggleRegisterMenu} style={{ background: '#0d6efd', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, padding: '9px 20px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  S'inscrire <i className={`bi bi-chevron-${showRegisterMenu ? 'up' : 'down'}`} style={{ fontSize: 11 }} />
                </button>
                {showRegisterMenu && (
                  <div style={{ position: 'absolute', top: 48, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb', width: 260, zIndex: 200 }}>
                    <Link to="/register?role=etudiant" onClick={handleCloseRegisterMenu} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', textDecoration: 'none', color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e2e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#000000' }}>
                        <i className="bi bi-journal-bookmark-fill"></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Je suis étudiant</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Trouver un professeur</div>
                      </div>
                    </Link>
                    <Link to="/register?role=enseignant" onClick={handleCloseRegisterMenu} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#1565c0' }}>
                        <i className="bi bi-person-workspace"></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Je suis enseignant</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Partager mes connaissances</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Login Button */}
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