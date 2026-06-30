import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ✅ CORRECTION : showPassword = false (mot de passe caché par défaut)
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm({ 
      ...form, 
      [e.target.name]: e.target.value 
    });
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
      } else if (user.role === 'etudiant') {
        navigate('/student/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* Header avec logo */}
        <div className="login-header">
          <div className="login-logo">
            <i className="bi bi-mortarboard"></i>
          </div>
          <h2>Learnect<span>.ma</span></h2>
          <p>Authentification</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          
          {/* Champ Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <i className="bi bi-envelope"></i> Adresse Email
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Entrez votre email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Champ Mot de passe avec œil - CORRIGÉ */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <i className="bi bi-lock"></i> Mot de passe
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}  // ← clé : false = password, true = text
                id="password"
                name="password"
                className="form-control"
                placeholder="Entrez votre mot de passe"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash"></i>  // œil barré = cacher
                ) : (
                  <i className="bi bi-eye"></i>        // œil ouvert = montrer
                )}
              </button>
            </div>
          </div>

          {/* Bouton de connexion */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Connexion...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Liens de navigation */}
        <div className="login-footer">
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register">Créer un compte</Link>
          </p>
          <Link to="/" className="back-link">
            <i className="bi bi-arrow-left"></i> Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;