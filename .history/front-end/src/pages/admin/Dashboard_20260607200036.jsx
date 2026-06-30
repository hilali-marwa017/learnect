import { useState, useEffect } from 'react';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalCommissions: 0,
    totalAvis: 0
  });
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      
      // URLs corrigées selon ton api.php
      const statsRes = await fetch('http://localhost:8000/api/admin/stats', { headers });
      const teachersRes = await fetch('http://localhost:8000/api/admin/enseignants/attente', { headers });
      const signalementsRes = await fetch('http://localhost:8000/api/admin/signalements', { headers });
      const usersRes = await fetch('http://localhost:8000/api/admin/users', { headers });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          totalEtudiants: statsData.total_etudiants || 0,
          totalEnseignants: statsData.total_enseignants || 0,
          totalReservations: statsData.total_reservations || 0,
          totalCommissions: statsData.revenus_total || 0,
          totalAvis: statsData.total_avis || 0
        });
      }
      
      if (teachersRes.ok) {
        const teachersData = await teachersRes.json();
        setPendingTeachers(teachersData || []);
      }
      
      if (signalementsRes.ok) {
        const signalementsData = await signalementsRes.json();
        setSignalements(signalementsData || []);
      }
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData || []);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValiderEnseignant = async (id) => {
    await fetch(`http://localhost:8000/api/admin/enseignants/${id}/valider`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    loadData();
  };

  const handleBloquerUser = async (id) => {
    await fetch(`http://localhost:8000/api/admin/users/${id}/bloquer`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    loadData();
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Chargement...</p></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-2xl">
              <i className="bi bi-shield-check fs-4 text-blue-400"></i>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-800 px-2.5 py-0.5 rounded text-blue-400">Console Administration</span>
              <h1 className="text-xl sm:text-2xl font-black mt-1">Learnect Back-office</h1>
              <p className="text-slate-300 text-xs mt-0.5">Validation des diplômes, modération des avis signalés et gestion des comptes utilisateurs.</p>
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-200 mb-8 flex-wrap">
          <button onClick={() => setActiveTab('stats')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'stats' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}>
            <i className="bi bi-graph-up"></i> Statistiques
          </button>
          <button onClick={() => setActiveTab('teachers')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'teachers' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}>
            <i className="bi bi-files"></i> Vérification ({pendingTeachers.length})
          </button>
          <button onClick={() => setActiveTab('reports')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'reports' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}>
            <i className="bi bi-exclamation-triangle"></i> Signalements ({signalements.filter(s => s.statut === 'en_attente').length})
          </button>
          <button onClick={() => setActiveTab('users')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}>
            <i className="bi bi-people"></i> Utilisateurs ({users.length})
          </button>
        </div>

        {activeTab === 'stats' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Élèves</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalEtudiants}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Tuteurs</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalEnseignants}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Réservations</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalReservations}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Commissions</span>
                <span className="text-3xl font-black text-blue-700 block mt-2">{stats.totalCommissions.toFixed(1)} DH</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Avis rédigés</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalAvis}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <ValidatedTeachers 
            pendingTeachers={pendingTeachers} 
            onValidate={handleValiderEnseignant}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'reports' && (
          <Signalements signalements={signalements} />
        )}

        {activeTab === 'users' && (
          <ManageUsers users={users} onBloquer={handleBloquerUser} />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;