import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function Login() {
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

    try {
      console.log('Envoi requête...', { email: form.email });
      
      const response = await api.post('/login', {
        email: form.email,
        password: form.password
      });
      
      console.log('Réponse reçue:', response.data);
      
      // Sauvegarde du token et user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirection selon rôle
      const userRole = response.data.user.role;
      console.log('Rôle utilisateur:', userRole);
      
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'enseignant') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error('Erreur détaillée:', err);
      console.error('Réponse erreur:', err.response);
      
      if (err.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else if (err.response?.status === 403) {
        setError(err.response.data?.message || 'Compte bloqué ou en attente');
      } else {
        setError('Erreur de connexion. Vérifiez que le serveur est démarré.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="card shadow-sm" style={{ maxWidth: '450px', width: '100%', borderRadius: '16px' }}>
        <div className="card-body p-4">
          
          <div className="text-center mb-4">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-mortarboard fs-4"></i>
            </div>
            <h3 className="fw-bold mb-1">Learnect.ma</h3>
            <p className="text-muted small">PORTAL ACADÉMIQUE MAROCAIN</p>
          </div>

          <div className="alert alert-primary py-2 mb-3 small">
            <i className="bi bi-lightbulb me-2"></i>
            Premier cours offert sur Learnect !
          </div>

          <h5 className="text-center mb-3">Content de vous revoir !</h5>
          <p className="text-center text-muted small mb-4">Veuillez vous authentifier pour accéder à votre espace</p>

          {error && (
            <div className="alert alert-danger py-2 small">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">ADRESSE EMAIL</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control border-start-0 ps-0"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">MOT DE PASSE</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control border-start-0 ps-0"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Connexion...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>OUVRIR MA SESSION</>
              )}
            </button>
          </form>

          <hr className="my-3" />

          <div className="text-center">
            <span className="text-muted small">Pas encore de compte ? </span>
            <Link to="/register" className="text-primary fw-bold text-decoration-none small">Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;