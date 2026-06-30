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
            options: { responsive: true, animation: false, plugins: { legend: { position: 'bottom' } } }
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
            options: { responsive: true, animation: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
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
    { id: 'teachers', label: `Élèves` },
    { id: 'reports', label: `Tuteurs` },
    { id: 'users', label: `Réservations` },
    { id: 'commission', label: 'Commission' }
  ];

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="bg-dark text-white p-3 rounded mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">Learnetc.ma</h4>
          <small>COURS PARTICULIERS - MAROC</small>
        </div>
        <div className="d-flex gap-3 align-items-center">
          <span>Admin Admin</span>
          <button className="btn btn-sm btn-outline-light">Déconnexion</button>
        </div>
      </div>

      {/* Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card p-3 text-center"><div className="text-muted small">Total Élèves</div><div className="fs-2 fw-bold">{stats.totalEtudiants}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center"><div className="text-muted small">Total Tuteurs</div><div className="fs-2 fw-bold">{stats.totalEnseignants}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center"><div className="text-muted small">Réservations</div><div className="fs-2 fw-bold">{stats.totalReservations}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center"><div className="text-muted small">Commission</div><div className="fs-2 fw-bold">{stats.revenusTotal} DH</div></div></div>
      </div>

      {/* Tabs - ultra simple */}
      <div className="border-bottom mb-4">
        <div className="d-flex gap-4">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setOnglet(tab.id)} className="p-2" style={{
              border: 'none', background: 'none', cursor: 'pointer',
              color: onglet === tab.id ? '#007bff' : '#6c757d',
              borderBottom: onglet === tab.id ? '2px solid #007bff' : 'none'
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Dashboard Content */}
      {onglet === 'stats' && (
        <div className="row g-3">
          <div className="col-md-6"><div className="card p-3"><h6 className="text-center">Répartition Élèves / Tuteurs</h6><canvas ref={graphRef1} style={{ height: '300px' }}></canvas></div></div>
          <div className="col-md-6"><div className="card p-3"><h6 className="text-center">Réservations & Commissions</h6><canvas ref={graphRef2} style={{ height: '300px' }}></canvas></div></div>
          <div className="col-12"><div className="card p-3"><h6>SUIVI DES FLUX FINANCIERS</h6><div className="bg-light p-2 rounded"><p className="mb-0">✓ 10% de commission, 90% pour l'enseignant.</p></div></div></div>
        </div>
      )}

      {onglet === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsAttente} onRefresh={chargerDonnees} />}
      {onglet === 'reports' && <Signalements signalements={signalements} onRefresh={chargerDonnees} />}
      {onglet === 'users' && <ManageUsers users={users} onRefresh={chargerDonnees} />}
    </div>
  );
}

export default AdminDashboard;