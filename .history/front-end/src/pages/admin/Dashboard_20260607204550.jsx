import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

Chart.register(...registerables);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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

  const usersChartRef = useRef(null);
  const revenusChartRef = useRef(null);
  const usersChartInstance = useRef(null);
  const revenusChartInstance = useRef(null);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'stats' && !loading && stats) {
      const timer = setTimeout(() => initCharts(), 100);
      return () => clearTimeout(timer);
    }
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
    if (usersChartRef.current) {
      if (usersChartInstance.current) {
        usersChartInstance.current.destroy();
        usersChartInstance.current = null;
      }
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
          animation: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 20, font: { size: 13 } } },
            title: {
              display: true,
              text: 'Répartition des utilisateurs',
              font: { size: 15, weight: 'bold' },
              padding: { bottom: 15 }
            }
          }
        }
      });
    }

    if (revenusChartRef.current) {
      if (revenusChartInstance.current) {
        revenusChartInstance.current.destroy();
        revenusChartInstance.current = null;
      }
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
          animation: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 20, font: { size: 13 } } },
            title: {
              display: true,
              text: 'Activité mensuelle (6 derniers mois)',
              font: { size: 15, weight: 'bold' },
              padding: { bottom: 15 }
            }
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
  const getHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/admin/enseignantsEnAttente`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/admin/signalements`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/admin/Users`, { headers: getHeaders() })
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
              <i className="bi bi-shield-check fs-4"></i>
            </div>
            <div>
              <span style={{ fontSize: '10px', background: '#1e293b', padding: '4px 10px', borderRadius: '20px' }}>CONSOLE ADMIN</span>
              <h1 style={{ fontSize: '24px', marginTop: '5px' }}>Learnect Back-office</h1>
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>Validation des diplômes, modération des avis signalés</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0' }}>
          {[
            { key: 'stats',    icon: 'bi-shield-check',        label: 'Statistiques' },
            { key: 'teachers', icon: 'bi-files',               label: `Vérification d'Enseignants (${pendingTeachers.length})` },
            { key: 'reports',  icon: 'bi-exclamation-triangle', label: `Avis Signalés (${signalements.length})` },
            { key: 'users',    icon: 'bi-people',              label: 'Comptes Utilisateurs' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: activeTab === tab.key ? '600' : '400',
                color: activeTab === tab.key ? '#3b82f6' : '#64748b',
                borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '-1px',
                transition: 'none',
                outline: 'none',
                boxShadow: 'none'
              }}
            >
              <i className={`bi ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
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

            {/* Charts */}
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