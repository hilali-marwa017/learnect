import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

Chart.register(...registerables);

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

  // Refs pour les canvas Chart.js
  const usersChartRef = useRef(null);
  const revenusChartRef = useRef(null);
  const usersChartInstance = useRef(null);
  const revenusChartInstance = useRef(null);

  useEffect(() => {
    loadAllData();
  }, []);

  // Initialiser les charts quand on est sur l'onglet stats et que les données sont chargées
  useEffect(() => {
    if (activeTab === 'stats' && !loading) {
      // Petit délai pour laisser le DOM se rendre
      setTimeout(() => {
        initCharts();
      }, 100);
    }
    // Détruire les charts quand on quitte l'onglet
    return () => {
      if (usersChartInstance.current) {
        usersChartInstance.current.destroy();
        usersChartInstance.current = null;
      }
      if (revenusChartInstance.current) {
        revenusChartInstance.current.destroy();
        revenusChartInstance.current = null;
      }
    };
  }, [activeTab, loading, stats]);

  const initCharts = () => {
    // --- Chart 1 : Répartition des utilisateurs (Doughnut) ---
    if (usersChartRef.current) {
      if (usersChartInstance.current) usersChartInstance.current.destroy();
      usersChartInstance.current = new Chart(usersChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Élèves', 'Tuteurs'],
          datasets: [{
            data: [stats.totalEtudiants, stats.totalEnseignants],
            backgroundColor: ['#3b82f6', '#0f172a'],
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 3,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 20, font: { size: 13 } } },
            title: { display: true, text: 'Répartition des utilisateurs', font: { size: 15, weight: 'bold' }, padding: { bottom: 15 } }
          }
        }
      });
    }

    // --- Chart 2 : Activité mensuelle simulée (Bar) ---
    if (revenusChartRef.current) {
      if (revenusChartInstance.current) revenusChartInstance.current.destroy();
      revenusChartInstance.current = new Chart(revenusChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
          datasets: [
            {
              label: 'Réservations',
              data: [
                Math.round(stats.totalReservations * 0.10),
                Math.round(stats.totalReservations * 0.14),
                Math.round(stats.totalReservations * 0.16),
                Math.round(stats.totalReservations * 0.18),
                Math.round(stats.totalReservations * 0.20),
                Math.round(stats.totalReservations * 0.22)
              ],
              backgroundColor: '#3b82f6',
              borderRadius: 6
            },
            {
              label: 'Commissions (DH)',
              data: [
                Math.round(stats.revenusTotal * 0.10),
                Math.round(stats.revenusTotal * 0.14),
                Math.round(stats.revenusTotal * 0.16),
                Math.round(stats.revenusTotal * 0.18),
                Math.round(stats.revenusTotal * 0.20),
                Math.round(stats.revenusTotal * 0.22)
              ],
              backgroundColor: '#0f172a',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 20, font: { size: 13 } } },
            title: { display: true, text: 'Activité mensuelle (6 derniers mois)', font: { size: 15, weight: 'bold' }, padding: { bottom: 15 } }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  };

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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p>Chargement...</p>
      </div>
    );
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
        <div className="d-flex gap-2 mb-4 border-bottom pb-2">
          <button onClick={() => setActiveTab('stats')} className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-outline-secondary'}`}>
            <i className="bi bi-graph-up me-1"></i> Statistiques
          </button>
          <button onClick={() => setActiveTab('teachers')} className={`btn ${activeTab === 'teachers' ? 'btn-primary' : 'btn-outline-secondary'}`}>
            <i className="bi bi-files me-1"></i> Vérification ({pendingTeachers.length})
          </button>
          <button onClick={() => setActiveTab('reports')} className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline-secondary'}`}>
            <i className="bi bi-exclamation-triangle me-1"></i> Signalements ({signalements.length})
          </button>
          <button onClick={() => setActiveTab('users')} className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-secondary'}`}>
            <i className="bi bi-people me-1"></i> Utilisateurs ({users.length})
          </button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            {/* KPI Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card p-3 text-center border-0 shadow-sm">
                  <div className="text-muted small">Total Élèves</div>
                  <div className="fs-2 fw-bold">{stats.totalEtudiants}</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 text-center border-0 shadow-sm">
                  <div className="text-muted small">Total Tuteurs</div>
                  <div className="fs-2 fw-bold">{stats.totalEnseignants}</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 text-center border-0 shadow-sm">
                  <div className="text-muted small">Réservations</div>
                  <div className="fs-2 fw-bold">{stats.totalReservations}</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 text-center border-0 shadow-sm">
                  <div className="text-muted small">Commissions</div>
                  <div className="fs-2 fw-bold text-primary">{stats.revenusTotal} DH</div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <div className="card border-0 shadow-sm p-4">
                  <canvas ref={usersChartRef}></canvas>
                </div>
              </div>
              <div className="col-md-7">
                <div className="card border-0 shadow-sm p-4">
                  <canvas ref={revenusChartRef}></canvas>
                </div>
              </div>
            </div>

            {/* Info Card */}
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