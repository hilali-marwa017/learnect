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
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Bouton retour */}
        <button 
          onClick={() => props.onNavigate('home')} 
          className="back-button"
        >
          ← Back to Home
        </button>

        {/* Logo / Nom du projet */}
        <div className="auth-logo">
          <span className="logo-icon">🎓</span>
          <h1>Learnect<span>.ma</span></h1>
        </div>

        {/* Titre */}
        <h2 className="auth-title">Sign in to your account</h2>

        {/* Message d'erreur */}
        {erreur && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{erreur}</span>
            <button onClick={() => setErreur('')}>✕</button>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-signin" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Lien création de compte */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button onClick={() => props.onNavigate('register')}>
              Create one
            </button>
          </p>
        </div>

      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .auth-container {
          min-height: 100vh;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .auth-card {
          max-width: 440px;
          width: 100%;
          padding: 2rem;
          background: white;
          border-radius: 16px;
        }

        /* Back Button */
        .back-button {
          background: none;
          border: none;
          color: #666;
          font-size: 14px;
          cursor: pointer;
          padding: 0;
          margin-bottom: 2rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }

        .back-button:hover {
          color: #0d6efd;
        }

        /* Logo */
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2rem;
        }

        .logo-icon {
          font-size: 28px;
        }

        .auth-logo h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
          letter-spacing: -0.5px;
        }

        .auth-logo span {
          color: #0d6efd;
        }

        /* Title */
        .auth-title {
          font-size: 28px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 1.5rem;
          letter-spacing: -0.5px;
        }

        /* Form Group */
        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 1px solid #ddd;
          border-radius: 10px;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-group input:focus {
          outline: none;
          border-color: #0d6efd;
          box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.1);
        }

        .form-group input::placeholder {
          color: #aaa;
          font-weight: 400;
        }

        /* Password Input with Toggle */
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input-wrapper input {
          flex: 1;
          padding-right: 50px;
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          color: #888;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #0d6efd;
        }

        /* Sign In Button */
        .btn-signin {
          width: 100%;
          padding: 12px;
          background: #0d6efd;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }

        .btn-signin:hover:not(:disabled) {
          background: #0b5ed7;
          transform: translateY(-1px);
        }

        .btn-signin:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Footer */
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .auth-footer p {
          font-size: 14px;
          color: #666;
        }

        .auth-footer button {
          background: none;
          border: none;
          color: #0d6efd;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }

        .auth-footer button:hover {
          text-decoration: underline;
        }

        /* Error Message */
        .error-message {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fee2e2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-size: 13px;
        }

        .error-message button {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #dc2626;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .auth-card {
            padding: 1.5rem;
          }
          
          .auth-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;