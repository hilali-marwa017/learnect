import { useState, useEffect } from 'react';
import api from '../../api/axios';

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('cours');
  const [reservations, setReservations] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reservationsRes, demandesRes] = await Promise.all([
        api.get('/etudiant/reservations').catch(() => ({ data: [] })),
        api.get('/etudiant/demandes').catch(() => ({ data: [] }))
      ]);
      setReservations(reservationsRes.data || []);
      setDemandes(demandesRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="bg-primary text-white rounded-4 p-4 mb-4">
        <h1 className="h3 mb-2">Espace Étudiant</h1>
        <p className="text-white-50">Bienvenue {user?.prenom || 'Étudiant'} !</p>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'cours' ? 'active' : ''}`} onClick={() => setActiveTab('cours')}>
            Mes Cours ({reservations.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'demandes' ? 'active' : ''}`} onClick={() => setActiveTab('demandes')}>
            Mes Demandes ({demandes.length})
          </button>
        </li>
      </ul>

      {activeTab === 'cours' && (
        <>
          {reservations.length === 0 ? (
            <div className="alert alert-info">Aucun cours réservé</div>
          ) : (
            reservations.map(r => (
              <div key={r.id_reservation} className="card mb-3">
                <div className="card-body">
                  <h5>Cours du {r.date}</h5>
                  <p>Statut: {r.statut}</p>
                  <p>Montant: {r.montant} DH</p>
                  <button className="btn btn-sm btn-outline-danger">Annuler</button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {activeTab === 'demandes' && (
        <>
          {demandes.length === 0 ? (
            <div className="alert alert-info">Aucune demande publiée</div>
          ) : (
            demandes.map(d => (
              <div key={d.id_demande} className="card mb-3">
                <div className="card-body">
                  <h5>{d.matiere}</h5>
                  <p>Niveau: {d.niveau}</p>
                  <p>Budget: {d.budgetMin} - {d.budgetMax} DH/h</p>
                  <p>Ville: {d.ville}</p>
                  <span className={`badge ${d.statut === 'active' ? 'bg-success' : 'bg-secondary'}`}>{d.statut}</span>
                </div>
              </div>
            ))
          )}
          <button className="btn btn-primary">Publier une demande</button>
        </>
      )}
    </div>
  );
}

export default StudentDashboard;