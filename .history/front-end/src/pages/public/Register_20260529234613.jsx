import React from 'react';

function Register(props) {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-5 text-center">
              
              {/* Header */}
              <div className="mb-4">
                <div className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3">
                  <i className="bi bi-mortarboard fs-1"></i>
                </div>
                <h2 className="fw-bold mb-2">Rejoindre Learnect.ma</h2>
                <p className="text-muted">Choisissez votre profil pour continuer</p>
              </div>

              {/* Deux options comme Superprof */}
              <div className="row g-4">
                {/* Option Étudiant */}
                <div className="col-md-6">
                  <div 
                    onClick={() => props.onNavigate('register-student')}
                    className="border rounded-4 p-4 text-center cursor-pointer transition-all hover-card"
                  >
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3">
                      <i className="bi bi-person-graduation fs-1 text-primary"></i>
                    </div>
                    <h4 className="fw-bold mb-2">Je suis élève</h4>
                    <p className="text-muted small mb-3">Je cherche des cours particuliers</p>
                    <button className="btn btn-outline-primary w-100 py-2 fw-bold">
                      S'inscrire comme élève →
                    </button>
                  </div>
                </div>

                {/* Option Enseignant */}
                <div className="col-md-6">
                  <div 
                    onClick={() => props.onNavigate('register-teacher')}
                    className="border rounded-4 p-4 text-center cursor-pointer transition-all hover-card"
                  >
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3">
                      <i className="bi bi-person-workspace fs-1 text-primary"></i>
                    </div>
                    <h4 className="fw-bold mb-2">Je suis professeur</h4>
                    <p className="text-muted small mb-3">Je donne des cours particuliers</p>
                    <button className="btn btn-primary w-100 py-2 fw-bold">
                      S'inscrire comme professeur →
                    </button>
                  </div>
                </div>
              </div>

              {/* Séparateur ou déjà inscrit */}
              <div className="mt-5 pt-3 border-top">
                <small className="text-muted">
                  Déjà inscrit ?{' '}
                  <button onClick={() => props.onNavigate('login')} className="btn btn-link p-0 text-primary fw-bold">
                    Se connecter
                  </button>
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease; }
        .hover-card { transition: all 0.3s ease; }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}

export default Register;