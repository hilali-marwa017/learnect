import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await login(form.email, form.password);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'enseignant') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #eef2f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px 44px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e9ecef',
      }}>
        
        {/* Header avec logo et titre */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 8px 20px rgba(13,110,253,0.2)',
          }}>
            <i className="bi bi-mortarboard" style={{ fontSize: '24px', color: 'white' }}></i>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            Learnect<span style={{ color: '#0d6efd' }}>.ma</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '500', letterSpacing: '1px' }}>
            PORTAL ACADÉMIQUE MAROCAIN
          </p>
        </div>

        {/* Badge premier cours offert */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderRadius: '40px',
          padding: '8px 16px',
          textAlign: 'center',
          marginBottom: '24px',
          border: '1px solid #fcd34d',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#92400e' }}>
            💡 Premier cours offert sur Learnect !
          </span>
        </div>

        {/* Titre principal */}
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: '#0f172a',
          textAlign: 'center',
          marginBottom: '8px',
          letterSpacing: '-0.5px',
        }}>
          Trouvez le tuteur idéal qui fera la différence.
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: '#64748b',
          textAlign: 'center',
          marginBottom: '28px',
          lineHeight: '1.5',
        }}>
          Rejoignez des milliers d'étudiants marocains pour
        </p>

        {/* Sous-titre connexion */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '4px',
          }}>
            Content de vous revoir !
          </h3>
          <p style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
          }}>
            Veuillez vous authentifier pour accéder à votre espace d'apprentissage
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{
            background: '#fef2f2',
            borderLeft: '3px solid #ef4444',
            padding: '10px 14px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: '#dc2626',
          }}>
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#334155',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              ADRESSE EMAIL
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1rem',
                color: '#94a3b8',
              }}>
                📧
              </span>
              <input
                type="email"
                name="email"
                placeholder="marwa.hilali@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  background: '#f8fafc',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#0d6efd';
                  e.target.style.background = 'white';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                }}
              />
            </div>
          </div>

          {/* Mot de passe avec œil */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#334155',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              MOT DE PASSE
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1rem',
                color: '#94a3b8',
              }}>
                🔗
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  paddingRight: '48px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  background: '#f8fafc',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#0d6efd';
                  e.target.style.background = 'white';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#94a3b8',
                  transition: 'color 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
                onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
              >
                {showPassword ? (
                  <i className="bi bi-eye" style={{ fontSize: '1.1rem' }}></i>
                ) : (
                  <i className="bi bi-eye-slash" style={{ fontSize: '1.1rem' }}></i>
                )}
              </button>
            </div>
          </div>

          {/* Bouton connexion */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
            onMouseOver={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(13,110,253,0.3)';
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm"></span> Connexion...</>
            ) : (
              <><i className="bi bi-box-arrow-in-right"></i> OUVRIR MA SESSION</>
            )}
          </button>

        </form>

        {/* Lien création de compte */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#0d6efd', fontWeight: '600', textDecoration: 'none' }}>
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Retour accueil */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link 
            to="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
            onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <i className="bi bi-arrow-left"></i> Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;