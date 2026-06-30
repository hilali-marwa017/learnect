import React, { useState } from 'react';
import api from '../../api/axios';

function Login(props) {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', form);
      const { token, user } = response.data;

      // Sauvegarder dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Rediriger selon le rôle
      if (user.role === 'etudiant') {
        props.onNavigate('student-dashboard');
      } else if (user.role === 'enseignant') {
        props.onNavigate('teacher-dashboard');
      } else if (user.role === 'admin') {
        props.onNavigate('admin-dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-5 col-lg-4">
            
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark">Connexion</h2>
                  <p className="text-secondary small">Accédez à votre espace Learnect</p>
                </div>

                {error && (
                  <div className="alert alert-danger small py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Mot de passe</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Votre mot de passe"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 fw-bold py-2"
                      disabled={loading}
                    >
                      {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                  </div>

                </form>

                <div className="text-center">
                  <p className="small text-secondary mb-2">
                    Pas encore de compte ?
                  </p>
                  <button 
                    onClick={() => props.onNavigate('register')} 
                    className="btn btn-outline-primary btn-sm fw-bold w-100 mb-2"
                  >
                    S'inscrire comme étudiant
                  </button>
                  <button 
                    onClick={() => props.onNavigate('register-enseignant')} 
                    className="btn btn-outline-success btn-sm fw-bold w-100"
                  >
                    Devenir tuteur
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;