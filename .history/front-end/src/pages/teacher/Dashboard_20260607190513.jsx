import { useState, useEffect } from 'react';
import api from '../../api/axios';

function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('cours');
  const [reservations, setReservations] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
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
      const [reservationsRes, creneauxRes] = await Promise.all([
        api.get('/enseignant/reservations').catch(() => ({ data: [] })),
        api.get('/enseignant/creneaux').catch(() => ({ data: [] }))
      ]);
      setReservations(reservationsRes.data || []);
      setCreneaux(creneauxRes.data || []);
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
      <div className="bg-success text-white rounded-4 p-4 mb-4">
        <h1 className="h3 mb-2">Espace Enseignant</h1>
        <p className="text-white-50">Bienvenue {user?.prenom || 'Enseignant'} !</p>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'cours' ? 'active' : ''}`} onClick={() => setActiveTab('cours')}>
            Mes Cours ({reservations.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'disponibilites' ? 'active' : ''}`} onClick={() => setActiveTab('disponibilites')}>
            Disponibilités ({creneaux.length})
          </button>
        </li>
      </ul>

      {activeTab === 'cours' && (
        <>
          {reservations.length === 0 ? (
            <div className="alert alert-info">Aucun cours programmé</div>
          ) : (
            reservations.map(r => (
              <div key={r.id_reservation} className="card mb-3">
                <div className="card-body">
                  <h5>Réservation du {r.date}</h5>
                  <p>Statut: {r.statut}</p>
                  <p>Montant: {r.montant} DH</p>
                  <button className="btn btn-sm btn-success">Confirmer</button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {activeTab === 'disponibilites' && (
        <>
          {creneaux.length === 0 ? (
            <div className="alert alert-info">Aucun créneau déclaré</div>
          ) : (
            creneaux.map(c => (
              <div key={c.id_creneau} className="card mb-3">
                <div className="card-body">
                  <h5>{c.jour}</h5>
                  <p>{c.heureDebut} - {c.heureFin}</p>
                  <span className={`badge ${c.estDisponible ? 'bg-success' : 'bg-secondary'}`}>
                    {c.estDisponible ? 'Disponible' : 'Réservé'}
                  </span>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default TeacherDashboard;