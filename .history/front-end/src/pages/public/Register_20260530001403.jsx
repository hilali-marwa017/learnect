import React from 'react';

function Register(props) {
  return (
    <div className="register-hero-section">
      {/* Bandeau supérieur avec illustration */}
      <div className="hero-wave">
        <div className="container py-5">
          <div className="row align-items-center min-vh-100 py-5">
            
            {/* Colonne gauche - Texte inspirant */}
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <div className="badge-glow mb-4">
                <span className="badge px-3 py-2 rounded-pill" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
                  🚀 Plus de 10 000 profs actifs
                </span>
              </div>
              
              <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: '-1.5px' }}>
                Donner des cours,<br />
                <span className="gradient-text">vivre de sa passion !</span>
              </h1>
              
              <p className="lead text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                Bienvenue sur la plus grande communauté de professeurs particuliers du Maroc. 
                Des milliers d'élèves trouvent chaque jour le profil parfait pour leurs cours.
              </p>

              {/* Tags */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-2 bg-light rounded-pill small">📚 Langues</span>
                <span className="px-3 py-2 bg-light rounded-pill small">⚽ Sports</span>
                <span className="px-3 py-2 bg-light rounded-pill small">🎵 Musique</span>
                <span className="px-3 py-2 bg-light rounded-pill small">🎨 Arts</span>
                <span className="px-3 py-2 bg-light rounded-pill small">📖 Scolaire</span>
                <span className="px-3 py-2 bg-light rounded-pill small">➕ 1000 matières</span>
              </div>

              {/* Avantages */}
              <div className="row g-3 mt-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-laptop fs-5 text-success"></i>
                    <span className="small">Cours en ligne ou en face à face</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-currency-dollar fs-5 text-success"></i>
                    <span className="small">Fixez vos tarifs librement</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-calendar fs-5 text-success"></i>
                    <span className="small">Organisez votre emploi du temps</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-people fs-5 text-success"></i>
                    <span className="small">Étudiants, diplômés, passionnés...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Formulaire moderne */}
            <div className="col-lg-5 offset-lg-1">
              <div className="glass-card p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="logo-icon mx-auto mb-3">
                    <span>🎓</span>
                  </div>
                  <h3 className="fw-bold mb-2">Créez votre profil</h3>
                  <p className="text-muted small">Rejoignez l'aventure Learnect.ma</p>
                </div>

                {/* Formulaire */}
                <form>
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
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => props.onNavigate('register-teacher')}
                    className="btn btn-primary w-100 py-3 fw-bold mb-3"
                    style={{ background: '#059669', border: 'none', borderRadius: '12px' }}
                  >
                    <i className="bi bi-envelope-paper me-2"></i>
                    Inscription par e-mail →
                  </button>

                  <div className="position-relative text-center my-4">
                    <hr className="text-muted" />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">ou</span>
                  </div>

                  <button className="btn btn-outline-secondary w-100 py-2 mb-2 d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: '10px' }}>
                    <i className="bi bi-google fs-5"></i>
                    Inscription avec Google
                  </button>

                  <button className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: '10px' }}>
                    <i className="bi bi-apple fs-5"></i>
                    Inscription avec Apple
                  </button>
                </form>

                {/* Footer formulaire */}
                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    Vous avez déjà un compte ?{' '}
                    <button 
                      onClick={() => props.onNavigate('login')} 
                      className="btn btn-link p-0 text-success fw-bold text-decoration-none"
                    >
                      Connexion
                    </button>
                  </small>
                  <p className="small text-muted mt-2 mb-0">
                    En vous inscrivant, vous acceptez nos 
                    <button className="btn btn-link p-0 text-success text-decoration-none small"> conditions générales</button>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Section profils */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3">Rejoignez la communauté Learnect</h2>
          <p className="text-muted">Choisissez le profil qui vous correspond</p>
        </div>

        <div className="row g-4">
          {/* Carte Étudiant */}
          <div className="col-md-6">
            <div 
              onClick={() => props.onNavigate('register-student')}
              className="profile-card text-center p-4 rounded-4 cursor-pointer"
            >
              <div className="profile-icon mx-auto mb-3">
                🧑‍🎓
              </div>
              <h4 className="fw-bold mb-2">Je cherche un professeur</h4>
              <p className="text-muted small mb-3">
                Trouvez le professeur idéal pour des cours particuliers à domicile ou en ligne.
              </p>
              <button className="btn btn-outline-success px-4 py-2 rounded-pill">
                Trouver un tuteur →
              </button>
            </div>
          </div>

          {/* Carte Enseignant */}
          <div className="col-md-6">
            <div 
              onClick={() => props.onNavigate('register-teacher')}
              className="profile-card text-center p-4 rounded-4 cursor-pointer active-card"
            >
              <div className="profile-icon mx-auto mb-3">
                👨‍🏫
              </div>
              <h4 className="fw-bold mb-2">Je donne des cours</h4>
              <p className="text-muted small mb-3">
                Partagez votre savoir, fixez vos tarifs et développez votre activité.
              </p>
              <button className="btn btn-success px-4 py-2 rounded-pill">
                Donner des cours →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS personnalisé */}
      <style>{`
        .register-hero-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);
          min-height: 100vh;
        }

        .hero-wave {
          position: relative;
        }

        .gradient-text {
          background: linear-gradient(135deg, #059669, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .badge-glow {
          display: inline-block;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(5, 150, 105, 0.1);
          transition: transform 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-5px);
        }

        .logo-icon {
          width: 65px;
          height: 65px;
          background: linear-gradient(135deg, #059669, #10b981);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
        }

        .profile-card {
          background: white;
          border: 1px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .profile-card:hover {
          transform: translateY(-6px);
          border-color: #059669;
          box-shadow: 0 20px 30px -12px rgba(5, 150, 105, 0.15);
        }

        .active-card {
          border-color: #059669;
          background: linear-gradient(135deg, rgba(5, 150, 105, 0.02), rgba(5, 150, 105, 0.05));
        }

        .profile-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(5, 150, 105, 0.05));
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .btn-outline-success {
          border-color: #059669;
          color: #059669;
          transition: all 0.2s;
        }

        .btn-outline-success:hover {
          background: #059669;
          color: white;
          transform: translateY(-2px);
        }

        .btn-success {
          background: #059669;
          transition: all 0.2s;
        }

        .btn-success:hover {
          background: #047857;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(5, 150, 105, 0.3);
        }

        .form-control:focus {
          border-color: #059669;
          box-shadow: 0 0 0 0.2rem rgba(5, 150, 105, 0.25);
        }

        @media (max-width: 768px) {
          .glass-card {
            margin-top: 30px;
          }
          
          .display-3 {
            font-size: 2rem;
          }
        }

        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default Register;