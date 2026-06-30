import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVues: 0,
    totalDemandes: 0,
    tauxReponse: 0,
    note: 4.8,
    avis: 12
  });
  const [annonces, setAnnonces] = useState([
    { id: 1, titre: 'Cours particuliers de Mathématiques', tarif: 180, statut: 'en_ligne', niveau: 'Lycée/Bac' }
  ]);

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
      
      {/* En-tête comme Superprof */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Tableau de bord</h1>
          <p className="text-muted small mb-0">
            <i className="bi bi-person-circle me-1"></i>
            {user?.prenom} {user?.nom} · {user?.ville || 'Casablanca'}, Maroc
          </p>
        </div>
        <div className="text-end">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
            <i className="bi bi-check-circle-fill me-1"></i>Contact vérifié
          </span>
        </div>
      </div>

      {/* Statistiques type Superprof */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 text-center">
            <i className="bi bi-eye fs-2 text-primary"></i>
            <div className="fs-3 fw-bold">{stats.totalVues || 0}</div>
            <div className="text-muted small">Vues de l'annonce</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 text-center">
            <i className="bi bi-envelope fs-2 text-primary"></i>
            <div className="fs-3 fw-bold">{stats.totalDemandes || 0}</div>
            <div className="text-muted small">Demandes reçues</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 text-center">
            <i className="bi bi-clock fs-2 text-primary"></i>
            <div className="fs-3 fw-bold">{stats.tauxReponse || 0}%</div>
            <div className="text-muted small">Taux de réponse</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 text-center">
            <i className="bi bi-star-fill fs-2 text-warning"></i>
            <div className="fs-3 fw-bold">{stats.note}</div>
            <div className="text-muted small">{stats.avis} avis</div>
          </div>
        </div>
      </div>

      {/* 2 colonnes : Annonces + Menu */}
      <div className="row g-4">
        
        {/* Colonne gauche - Annonces */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pt-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0"><i className="bi bi-megaphone me-2 text-primary"></i>Mes annonces</h5>
              <Link to="/enseignant/annonce" className="btn btn-sm btn-outline-primary">
                <i className="bi bi-plus-lg me-1"></i>Créer une annonce
              </Link>
            </div>
            <div className="card-body">
              {annonces.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-file-text fs-1 text-muted"></i>
                  <p className="text-muted mt-2">Aucune annonce pour le moment</p>
                  <button className="btn btn-primary btn-sm">Créer ma première annonce</button>
                </div>
              ) : (
                annonces.map(annonce => (
                  <div key={annonce.id} className="border rounded-3 p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="fw-bold mb-1">{annonce.titre}</h6>
                        <div className="d-flex gap-3 mb-2">
                          <span className="badge bg-light text-dark">
                            <i className="bi bi-cash-stack me-1"></i>{annonce.tarif} MAD/h
                          </span>
                          <span className="badge bg-light text-dark">
                            <i className="bi bi-mortarboard me-1"></i>{annonce.niveau}
                          </span>
                          <span className={`badge ${annonce.statut === 'en_ligne' ? 'bg-success' : 'bg-secondary'}`}>
                            {annonce.statut === 'en_ligne' ? 'En ligne' : 'Hors ligne'}
                          </span>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-pencil me-1"></i>Modifier
                      </button>
                    </div>
                    <div className="d-flex gap-3 mt-2 pt-2 border-top">
                      <Link to="#" className="small text-primary text-decoration-none">
                        <i className="bi bi-bar-chart me-1"></i>Statistiques
                      </Link>
                      <Link to="#" className="small text-primary text-decoration-none">
                        <i className="bi bi-people me-1"></i>Élèves intéressés
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mes demandes de cours */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-transparent border-0 pt-3">
              <h5 className="fw-bold mb-0"><i className="bi bi-question-circle me-2 text-primary"></i>Mes demandes de cours</h5>
            </div>
            <div className="card-body text-center py-4">
              <i className="bi bi-inbox fs-1 text-muted"></i>
              <p className="text-muted mt-2">Aucune demande pour le moment</p>
              <small className="text-muted">Les élèves vous contacteront directement</small>
            </div>
          </div>
        </div>

        {/* Colonne droite - Menu type Superprof */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pt-3">
              <h5 className="fw-bold mb-0"><i className="bi bi-grid-3x3-gap me-2 text-primary"></i>Menu</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/enseignant/dashboard" className="list-group-item list-group-item-action border-0 py-3 active-dashboard">
                  <i className="bi bi-speedometer2 me-3 text-primary"></i>Tableau de bord
                  <i className="bi bi-chevron-right float-end text-muted"></i>
                </Link>
                <Link to="/enseignant/messages" className="list-group-item list-group-item-action border-0 py-3">
                  <i className="bi bi-envelope me-3 text-primary"></i>Mes messages
                  <span className="badge bg-danger rounded-pill ms-2">3</span>
                  <i className="bi bi-chevron-right float-end text-muted"></i>
                </Link>
                <Link to="/enseignant/annonces" className="list-group-item list-group-item-action border-0 py-3">
                  <i className="bi bi-megaphone me-3 text-primary"></i>Mes annonces
                  <i className="bi bi-chevron-right float-end text-muted"></i>
                </Link>
                <Link to="/enseignant/evaluations" className="list-group-item list-group-item-action border-0 py-3">
                  <i className="bi bi-star me-3 text-primary"></i>Évaluations
                  <span className="ms-2">⭐ {stats.note}</span>
                  <i className="bi bi-chevron-right float-end text-muted"></i>
                </Link>
                <Link to="/enseignant/profil" className="list-group-item list-group-item-action border-0 py-3">
                  <i className="bi bi-person-gear me-3 text-primary"></i>Mon compte
                  <i className="bi bi-chevron-right float-end text-muted"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Conseils type Superprof */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-transparent border-0 pt-3">
              <h5 className="fw-bold mb-0"><i className="bi bi-lightbulb me-2 text-warning"></i>À savoir</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <small>Complétez votre profil pour plus de visibilité</small>
              </div>
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <small>Répondez rapidement aux demandes</small>
              </div>
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <small>Ajoutez une photo professionnelle</small>
              </div>
              <div className="alert alert-primary bg-opacity-10 border-0 small">
                <i className="bi bi-info-circle me-2"></i>
                Les 3 premiers jours sont gratuits !
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .list-group-item-action:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }
        .active-dashboard {
          background-color: rgba(13, 110, 253, 0.08);
          border-left: 3px solid #0d6efd;
        }
        .card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default TeacherDashboard;