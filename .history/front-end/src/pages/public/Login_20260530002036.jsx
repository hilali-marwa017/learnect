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
            
            <h1 className="hero-title mb-4">
              Donner des cours,<br />
              <span className="text-primary-gradient">vivre de sa passion !</span>
            </h1>
            
            <p className="hero-description">
              Bienvenue sur la plus grande communauté de professeurs particuliers du Maroc.
            </p>
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
                  <button onClick={() => setErreur('')}>✕</button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="input-group-custom">
                  <label>EMAIL</label>
                  <div className="input-wrapper">
                    <i className="bi bi-envelope"></i>
                    <input 
                      type="email" 
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group-custom">
                  <label>MOT DE PASSE</label>
                  <div className="input-wrapper password-wrapper">
                    <i className="bi bi-lock"></i>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
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
                      <span className="spinner"></span>
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .login-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #eef2f6 100%);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Hero Badge */
        .hero-badge .badge {
          background: rgba(13, 110, 253, 0.12);
          color: #0d6efd;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: -0.2px;
          padding: 8px 18px;
        }

        /* Hero Title */
        .hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3.2rem;
          font-weight: 700;
          letter-spacing: -1.5px;
          line-height: 1.2;
          color: #1a1a2e;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
            letter-spacing: -1px;
          }
        }

        .text-primary-gradient {
          background: linear-gradient(135deg, #0d6efd, #0a58ca);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Hero Description */
        .hero-description {
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          line-height: 1.5;
          color: #4a5568;
        }

        /* Login Card */
        .login-card {
          background: white;
          border-radius: 32px;
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .login-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px -12px rgba(13, 110, 253, 0.2);
        }

        /* Card Header */
        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #0d6efd, #0a58ca);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.25);
        }

        .logo-icon i {
          font-size: 28px;
          color: white;
        }

        .card-header h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: #1a1a2e;
        }

        .card-header p {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          color: #6c757d;
        }

        /* Input Groups */
        .input-group-custom {
          margin-bottom: 1.5rem;
        }

        .input-group-custom label {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6c757d;
          margin-bottom: 0.5rem;
          display: block;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper i:first-child {
          position: absolute;
          left: 16px;
          color: #adb5bd;
          font-size: 1.1rem;
          pointer-events: none;
        }

        .input-wrapper input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          border: 1.5px solid #e9ecef;
          border-radius: 14px;
          background: white;
          transition: all 0.2s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #0d6efd;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
        }

        .input-wrapper input::placeholder {
          color: #cbd5e1;
          font-weight: 400;
        }

        /* Password Toggle Button (L'ŒIL) */
        .password-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #adb5bd;
          transition: color 0.2s ease;
        }

        .password-toggle i {
          font-size: 1.2rem;
          pointer-events: none;
        }

        .password-toggle:hover {
          color: #0d6efd;
        }

        /* Login Button */
        .btn-login {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0d6efd, #0a58ca);
          border: none;
          border-radius: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.3);
        }

        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Forgot Password */
        .forgot-password {
          text-align: center;
          margin: 1rem 0;
        }

        .forgot-password a {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: #6c757d;
          text-decoration: none;
          transition: color 0.2s;
        }

        .forgot-password a:hover {
          color: #0d6efd;
          text-decoration: underline;
        }

        /* Divider */
        .divider {
          position: relative;
          text-align: center;
          margin: 1.5rem 0;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e9ecef;
        }

        .divider span {
          position: relative;
          background: white;
          padding: 0 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: #6c757d;
        }

        /* Register Button */
        .btn-register {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 1.5px solid #e9ecef;
          border-radius: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          color: #0d6efd;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-register:hover {
          border-color: #0d6efd;
          background: rgba(13, 110, 253, 0.04);
          transform: translateY(-2px);
        }

        /* Alert Custom */
        .alert-custom {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 14px;
          margin-bottom: 1.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
        }

        .alert-error {
          background: #fee2e2;
          color: #dc2626;
          border-left: 3px solid #dc2626;
        }

        .alert-custom button {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          color: inherit;
          opacity: 0.7;
        }

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .login-card {
            padding: 1.75rem;
          }
          
          .hero-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;