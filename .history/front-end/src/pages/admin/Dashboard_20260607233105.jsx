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
    totalEnseignants: 0,
    totalReservations: 0,
    revenusTotal: 0,
    reservationsMois: [15, 22, 18, 25, 30, 28],
    commissionsMois: [150, 220, 180, 250, 300, 280]
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
              labels: ['Élèves', 'Tuteurs'],
              datasets: [{
                data: [stats.totalEtudiants, stats.totalEnseignants],
                backgroundColor: ['#3b82f6', '#0f172a']
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
                { label: 'Réservations', data: stats.reservationsMois, backgroundColor: '#3b82f6' },
                { label: 'Commissions', data: stats.commissionsMois, backgroundColor: '#0f172a' }
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
          totalEnseignants: data.total_enseignants || 0,
          totalReservations: data.total_reservations || 0,
          revenusTotal: data.revenus_total || 0,
          reservationsMois: data.historique_reservations || [15, 22, 18, 25, 30, 28],
          commissionsMois: data.historique_commissions || [150, 220, 180, 250, 300, 280]
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
    return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary"></div></div>;
  }

  const tabs = [
    { id: 'stats', label: 'Dashboard' },
    { id: 'teachers', label: 'Élèves' },
    { id: 'reports', label: 'Tuteurs' },
    { id: 'users', label: 'Réservations' },
    { id: 'commission', label: 'Commission' }
  ];

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      {/* Header plus petit */}
      <div className="bg-dark text-white p-2 rounded mb-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">Learnetc.ma</h5>
          <small style={{ fontSize: '11px' }}>COURS PARTICULIERS - MAROC</small>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <span style={{ fontSize: '13px' }}>Admin Admin</span>
          <button className="btn btn-sm btn-outline-light" style={{ fontSize: '12px', padding: '2px 8px' }}>Déconnexion</button>
        </div>
      </div>

      {/* Cards plus petites */}
      <div className="row g-2 mb-3">
        <div className="col-md-3"><div className="card p-2 text-center"><small className="text-muted">Total Élèves</small><div className="fs-4 fw-bold">{stats.totalEtudiants}</div></div></div>
        <div className="col-md-3"><div className="card p-2 text-center"><small className="text-muted">Total Tuteurs</small><div className="fs-4 fw-bold">{stats.totalEnseignants}</div></div></div>
        <div className="col-md-3"><div className="card p-2 text-center"><small className="text-muted">Réservations</small><div className="fs-4 fw-bold">{stats.totalReservations}</div></div></div>
        <div className="col-md-3"><div className="card p-2 text-center"><small className="text-muted">Commission</small><div className="fs-4 fw-bold">{stats.revenusTotal} DH</div></div></div>
      </div>

      {/* Tabs plus petits */}
      <div className="border-bottom mb-3">
        <div className="d-flex gap-3">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setOnglet(tab.id)} className="p-1" style={{
              border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px',
              color: onglet === tab.id ? '#007bff' : '#6c757d',
              borderBottom: onglet === tab.id ? '2px solid #007bff' : 'none'
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Graphiques plus petits */}
      {onglet === 'stats' && (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card p-2">
              <small className="text-center fw-bold">Répartition Élèves / Tuteurs</small>
              <div style={{ height: '220px' }}>
                <canvas ref={graphRef1} style={{ height: '200px', width: '100%' }}></canvas>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-2">
              <small className="text-center fw-bold">Réservations & Commissions</small>
              <div style={{ height: '220px' }}>
                <canvas ref={graphRef2} style={{ height: '200px', width: '100%' }}></canvas>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card p-2">
              <small className="fw-bold">SUIVI DES FLUX FINANCIERS</small>
              <div className="bg-light p-1 rounded">
                <small className="mb-0">✓ 10% de commission, 90% pour l'enseignant.</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {onglet === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsAttente} onRefresh={chargerDonnees} />}
      {onglet === 'reports' && <Signalements signalements={signalements} onRefresh={chargerDonnees} />}
      {onglet === 'users' && <ManageUsers users={users} onRefresh={chargerDonnees} />}
    </div>
  );
}

export default AdminDashboard;