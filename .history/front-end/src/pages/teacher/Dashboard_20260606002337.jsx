import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    tarifMoyen: 180,
    note: 4.8,
    creneauxLibres: 4,
    revenusBruts: 0,
    reservationsCount: 1,
    messagesNonLus: 3
  });
  const [eleves, setEleves] = useState([
    { id: 1, nom: 'Marwa Hilali', telephone: '+212612345678', dateCours: '2026-05-25', gainNet: 0 },
    { id: 2, nom: 'Yassine Amrani', telephone: '+212698765432', dateCours: '2026-05-28', gainNet: 162 }
  ]);
  const [demandes, setDemandes] = useState([
    { id: 1, titre: 'Classes Préparatoires (MPSI) • Mathématique...', ville: 'Casablanca', budgetMin: 120, budgetMax: 160, statut: 'propose' },
    { id: 2, titre: 'Lycée - 2ème Bac Sciences Maths • Physique...', ville: 'Marrakech', budgetMin: 100, budgetMax: 150, statut: 'offre' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les données depuis l'API
    const fetchData = async () => {
      try {
        // const res = await api.get('/teacher/dashboard');
        // setStats(res.data.stats);
        // setEleves(res.data.eleves);
        // setDemandes(res.data.demandes);
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
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      
      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Tableau de bord enseignant</h1>
          <p className="text-muted small mb-0">
            Bienvenue, <span className="fw-bold text-primary">Prof. {user?.prenom} {user?.nom}</span>
          </p>
        </div>
        <div className="text-end">
          <span className="badge bg-light text-dark px-3 py-2">
            <i className="bi bi-geo-alt me-1"></i> {user?.ville || 'Casablanca'}
          </span>
        </div>
      </div>

      {/* Cartes stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small">VOTRE TARIF HORAIRE MOYEN</span>
                <i className="bi bi-calculator text-primary fs-5"></i>
              </div>
              <div className="d-flex align-items-baseline">
                <span className="fs-2 fw-bold text-primary">{stats.tarifMoyen}</span>
                <span className="text-muted ms-1">DH / heure</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small">NOTE DES APPRENANTS</span>
                <i className="bi bi-star-fill text-warning fs-5"></i>
              </div>
              <div className="d-flex align-items-baseline">
                <span className="fs-2 fw-bold text-primary">{stats.note}</span>
                <span className="text-muted ms-1">★</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small">CRÉNEAUX LIBRES</span>
                <i className="bi bi-calendar-week text-primary fs-5"></i>
              </div>
              <div className="d-flex align-items-baseline">
                <span className="fs-2 fw-bold text-primary">{stats.creneauxLibres}</span>
                <span className="text-muted ms-1">disponibles</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small">MESSAGES</span>
                <i className="bi bi-chat-dots text-primary fs-5"></i>
              </div>
              <div className="d-flex align-items-baseline">
                <span className="fs-2 fw-bold text-primary">{stats.messagesNonLus}</span>
                <span className="text-muted ms-1">non lus</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lignes de navigation rapide */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <Link to="/enseignant/disponibilites" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-4 text-center p-3 hover-card">
              <i className="bi bi-calendar-plus fs-2 text-primary"></i>
              <span className="fw-semibold mt-2">Gérer mes créneaux</span>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/enseignant/revenus" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-4 text-center p-3 hover-card">
              <i className="bi bi-wallet2 fs-2 text-primary"></i>
              <span className="fw-semibold mt-2">Portefeuille & Revenus</span>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/enseignant/messages" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-4 text-center p-3 hover-card">
              <i className="bi bi-envelope-paper fs-2 text-primary"></i>
              <span className="fw-semibold mt-2">Messages</span>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/enseignant/profil" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-4 text-center p-3 hover-card">
              <i className="bi bi-person-gear fs-2 text-primary"></i>
              <span className="fw-semibold mt-2">Mon profil</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Synthèse & Revenus */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Synthèse & Élèves</h5>
                <i className="bi bi-graph-up text-primary fs-4"></i>
              </div>
              <div className="row text-center">
                <div className="col-6">
                  <div className="bg-light rounded-3 p-3">
                    <div className="text-muted small">NOTE DES APPRENANTS</div>
                    <div className="fs-1 fw-bold text-primary">{stats.note}★</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-light rounded-3 p-3">
                    <div className="text-muted small">CRÉNEAUX LIBRES</div>
                    <div className="fs-1 fw-bold text-primary">{stats.creneauxLibres}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Réseaux de connexion</h5>
                <i className="bi bi-people text-primary fs-4"></i>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="bg-light rounded-3 p-3 text-center">
                    <div className="text-muted small">REVENUS CUMULÉS (BRUTS)</div>
                    <div className="fs-1 fw-bold text-primary">{stats.revenusBruts}</div>
                    <span className="text-muted">DH</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-light rounded-3 p-3 text-center">
                    <div className="text-muted small">RÉSERVATIONS EFFECTUÉES</div>
                    <div className="fs-1 fw-bold text-primary">{stats.reservationsCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suivi des élèves */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-header bg-transparent border-0 pt-4 pb-0">
          <h5 className="fw-bold mb-0">📋 Suivi de vos élèves particuliers</h5>
        </div>
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="text-muted small">
                  <th>Élève</th>
                  <th>WhatsApp</th>
                  <th>Cours prévu</th>
                  <th>Gains net (90%)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {eleves.map(eleve => (
                  <tr key={eleve.id}>
                    <td className="fw-semibold">{eleve.nom}</td>
                    <td>
                      <a href={`https://wa.me/${eleve.telephone}`} target="_blank" rel="noopener noreferrer" className="text-success text-decoration-none">
                        <i className="bi bi-whatsapp me-1"></i> {eleve.telephone}
                      </a>
                    </td>
                    <td>{eleve.dateCours}</td>
                    <td className="fw-bold">{eleve.gainNet} DH</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        <i className="bi bi-chat me-1"></i> Clavarder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Demandes d'enseignement */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-transparent border-0 pt-4 pb-0">
          <h5 className="fw-bold mb-0">📢 Demandes d'enseignement</h5>
          <p className="text-muted small mb-0">Proposez directement vos prix d'accompagnement aux élèves.</p>
        </div>
        <div className="card-body p-4">
          <div className="row g-3">
            {demandes.map(demande => (
              <div key={demande.id} className="col-md-6">
                <div className="border rounded-3 p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{demande.titre}</h6>
                    <span className="badge bg-light text-dark">{demande.ville}</span>
                  </div>
                  <p className="text-muted small mb-2">
                    Budget : {demande.budgetMin} à {demande.budgetMax} DH/h
                  </p>
                  <button className="btn btn-sm btn-outline-primary rounded-pill px-3">
                    {demande.statut === 'propose' ? 'Déjà proposé ▼' : 'Faire une offre ▼'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hover-card {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .hover-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(13,110,253,0.12) !important;
          border-color: #0d6efd !important;
        }
        .table th, .table td {
          padding: 12px 8px;
        }
      `}</style>
    </div>
  );
}

export default Dashboa;