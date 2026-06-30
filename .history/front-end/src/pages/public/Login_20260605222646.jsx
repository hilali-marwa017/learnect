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
    <div className="d-flex align-items-center justify-content-center py-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="card border rounded-4 p-4 p-md-5 shadow-sm" style={{ maxWidth: '420px', width: '100%' }}>

        {/* Retour */}
        <div className="text-center mb-4">
          <Link to="/" className="text-muted text-decoration-none small fw-medium">
            <i className="bi bi-arrow-left me-1"></i>Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 64, height: 64 }}
          >
            <i className="bi bi-mortarboard fs-3"></i>
          </div>
          <h4 className="fw-bold mb-0">
            Learnect<span className="text-primary">.ma</span>
          </h4>
        </div>

        {/* Erreur */}
        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">
              <i className="bi bi-envelope text-primary me-1"></i>Adresse Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control rounded-3"
              placeholder="Entrez votre email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="mb-4">
            <label className="form-label small fw-semibold">
              <i className="bi bi-lock text-primary me-1"></i>Mot de passe
            </label>
            <div className="position-relative">
              <input
                type={voirPassword ? 'text' : 'password'}
                name="password"
                className="form-control rounded-3"
                placeholder="Entrez votre mot de passe"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setVoirPassword(!voirPassword)}
                className="btn btn-link text-muted p-0 position-absolute"
                style={{ right: '14px', top: '50%', transform: 'translateY(-50%)', border: 'none' }}
              >
                {voirPassword
                  ? <i className="bi bi-eye-slash fs-5"></i>
                  : <i className="bi bi-eye fs-5"></i>
                }
              </button>
            </div>
          </div>

          {/* Bouton connexion */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2 rounded-3"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Connexion...</>
            ) : (
              <><i className="bi bi-box-arrow-in-right me-2"></i>Se connecter</>
            )}
          </button>

        </form>

        <hr className="my-4" />

        <p className="text-center text-muted small mb-0">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-primary fw-semibold text-decoration-none">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;