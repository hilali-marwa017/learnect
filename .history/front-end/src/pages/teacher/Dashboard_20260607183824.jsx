import { useState, useEffect } from 'react';
import api from '../api/axios';

function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('cours');
  const [reservations, setReservations] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nouveauJour, setNouveauJour] = useState('Lundi');
  const [nouvelleHeure, setNouvelleHeure] = useState('09:00');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reservationsRes, creneauxRes] = await Promise.all([
        api.get('/teacher/reservations').catch(() => ({ data: [] })),
        api.get('/teacher/creneaux').catch(() => ({ data: [] }))
      ]);
      setReservations(reservationsRes.data || []);
      setCreneaux(creneauxRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ajouterCreneau = async () => {
    try {
      await api.post('/teacher/creneaux', { jour: nouveauJour, heureDebut: nouvelleHeure, heureFin: (parseInt(nouvelleHeure.split(':')[0]) + 1) + ':00' });
      loadData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <div className="bg-success text-white rounded-4 p-4 mb-4"><h1 className="h3">Espace Enseignant</h1></div>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item"><button className={`nav-link ${activeTab === 'cours' ? 'active' : ''}`} onClick={() => setActiveTab('cours')}>Mes Cours ({reservations.length})</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'disponibilites' ? 'active' : ''}`} onClick={() => setActiveTab('disponibilites')}>Disponibilités ({creneaux.length})</button></li>
      </ul>
      {activeTab === 'cours' && reservations.map(r => <div key={r.id} className="card mb-2 p-3"><h5>{r.eleve || 'Élève'}</h5><p>Date: {r.date}</p><button className="btn btn-sm btn-success">Confirmer</button></div>)}
      {activeTab === 'disponibilites' && <div><select className="form-select mb-2" value={nouveauJour} onChange={e => setNouveauJour(e.target.value)}><option>Lundi</option><option>Mardi</option><option>Mercredi</option></select><input type="time" className="form-control mb-2" value={nouvelleHeure} onChange={e => setNouvelleHeure(e.target.value)} /><button className="btn btn-primary" onClick={ajouterCreneau}>Ajouter créneau</button><hr />{creneaux.map(c => <div key={c.id} className="alert alert-secondary">{c.jour} - {c.heureDebut}</div>)}</div>}
    </div>
  );
}

export default TeacherDashboard;