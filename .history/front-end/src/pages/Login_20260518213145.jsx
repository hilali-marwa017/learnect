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
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* LEFT — visuel */}
      <div style={{
        background: 'var(--grad)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 60, position: 'relative', overflow: 'hidden',
      }} className="d-none d-lg-flex">
        <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '4rem', marginBottom: 24 }}>🎓</div>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: '2.2rem', marginBottom: 16, letterSpacing: -0.8 }}>
            Bon retour !
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontSize: '1rem', maxWidth: 320 }}>
            Connectez-vous pour accéder à vos cours, réservations et messages.
          </p>
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            {['✓  Enseignants 100% vérifiés', '✓  Paiement sécurisé', '✓  Support disponible'].map((t, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500, fontSize: '0.95rem' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — formulaire */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'white' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900 }}>L</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark)' }}>Learnect</span>
          </Link>

          <h2 style={{ fontWeight: 900, fontSize: '1.9rem', letterSpacing: -0.5, marginBottom: 8 }}>Connexion</h2>
          <p style={{ color: 'var(--gray)', marginBottom: 32, fontSize: '0.95rem' }}>Entrez vos identifiants pour continuer</p>

          {error && (
            <div style={{ background: '#FFF0F3', border: '1px solid #FFD6E0', color: '#C0143C', padding: '12px 16px', borderRadius: 12, marginBottom: 24, fontSize: '0.88rem', fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: '0.87rem', color: 'var(--dark)', display: 'block', marginBottom: 8 }}>Email</label>
              <input type="email" name="email" className="inp" placeholder="vous@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: '0.87rem', color: 'var(--dark)', display: 'block', marginBottom: 8 }}>Mot de passe</label>
              <input type="password" name="password" className="inp" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-grad" style={{ width: '100%', textAlign: 'center', padding: '14px', fontSize: '0.95rem', marginTop: 8, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--gray)', fontSize: '0.9rem' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: 'var(--p1)', fontWeight: 700, textDecoration: 'none' }}>S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;