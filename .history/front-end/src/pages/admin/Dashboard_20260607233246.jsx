import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

Chart.register(...registerables);

const API_URL = 'http://localhost:8000/api';

function AdminDashboard() {
  const [onglet, setOnglet] = useState('stats');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalEnseignants: 4,
    totalReservations: 0,
    revenusTotal: 0,
    reservationsMois: [12, 19, 15, 17, 14, 18],
    commissionsMois: [120, 190, 150, 170, 140, 180]
  });
  const [enseignantsAttente, setEnseignantsAttente] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);

  const graphRef1 = useRef(null);
  const graphRef2 = useRef(null);
  let chart1 = null;
  let chart2 = null;

  useEffect(() => {
    chargerDonnees();
  }, []);

  useEffect(() => {
    if (onglet === 'stats' && !chargement) {
      setTimeout(() => {
        if (chart1) chart1.destroy();
        if (chart2) chart2.destroy();

        if (graphRef1.current) {
          chart1 = new Chart(graphRef1.current, {
            type: 'doughnut',
            data: {
              labels: ['👨‍🎓 Élèves', '👨‍🏫 Tuteurs'],
              datasets: [{
                data: [stats.totalEtudiants, stats.totalEnseignants],
                backgroundColor: ['#3b82f6', '#f59e0b']
              }]
            },
            options: { responsive: true, maintainAspectRatio: true, animation: false, plugins: { legend: { position: 'bottom' } } }
          });
        }

        if (graphRef2.current) {
          chart2 = new Chart(graphRef2.current, {
            type: 'bar',
            data: {
              labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
              datasets: [
                { label: '📅 Réservations', data: stats.reservationsMois, backgroundColor: '#3b82f6', borderRadius: 6 },
                { label: '💰 Commissions', data: stats.commissionsMois, backgroundColor: '#10b981', borderRadius: 6 }
              ]
            },
            options: { responsive: true, maintainAspectRatio: true, animation: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
          });
        }
      }, 100);
    }
    return () => { if (chart1) chart1.destroy(); if (chart2) chart2.destroy(); };
  }, [onglet, chargement, stats]);

  const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  async function chargerDonnees() {
    setChargement(true);
    try {
      const [resStats, resTeachers, resReports, resUsers] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/enseignants/attente`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/signalements`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/users`, { headers: getHeaders() })
      ]);

      if (resStats.ok) {
        const data = await resStats.json();
        setStats({
          totalEtudiants: data.total_etudiants || 0,
          totalEnseignants: data.total_enseignants || 4,
          totalReservations: data.total_reservations || 0,
          revenusTotal: data.revenus_total || 0,
          reservationsMois: data.historique_reservations || [12, 19, 15, 17, 14, 18],
          commissionsMois: data.historique_commissions || [120, 190, 150, 170, 140, 180]
        });
      }
      if (resTeachers.ok) setEnseignantsAttente(await resTeachers.json());
      if (resReports.ok) setSignalements(await resReports.json());
      if (resUsers.ok) setUsers(await resUsers.json());
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  if (chargement) {
    return <div className="d-flex justify-content-center align-items-center vh-100 bg-light"><div className="spinner-border text-primary"></div></div>;
  }

  const tabs = [
    { id: 'stats', label: 'Dashboard', color: '#3b82f6' },
    { id: 'teachers', label: 'Élèves', color: '#8b5cf6' },
    { id: 'reports', label: 'Tuteurs', color: '#f59e0b' },
    { id: 'users', label: 'Réservations', color: '#10b981' },
    { id: 'commission', label: 'Commission', color: '#ef4444' }
  ];

  return (
    <div className="container-fluid p-3" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* Header avec couleurs */}
      <div className="rounded mb-3 p-3 text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0 fw-bold">🎓 Learnetc.ma</h4>
            <small style={{ opacity: 0.8 }}>COURS PARTICULIERS - MAROC</small>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <div className="text-end">
              <div className="fw-bold">Admin Admin</div>
              <small style={{ opacity: 0.7 }}>Administrateur</small>
            </div>
            <button className="btn btn-sm" style={{ background: '#ef4444', color: 'white', border: 'none' }}>🚪 Déconnexion</button>
          </div>
        </div>
      </div>

      {/* Cartes KPI avec couleurs */}
      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ borderTop: '3px solid #3b82f6' }}><div className="text-muted small">👨‍🎓 Total Élèves</div><div className="fs-2 fw-bold" style={{ color: '#3b82f6' }}>{stats.totalEtudiants}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ borderTop: '3px solid #f59e0b' }}><div className="text-muted small">👨‍🏫 Total Tuteurs</div><div className="fs-2 fw-bold" style={{ color: '#f59e0b' }}>{stats.totalEnseignants}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ borderTop: '3px solid #10b981' }}><div className="text-muted small">📅 Réservations</div><div className="fs-2 fw-bold" style={{ color: '#10b981' }}>{stats.totalReservations}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ borderTop: '3px solid #8b5cf6' }}><div className="text-muted small">💰 Commission</div><div className="fs-2 fw-bold" style={{ color: '#8b5cf6' }}>{stats.revenusTotal} DH</div></div></div>
      </div>

      {/* Tabs - UNIQUEMENT TEXTE, pas de boutons */}
      <div className="border-bottom mb-4" style={{ borderColor: '#e2e8f0 !important' }}>
        <div className="d-flex gap-4">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setOnglet(tab.id)}
              style={{
                padding: '10px 0',
                fontSize: '14px',
                fontWeight: onglet === tab.id ? '600' : '400',
                color: onglet === tab.id ? tab.color : '#94a3b8',
                borderBottom: onglet === tab.id ? `2px solid ${tab.color}` : 'none',
                cursor: 'pointer',
                transition: 'none'
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      {/* Graphiques */}
      {onglet === 'stats' && (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card p-3 border-0 shadow-sm">
              <h6 className="text-center mb-2" style={{ color: '#1e293b' }}>📊 Répartition Élèves / Tuteurs</h6>
              <div style={{ height: '260px' }}>
                <canvas ref={graphRef1}></canvas>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 border-0 shadow-sm">
              <h6 className="text-center mb-2" style={{ color: '#1e293b' }}>📈 Réservations & Commissions mensuelles</h6>
              <div style={{ height: '260px' }}>
                <canvas ref={graphRef2}></canvas>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card p-3 border-0 shadow-sm">
              <h6 className="fw-bold mb-2" style={{ color: '#1e293b' }}>💰 SUIVI DES FLUX FINANCIERS</h6>
              <div className="p-2 rounded" style={{ background: '#f1f5f9' }}>
                <p className="mb-0" style={{ color: '#475569' }}>✓ <span style={{ color: '#10b981', fontWeight: 'bold' }}>10%</span> de commission pour la plateforme, <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>90%</span> pour l'enseignant.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Autres onglets */}
      {onglet === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsAttente} onRefresh={chargerDonnees} />}
      {onglet === 'reports' && <Signalements signalements={signalements} onRefresh={chargerDonnees} />}
      {onglet === 'users' && <ManageUsers users={users} onRefresh={chargerDonnees} />}
      {onglet === 'commission' && (
        <div className="card p-5 text-center border-0 shadow-sm">
          <i className="bi bi-cash-stack fs-1" style={{ color: '#8b5cf6' }}></i>
          <h5 className="mt-3" style={{ color: '#1e293b' }}>Gestion des commissions</h5>
          <p className="text-muted">Module en cours de développement</p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;