import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className="page-auth">
      <div style={{ width: '100%', maxWidth: '640px' }}>

        {/* Retour */}
        <Link
          to="/"
          className="d-inline-flex align-items-center gap-2 text-secondary fw-medium mb-4"
          style={{ fontSize: '14px' }}
        >
          ← Retour à l'accueil
        </Link>

        <div className="carte-auth" style={{ maxWidth: '640px' }}>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="logo-auth">🎓</div>
            <h2 style={{ fontFamily: 'var(--police-titre)', fontSize: '26px' }}>
              Rejoindre Learnect<span className="text-primary">.ma</span>
            </h2>
            <p className="text-secondary small mt-2">
              Choisissez votre profil pour commencer
            </p>
          </div>

          {/* Choix du profil */}
          <div className="row g-3">

            {/* Carte Élève */}
            <div className="col-12 col-md-6">
              <Link
                to="/register/etudiant"
                className="d-block text-decoration-none"
              >
                <div
                  className="card h-100 p-4 text-center border-2"
                  style={{ borderRadius: '16px', borderColor: 'var(--bordure)', cursor: 'pointer' }}
                >
                  <div
                    className="rounded-3 d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px', background: 'var(--couleur-principale-claire)', fontSize: '28px' }}
                  >
                    🧑‍🎓
                  </div>
                  <h5 className="fw-bold text-dark mb-2">Je suis élève</h5>
                  <p className="text-secondary small mb-3" style={{ lineHeight: '1.5', minHeight: '48px' }}>
                    Je souhaite trouver le professeur idéal pour des cours à domicile ou en ligne.
                  </p>
                  <div className="btn btn-outline-primary w-100 fw-bold" style={{ borderRadius: '10px', pointerEvents: 'none' }}>
                    Trouver un tuteur →
                  </div>
                </div>
              </Link>
            </div>

            {/* Carte Enseignant */}
            <div className="col-12 col-md-6">
              <Link
                to="/register/enseignant"
                className="d-block text-decoration-none"
              >
                <div
                  className="card h-100 p-4 text-center border-2"
                  style={{ borderRadius: '16px', borderColor: 'var(--couleur-principale)', cursor: 'pointer', background: 'var(--couleur-principale-claire)' }}
                >
                  <div
                    className="rounded-3 d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px', background: 'var(--couleur-principale)', fontSize: '28px' }}
                  >
                    👨‍🏫
                  </div>
                  <h5 className="fw-bold text-dark mb-2">Je suis enseignant</h5>
                  <p className="text-secondary small mb-3" style={{ lineHeight: '1.5', minHeight: '48px' }}>
                    Je souhaite proposer mes cours, gérer mes créneaux et développer mon activité.
                  </p>
                  <div className="btn btn-primary w-100 fw-bold" style={{ borderRadius: '10px', pointerEvents: 'none' }}>
                    Donner des cours →
                  </div>
                </div>
              </Link>
            </div>

          </div>

          {/* Pied de page */}
          <div className="text-center mt-4 pt-3 border-top">
            <small className="text-secondary">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-primary fw-bold">
                Se connecter
              </Link>
            </small>
          </div>

        </div>
      </div>
    </div>
  )
}