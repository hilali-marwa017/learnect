import React from 'react';

function Register(props) {
  return (
    <div className="container py-5" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          
          {/* Bouton Retour Accueil discret */}
          <button 
            onClick={() => props.onNavigate('home')} 
            className="btn btn-link p-0 text-muted text-decoration-none mb-4 d-inline-flex align-items-center gap-2"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            ← Retour à l'accueil
          </button>

          <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 bg-white position-relative overflow-hidden">
            {/* Barre de couleur supérieure décorative */}
            <div className="position-absolute top-0 start-0 w-100" style={{ height: '6px', background: '#059669' }} />
            
            <div className="card-body p-0 text-center">
              
              {/* En-tête */}
              <div className="mb-5">
                <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '72px', height: '72px', fontSize: '32px' }}>
                  🎓
                </div>
                <h2 className="fw-bold text-dark mb-2" style={{ letterSpacing: '-0.5px', fontSize: '2rem' }}>
                  Rejoindre Learnect<span style={{ color: '#059669' }}>.ma</span>
                </h2>
                <p className="text-muted mx-auto" style={{ maxWidth: '420px', fontSize: '15px' }}>
                  Choisissez votre profil pour commencer votre aventure sur la première plateforme de soutien scolaire au Maroc.
                </p>
              </div>

              {/* Sélection des Profils */}
              <div className="row g-4 justify-content-center">
                
                {/* Profil Élève */}
                <div className="col-md-6">
                  <div 
                    onClick={() => props.onNavigate('register-student')}
                    className="border border-2 rounded-4 p-4 text-center cursor-pointer transition-card option-card"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <div className="bg-light rounded-4 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px', fontSize: '28px' }}>
                      🧑‍🎓
                    </div>
                    <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '1.25rem' }}>Je suis élève / parent</h4>
                    <p className="text-muted small mb-4 px-2" style={{ minHeight: '40px', lineHeight: '1.4' }}>
                      Je souhaite trouver le professeur idéal et planifier des cours particuliers à domicile ou en ligne.
                    </p>
                    <button className="btn btn-outline-dark w-100 py-2.5 fw-bold" style={{ borderRadius: '10px', fontSize: '14px' }}>
                      Trouver un tuteur →
                    </button>
                  </div>
                </div>

                {/* Profil Professeur */}
                <div className="col-md-6">
                  <div 
                    onClick={() => props.onNavigate('register-teacher')}
                    className="border border-2 rounded-4 p-4 text-center cursor-pointer transition-card option-card-active"
                    style={{ borderColor: '#059669', background: 'rgba(5, 150, 105, 0.02)' }}
                  >
                    <div className="bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px', fontSize: '28px', color: '#059669', borderRadius: '12px' }}>
                      👨‍🏫
                    </div>
                    <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '1.25rem' }}>Je suis professeur</h4>
                    <p className="text-muted small mb-4 px-2" style={{ minHeight: '40px', lineHeight: '1.4' }}>
                      Je souhaite proposer mes compétences, gérer mes créneaux horaires et développer mon activité au Maroc.
                    </p>
                    <button className="btn btn-success w-100 py-2.5 fw-bold text-white border-0" style={{ borderRadius: '10px', fontSize: '14px', background: '#059669' }}>
                      Donner des cours →
                    </button>
                  </div>
                </div>

              </div>

              {/* Pied de page de la carte */}
              <div className="mt-5 pt-4 border-top border-light">
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                  Déjà inscrit sur Learnect ?{' '}
                  <button 
                    onClick={() => props.onNavigate('login')} 
                    className="btn btn-link p-0 fw-bold text-decoration-none ms-1"
                    style={{ color: '#059669' }}
                  >
                    Se connecter
                  </button>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* CSS Natif inclus pour l'animation (Validé aux examens) */}
      <style>{`
        .cursor-pointer { cursor: pointer; }
        .transition-card { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        
        .option-card:hover { 
          transform: translateY(-4px); 
          border-color: #1f2937 !important;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
        }
        
        .option-card-active:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 12px 24px rgba(5, 150, 105, 0.12);
        }
      `}</style>
    </div>
  );
}

export default Register;
