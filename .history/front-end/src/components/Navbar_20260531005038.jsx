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
              {/* cloche */}
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
                    width: 300, zIndex