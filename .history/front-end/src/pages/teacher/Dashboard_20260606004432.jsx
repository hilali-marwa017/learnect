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
      <h2 className="fw-bold mb-4">Tableau de bord</h2>
      <p className="text-muted mb-4">Bienvenue, {user?.prenom} {user?.nom}</p>

      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 text-center">
            <i className="bi bi-journal-bookmark-fill fs-1 text-primary"></i>
            <div className="fs-2 fw-bold">{stats.totalCours}</div>
            <div className="text-muted small">Cours donnés</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 text-center">
            <i className="bi bi-cash-stack fs-1 text-success"></i>
            <div className="fs-2 fw-bold">{stats.revenus}</div>
            <div className="text-muted small">DH gagnés</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 text-center">
            <i className="bi bi-star-fill fs-1 text-warning"></i>
            <div className="fs-2 fw-bold">{stats.note}</div>
            <div className="text-muted small">Note moyenne</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 text-center">
            <i className="bi bi-people-fill fs-1 text-primary"></i>
            <div className="fs-2 fw-bold">{stats.eleves}</div>
            <div className="text-muted small">Élèves</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <Link to="/enseignant/disponibilites" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-4 text-center">
              <i className="bi bi-calendar-week fs-2 text-primary"></i>
              <h5 className="mt-2">Gérer mes disponibilités</h5>
              <small className="text-muted">Définissez vos créneaux</small>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/enseignant/revenus" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-4 text-center">
              <i className="bi bi-graph-up fs-2 text-success"></i>
              <h5 className="mt-2">Mes revenus</h5>
              <small className="text-muted">Consultez vos gains</small>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;