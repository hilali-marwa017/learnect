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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation locale
    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      // Appel correct : on passe email et password
      const user = await login(form.email, form.password);
      console.log('Utilisateur connecté:', user);
      
      // Redirection selon le rôle
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'enseignant') {
        navigate('/enseignant/dashboard');
      } else {
        navigate('/etudiant/dashboard');
      }
    } catch (err) {
      console.error('Erreur détaillée:', err.response?.data);
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="card border-0 shadow-lg rounded-4" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-body p-4 p-md-5">
          
          {/* Bouton retour */}
          <div className="text-center mb-3">
            <Link to="/" className="text-muted text-decoration-none small d-inline-flex align-items-center gap-1">
              <i className="bi bi-arrow-left"></i> Retour à l'accueil
            </Link>
          </div>

          {/* Logo */}
          <div className="text-center mb-4">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <div className="bg-primary text-white rounded-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-mortarboard fs-5"></i>
              </div>
              <span className="fw-bold fs-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Learnect<span className="text-primary">.ma</span>
              </span>
            </div>
            <p className="text-muted small mb-0">Cours particuliers - Maroc</p>
          </div>

          {/* Titre */}
          <h2 className="text-center fw-bold fs-4 mb-4">Se connecter</h2>

          {/* Erreur */}
          {error && (
            <div className="alert alert-danger py-2 px-3 d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span className="small">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                <i className="bi bi-envelope text-primary me-1"></i> Adresse Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control py-2"
                placeholder="marwa@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Mot de passe avec œil */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary mb-1">
                <i className="bi bi-lock text-primary me-1"></i> Mot de passe
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control py-2"
                  placeholder="Entrez votre mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 text-muted me-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-bold rounded-3"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Connexion...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>Se connecter</>
              )}
            </button>
          </form>

          {/* Lien inscription */}
          <div className="text-center mt-4 pt-2 border-top">
            <p className="small text-muted mb-0">
              Pas encore de compte ?{' '}
              <Link to="/register?role=etudiant" className="text-primary fw-bold text-decoration-none">
                Créer un compte
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;