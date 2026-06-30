import React, { useState } from 'react';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setIsLoading(true);

    if (!email || !password) {
      setErreur('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Comptes de test
      if (email === 'admin@learnect.ma' && password === 'admin123') {
        props.onNavigate('admin-dashboard');
      } else if (email === 'prof@learnect.ma' && password === 'prof123') {
        props.onNavigate('teacher-dashboard');
      } else if (email === 'eleve@learnect.ma' && password === 'eleve123') {
        props.onNavigate('student-dashboard');
      } else {
        setErreur('Email ou mot de passe incorrect');
      }
    } catch (error) {
      setErreur('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="row align-items-center min-vh-100">
          
          {/* Colonne gauche - Message inspirant */}
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
            <div className="hero-badge mb-4">
              <span className="badge px-3 py-2 rounded-pill">
                🚀 Rejoignez +10 000 passionnés
              </span>
            </div>
            
            <h1 className="display-4 fw-bold mb-4">
              Donner des cours,<br />
              <span className="text-primary">vivre de sa passion !</span>
            </h1>
            
            <p className="lead text-muted mb-0" style={{ fontSize: '1.1rem' }}>
              Bienvenue sur la plus grande communauté de professeurs particuliers du Maroc.
            </p>
          </div>

          {/* Colonne droite - Formulaire de connexion */}
          <div className="col-lg-5 offset-lg-1">
            <div className="login-card p-4 p-md-5">
              
              <div className="text-center mb-4">
                <div className="logo-icon mx-auto mb-3">
                  <i className="bi bi-mortarboard fs-2"></i>
                </div>
                <h3 className="fw-bold mb-2">Connectez-vous</h3>
                <p className="text-muted small">Accédez à votre espace Learnect.ma</p>
              </div>

              {erreur && (
                <div className="alert alert-danger alert-dismissible fade show py-2 mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {erreur}
                  <button type="button" className="btn-close" onClick={() => setErreur('')}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">EMAIL</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-primary"></i>
                    </span>
                    <input 
                      type="email" 
                      className="form-control border-start-0 py-2" 
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">MOT DE PASSE</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-primary"></i>
                    </span>
                    <input 
                      type="password" 
                      className="form-control border-start-0 py-2" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-3 fw-bold mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Connexion...
                    </>
                  ) : (
                    <>
                      Se connecter →
                    </>
                  )}
                </button>
              </form>

              {/* Mot de passe oublié */}
              <div className="text-center mb-3">
                <button className="btn btn-link p-0 text-primary small text-decoration-none">
                  Mot de passe oublié ?
                </button>
              </div>

              <div className="position-relative text-center my-4">
                <hr className="text-muted" />
                <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                  Pas encore inscrit ?
                </span>
              </div>

              <button 
                onClick={() => props.onNavigate('register')}
                className="btn btn-outline-primary w-100 py-3 fw-bold"
              >
                Créer un compte gratuitement →
              </button>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .login-container {
          background: linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%);
          min-height: 100vh;
        }

        .hero-badge .badge {
          background: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
          font-weight: 500;
          font-size: 14px;
        }

        .text-primary {
          color: #0d6efd !important;
        }

        .login-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e9ecef;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 40px -12px rgba(13, 110, 253, 0.15);
        }

        .logo-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #0d6efd, #0a58ca);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 16px rgba(13, 110, 253, 0.2);
        }

        .btn-primary {
          background: #0d6efd;
          border: none;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0b5ed7;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(13, 110, 253, 0.3);
        }

        .btn-primary:disabled {
          background: #6ea8fe;
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-outline-primary {
          border-color: #0d6efd;
          color: #0d6efd;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .btn-outline-primary:hover {
          background: #0d6efd;
          color: white;
          transform: translateY(-2px);
        }

        .btn-link {
          transition: all 0.2s ease;
        }

        .btn-link:hover {
          text-decoration: underline !important;
        }

        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.2);
        }

        .input-group-text {
          background-color: #f8f9fa;
          border-radius: 12px 0 0 12px;
        }

        .form-control {
          border-radius: 0 12px 12px 0;
        }

        .form-control:focus {
          box-shadow: none;
          border-color: #0d6efd;
        }

        .alert {
          border-radius: 12px;
          border: none;
        }

        .display-4 {
          font-size: calc(1.3rem + 2vw);
          letter-spacing: -0.5px;
        }

        @media (min-width: 768px) {
          .display-4 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .login-card {
            margin-top: 30px;
          }
          
          .display-4 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;   