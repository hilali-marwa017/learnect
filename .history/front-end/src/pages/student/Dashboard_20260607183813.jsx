import { useState, useEffect } from 'react';
import api from '../api/axios';

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('cours');
  const [reservations, setReservations] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reservationsRes, demandesRes] = await Promise.all([
        api.get('/student/reservations').catch(() => ({ data: [] })),
        api.get('/student/demandes').catch(() => ({ data: [] }))
      ]);
      setReservations(reservationsRes.data || []);
      setDemandes(demandesRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <div className="bg-primary text-white rounded-4 p-4 mb-4"><h1 className="h3">Espace Étudiant</h1></div>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item"><button className={`nav-link ${activeTab === 'cours' ? 'active' : ''}`} onClick={() => setActiveTab('cours')}>Mes Cours ({reservations.length})</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'demandes' ? 'active' : ''}`} onClick={() => setActiveTab('demandes')}>Mes Demandes ({demandes.length})</button></li>
      </ul>
      {activeTab === 'cours' && reservations.map(r => <div key={r.id} className="card mb-2 p-3"><h5>{r.matiere || 'Cours'}</h5><p>Date: {r.date || 'À définir'}</p><button className="btn btn-sm btn-outline-danger">Annuler</button></div>)}
      {activeTab === 'demandes' && demandes.map(d => <div key={d.id} className="card mb-2 p-3"><h5>{d.matiere}</h5><p>Budget: {d.budgetMin} - {d.budgetMax} DH/h</p></div>)}
      {reservations.length === 0 && activeTab === 'cours' && <div className="alert alert-info">Aucun cours réservé</div>}
      {demandes.length === 0 && activeTab === 'demandes' && <button className="btn btn-primary">Publier une demande</button>}
    </div>
  );
}

export default StudentDashboard;