import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

Chart.register(...registerables);

const API_URL = 'http://localhost:8000/api';

function AdminDashboard() {
  const [ongletActif, setOngletActif] = useState('stats');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [statistiques, setStatistiques] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalAvis: 0,
    revenusTotal: 0,
    historiqueReservations: [15, 22, 18, 25, 30, 28],
    historiqueCommissions: [150, 220, 180, 250, 300, 280]
  });
  const [enseignantsEnAttente, setEnseignantsEnAttente] = useState([]);
  const [listeSignalements, setListeSignalements] = useState([]);
  const [listeUtilisateurs, setListeUtilisateurs] = useState([]);

  const graphiqueUtilisateursRef = useRef(null);
  const graphiqueRevenusRef = useRef(null);
  const instanceGraphiqueUtilisateurs = useRef(null);
  const instanceGraphiqueRevenus = useRef(null);

  useEffect(() => {
    chargerDonnees();
  }, []);

  useEffect(() => {
    if (ongletActif === 'stats' && !chargement && graphiqueUtilisateursRef.current && graphiqueRevenusRef.current) {
      initialiserGraphiques();
    }
    return () => {
      if (instanceGraphiqueUtilisateurs.current) instanceGraphiqueUtilisateurs.current.destroy();
      if (instanceGraphiqueRevenus.current) instanceGraphiqueRevenus.current.destroy();
    };
  }, [ongletActif, chargement, statistiques]);

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  });

  function initialiserGraphiques() {
    if (instanceGraphiqueUtilisateurs.current) instanceGraphiqueUtilisateurs.current.destroy();
    if (instanceGraphiqueRevenus.current) instanceGraphiqueRevenus.current.destroy();

    const ctx1 = graphiqueUtilisateursRef.current.getContext('2d');
    instanceGraphiqueUtilisateurs.current = new Chart(ctx1, {
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

    const ctx2 = graphiqueRevenusRef.current.getContext('2d');
    instanceGraphiqueRevenus.current = new Chart(ctx2, {
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

  async function chargerDonnees() {
    setChargement(true);
    setErreur(null);
    try {
      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/enseignants/attente`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/signalements`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/users`, { headers: getHeaders() })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStatistiques({
          totalEtudiants: statsData.total_etudiants || 0,
          totalEnseignants: statsData.total_enseignants || 0,
          totalReservations: statsData.total_reservations || 0,
          totalAvis: statsData.total_avis || 0,
          revenusTotal: statsData.revenus_total || 0,
          historiqueReservations: statsData.historique_reservations || [15, 22, 18, 25, 30, 28],
          historiqueCommissions: statsData.historique_commissions || [150, 220, 180, 250, 300, 280]
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
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded" style={{ background: '#0f172a' }}>
        <div>
          <h4 className="text-white mb-0">Learnetc.ma</h4>
          <small className="text-white-50">COURS PARTICULIERS - MAROC</small>
        </div>
        <div className="d-flex gap-3 align-items-center">
          <span className="text-white">Admin Admin</span>
          <button className="btn btn-sm btn-outline-light">Déconnexion</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <div className="text-muted small">Total Élèves</div>
            <div className="fs-2 fw-bold">{statistiques.totalEtudiants}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <div className="text-muted small">Total Tuteurs</div>
            <div className="fs-2 fw-bold">{statistiques.totalEnseignants}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <div className="text-muted small">Réservations</div>
            <div className="fs-2 fw-bold">{statistiques.totalReservations}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <div className="text-muted small">Commission</div>
            <div className="fs-2 fw-bold">{statistiques.revenusTotal} DH</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="d-flex gap-3 border-bottom pb-2">
          <button onClick={() => setOngletActif('stats')} className="btn btn-sm" style={{ borderBottom: ongletActif === 'stats' ? '2px solid #0d6efd' : 'none', borderRadius: 0, fontWeight: ongletActif === 'stats' ? 'bold' : 'normal' }}>Dashboard</button>
          <button onClick={() => setOngletActif('teachers')} className="btn btn-sm" style={{ borderBottom: ongletActif === 'teachers' ? '2px solid #0d6efd' : 'none', borderRadius: 0 }}>Élèves</button>
          <button onClick={() => setOngletActif('reports')} className="btn btn-sm" style={{ borderBottom: ongletActif === 'reports' ? '2px solid #0d6efd' : 'none', borderRadius: 0 }}>Tuteurs</button>
          <button onClick={() => setOngletActif('users')} className="btn btn-sm" style={{ borderBottom: ongletActif === 'users' ? '2px solid #0d6efd' : 'none', borderRadius: 0 }}>Réservations</button>
          <button onClick={() => setOngletActif('commission')} className="btn btn-sm" style={{ borderBottom: ongletActif === 'commission' ? '2px solid #0d6efd' : 'none', borderRadius: 0 }}>Commission</button>
        </div>
      </div>

      {/* Charts */}
      {ongletActif === 'stats' && (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h6 className="text-center mb-3">Répartition Élèves / Tuteurs</h6>
              <div style={{ height: '300px' }}>
                <canvas ref={graphiqueUtilisateursRef}></canvas>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h6 className="text-center mb-3">Réservations & Commissions</h6>
              <div style={{ height: '300px' }}>
                <canvas ref={graphiqueRevenusRef}></canvas>
              </div>
            </div>
          </div>
          <div className="col-12 mt-3">
            <div className="card p-3 shadow-sm">
              <h6>SUIVI DES FLUX FINANCIERS</h6>
              <div className="bg-light p-2 rounded">
                <p className="mb-0">✓ 10% de commission, 90% pour l'enseignant.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {ongletActif === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsEnAttente} onRefresh={rafraichirUtilisateurs} />}
      {ongletActif === 'reports' && <Signalements signalements={listeSignalements} onRefresh={rafraichirUtilisateurs} />}
      {ongletActif === 'users' && <ManageUsers users={listeUtilisateurs} onRefresh={rafraichirUtilisateurs} />}
    </div>
  );
}

export default AdminDashboard;