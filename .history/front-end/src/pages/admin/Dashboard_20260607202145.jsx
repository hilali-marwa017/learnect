import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

// Enregistrement Chart.js
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

  // Données Chart.js
  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Volume (DH)',
        data: [8900, 12500, 15300, 19800, 24300, 28700],
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.raw.toLocaleString() + ' DH';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString() + ' DH';
          }
        }
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Chargement...</p></div>;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ background: '#0f172a', color: 'white', borderRadius: '30px', padding: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '16px' }}>
              <i className="bi bi-shield-check fs-4 text-blue-400"></i>
            </div>
            <div>
              <span style={{ fontSize: '10px', background: '#1e293b', padding: '4px 10px', borderRadius: '20px' }}>CONSOLE ADMIN</span>
              <h1 style={{ fontSize: '24px', marginTop: '5px' }}>Learnect Back-office</h1>
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>Validation des diplômes, modération des avis signalés</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          <button onClick={() => setActiveTab('stats')} className={`py-2 px-5 rounded-lg ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><i className="bi bi-graph-up me-1"></i> Statistiques</button>
          <button onClick={() => setActiveTab('teachers')} className={`py-2 px-5 rounded-lg ${activeTab === 'teachers' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><i className="bi bi-files me-1"></i> Vérification ({pendingTeachers.length})</button>
          <button onClick={() => setActiveTab('reports')} className={`py-2 px-5 rounded-lg ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><i className="bi bi-exclamation-triangle me-1"></i> Signalements ({signalements.length})</button>
          <button onClick={() => setActiveTab('users')} className={`py-2 px-5 rounded-lg ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><i className="bi bi-people me-1"></i> Utilisateurs ({users.length})</button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            {/* 5 cartes stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid #e2e8f0' }}><div style={{ fontSize: '10px', color: '#94a3b8' }}>Total Élèves</div><div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalEtudiants}</div></div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid #e2e8f0' }}><div style={{ fontSize: '10px', color: '#94a3b8' }}>Total Tuteurs</div><div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalEnseignants}</div></div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid #e2e8f0' }}><div style={{ fontSize: '10px', color: '#94a3b8' }}>Réservations</div><div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalReservations}</div></div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid #e2e8f0' }}><div style={{ fontSize: '10px', color: '#94a3b8' }}>Commissions</div><div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>{stats.revenusTotal} DH</div></div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid #e2e8f0' }}><div style={{ fontSize: '10px', color: '#94a3b8' }}>Avis rédigés</div><div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalAvis}</div></div>
            </div>

            {/* Graphique Chart.js */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <div><span style={{ fontSize: '10px', color: '#6366f1', fontWeight: 'bold' }}>VOLUME DES TRANSACTIONS</span><h4 style={{ fontSize: '14px', marginTop: '5px' }}>Évolution des encaissements & commissions (10%)</h4></div>
                <div style={{ background: '#eef2ff', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#6366f1' }}><i className="bi bi-graph-up me-1"></i> Croissance mensuelle : +22%</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '20px' }}>
                <div style={{ height: '300px' }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#94a3b8' }}>PERFORMANCE ADMIN</span>
                  <div style={{ marginTop: '12px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Volume de pointe :</span><strong>Juin (28 700 DH)</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Total Commissions :</span><strong style={{ color: '#6366f1' }}>10 863 DH</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tuteurs actifs :</span><strong>Sofia, Amine, Laila</strong></div>
                  </div>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}><i className="bi bi-shield-check me-1"></i> Les commissions fixes servent au financement des serveurs.</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 'bold' }}>SUIVI DES FLUX FINANCIERS TRANSPARENTS</h4>
              <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '16px', fontSize: '12px' }}>
                <p><i className="bi bi-check-circle-fill text-green-600 me-2"></i> Tous les profils d'enseignants ont 10% de taxes perçues d'utilisation, et 90% restent pour l'enseignant.</p>
                <p style={{ marginTop: '8px' }}><i className="bi bi-check-circle-fill text-green-600 me-2"></i> Les modifications faites par l'ordinateur de modération sont instantanément visibles globalement.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && <ValidatedTeachers pendingTeachers={pendingTeachers} onRefresh={loadAllData} />}
        {activeTab === 'reports' && <Signalements signalements={signalements} onRefresh={loadAllData} />}
        {activeTab === 'users' && <ManageUsers users={users} onRefresh={loadAllData} />}
      </div>
    </div>
  );
}

export default AdminDashboard;