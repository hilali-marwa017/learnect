import React, { useState } from 'react';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="login-page">
      <div className="container">
        <div className="row align-items-center min-vh-100">
          
          {/* Colonne gauche - Message inspirant */}
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
            <div className="hero-badge mb-4">
              <span className="badge-hero">
                🚀 Rejoignez +10 000 passionnés
              </span>
            </div>
            
            <h1 className="hero-title">
              Donner des cours,<br />
              <span className="text-gradient">vivre de sa passion !</span>
            </h1>
            
            <p className="hero-description">
              Bienvenue sur la plus grande communauté de professeurs particuliers du Maroc.
            </p>

            {/* Stats rapides */}
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-number">10k+</div>
                <div className="stat-label">Professeurs</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">15k+</div>
                <div className="stat-label">Élèves actifs</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Formulaire de connexion */}
          <div className="col-lg-5 offset-lg-1">
            <div className="login-card">
              
              <div className="card-header">
                <div className="logo-icon">
                  <i className="bi bi-mortarboard"></i>
                </div>
                <h3>Connectez-vous</h3>
                <p>Accédez à votre espace Learnect.ma</p>
              </div>

              {erreur && (
                <div className="alert-custom alert-error">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{erreur}</span>
                  <button className="alert-close" onClick={() => setErreur('')}>✕</button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">EMAIL</label>
                  <div className="input-wrapper">
                    <i className="bi bi-envelope input-icon"></i>
                    <input 
                      type="email" 
                      className="form-control-custom"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">MOT DE PASSE</label>
                  <div className="input-wrapper password-wrapper">
                    <i className="bi bi-lock input-icon"></i>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="form-control-custom"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-login" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Connexion...
                    </>
                  ) : (
                    'Se connecter →'
                  )}
                </button>
              </form>

              <div className="forgot-password">
                <a href="#" onClick={(e) => e.preventDefault()}>Mot de passe oublié ?</a>
              </div>

              <div className="divider">
                <span>Pas encore inscrit ?</span>
              </div>

              <button 
                onClick={() => props.onNavigate('register')}
                className="btn-register"
              >
                Créer un compte gratuitement →
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;