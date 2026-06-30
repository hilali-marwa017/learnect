import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 140px)',
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 35px -12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef',
      }}>
        
        {/* BOUTON RETOUR */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link 
            to="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'color 0.2s',
              fontWeight: 500,
            }}
            onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
            onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <i className="bi bi-arrow-left"></i> Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(13,110,253,0.25)',
          }}>
            <i className="bi bi-mortarboard" style={{ fontSize: '28px', color: 'white' }}></i>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            Learnect<span style={{ color: '#0d6efd' }}>.ma</span>
          </h2>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
          }}>
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '0.85rem' }}>
              <i className="bi bi-envelope" style={{ marginRight: '6px', color: '#0d6efd' }}></i> Adresse Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Entrez votre email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#0d6efd'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '0.85rem' }}>
              <i className="bi bi-lock" style={{ marginRight: '6px', color: '#0d6efd' }}></i> Mot de passe
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'password' : 'text'}
                name="password"
                placeholder="Entrez votre mot de passe"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '48px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#adb5bd',
                  transition: 'color 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
                onMouseOut={e => e.currentTarget.style.color = '#adb5bd'}
              >
                {showPassword
                  ? <i className="bi bi-eye-slash" style={{ fontSize: '1.2rem' }}></i>
                  : <i className="bi bi-eye" style={{ fontSize: '1.2rem' }}></i>
                }
              </button>
            </div>
          </div>

          {/* Bouton Se connecter */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
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
              <><i className="bi bi-box-arrow-in-right"></i> Se connecter</>
            )}
          </button>

        </form>

        {/* Lien inscription */}
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e9ecef' }}>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#0d6efd', fontWeight: '600', textDecoration: 'none' }}>
              Créer un compte
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;