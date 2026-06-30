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
      backgroundColor: '#0d6efd',
      borderRadius: 6,
      barPercentage: 0.65,
      categoryPercentage: 0.8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 11 } } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.raw.toLocaleString()} DH` } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => v.toLocaleString() + ' DH' } }
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Chargement...</p></div>;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ background: '#0f172a', color: 'white', borderRadius: '30px', padding: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '16px' }}><i className="bi bi-shield-check fs-4 text-blue-400"></i></div>
            <div>
              <span style={{ fontSize: '10px', background: '#1e293b', padding: '4px 10px', borderRadius: '20px' }}>CONSOLE ADMIN</span>
              <h1 style={{ fontSize: '24px', marginTop: '5px' }}>Learnect Back-office</h1>
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>Validation des diplômes, modération des avis signalés</p>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mb-4 border-bottom pb-2">
          <button onClick={() => setActiveTab('stats')} className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-outline-secondary'}`}><i className="bi bi-graph-up me-1"></i> Statistiques</button>
          <button onClick={() => setActiveTab('teachers')} className={`btn ${activeTab === 'teachers' ? 'btn-primary' : 'btn-outline-secondary'}`}><i className="bi bi-files me-1"></i> Vérification ({pendingTeachers.length})</button>
          <button onClick={() => setActiveTab('reports')} className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline-secondary'}`}><i className="bi bi-exclamation-triangle me-1"></i> Signalements ({signalements.length})</button>
          <button onClick={() => setActiveTab('users')} className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-secondary'}`}><i className="bi bi-people me-1"></i> Utilisateurs ({users.length})</button>
        </div>

        {activeTab === 'stats' && (
          <div>
            <div className="row g-3 mb-4">
              <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm"><div className="text-muted small">Total Élèves</div><div className="fs-2 fw-bold">{stats.totalEtudiants}</div></div></div>
              <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm"><div className="text-muted small">Total Tuteurs</div><div className="fs-2 fw-bold">{stats.totalEnseignants}</div></div></div>
              <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm"><div className="text-muted small">Réservations</div><div className="fs-2 fw-bold">{stats.totalReservations}</div></div></div>
              <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm"><div className="text-muted small">Commissions</div><div className="fs-2 fw-bold text-primary">{stats.revenusTotal} DH</div></div></div>
            </div>

            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                <div><span className="text-primary small fw-bold">VOLUME DES TRANSACTIONS</span><h5 className="mt-1">Évolution des encaissements & commissions (10%)</h5></div>
                <div className="bg-light px-3 py-1 rounded-pill small fw-bold"><i className="bi bi-graph-up me-1"></i> Croissance mensuelle : +22%</div>
              </div>
              <div className="row mt-3">
                <div className="col-md-8" style={{ height: '320px' }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="col-md-4">
                  <div className="bg-light p-3 rounded-3">
                    <div className="small text-muted fw-bold">PERFORMANCE ADMIN</div>
                    <div className="mt-3 small"><span className="text-muted">Volume de pointe :</span><br /><strong>Juin (28 700 DH)</strong></div>
                    <div className="mt-2 small"><span className="text-muted">Total Commissions :</span><br /><strong className="text-primary">10 863 DH</strong></div>
                    <div className="mt-2 small"><span className="text-muted">Tuteurs actifs :</span><br /><strong>Sofia, Amine, Laila</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm p-4">
              <h6 className="fw-bold">SUIVI DES FLUX FINANCIERS TRANSPARENTS</h6>
              <div className="bg-light p-3 rounded-3 mt-3 small">
                <p className="mb-1"><i className="bi bi-check-circle-fill text-primary me-2"></i> 10% de commission, 90% pour l'enseignant.</p>
                <p className="mb-0"><i className="bi bi-check-circle-fill text-primary me-2"></i> Modération instantanée visible globalement.</p>
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