import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalCommissions: 0,
    totalAvis: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats({
        totalEtudiants: res.data.total_etudiants || 0,
        totalEnseignants: res.data.total_enseignants || 0,
        totalReservations: res.data.total_reservations || 0,
        totalCommissions: res.data.revenus_total || 0,
        totalAvis: res.data.total_avis || 0
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container py-4">
      <div className="bg-dark text-white rounded-4 p-4 mb-4">
        <h1 className="h3 mb-2">Console Administration Learnect</h1>
        <p className="text-white-50">Gestion des utilisateurs, validation des enseignants et modération</p>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item"><button className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Statistiques</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>Validation Enseignants</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Signalements</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Utilisateurs</button></li>
      </ul>

      {activeTab === 'stats' && (
        <div className="row g-3">
          <div className="col-md-3"><div className="card p-3 text-center"><h2 className="text-primary">{stats.totalEtudiants}</h2><p>Étudiants</p></div></div>
          <div className="col-md-3"><div className="card p-3 text-center"><h2 className="text-primary">{stats.totalEnseignants}</h2><p>Enseignants</p></div></div>
          <div className="col-md-3"><div className="card p-3 text-center"><h2 className="text-primary">{stats.totalReservations}</h2><p>Réservations</p></div></div>
          <div className="col-md-3"><div className="card p-3 text-center"><h2 className="text-primary">{stats.totalCommissions} DH</h2><p>Commissions</p></div></div>
          <div className="col-md-12 mt-3"><div className="card p-3"><h5>Dernière activité</h5><p>Total avis: {stats.totalAvis}</p></div></div>
        </div>
      )}

      {activeTab === 'teachers' && <ValidatedTeachers />}
      {activeTab === 'reports' && <Signalements />}
      {activeTab === 'users' && <ManageUsers />}
    </div>
  );
}

export default AdminDashboard;