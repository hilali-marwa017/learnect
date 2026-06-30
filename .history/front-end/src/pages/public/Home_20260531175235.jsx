import { Link } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      {/* HERO SECTION */}
      <div className="hero-bg" style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 40%, #EDE9FE 100%)',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        
        {/* Éléments décoratifs */}
        <div style={{
          position: 'absolute',
          top: -80, right: -80,
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -60, left: -60,
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              
              {/* Badge */}
              <div className="badge-premium d-inline-flex align-items-center gap-2 mb-4">
                <i className="bi bi-star-fill"></i>
                <span>+10 000 étudiants satisfaits</span>
              </div>

              {/* Titre */}
              <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                Trouvez le <span className="text-primary">prof idéal</span><br />
                pour vos cours particuliers
              </h1>

              {/* Description */}
              <p className="lead text-muted mb-5" style={{ fontSize: '1.1rem' }}>
                Des milliers de professeurs qualifiés près de chez vous.
                Cours à domicile ou en ligne, choisissez ce qui vous convient.
              </p>

              {/* Search Box */}
              <div className="search-pill-container d-flex align-items-center bg-white rounded-5 shadow-sm p-2 mx-auto" style={{ maxWidth: '600px' }}>
                <div className="flex-grow-1 px-3">
                  <input
                    type="text"
                    className="search-input-field w-100 border-0 py-3 px-2"
                    placeholder="Mathématiques, Physique, Anglais..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ outline: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  />
                </div>
                <Link
                  to={`/enseignants?search=${encodeURIComponent(searchQuery)}`}
                  className="btn btn-primary rounded-5 px-4 py-2 fw-bold d-flex align-items-center gap-2"
                >
                  <i className="bi bi-search"></i>
                  Chercher un prof
                </Link>
              </div>

              {/* Liens rapides */}
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-5">
                <Link to="/register?role=etudiant" className="text-decoration-none">
                  <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-white bg-opacity-50 hover-bg-blue-50 transition-smooth">
                    <i className="bi bi-person-graduation text-primary"></i>
                    <span className="small fw-medium">Je suis élève</span>
                  </div>
                </Link>
                <Link to="/register?role=enseignant" className="text-decoration-none">
                  <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-white bg-opacity-50 hover-bg-blue-50 transition-smooth">
                    <i className="bi bi-person-workspace text-primary"></i>
                    <span className="small fw-medium">Je suis enseignant</span>
                  </div>
                </Link>
              </div>

              {/* Stats */}
              <div className="stats-container d-flex justify-content-center gap-4 mt-5 pt-3">
                <div className="text-center">
                  <div className="stat-number fs-2 fw-bold text-primary">10k+</div>
                  <div className="stat-label small text-muted">Professeurs</div>
                </div>
                <div className="stat-divider"></div>
                <div className="text-center">
                  <div className="stat-number fs-2 fw-bold text-primary">15k+</div>
                  <div className="stat-label small text-muted">Élèves actifs</div>
                </div>
                <div className="stat-divider"></div>
                <div className="text-center">
                  <div className="stat-number fs-2 fw-bold text-primary">4.9⭐</div>
                  <div className="stat-label small text-muted">Note moyenne</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Features Section (optionnel) */}
      <div className="container py-5">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-calendar-check fs-2 text-primary"></i>
              </div>
              <h5 className="fw-bold">Cours à domicile</h5>
              <p className="text-muted small">Le professeur se déplace chez vous</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-laptop fs-2 text-primary"></i>
              </div>
              <h5 className="fw-bold">Cours en ligne</h5>
              <p className="text-muted small">Apprenez depuis chez vous</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-shield-check fs-2 text-primary"></i>
              </div>
              <h5 className="fw-bold">100% sécurisé</h5>
              <p className="text-muted small">Paiements et données protégés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;