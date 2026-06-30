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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 140px)',
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 35px -12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef',
      }}>
        
        {/* Bouton retour - EN HAUT À GAUCHE de la carte */}
        <div style={{ marginBottom: '20px' }}>
          <Link 
            to="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'color 0.2s',
              padding: '4px 8px',
              marginLeft: '-8px',
              borderRadius: '6px',
            }}
            onMouseOver={e => {
              e.currentTarget.style.color = '#0d6efd';
              e.currentTarget.style.background = '#f1f5f9';
            }}
            onMouseOut={e => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <i className="bi bi-arrow-left" style={{ fontSize: '0.8rem' }}></i>
            Retour
          </Link>
        </div>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <i className="bi bi-mortarboard" style={{ fontSize: '24px', color: 'white' }}></i>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' }}>
            Learnect<span style={{ color: '#0d6efd' }}>.ma</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500' }}>Authentification</p>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '10px 14px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <i className="bi bi-exclamation-triangle-fill"></i>
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#334155', fontSize: '0.75rem' }}>
              <i className="bi bi-envelope" style={{ marginRight: '6px', color: '#0d6efd', fontSize: '0.7rem' }}></i> Adresse Email
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
                padding: '10px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#0d6efd'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#334155', fontSize: '0.75rem' }}>
              <i className="bi bi-lock" style={{ marginRight: '6px', color: '#0d6efd', fontSize: '0.7rem' }}></i> Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Entrez votre mot de passe"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  paddingRight: '42px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
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
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash" style={{ fontSize: '1rem' }}></i>
                ) : (
                  <i className="bi bi-eye" style={{ fontSize: '1rem' }}></i>
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
              padding: '11px',
              background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #edf2f7' }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
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