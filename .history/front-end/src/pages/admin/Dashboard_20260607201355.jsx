import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalAvis: 0,
    revenusTotal: 0
  });
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({ 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/stats', { headers: getHeaders() }),
        fetch('http://localhost:8000/api/admin/enseignantsEnAttente', { headers: getHeaders() }),
        fetch('http://localhost:8000/api/admin/signalements', { headers: getHeaders() }),
        fetch('http://localhost:8000/api/admin/Users', { headers: getHeaders() })
      ]);
      
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats({
          totalEtudiants: data.total_etudiants || 0,
          totalEnseignants: data.total_enseignants || 0,
          totalReservations: data.total_reservations || 0,
          totalAvis: data.total_avis || 0,
          revenusTotal: data.revenus_total || 0
        });
      }
      if (teachersRes.ok) setPendingTeachers(await teachersRes.json());
      if (signalementsRes.ok) setSignalements(await signalementsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Volume (DH)',
      data: [8900, 12500, 15300, 19800, 24300, 28700],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 8,
    }]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (ctx) => `${ctx.raw.toLocaleString()} DH` } } } };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Chargement...</p></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-2xl"><i className="bi bi-shield-check fs-4 text-blue-400"></i></div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-800 px-2.5 py-0.5 rounded text-blue-400">Console Administration</span>
              <h1 className="text-xl sm:text-2xl font-black mt-1">Learnect Back-office</h1>
              <p className="text-slate-300 text-xs mt-0.5">Validation des diplômes, modération des avis signalés et gestion des comptes utilisateurs.</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8 flex-wrap">
          <button onClick={() => setActiveTab('stats')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'stats' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}><i className="bi bi-graph-up"></i> Statistiques</button>
          <button onClick={() => setActiveTab('teachers')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'teachers' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}><i className="bi bi-files"></i> Vérification ({pendingTeachers.length})</button>
          <button onClick={() => setActiveTab('reports')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'reports' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}><i className="bi bi-exclamation-triangle"></i> Signalements ({signalements.length})</button>
          <button onClick={() => setActiveTab('users')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}><i className="bi bi-people"></i> Utilisateurs ({users.length})</button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              <div className="bg-white p-5 rounded-3xl border text-center"><span className="text-[10px] text-slate-400 font-bold uppercase">Total Élèves</span><span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalEtudiants}</span></div>
              <div className="bg-white p-5 rounded-3xl border text-center"><span className="text-[10px] text-slate-400 font-bold uppercase">Total Tuteurs</span><span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalEnseignants}</span></div>
              <div className="bg-white p-5 rounded-3xl border text-center"><span className="text-[10px] text-slate-400 font-bold uppercase">Réservations</span><span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalReservations}</span></div>
              <div className="bg-white p-5 rounded-3xl border text-center"><span className="text-[10px] text-slate-400 font-bold uppercase">Commissions brutes</span><span className="text-3xl font-black text-blue-700 block mt-2">{stats.revenusTotal.toFixed(1)} DH</span></div>
              <div className="bg-white p-5 rounded-3xl border text-center"><span className="text-[10px] text-slate-400 font-bold uppercase">Avis rédigés</span><span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalAvis}</span></div>
            </div>

            <div className="bg-white p-6 rounded-3xl border mb-8">
              <div className="flex justify-between items-start pb-4 border-b">
                <div><span className="text-[10px] uppercase font-bold text-indigo-600">Volume des transactions</span><h4 className="text-sm font-black mt-1">Évolution des encaissements & commissions (10%)</h4></div>
                <div className="bg-indigo-50 px-3 py-1.5 rounded-xl text-[11px] font-bold text-indigo-700"><i className="bi bi-graph-up me-1"></i> Croissance mensuelle : +22%</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                <div className="md:col-span-2" style={{ height: '280px' }}><Bar data={chartData} options={chartOptions} /></div>
                <div className="bg-slate-50 p-4 rounded-2xl border">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Performance Administrative</span>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Volume de pointe :</span><strong>Juin (28 700 DH)</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Total Commissions :</span><strong className="text-indigo-800">10 863 DH</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Tuteurs actifs :</span><strong>Sofia, Amine, Laila</strong></div>
                  </div>
                  <p className="text-[10.5px] text-slate-400 italic mt-3 pt-2 border-t"><i className="bi bi-shield-check me-1"></i> Les commissions fixes servent au financement des serveurs.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border">
              <h4 className="text-xs font-black uppercase">Suivi des flux financiers transparents</h4>
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-xs space-y-2 text-slate-600">
                <p><i className="bi bi-check-circle-fill text-green-600 me-2"></i> Tous les profils d'enseignants ont 10% de taxes perçues d'utilisation, et 90% restent pour l'enseignant.</p>
                <p><i className="bi bi-check-circle-fill text-green-600 me-2"></i> Les modifications faites par l'ordinateur de modération sont instantanément visibles globalement.</p>
              </div>
            </div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && <ValidatedTeachers pendingTeachers={pendingTeachers} onRefresh={loadAllData} />}

        {/* Signalements Tab */}
        {activeTab === 'reports' && <Signalements signalements={signalements} onRefresh={loadAllData} />}

        {/* Users Tab */}
        {activeTab === 'users' && <ManageUsers users={users} onRefresh={loadAllData} />}
      </div>
    </div>
  );
}

export default AdminDashboard;