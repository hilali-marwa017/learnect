import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const dashboardLink =
    user?.role === 'admin'      ? '/admin/dashboard' :
    user?.role === 'enseignant' ? '/teacher/dashboard' :
                                  '/student/dashboard';

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #f1f5f9',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: '100%',
        padding: '0 48px',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* LOGO */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 42, height: 42,
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 2px 8px rgba(13,110,253,0.25)',
          }}>
            <i className="bi bi-mortarboard"></i>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', letterSpacing: -0.5, lineHeight: 1.1, fontFamily: 'Geist, sans-serif' }}>
              Learnect<span style={{ color: '#0d6efd' }}>.ma</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.2 }}>
              Cours Particuliers · Maroc
            </div>
          </div>
        </Link>

        {/* DROITE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

          {isAuthenticated ? (
            <>
              {/* cloche de notification */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  style={{
                    width: 40, height: 40,
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '50%',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem',
                    transition: 'all 0.15s',
                    position: 'relative',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#0d6efd'; e.currentTarget.style.background = '#eff6ff'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#f8fafc'; }}>
                  <i className="bi bi-bell"></i>
                  <span style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#ef4444', color: 'white',
                    fontSize: 9, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid white',
                  }}>
                    3
                  </span>
                </button>

                {showNotif && (
                  <div style={{
                    position: 'absolute', top: 50, right: 0,
                    background: 'white', borderRadius: 16,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                    border: '1px solid #e5e7eb',
                    width: 300, zIndex: 100, overflow: 'hidden',
                  }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Notifications</span>
                      <button style={{ background: 'none', border: 'none', color: '#0d6efd', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
                        Tout marquer lu
                      </button>
                    </div>
                    <div style={{ padding: '24px 18px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔔</div>
                      Aucune nouvelle notification
                    </div>
                  </div>
                )}
              </div>

              {/* séparateur */}
              <div style={{ width: 1, height: 28, background: '#e5e7eb' }} />

              {/* avatar + nom */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 50, border: '1.5px solid #e5e7eb', background: '#f8fafc', cursor: 'pointer' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                }}>
                  {user?.prenom?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a', lineHeight: 1.1 }}>
                    {user?.prenom} {user?.nom}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#0d6efd', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {user?.role === 'admin' ? '🔴 Admin' : user?.role === 'enseignant' ? '🟡 Tuteur' : '🟢 Élève'}
                  </div>
                </div>
              </div>

              {/* dashboard */}
              <Link to={dashboardLink} style={{
                background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
                color: 'white', borderRadius: 10,
                fontSize: 14, padding: '9px 22px',
                fontWeight: 600, textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(13,110,253,0.25)',
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(13,110,253,0.35)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,110,253,0.25)'; }}>
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </Link>

              {/* déconnexion */}
              <button onClick={handleLogout} style={{
                background: 'transparent', color: '#64748b',
                border: '1.5px solid #e5e7eb',
                borderRadius: 10, fontSize: 14, padding: '9px 18px',
                fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Geist, sans-serif',
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              {/* Devenir tuteur - redirige directement vers formulaire enseignant */}
              <Link 
                to="/register?role=enseignant" 
                style={{
                  background: 'transparent', color: '#1a1a1a',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 10, fontSize: 14, padding: '9px 20px',
                  fontWeight: 600, textDecoration: 'none',
                  transition: 'all 0.2s', display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  letterSpacing: -0.2,
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#0d6efd'; e.currentTarget.style.color = '#0d6efd'; e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <i className="bi bi-person-workspace"></i>
                Devenir tuteur
              </Link>

              {/* Se connecter */}
              <Link 
                to="/login" 
                style={{
                  background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
                  color: 'white', borderRadius: 10,
                  fontSize: 14, padding: '9px 24px',
                  fontWeight: 600, textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(13,110,253,0.2)',
                  transition: 'all 0.2s', display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  letterSpacing: -0.2,
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(13,110,253,0.35)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,110,253,0.2)'; }}>
                <i className="bi bi-box-arrow-in-right"></i>
                Se connecter
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;