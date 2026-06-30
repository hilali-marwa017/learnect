import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '/Login.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

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
    <div className="auth-bg">
      <div className="auth-card">

        {/* logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <h2 className="auth-title">Learnect<span>.ma</span></h2>
          <p className="auth-subtitle">Connectez-vous à votre compte</p>
        </div>

        {/* erreur */}
        {error && (
          <div className="auth-error">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {/* formulaire */}
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Adresse Email</label>
            <div className="input-icon-wrap">
              <i className="bi bi-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control input-with-icon"
                placeholder="Entrez votre email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Mot de passe</label>
            <div className="input-icon-wrap">
              <i className="bi bi-lock input-icon"></i>
              <input
                type={showPwd ? 'text' : 'password'}
                id="password"
                name="password"
                className="form-control input-with-icon input-with-icon-right"
                placeholder="Entrez votre mot de passe"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)}>
                <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading
              ? <><i className="bi bi-arrow-repeat me-2"></i>Connexion...</>
              : <><i className="bi bi-box-arrow-in-right me-2"></i>Se connecter</>
            }
          </button>
        </form>

        <div className="auth-links">
          <p>Pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
          <Link to="/" className="auth-back">
            <i className="bi bi-arrow-left me-1"></i>Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;