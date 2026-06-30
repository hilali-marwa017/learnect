import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

Chart.register(...registerables);

const API_URL = 'http://localhost:8000/api';

function AdminDashboard() {
  const [ongletActif, setOngletActif] = useState('dashboard');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [statistiques, setStatistiques] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalAvis: 0,
    revenusTotal: 0,
    historiqueReservations: [],
    historiqueCommissions: []
  });
  const [enseignantsEnAttente, setEnseignantsEnAttente] = useState([]);
  const [listeSignalements, setListeSignalements] = useState([]);
  const [listeUtilisateurs, setListeUtilisateurs] = useState([]);

  const graphiqueUtilisateursRef = useRef(null);
  const graphiqueRevenusRef = useRef(null);
  let userChart = null;
  let revenueChart = null;

  useEffect(() => {
    chargerDonnees();
  }, []);

  useEffect(() => {
    if (ongletActif === 'dashboard' && !chargement && !erreur) {
      setTimeout(() => {
        if (userChart) userChart.destroy();
        if (revenueChart) revenueChart.destroy();

        if (graphiqueUtilisateursRef.current) {
          userChart = new Chart(graphiqueUtilisateursRef.current, {
            type: 'doughnut',
            data: {
              labels: ['Élèves', 'Tuteurs'],
              datasets: [{
                data: [statistiques.totalEtudiants, statistiques.totalEnseignants],
                backgroundColor: ['#3b82f6', '#0f172a'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              animation: false,
              plugins: { legend: { position: 'bottom' } }
            }
          });
        }

        if (graphiqueRevenusRef.current) {
          revenueChart = new Chart(graphiqueRevenusRef.current, {
            type: 'bar',
            data: {
              labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
              datasets: [
                {
                  label: 'Réservations',
                  data: statistiques.historiqueReservations,
                  backgroundColor: '#3b82f6',
                  borderRadius: 4
                },
                {
                  label: 'Commissions (DH)',
                  data: statistiques.historiqueCommissions,
                  backgroundColor: '#0f172a',
                  borderRadius: 4
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              animation: false,
              plugins: { legend: { position: 'bottom' } },
              scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
            }
          });
        }
      }, 100);
    }
    return () => {
      if (userChart) userChart.destroy();
      if (revenueChart) revenueChart.destroy();
    };
  }, [ongletActif, chargement, statistiques]);

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  });

  async function chargerDonnees() {
    setChargement(true);
    try {
      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/enseignants/attente`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/signalements`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/users`, { headers: getHeaders() })
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStatistiques({
          totalEtudiants: data.total_etudiants || 0,
          totalEnseignants: data.total_enseignants || 0,
          totalReservations: data.total_reservations || 0,
          totalAvis: data.total_avis || 0,
          revenusTotal: data.revenus_total || 0,
          historiqueReservations: data.historique_reservations || [12, 19, 15, 17, 14, 18],
          historiqueCommissions: data.historique_commissions || [120, 190, 150, 170, 140, 180]
        });
      }
      if (teachersRes.ok) setEnseignantsEnAttente(await teachersRes.json());
      if (signalementsRes.ok) setListeSignalements(await signalementsRes.json());
      if (usersRes.ok) setListeUtilisateurs(await usersRes.json());
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  async function rafraichirUtilisateurs() {
    try {
      const res = await fetch(`${API_URL}/admin/users`, { headers: getHeaders() });
      if (res.ok) setListeUtilisateurs(await res.json());
      const teachersRes = await fetch(`${API_URL}/admin/enseignants/attente`, { headers: getHeaders() });
      if (teachersRes.ok) setEnseignantsEnAttente(await teachersRes.json());
    } catch (err) {
      console.error(err);
    }
  }

  if (chargement) {
    return <div className="text-center p-5"><div className="spinner-border"></div><p>Chargement...</p></div>;
  }

  return (
    <div className="container-fluid p-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Header */}
      <div className="bg-dark text-white p-3 rounded mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Learnetc.ma</h4>
            <small>COURS PARTICULIERS - MAROC</small>
          </div>
          <div className="d-flex gap-3">
            <span>Admin Admin</span>
            <button className="btn btn-sm btn-outline-light">Déconnexion</button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="text-muted">Total Élèves</div>
            <div className="fs-2 fw-bold">{statistiques.totalEtudiants}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="text-muted">Total Tuteurs</div>
            <div className="fs-2 fw-bold">{statistiques.totalEnseignants}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="text-muted">Réservations</div>
            <div className="fs-2 fw-bold">{statistiques.totalReservations}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="text-muted">Commission</div>
            <div className="fs-2 fw-bold">{statistiques.revenusTotal} DH</div>
          </div>
        </div>
      </div>

      {/* Simple Tabs - No hover, no transition */}
      <div className="border-bottom mb-4">
        <div className="d-flex gap-4">
          <button onClick={() => setOngletActif('dashboard')} className="p-2" style={{ border: 'none', background: 'none', color: ongletActif === 'dashboard' ? '#007bff' : '#6c757d', borderBottom: ongletActif === 'dashboard' ? '2px solid #007bff' : 'none', cursor: 'pointer' }}>Dashboard</button>
          <button onClick={() => setOngletActif('eleves')} className="p-2" style={{ border: 'none', background: 'none', color: ongletActif === 'eleves' ? '#007bff' : '#6c757d', borderBottom: ongletActif === 'eleves' ? '2px solid #007bff' : 'none', cursor: 'pointer' }}>Élèves</button>
          <button onClick={() => setOngletActif('tuteurs')} className="p-2" style={{ border: 'none', background: 'none', color: ongletActif === 'tuteurs' ? '#007bff' : '#6c757d', borderBottom: ongletActif === 'tuteurs' ? '2px solid #007bff' : 'none', cursor: 'pointer' }}>Tuteurs</button>
          <button onClick={() => setOngletActif('reservations')} className="p-2" style={{ border: 'none', background: 'none', color: ongletActif === 'reservations' ? '#007bff' : '#6c757d', borderBottom: ongletActif === 'reservations' ? '2px solid #007bff' : 'none', cursor: 'pointer' }}>Réservations</button>
          <button onClick={() => setOngletActif('commission')} className="p-2" style={{ border: 'none', background: 'none', color: ongletActif === 'commission' ? '#007bff' : '#6c757d', borderBottom: ongletActif === 'commission' ? '2px solid #007bff' : 'none', cursor: 'pointer' }}>Commission</button>
        </div>
      </div>

      {/* Dashboard Content */}
      {ongletActif === 'dashboard' && (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card p-3">
              <h6 className="text-center">Répartition Élèves / Tuteurs</h6>
              <canvas ref={graphiqueUtilisateursRef} style={{ height: '300px', width: '100%' }}></canvas>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card p-3">
              <h6 className="text-center">Réservations & Commissions</h6>
              <canvas ref={graphiqueRevenusRef} style={{ height: '300px', width: '100%' }}></canvas>
            </div>
          </div>
          <div className="col-12">
            <div className="card p-3">
              <h6>SUIVI DES FLUX FINANCIERS</h6>
              <div className="bg-light p-2 rounded">
                <p className="mb-0">✓ 10% de commission, 90% pour l'enseignant.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content */}
      {ongletActif === 'tuteurs' && <ValidatedTeachers pendingTeachers={enseignantsEnAttente} onRefresh={rafraichirUtilisateurs} />}
      {ongletActif === 'signalements' && <Signalements signalements={listeSignalements} onRefresh={rafraichirUtilisateurs} />}
      {ongletActif === 'utilisateurs' && <ManageUsers users={listeUtilisateurs} onRefresh={rafraichirUtilisateurs} />}
      {(ongletActif === 'eleves' || ongletActif === 'reservations' || ongletActif === 'commission') && (
        <div className="card p-5 text-center">
          <p className="text-muted">Contenu en cours de développement...</p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;