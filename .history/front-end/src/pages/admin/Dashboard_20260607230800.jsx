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
    historiqueReservations: [],
    historiqueCommissions: []
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
    if (ongletActif === 'stats' && !chargement && !erreur && statistiques.historiqueReservations.length > 0) {
      setTimeout(() => initialiserGraphiques(), 100);
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

    if (graphiqueUtilisateursRef.current) {
      instanceGraphiqueUtilisateurs.current = new Chart(graphiqueUtilisateursRef.current, {
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
      instanceGraphiqueRevenus.current = new Chart(graphiqueRevenusRef.current, {
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

      if (!statsRes.ok) throw new Error('Erreur chargement stats');
      if (!teachersRes.ok) throw new Error('Erreur chargement enseignants');
      if (!signalementsRes.ok) throw new Error('Erreur chargement signalements');
      if (!usersRes.ok) throw new Error('Erreur chargement utilisateurs');

      const statsData = await statsRes.json();
      setStatistiques({
        totalEtudiants: statsData.total_etudiants || 0,
        totalEnseignants: statsData.total_enseignants || 0,
        totalReservations: statsData.total_reservations || 0,
        totalAvis: statsData.total_avis || 0,
        revenusTotal: statsData.revenus_total || 0,
        historiqueReservations: statsData.historique_reservations || [],
        historiqueCommissions: statsData.historique_commissions || []
      });

      setEnseignantsEnAttente(await teachersRes.json());
      setListeSignalements(await signalementsRes.json());
      setListeUtilisateurs(await usersRes.json());
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
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Chargement...</p></div>;
  }

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container-xl">
        <div className="rounded-4 text-white p-4 mb-4" style={{ background: '#0f172a' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 rounded-3" style={{ background: '#1e293b' }}><i className="bi bi-shield-check fs-5"></i></div>
              <div><h1 className="fs-5 fw-bold mb-0">Learnect Back-office</h1></div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-white-50">Admin Admin</span>
              <button className="btn btn-sm btn-outline-light">Déconnexion</button>
            </div>
          </div>
        </div>

        {erreur && <div className="alert alert-danger mb-4">{erreur}</div>}

        <div className="mb-4" style={{ borderBottom: '1px solid #dee2e6' }}>
          <ul className="nav nav-tabs border-0">
            <li className="nav-item"><button className={`nav-link ${ongletActif === 'stats' ? 'active' : ''}`} onClick={() => setOngletActif('stats')} style={{ border: 'none', borderBottom: ongletActif === 'stats' ? '2px solid #0d6efd' : 'none', background: 'none' }}>Statistiques</button></li>
            <li className="nav-item"><button className={`nav-link ${ongletActif === 'teachers' ? 'active' : ''}`} onClick={() => setOngletActif('teachers')} style={{ border: 'none', borderBottom: ongletActif === 'teachers' ? '2px solid #0d6efd' : 'none', background: 'none' }}>Vérification ({enseignantsEnAttente.length})</button></li>
            <li className="nav-item"><button className={`nav-link ${ongletActif === 'reports' ? 'active' : ''}`} onClick={() => setOngletActif('reports')} style={{ border: 'none', borderBottom: ongletActif === 'reports' ? '2px solid #0d6efd' : 'none', background: 'none' }}>Signalements ({listeSignalements.length})</button></li>
            <li className="nav-item"><button className={`nav-link ${ongletActif === 'users' ? 'active' : ''}`} onClick={() => setOngletActif('users')} style={{ border: 'none', borderBottom: ongletActif === 'users' ? '2px solid #0d6efd' : 'none', background: 'none' }}>Utilisateurs ({listeUtilisateurs.length})</button></li>
          </ul>
        </div>

        {ongletActif === 'stats' && (
          <div>
            <div className="row g-3 mb-4">
              <div className="col-md-3"><div className="card p-3 text-center"><i className="bi bi-people fs-2 text-primary"></i><div className="text-muted small">Total Élèves</div><div className="fs-2 fw-bold">{statistiques.totalEtudiants}</div></div></div>
              <div className="col-md-3"><div className="card p-3 text-center"><i className="bi bi-briefcase fs-2 text-primary"></i><div className="text-muted small">Total Tuteurs</div><div className="fs-2 fw-bold">{statistiques.totalEnseignants}</div></div></div>
              <div className="col-md-3"><div className="card p-3 text-center"><i className="bi bi-calendar-check fs-2 text-primary"></i><div className="text-muted small">Réservations</div><div className="fs-2 fw-bold">{statistiques.totalReservations}</div></div></div>
              <div className="col-md-3"><div className="card p-3 text-center"><i className="bi bi-cash-stack fs-2 text-primary"></i><div className="text-muted small">Commissions</div><div className="fs-2 fw-bold">{statistiques.revenusTotal} DH</div></div></div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-5"><div className="card p-3"><h6 className="text-center">Répartition Élèves / Tuteurs</h6><canvas ref={graphiqueUtilisateursRef} style={{ height: '280px', width: '100%' }}></canvas></div></div>
              <div className="col-md-7"><div className="card p-3"><h6 className="text-center">Réservations & Commissions</h6><canvas ref={graphiqueRevenusRef} style={{ height: '280px', width: '100%' }}></canvas></div></div>
            </div>

            <div className="card p-3"><h6>SUIVI DES FLUX FINANCIERS</h6><div className="bg-light p-2 rounded"><p className="mb-0">✓ 10% de commission, 90% pour l'enseignant.</p></div></div>
          </div>
        )}

        {ongletActif === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsEnAttente} onRefresh={rafraichirUtilisateurs} />}
        {ongletActif === 'reports' && <Signalements signalements={listeSignalements} onRefresh={rafraichirUtilisateurs} />}
        {ongletActif === 'users' && <ManageUsers users={listeUtilisateurs} onRefresh={rafraichirUtilisateurs} />}
      </div>
    </div>
  );
}

export default AdminDashboard;