import { useState, useEffect } from 'react';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [user, setUser] = useState(null);
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
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      
      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/stats', { headers }).catch(() => ({ json: () => ({}) })),
        fetch('http://localhost:8000/api/admin/enseignants/en-attente', { headers }).catch(() => ({ json: () => [] })),
        fetch('http://localhost:8000/api/admin/signalements', { headers }).catch(() => ({ json: () => [] })),
        fetch('http://localhost:8000/api/admin/users', { headers }).catch(() => ({ json: () => [] }))
      ]);
      
      const statsData = await statsRes.json();
      const teachersData = await teachersRes.json();
      const signalementsData = await signalementsRes.json();
      const usersData = await usersRes.json();
      
      setStats({
        totalEtudiants: statsData.total_etudiants || 0,
        totalEnseignants: statsData.total_enseignants || 0,
        totalReservations: statsData.total_reservations || 0,
        totalCommissions: statsData.revenus_total || 0,
        totalAvis: statsData.total_avis || 0
      });
      setPendingTeachers(teachersData || []);
      setSignalements(signalementsData || []);
      setUsers(usersData || []);
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
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
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

        {/* Tabs */}
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

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              <div className="bg-white p-5 rounded-3xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Élèves</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalEtudiants}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Tuteurs</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalEnseignants}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Réservations</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalReservations}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Commissions</span>
                <span className="text-3xl font-black text-blue-700 block mt-2">{stats.totalCommissions.toFixed(1)} DH</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Avis rédigés</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalAvis}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border mb-8">
              <div className="flex justify-between items-start pb-4 border-b">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-600">Volume des transactions</span>
                  <h4 className="text-sm font-black mt-1">Évolution des encaissements & commissions (10%)</h4>
                </div>
                <div className="bg-indigo-50 px-3 py-1.5 rounded-xl text-[11px] font-bold text-indigo-700">
                  <i className="bi bi-graph-up me-1"></i> Croissance +22%
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                <div className="md:col-span-2">
                  <div className="flex items-end justify-between gap-3 h-44 pt-6">
                    {['Jan', 'Fév', 'Mar', 'Avr', 'Mai'].map((m, i) => {
                      const heights = [30, 45, 55, 70, 85];
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-slate-100 rounded-t-xl h-32 flex items-end">
                            <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-xl" style={{ height: `${heights[i]}%` }}></div>
                          </div>
                          <span className="text-[10px] font-black mt-2 uppercase">{m}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Performance Admin</span>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between"><span>Volume de pointe :</span><strong>Mai (24 300 DH)</strong></div>
                    <div className="flex justify-between"><span>Total Commissions :</span><strong className="text-indigo-800">8 130 DH</strong></div>
                    <div className="flex justify-between"><span>Tuteurs actifs :</span><strong>Sofia, Amine, Laila</strong></div>
                  </div>
                  <p className="text-[10.5px] text-slate-400 italic mt-3 pt-2 border-t">🛡️ Notice de Modération</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border">
              <h4 className="text-xs font-black uppercase">Suivi des flux financiers</h4>
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-xs space-y-2 text-slate-600">
                <p>✓ 10% de commission, 90% pour l'enseignant.</p>
                <p>✓ Modération instantanée visible globalement.</p>
              </div>
            </div>
          </div>
        )}

        {/* Teachers Validation Tab */}
        {activeTab === 'teachers' && (
          <ValidatedTeachers 
            pendingTeachers={pendingTeachers} 
            onValidate={async (id) => {
              await fetch(`http://localhost:8000/api/admin/enseignants/${id}/valider`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              loadData();
            }}
            onRefresh={loadData}
          />
        )}

        {/* Signalements Tab */}
        {activeTab === 'reports' && (
          <Signalements 
            signalements={signalements} 
            onTraiter={async (id) => {
              await fetch(`http://localhost:8000/api/admin/signalements/${id}/traiter`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              loadData();
            }}
            onSupprimerAvis={async (idAvis, idSignalement) => {
              await fetch(`http://localhost:8000/api/admin/avis/${idAvis}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              await fetch(`http://localhost:8000/api/admin/signalements/${idSignalement}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              loadData();
            }}
          />
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <ManageUsers 
            users={users} 
            onBloquer={async (id) => {
              await fetch(`http://localhost:8000/api/admin/users/${id}/bloquer`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              loadData();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;