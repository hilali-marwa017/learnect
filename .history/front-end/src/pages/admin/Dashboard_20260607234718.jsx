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
    reservationsMois: [],
    commissionsMois: []
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
    if (onglet === 'stats' && !chargement && stats.reservationsMois.length > 0) {
      setTimeout(() => {
        if (chart1) chart1.destroy();
        if (chart2) chart2.destroy();

        if (graphRef1.current && (stats.totalEtudiants > 0 || stats.totalEnseignants > 0)) {
          chart1 = new Chart(graphRef1.current, {
            type: 'doughnut',
            data: {
              labels: ['Élèves', 'Tuteurs'],
              datasets: [{
                data: [stats.totalEtudiants, stats.totalEnseignants],
                backgroundColor: ['#3b82f6', '#f59e0b']
              }]
            },
            options: { responsive: true, maintainAspectRatio: true, animation: false, plugins: { legend: { position: 'bottom' } } }
          });
        }

        if (graphRef2.current && stats.reservationsMois.length > 0) {
          chart2 = new Chart(graphRef2.current, {
            type: 'bar',
            data: {
              labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
              datasets: [
                { label: 'Réservations', data: stats.reservationsMois, backgroundColor: '#3b82f6', borderRadius: 6 },
                { label: 'Commissions', data: stats.commissionsMois, backgroundColor: '#10b981', borderRadius: 6 }
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
    setErreur(null);
    try {
      const [resStats, resTeachers, resReports, resUsers] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/enseignants/attente`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/signalements`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/users`, { headers: getHeaders() })
      ]);

      if (!resStats.ok) throw new Error('Erreur chargement statistiques');
      
      const data = await resStats.json();
      setStats({
        totalEtudiants: data.total_etudiants || 0,
        totalEnseignants: data.total_enseignants || 0,
        totalReservations: data.total_reservations || 0,
        revenusTotal: data.revenus_total || 0,
        reservationsMois: data.historique_reservations || [],
        commissionsMois: data.historique_commissions || []
      });

      if (resTeachers.ok) setEnseignantsAttente(await resTeachers.json());
      if (resReports.ok) setSignalements(await resReports.json());
      if (resUsers.ok) setUsers(await resUsers.json());
      
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  async function rafraichirDonnees() {
    await chargerDonnees();
  }

  if (chargement) {
    return <div className="d-flex justify-content-center align-items-center vh-100 bg-light"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container-fluid p-4" style={{ background: '#f5f7fa', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm"><div className="text-muted small">Total Élèves</div><div className="fs-2 fw-bold text-primary">{stats.totalEtudiants}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm"><div className="text-muted small">Total Tuteurs</div><div className="fs-2 fw-bold text-warning">{stats.totalEnseignants}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm"><div className="text-muted small">Réservations</div><div className="fs-2 fw-bold text-success">{stats.totalReservations}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm"><div className="text-muted small">Commission</div><div className="fs-2 fw-bold text-purple">{stats.revenusTotal} DH</div></div></div>
      </div>

      {/* Tabs - simple text */}
      <div className="mb-4">
        <div className="d-flex gap-4">
          <span onClick={() => setOnglet('stats')} style={{ 
            fontSize: '14px', 
            cursor: 'pointer',
            color: onglet === 'stats' ? '#000' : '#6c757d'
          }}>Statistiques</span>
          
          <span onClick={() => setOnglet('teachers')} style={{ 
            fontSize: '14px', 
            cursor: 'pointer',
            color: onglet === 'teachers' ? '#000' : '#6c757d'
          }}>Vérification d'Enseignants ({enseignantsAttente.length})</span>
          
          <span onClick={() => setOnglet('reports')} style={{ 
            fontSize: '14px', 
            cursor: 'pointer',
            color: onglet === 'reports' ? '#000' : '#6c757d'
          }}>Avis Signalés ({signalements.length})</span>
          
          <span onClick={() => setOnglet('users')} style={{ 
            fontSize: '14px', 
            cursor: 'pointer',
            color: onglet === 'users' ? '#000' : '#6c757d'
          }}>Comptes Utilisateurs</span>
        </div>
      </div>

      {/* Dashboard Content */}
      {onglet === 'stats' && (
        <div className="row g-3">
          {stats.totalEtudiants > 0 || stats.totalEnseignants > 0 ? (
            <div className="col-md-6">
              <div className="card p-3 border-0 shadow-sm">
                <h6 className="text-center mb-2">Répartition Élèves / Tuteurs</h6>
                <div style={{ height: '260px' }}>
                  <canvas ref={graphRef1}></canvas>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-6">
              <div className="card p-3 border-0 shadow-sm text-center">
                <p className="text-muted my-5">Aucune donnée disponible</p>
              </div>
            </div>
          )}
          
          {stats.reservationsMois.length > 0 ? (
            <div className="col-md-6">
              <div className="card p-3 border-0 shadow-sm">
                <h6 className="text-center mb-2">Réservations & Commissions mensuelles</h6>
                <div style={{ height: '260px' }}>
                  <canvas ref={graphRef2}></canvas>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-6">
              <div className="card p-3 border-0 shadow-sm text-center">
                <p className="text-muted my-5">Aucune donnée disponible</p>
              </div>
            </div>
          )}
          
          <div className="col-12">
            <div className="card p-3 border-0 shadow-sm">
              <h6 className="fw-bold mb-2">SUIVI DES FLUX FINANCIERS</h6>
              <div className="p-2 rounded" style={{ background: '#f1f5f9' }}>
                <p className="mb-0">10% de commission, 90% pour l'enseignant.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs */}
      {onglet === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsAttente} onRefresh={rafraichirDonnees} />}
      {onglet === 'reports' && <Signalements signalements={signalements} onRefresh={rafraichirDonnees} />}
      {onglet === 'users' && <ManageUsers users={users} onRefresh={rafraichirDonnees} />}
    </div>
  );
}

export default AdminDashboard;