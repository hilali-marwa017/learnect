import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const unreadCount = 0;

  async function handleLogout() {
    setIsLoggingOut(true);
    await new Promise(r => setTimeout(r, 1200));
    navigate('/');
    logout();
  }

  function getDashboardLink() {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'enseignant') return '/enseignant/dashboard';
    return '/etudiant/dashboard';
  }

  const btnStyle = { background: 'transparent', border: '1.5px solid #dc2626', borderRadius: 10, fontSize: 14, padding: '9px 20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', minWidth: '130px', justifyContent: 'center', cursor: 'pointer' };

  return (
    <>
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
                    {unreadCount > 0 && (
                      <span style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotif && (
                    <div style={{ position: 'absolute', top: 50, right: 0, background: 'white', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb', width: 300, zIndex: 100, overflow: 'hidden' }}>
                      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Notifications</span>
                        <button style={{ background: 'none', border: 'none', color: '#0d6efd', fontSize: '0.72rem', cursor: 'pointer' }}>Tout marquer lu</button>
                      </div>
                      <div style={{ padding: '24px 18px', textAlign: 'center', color: '#94a3b8' }}>
                        <i className="bi bi-bell-slash" style={{ fontSize: '2rem' }}></i>
                        <div>Aucune notification</div>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ width: 1, height: 28, background: '#e5e7eb' }} />
                <Link to={getDashboardLink()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 50, border: '1.5px solid #e5e7eb', background: '#f8fafc', textDecoration: 'none' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>
                    {user?.prenom?.[0]?.toUpperCase() || user?.nom?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>{user?.prenom} {user?.nom}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#0d6efd', textTransform: 'uppercase' }}>
                      {user?.role === 'admin' ? 'ADMIN' : user?.role === 'enseignant' ? 'TUTEUR' : 'ÉLÈVE'}
                    </div>
                  </div>
                </Link>
                <button onClick={() => setShowLogoutModal(true)} style={btnStyle}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Déconnexion</span>
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
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e2e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                          <i className="bi bi-journal-bookmark-fill"></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Je suis étudiant</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Trouver un professeur</div>
                        </div>
                      </Link>
                      <Link to="/register?role=enseignant" onClick={() => setShowRegisterMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', textDecoration: 'none', color: '#0f172a' }}>
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
                <Link to="/login" style={{ background: 'transparent', color: '#1a1a1a', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, padding: '9px 24px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="bi bi-box-arrow-in-right"></i> Se connecter
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MODAL DÉCONNEXION */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ display: 'flex', maxWidth: '780px', width: '100%', background: 'white', borderRadius: '24px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>

            {/* Panel gauche — même style que Login */}
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #3c78d3, #0a58ca)', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: 56, height: 56, background: '#ffffff33', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <i className="bi bi-mortarboard" style={{ fontSize: 28, color: 'white' }}></i>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 12, letterSpacing: '-0.5px' }}>
                  Learnect<span style={{ color: '#0b0b0b' }}>.ma</span>
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#ffffffcc', marginBottom: 32, lineHeight: 1.6 }}>PORTAL ACADÉMIQUE MAROCAIN</p>
                <div style={{ background: '#ffffff26', borderRadius: 12, padding: 16, marginBottom: 24, borderLeft: '2px solid #060606' }}>
                  <p style={{ fontSize: '0.85rem', color: 'white', margin: 0 }}>
                    <i className="bi bi-shield-check me-2"></i>Votre session sera fermée en toute sécurité.
                  </p>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: 8 }}>
                  À bientôt,<br />{user?.prenom} !
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#ffffffb3' }}>Vos données sont sauvegardées et sécurisées.</p>
              </div>
            </div>

            {/* Panel droit */}
            <div style={{ flex: 1, padding: '48px 44px', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <button onClick={() => setShowLogoutModal(false)} style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f0f0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                  <i className="bi bi-x-lg" style={{ fontSize: '1.2rem' }}></i>
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.4rem', margin: '0 auto 16px' }}>
                  {user?.prenom?.[0]?.toUpperCase() || 'A'}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                  Voulez-vous vous déconnecter ?
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {user?.prenom} {user?.nom} · <span style={{ color: '#0d6efd', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    {user?.role === 'admin' ? 'Admin' : user?.role === 'enseignant' ? 'Tuteur' : 'Élève'}
                  </span>
                </p>
              </div>

              {isLoggingOut ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <span className="spinner-border" style={{ width: 32, height: 32, borderWidth: '3px', color: '#0d6efd' }}></span>
                  <p style={{ marginTop: 12, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Déconnexion en cours...</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleLogout}
                    style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}
                  >
                    <i className="bi bi-box-arrow-right"></i> Confirmer la déconnexion
                  </button>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    style={{ width: '100%', padding: '14px', background: 'white', color: '#334155', border: '1.5px solid #e2e8f0', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    Annuler
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;