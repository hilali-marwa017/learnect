import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin')           navigate('/admin/dashboard');
      else if (user.role === 'enseignant') navigate('/teacher/dashboard');
      else                                 navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* cercles déco */}
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(13,110,253,0.06)', top: -100, right: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(13,110,253,0.04)', bottom: -80, left: -80, pointerEvents: 'none' }} />

      {/* card */}
      <div style={{
        background: 'white',
        borderRadius: 24,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        position: 'relative',
      }}>

        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(13,110,253,0.3)',
          }}>
            🎓
          </div>
          <h2 style={{ fontFamily: 'Geist, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#0f172a', marginBottom: 6, letterSpacing: -0.5 }}>
            Learnect.ma
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>
            Connectez-vous à votre compte
          </p>
        </div>

        {/* erreur */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 10, marginBottom: 20, fontSize: '0.83rem', fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}

        {/* formulaire */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* email */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7 }}>
              Adresse Email
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', color: '#94a3b8' }}>✉️</span>
              <input
                type="email"
                name="email"
                placeholder="Entrez votre email"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10,
                  padding: '11px 14px 11px 38px', fontSize: '0.9rem',
                  fontFamily: 'Geist, sans-serif', outline: 'none', color: '#0f172a',
                  transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* password */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7 }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', color: '#94a3b8' }}>🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Entrez votre mot de passe"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10,
                  padding: '11px 14px 11px 38px', fontSize: '0.9rem',
                  fontFamily: 'Geist, sans-serif', outline: 'none', color: '#0f172a',
                  transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* bouton */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
              color: 'white', border: 'none',
              padding: '13px', borderRadius: 10,
              fontSize: '0.95rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Geist, sans-serif',
              opacity: loading ? 0.7 : 1,
              marginTop: 4,
              boxShadow: '0 4px 12px rgba(13,110,253,0.3)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseOver={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(13,110,253,0.4)'; } }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,110,253,0.3)'; }}>
            {loading ? '⏳ Connexion...' : '🔑 Se connecter'}
          </button>
        </form>

        {/* footer card */}
        <p style={{ textAlign: 'center', marginTop: 24, color: '#94a3b8', fontSize: '0.83rem' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#0d6efd', fontWeight: 700, textDecoration: 'none' }}>
            Créer un compte
          </Link>
        </p>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, color: '#94a3b8', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 500 }}
          onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
          onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
          ← Retour à l'accueil
        </Link>

      </div>
    </div>
  );
}

export default Login;