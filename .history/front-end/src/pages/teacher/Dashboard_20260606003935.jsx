import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Tableau de bord</h2>
        <span className="badge bg-success">✓ Compte actif</span>
      </div>

      <div className="alert alert-info d-flex align-items-center gap-2">
        <i className="bi bi-check-circle-fill"></i>
        <span>Bienvenue, <strong>{user?.prenom} {user?.nom}</strong> ! Votre compte enseignant est actif.</span>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-md-3 col-6">
          <Link to="/enseignant/disponibilites" className="text-decoration-none">
            <div className="card text-center p-3 shadow-sm">
              <i className="bi bi-calendar-week fs-1 text-primary"></i>
              <div className="fw-semibold mt-2">Disponibilités</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/enseignant/revenus" className="text-decoration-none">
            <div className="card text-center p-3 shadow-sm">
              <i className="bi bi-wallet2 fs-1 text-primary"></i>
              <div className="fw-semibold mt-2">Revenus</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/enseignant/profil" className="text-decoration-none">
            <div className="card text-center p-3 shadow-sm">
              <i className="bi bi-person-gear fs-1 text-primary"></i>
              <div className="fw-semibold mt-2">Mon profil</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <div className="card text-center p-3 shadow-sm">
            <i className="bi bi-star-fill fs-1 text-warning"></i>
            <div className="fw-semibold mt-2">4.9 ★</div>
            <div className="small text-muted">Note moyenne</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;