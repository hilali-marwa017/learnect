// src/pages/etudiant/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('cours');
  const [reservations, setReservations] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(function() {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    setLoading(true);
    try {
      // Récupérer les réservations de l'étudiant
      const reservationsRes = await api.get('/reservations');
      setReservations(reservationsRes.data || []);
      
      // Récupérer les demandes de l'étudiant
      const demandesRes = await api.get('/demandes/mes-demandes');
      setDemandes(demandesRes.data || []);
      
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnnulerReservation(id) {
    if (window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      try {
        await api.delete(`/reservations/${id}`);
        chargerDonnees();
      } catch (err) {
        console.error('Erreur annulation:', err);
        alert('Erreur lors de l\'annulation');
      }
    }
  }

  async function handleSupprimerDemande(id) {
    if (window.confirm('Voulez-vous vraiment supprimer cette demande ?')) {
      try {
        await api.delete(`/demandes/${id}`);
        chargerDonnees();
      } catch (err) {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression');
      }
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* En-tête */}
      <div style={{ background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', color: 'white' }}>
        <h1 className="h3 mb-2">Espace Étudiant</h1>
        <p className="mb-0" style={{ opacity: 0.9 }}>
          Bienvenue {user?.prenom || 'Étudiant'} {user?.nom || ''} !
        </p>
      </div>

      {/* Onglets */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'cours' ? 'active' : ''}`} 
            onClick={() => setActiveTab('cours')}
            style={{ cursor: 'pointer' }}
          >
            Mes Cours ({reservations.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'demandes' ? 'active' : ''}`} 
            onClick={() => setActiveTab('demandes')}
            style={{ cursor: 'pointer' }}
          >
            Mes Demandes ({demandes.length})
          </button>
        </li>
      </ul>

      {/* Tab Cours */}
      {activeTab === 'cours' && (
        <div>
          {reservations.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              Aucun cours réservé pour le moment.
              <Link to="/teachers" className="alert-link ms-2">Trouver un professeur →</Link>
            </div>
          ) : (
            <div className="row g-3">
              {reservations.map(function(r) {
                return (
                  <div key={r.id_reservation || r.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title text-primary mb-0">
                            {r.creneau?.enseignant?.user?.prenom} {r.creneau?.enseignant?.user?.nom}
                          </h5>
                          <span className={`badge ${r.statut === 'confirmee' ? 'bg-success' : 'bg-warning'}`}>
                            {r.statut === 'confirmee' ? 'Confirmé' : 'En attente'}
                          </span>
                        </div>
                        <p className="card-text small text-muted mb-2">
                          <i className="bi bi-calendar me-1"></i> {r.creneau?.date} à {r.creneau?.heure_debut}
                        </p>
                        <p className="card-text small text-muted mb-2">
                          <i className="bi bi-book me-1"></i> {r.creneau?.enseignant?.matieres?.[0]?.nom || 'Cours particulier'}
                        </p>
                        <p className="card-text fw-bold text-success mb-3">
                          {r.montant} DH
                        </p>
                        {r.statut !== 'confirmee' && (
                          <button 
                            className="btn btn-sm btn-outline-danger w-100"
                            onClick={() => handleAnnulerReservation(r.id_reservation || r.id)}
                          >
                            <i className="bi bi-x-circle me-1"></i> Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Demandes */}
      {activeTab === 'demandes' && (
        <div>
          {demandes.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              Aucune demande publiée.
            </div>
          ) : (
            <div className="row g-3">
              {demandes.map(function(d) {
                return (
                  <div key={d.id_demande || d.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title text-primary mb-0">{d.matiere}</h5>
                          <span className={`badge ${d.statut === 'active' || d.statut === 'en_cours' ? 'bg-success' : 'bg-secondary'}`}>
                            {d.statut === 'active' || d.statut === 'en_cours' ? 'Active' : 'Fermée'}
                          </span>
                        </div>
                        <p className="card-text small text-muted mb-2">
                          <i className="bi bi-mortarboard me-1"></i> Niveau: {d.niveau}
                        </p>
                        <p className="card-text small text-muted mb-2">
                          <i className="bi bi-cash me-1"></i> Budget: {d.budgetMin || d.budget} - {d.budgetMax} DH/h
                        </p>
                        <p className="card-text small text-muted mb-3">
                          <i className="bi bi-geo-alt me-1"></i> {d.ville}
                        </p>
                        <button 
                          className="btn btn-sm btn-outline-danger w-100"
                          onClick={() => handleSupprimerDemande(d.id_demande || d.id)}
                        >
                          <i className="bi bi-trash me-1"></i> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/demandes/nouvelle" className="btn btn-primary px-4 py-2">
              <i className="bi bi-plus-circle me-2"></i> Publier une demande
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;