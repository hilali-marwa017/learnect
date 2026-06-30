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
    totalAvis: 0,
    revenusTotal: 0
  });
  const [enseignantsAttente, setEnseignantsAttente] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [paiements, setPaiements] = useState([]);

  const graphRef = useRef(null);
  let chart = null;

  useEffect(() => {
    chargerDonnees();
  }, []);

  useEffect(() => {
    if (onglet === 'stats' && !chargement) {
      setTimeout(() => {
        if (chart) chart.destroy();

        if (graphRef.current && (stats.totalEtudiants > 0 || stats.totalEnseignants > 0)) {
          chart = new Chart(graphRef.current, {
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
      }, 100);
    }
    return () => { if (chart) chart.destroy(); };
  }, [onglet, chargement, stats]);

  const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  async function chargerDonnees() {
    setChargement(true);
    setErreur(null);
    try {
      const [resStats, resTeachers, resReports, resUsers, resDemandes, resReservations, resPaiements] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/enseignants/attente`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/signalements`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/users`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/demandes`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/reservations`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/paiements`, { headers: getHeaders() })
      ]);

      if (resStats.ok) {
        const data = await resStats.json();
        setStats({
          totalEtudiants: data.total_etudiants || 0,
          totalEnseignants: data.total_enseignants || 0,
          totalReservations: data.total_reservations || 0,
          totalAvis: data.total_avis || 0,
          revenusTotal: data.revenus_total || 0
        });
      }
      if (resTeachers.ok) setEnseignantsAttente(await resTeachers.json());
      if (resReports.ok) setSignalements(await resReports.json());
      if (resUsers.ok) setUsers(await resUsers.json());
      if (resDemandes.ok) setDemandes(await resDemandes.json());
      if (resReservations.ok) setReservations(await resReservations.json());
      if (resPaiements.ok) setPaiements(await resPaiements.json());
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
    <div className="container-fluid p-4" style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
            <div className="text-muted small">Total Élèves</div>
            <div className="fs-2 fw-bold text-primary">{stats.totalEtudiants}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
            <div className="text-muted small">Total Tuteurs</div>
            <div className="fs-2 fw-bold text-warning">{stats.totalEnseignants}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
            <div className="text-muted small">Réservations</div>
            <div className="fs-2 fw-bold text-success">{stats.totalReservations}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
            <div className="text-muted small">Commission</div>
            <div className="fs-2 fw-bold text-purple">{stats.revenusTotal} DH</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="d-flex gap-4">
          <span onClick={() => setOnglet('stats')} style={{ fontSize: '14px', cursor: 'pointer', color: onglet === 'stats' ? '#000' : '#6c757d' }}>Statistiques</span>
          <span onClick={() => setOnglet('teachers')} style={{ fontSize: '14px', cursor: 'pointer', color: onglet === 'teachers' ? '#000' : '#6c757d' }}>Vérification Enseignants ({enseignantsAttente.length})</span>
          <span onClick={() => setOnglet('reports')} style={{ fontSize: '14px', cursor: 'pointer', color: onglet === 'reports' ? '#000' : '#6c757d' }}>Signalements ({signalements.length})</span>
          <span onClick={() => setOnglet('demandes')} style={{ fontSize: '14px', cursor: 'pointer', color: onglet === 'demandes' ? '#000' : '#6c757d' }}>Demandes ({demandes.length})</span>
          <span onClick={() => setOnglet('reservations')} style={{ fontSize: '14px', cursor: 'pointer', color: onglet === 'reservations' ? '#000' : '#6c757d' }}>Réservations</span>
          <span onClick={() => setOnglet('paiements')} style={{ fontSize: '14px', cursor: 'pointer', color: onglet === 'paiements' ? '#000' : '#6c757d' }}>Paiements</span>
          <span onClick={() => setOnglet('users')} style={{ fontSize: '14px', cursor: 'pointer', color: onglet === 'users' ? '#000' : '#6c757d' }}>Utilisateurs</span>
        </div>
      </div>

      {/* Dashboard Stats */}
      {onglet === 'stats' && (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card p-3 border-0 shadow-sm">
              <h6 className="text-center mb-2">Répartition Élèves / Tuteurs</h6>
              <div style={{ height: '260px' }}>
                <canvas ref={graphRef}></canvas>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 border-0 shadow-sm">
              <h6 className="text-center mb-2">Informations générales</h6>
              <div className="p-3">
                <p><strong>Total Avis:</strong> {stats.totalAvis}</p>
                <p><strong>Commission totale:</strong> {stats.revenusTotal} DH</p>
                <p><strong>Enseignants en attente:</strong> {enseignantsAttente.length}</p>
                <p><strong>Signalements:</strong> {signalements.length}</p>
              </div>
            </div>
          </div>
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

      {/* Enseignants en attente */}
      {onglet === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsAttente} onRefresh={rafraichirDonnees} />}
      
      {/* Signalements */}
      {onglet === 'reports' && <Signalements signalements={signalements} onRefresh={rafraichirDonnees} />}
      
      {/* Demandes */}
      {onglet === 'demandes' && (
        <div className="card p-3 border-0 shadow-sm">
          <h5 className="mb-3">Demandes des étudiants</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr><th>ID</th><th>Étudiant</th><th>Message</th><th>Date</th></tr>
              </thead>
              <tbody>
                {demandes.map(d => (
                  <tr key={d.id}><td>{d.id}</td><td>{d.etudiant?.nom} {d.etudiant?.prenom}</td><td>{d.message}</td><td>{new Date(d.created_at).toLocaleDateString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Réservations */}
      {onglet === 'reservations' && (
        <div className="card p-3 border-0 shadow-sm">
          <h5 className="mb-3">Toutes les réservations</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr><th>ID</th><th>Étudiant</th><th>Enseignant</th><th>Date</th><th>Montant</th><th>Statut</th></tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.etudiant?.nom} {r.etudiant?.prenom}</td>
                    <td>{r.creneau?.enseignant?.user?.nom} {r.creneau?.enseignant?.user?.prenom}</td>
                    <td>{r.creneau?.date}</td>
                    <td>{r.montant} DH</td>
                    <td>{r.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Paiements */}
      {onglet === 'paiements' && (
        <div className="card p-3 border-0 shadow-sm">
          <h5 className="mb-3">Historique des paiements</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr><th>ID</th><th>Étudiant</th><th>Montant</th><th>Commission</th><th>Statut</th><th>Date</th></tr>
              </thead>
              <tbody>
                {paiements.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.reservation?.etudiant?.nom} {p.reservation?.etudiant?.prenom}</td>
                    <td>{p.montant} DH</td>
                    <td>{p.comission} DH</td>
                    <td>{p.statut}</td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Utilisateurs */}
      {onglet === 'users' && <ManageUsers users={users} onRefresh={rafraichirDonnees} />}
    </div>
  );
}

export default AdminDashboard;