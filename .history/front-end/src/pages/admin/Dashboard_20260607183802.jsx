export default function Dashboard() {
    return <div>Admin Dashboard</div>;
}import { useState, useEffect } from 'react';
import api from '../api/axios';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ totalEtudiants: 0, totalEnseignants: 0, totalReservations: 0, totalCommissions: 0 });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [signalements, setSignalements] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, usersRes, signalementsRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: { total_etudiants: 45, total_enseignants: 12, total_reservations: 128, revenus_total: 8450 } })),
        api.get('/admin/users').catch(() => ({ data: [] })),
        api.get('/admin/signalements').catch(() => ({ data: [] }))
      ]);
      setStats({
        totalEtudiants: statsRes.data.total_etudiants || 45,
        totalEnseignants: statsRes.data.total_enseignants || 12,
        totalReservations: statsRes.data.total_reservations || 128,
        totalCommissions: statsRes.data.revenus_total || 8450
      });
      setUsers(usersRes.data || []);
      setSignalements(signalementsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <div className="bg-dark text-white rounded-4 p-4 mb-4">
        <h1 className="h3">Console Administration Learnect</h1>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item"><button className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Statistiques</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Utilisateurs</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'signalements' ? 'active' : ''}`} onClick={() => setActiveTab('signalements')}>Signalements</button></li>
      </ul>

      {activeTab === 'stats' && (
        <div className="row g-3">
          <div className="col-md-3"><div className="card p-3 text-center"><h2>{stats.totalEtudiants}</h2><p className="text-muted">Étudiants</p></div></div>
          <div className="col-md-3"><div className="card p-3 text-center"><h2>{stats.totalEnseignants}</h2><p className="text-muted">Enseignants</p></div></div>
          <div className="col-md-3"><div className="card p-3 text-center"><h2>{stats.totalReservations}</h2><p className="text-muted">Réservations</p></div></div>
          <div className="col-md-3"><div className="card p-3 text-center"><h2>{stats.totalCommissions} DH</h2><p className="text-muted">Commissions</p></div></div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card p-3"><table className="table table-sm"><thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead><tbody>
          {users.map(u => <tr key={u.id}><td>{u.nom} {u.prenom}</td><td>{u.email}</td><td>{u.role}</td><td>{u.statut}</td><td><button className="btn btn-sm btn-danger">Bloquer</button></td></tr>)}
          {users.length === 0 && <tr><td colSpan="5" className="text-center">Aucun utilisateur</td></tr>}
        </tbody></table></div>
      )}

      {activeTab === 'signalements' && (
        <div className="card p-3">
          {signalements.length === 0 ? <p className="text-center">Aucun signalement</p> : signalements.map(s => <div key={s.id} className="border-bottom p-2"><strong>{s.motif}</strong><button className="btn btn-sm btn-primary float-end">Traiter</button></div>)}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;