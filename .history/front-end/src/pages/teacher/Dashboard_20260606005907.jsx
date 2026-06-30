import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function TeacherDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalCours: 12,
    revenus: 1080,
    note: 4.8,
    eleves: 8,
    creneauxLibres: 4
  });
  const [loading, setLoading] = useState(true);

  // Navigation items comme dans l'image
  const navItems = [
    { path: '/enseignant/dashboard', label: 'Synthèse & Élèves', icon: 'bi-graph-up' },
    { path: '/enseignant/disponibilites', label: 'Créneaux libres', icon: 'bi-calendar-week', badge: stats.creneauxLibres },
    { path: '/enseignant/revenus', label: 'Portefeuille & Revenus', icon: 'bi-wallet2' },
    { path: '/enseignant/profil', label: 'Mon Profil', icon: 'bi-person-gear' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await api.get('/teacher/dashboard');
        // setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
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
      
      {/* En-tête avec avatar */}
      <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
          <i className="bi bi-person fs-2"></i>
        </div>
        <div>
          <h4 className="fw-bold mb-0">{user?.prenom} {user?.nom}</h4>
          <p className="text-muted mb-0">
            <i className="bi bi-briefcase me-1"></i>Enseignant · {user?.ville || 'Casablanca'}
          </p>
        </div>
      </div>

      {/* Navigation comme dans l'image */}
      <div className="row g-3 mb-4">
        {navItems.map((item) => (
          <div key={item.path} className="col-md-3 col-6">
            <Link to={item.path} className="text-decoration-none">
              <div className={`card border-0 shadow-sm p-3 text-center ${location.pathname === item.path ? 'active-card' : ''}`}>
                <i className={`${item.icon} fs-2 ${location.pathname === item.path ? 'text-primary' : 'text-secondary'}`}></i>
                <div className="fw-semibold mt-2">{item.label}</div>
                {item.badge !== undefined && (
                  <span className="badge bg-primary mt-1 rounded-pill">{item.badge}</span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Contenu principal - Synthèse & Élèves */}
      <div className="row g-4">
        {/* Carte Statistiques */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 pt-3">
              <h5 className="fw-bold mb-0"><i className="bi bi-graph-up me-2 text-primary"></i>Synthèse</h5>
            </div>
            <div className="card-body">
              <div className="row text-center g-3">
                <div className="col-6">
                  <div className="bg-light rounded-3 p-3">
                    <div className="text-muted small">Cours donnés</div>
                    <div className="fs-2 fw-bold">{stats.totalCours}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-light rounded-3 p-3">
                    <div className="text-muted small">Note moyenne</div>
                    <div className="fs-2 fw-bold text-warning">{stats.note}★</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-light rounded-3 p-3">
                    <div className="text-muted small">Revenus totaux</div>
                    <div className="fs-2 fw-bold text-success">{stats.revenus} DH</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-light rounded-3 p-3">
                    <div className="text-muted small">Élèves</div>
                    <div className="fs-2 fw-bold">{stats.eleves}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte Élèves récents */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 pt-3">
              <h5 className="fw-bold mb-0"><i className="bi bi-people me-2 text-primary"></i>Élèves récents</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {['Marwa Hilali', 'Yassine Amrani', 'Sofia Benjelloun'].map((eleve, i) => (
                  <div key={i} className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-person-circle text-primary me-2"></i>
                      <span className="fw-semibold">{eleve}</span>
                    </div>
                    <button className="btn btn-sm btn-outline-primary rounded-pill">
                      <i className="bi bi-chat me-1"></i>Message
                    </button>
                  </div>
                ))}
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