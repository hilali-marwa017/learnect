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
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour test : admin@learnect.ma / admin123
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
    <div className="login-hero-section">
      <div className="container">
        <div className="row align-items-center min-vh-100">
          
          {/* Colonne gauche - Message inspirant */}
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
            <div className="hero-content">
              <div className="hero-badge mb-4">
                <span className="badge px-3 py-2 rounded-pill">
                  🎯 Rejoignez +10 000 passionnés
                </span>
              </div>
              
              <h1 className="display-3 fw-bold mb-4">
                Donner des cours,<br />
                <span className="gradient-text">vivre de sa passion !</span>
              </h1>
              
              <p className="lead text-muted mb-4">
                Bienvenue sur la plus grande communauté de professeurs particuliers du Maroc.
              </p>

              {/* Statistiques */}
              <div className="row g-4 mt-4">
                <div className="col-4">
                  <div className="stat-number">10k+</div>
                  <div className="stat-label">Professeurs</div>
                </div>
                <div className="col-4">
                  <div className="stat-number">15k+</div>
                  <div className="stat-label">Élèves actifs</div>
                </div>
                <div className="col-4">
                  <div className="stat-number">4.9⭐</div>
                  <div className="stat-label">Note moyenne</div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Formulaire de connexion */}
          <div className="col-lg-5 offset-lg-1">
            <div className="glass-card p-4 p-md-5">
              
              <div className="text-center mb-4">
                <div className="logo-icon mx-auto mb-3">
                  <span>🎓</span>
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
                  <label className="form-label fw-semibold small text-secondary">Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
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
                  <label className="form-label fw-semibold small text-secondary">Mot de passe</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
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
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Se connecter →
                    </>
                  )}
                </button>
              </form>

              {/* Mot de passe oublié */}
              <div className="text-center mb-3">
                <button className="btn btn-link p-0 text-success small text-decoration-none">
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
                className="btn btn-outline-success w-100 py-3 fw-bold"
              >
                Créer un compte gratuitement →
              </button>

              {/* Footer conditions */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="small text-muted mb-0">
                  En vous connectant, vous acceptez nos 
                  <button className="btn btn-link p-0 text-success text-decoration-none small ms-1">
                    conditions générales
                  </button>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* CSS personnalisé */}
      <style>{`
        .login-hero-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);
          min-height: 100vh;
        }

        .hero-badge {
          display: inline-block;
        }

        .hero-badge .badge {
          background: rgba(5, 150, 105, 0.1);
          color: #059669;
          font-weight: 500;
        }

        .gradient-text {
          background: linear-gradient(135deg, #059669, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 800;
          color: #059669;
        }

        .stat-label {
          font-size: 13px;
          color: #6c757d;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(5, 150, 105, 0.15);
          transition: transform 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-5px);
        }

        .logo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #059669, #10b981);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 8px 20px rgba(5, 150, 105, 0.25);
        }

        .btn-primary {
          background: #059669;
          border: none;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: #047857;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(5, 150, 105, 0.3);
        }

        .btn-primary:disabled {
          background: #10b981;
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-outline-success {
          border-color: #059669;
          color: #059669;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .btn-outline-success:hover {
          background: #059669;
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
          border-color: #059669;
          box-shadow: 0 0 0 0.2rem rgba(5, 150, 105, 0.2);
        }

        .input-group-text {
          background-color: #f8f9fa;
          border-radius: 12px 0 0 12px;
        }

        .form-control {
          border-radius: 0 12px 12px 0;
        }

        .alert {
          border-radius: 12px;
          border: none;
        }

        @media (max-width: 768px) {
          .glass-card {
            margin-top: 30px;
          }
          
          .display-3 {
            font-size: 2rem;
          }
          
          .stat-number {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;