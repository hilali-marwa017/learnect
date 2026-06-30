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
    if (activeTab === 'stats' && !loading) {
      initCharts();
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

  function initCharts() {
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
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          animation: false,
          hover: { mode: null },
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Répartition des utilisateurs',
              font: { size: 14, weight: 'bold' }
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
              borderRadius: 4
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
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          animation: false,
          hover: { mode: null },
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Activité mensuelle (6 derniers mois)',
              font: { size: 14, weight: 'bold' }
            }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  function getToken() {
    return localStorage.getItem('token');
  }

  function getHeaders() {
    return {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    };
  }

  async function loadAllData() {
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
  }

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
        <div style={{ background: '#0f172a', color: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '10px' }}>
              <i className="bi bi-shield-check fs-5"></i>
            </div>
            <div>
              <span style={{ fontSize: '10px', background: '#1e293b', padding: '3px 10px', borderRadius: '20px' }}>CONSOLE ADMIN</span>
              <h1 style={{ fontSize: '22px', marginTop: '6px', marginBottom: '2px' }}>Learnect Back-office</h1>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: 0 }}>Validation des diplômes, modération des avis signalés</p>
            </div>
          </div>
        </div>

        {/* Tabs - méthode map() du cours DAIF */}
        <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
          {[
            { key: 'stats',    icon: 'bi-shield-check',         label: 'Statistiques' },
            { key: 'teachers', icon: 'bi-files',                label: `Vérification d'Enseignants (${pendingTeachers.length})` },
            { key: 'reports',  icon: 'bi-exclamation-triangle', label: `Avis Signalés (${signalements.length})` },
            { key: 'users',    icon: 'bi-people',               label: 'Comptes Utilisateurs' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                padding: '10px 20px',
                marginBottom: '-1px',
                fontSize: '14px',
                fontWeight: activeTab === tab.key ? '600' : '400',
                color: activeTab === tab.key ? '#3b82f6' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                outline: 'none',
                boxShadow: 'none',
                transform: 'none'
              }}
            >
              <i className={`bi ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Onglet Statistiques */}
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

            {/* Info */}
            <div className="card border-0 shadow-sm p-4">
              <h6 className="fw-bold mb-3">SUIVI DES FLUX FINANCIERS</h6>
              <div className="bg-light p-3 rounded small">
                <p className="mb-1"><i className="bi bi-check-circle-fill text-primary me-2"></i>10% de commission, 90% pour l'enseignant.</p>
                <p className="mb-0"><i className="bi bi-check-circle-fill text-primary me-2"></i>Modération instantanée visible globalement.</p>
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