import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCours: 12,
    revenus: 1080,
    note: 4.8,
    eleves: 8
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* En-tête avec navigation */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Tableau de bord</h2>
          <p className="text-muted">Bienvenue, {user?.prenom} {user?.nom}</p>
        </div>
        <div className="text-end">
          <span className="badge bg-primary px-3 py-2">
            <i className="bi bi-person-circle me-1"></i> Enseignant
          </span>
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <Link to="/enseignant/dashboard" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-3 text-center active-card">
              <i className="bi bi-speedometer2 fs-2 text-primary"></i>
              <div className="fw-semibold mt-2">Dashboard</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/enseignant/disponibilites" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-3 text-center">
              <i className="bi bi-calendar-week fs-2 text-primary"></i>
              <div className="fw-semibold mt-2">Disponibilités</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/enseignant/revenus" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-3 text-center">
              <i className="bi bi-wallet2 fs-2 text-primary"></i>
              <div className="fw-semibold mt-2">Revenus</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/enseignant/profil" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-3 text-center">
              <i className="bi bi-person-gear fs-2 text-primary"></i>
              <div className="fw-semibold mt-2">Mon profil</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Cours donnés</div>
                <div className="fs-2 fw-bold">{stats.totalCours}</div>
              </div>
              <i className="bi bi-journal-bookmark-fill fs-1 text-primary opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Revenus</div>
                <div className="fs-2 fw-bold">{stats.revenus} DH</div>
              </div>
              <i className="bi bi-cash-stack fs-1 text-success opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Note moyenne</div>
                <div className="fs-2 fw-bold">{stats.note}</div>
              </div>
              <i className="bi bi-star-fill fs-1 text-warning opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Élèves</div>
                <div className="fs-2 fw-bold">{stats.eleves}</div>
              </div>
              <i className="bi bi-people-fill fs-1 text-primary opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Derniers cours */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0 pt-3">
          <h5 className="fw-bold mb-0"><i className="bi bi-clock-history me-2"></i>Prochains cours</h5>
        </div>
        <div className="card-body">
          <div className="list-group list-group-flush">
            <div className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
              <div>
                <i className="bi bi-person-circle text-primary me-2"></i>
                <span className="fw-semibold">Marwa Hilali</span>
                <span className="text-muted ms-2">Mathématiques</span>
              </div>
              <div>
                <i className="bi bi-calendar me-1 text-muted"></i>
                <span className="small">Lundi 10 juin • 14h00</span>
                <button className="btn btn-sm btn-outline-primary ms-3 rounded-pill">
                  <i className="bi bi-chat me-1"></i>Contacter
                </button>
              </div>
            </div>
            <div className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
              <div>
                <i className="bi bi-person-circle text-primary me-2"></i>
                <span className="fw-semibold">Yassine Amrani</span>
                <span className="text-muted ms-2">Physique</span>
              </div>
              <div>
                <i className="bi bi-calendar me-1 text-muted"></i>
                <span className="small">Mercredi 12 juin • 10h00</span>
                <button className="btn btn-sm btn-outline-primary ms-3 rounded-pill">
                  <i className="bi bi-chat me-1"></i>Contacter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .active-card {
          border-color: #0d6efd !important;
          background: rgba(13, 110, 253, 0.05);
        }
        .card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default TeacherDashboard;