import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
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
      background: 'linear-gradient(135deg, #1B2B5E 0%, #2d4a9e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, maxWidth: 900, width: '100%', borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>

        {/* LEFT — décoratif */}
        <div style={{
          background: 'linear-gradient(135deg, #FF6B35, #e85a25)',
          padding: 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }} className="d-none d-md-flex">
          <div style={{ fontSize: '3rem', marginBottom: 24 }}>🎓</div>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: '2rem', marginBottom: 16 }}>
            Bon retour !
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontSize: '1rem' }}>
            Connectez-vous pour accéder à vos cours, réservations et messages.
          </p>
          <div style={{ marginTop: 40 }}>
            {['Enseignants vérifiés ✓','Paiement sécurisé ✓','Support 7j/7 ✓'].map((t, i) => (
              <div key={i} style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 12, fontWeight: 500 }}>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — formulaire */}
        <div style={{ background: 'white', padding: 60 }}>
          <div style={{ marginBottom: 36 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1B2B5E' }}>
                Learn<span style={{ color: '#FF6B35' }}>ect</span>
              </span>
            </Link>
            <h3 style={{ fontWeight: 800, color: '#1B2B5E', marginBottom: 8 }}>Connexion</h3>
            <p style={{ color: '#6B7280' }}>Entrez vos identifiants pour continuer</p>
          </div>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '12px 16px', borderRadius: 12, marginBottom: 24, fontSize: '0.9rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                className="input-custom"
                placeholder="vous@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                className="input-custom"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary-custom"
              style={{ width: '100%', textAlign: 'center', fontSize: '1rem', padding: '14px', opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? '⏳ Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, color: '#6B7280', fontSize: '0.9rem' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#FF6B35', fontWeight: 700, textDecoration: 'none' }}>
              S'inscrire
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;