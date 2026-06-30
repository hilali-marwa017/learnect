import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [voirPassword, setVoirPassword] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'enseignant') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow border-0 rounded-4 p-4" style={{ maxWidth: '420px', width: '100%' }}>

        {/* Retour */}
        <div className="mb-3 text-center">
          <Link to="/" className="text-muted text-decoration-none small">
            <i className="bi bi-arrow-left me-1"></i>Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 60, height: 60 }}>
            <i className="bi bi-mortarboard fs-3"></i>
          </div>
          <h4 className="fw-bold mb-0">Learnect<span className="text-primary">.ma</span></h4>
          <p className="text-muted small mt-1">Connectez-vous à votre compte</p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i>
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label small fw-semibold">
              <i className="bi bi-envelope text-primary me-1"></i>Adresse Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="exemple@mail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">
              <i className="bi bi-lock text-primary me-1"></i>Mot de passe
            </label>
            <div className="input-group">
              <input
                type={voirPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                placeholder="Votre mot de passe"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setVoirPassword(!voirPassword)}
              >
                {voirPassword
                  ? <i className="bi bi-eye-slash"></i>   // visible → cliquer pour cacher
                  : <i className="bi bi-eye"></i>          // caché → cliquer pour voir
                }
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2"
            disabled={loading}
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2"></span>Connexion...</>
              : <><i className="bi bi-box-arrow-in-right me-2"></i>Se connecter</>
            }
          </button>

        </form>

        <hr className="my-3" />

        <p className="text-center text-muted small mb-0">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-primary fw-bold text-decoration-none">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;