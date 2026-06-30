import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';
import api from '../../api/axios';

Chart.register(...registerables);

function AdminDashboard() {
  const [onglet, setOnglet] = useState('stats');
  const [chargement, setChargement] = useState(true);
  const [stats, setStats] = useState({ totalEtudiants: 0, totalEnseignants: 0, totalReservations: 0, totalAvis: 0, revenusTotal: 0 });
  const [enseignantsAttente, setEnseignantsAttente] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const graphRef = useRef(null);
  let chart = null;

  useEffect(() => { chargerDonnees(); }, []);

  useEffect(() => {
    if (onglet === 'stats' && !chargement) {
      setTimeout(() => {
        if (chart) chart.destroy();
        if (graphRef.current) {
          chart = new Chart(graphRef.current, {
            type: 'doughnut',
            data: { labels: ['Élèves', 'Tuteurs'], datasets: [{ data: [stats.totalEtudiants, stats.totalEnseignants], backgroundColor: ['#3b82f6', '#f59e0b'] }] },
            options: { responsive: true, maintainAspectRatio: true, animation: false, plugins: { legend: { position: 'bottom' } } }
          });
        }
      }, 100);
    }
    return () => { if (chart) chart.destroy(); };
  }, [onglet, chargement, stats]);

  async function chargerDonnees() {
    setChargement(true);
    try {
      const [resStats, resTeachers, resReports, resUsers, resDemandes, resReservations, resPaiements] = await Promise.all([
        api.get('/admin/stats'), api.get('/admin/enseignants/attente'), api.get('/admin/signalements'),
        api.get('/admin/users'), api.get('/admin/demandes'), api.get('/admin/reservations'), api.get('/admin/paiements')
      ]);
      setStats({
        totalEtudiants: resStats.data.total_etudiants || 0,
        totalEnseignants: resStats.data.total_enseignants || 0,
        totalReservations: resStats.data.total_reservations || 0,
        totalAvis: resStats.data.total_avis || 0,
        revenusTotal: resStats.data.revenus_total || 0
      });
      setEnseignantsAttente(resTeachers.data || []);
      setSignalements(resReports.data || []);
      setUsers(resUsers.data || []);
      setDemandes(resDemandes.data || []);
      setReservations(resReservations.data || []);
      setPaiements(resPaiements.data || []);
    } catch (err) { console.error(err); }
    finally { setChargement(false); }
  }

  async function rafraichirDonnees() { await chargerDonnees(); }

  if (chargement) return <div className="d-flex justify-content-center align-items-center vh-100 bg-light"><div className="spinner-border text-primary"></div></div>;

  const tabs = [
    { id: 'stats', label: 'Stats', icon: 'bi-graph-up' },
    { id: 'teachers', label: `Vérif (${enseignantsAttente.length})`, icon: 'bi-person-badge' },
    { id: 'reports', label: `Sig (${signalements.length})`, icon: 'bi-flag' },
    { id: 'demandes', label: `Demandes (${demandes.length})`, icon: 'bi-envelope' },
    { id: 'reservations', label: `Résa (${reservations.length})`, icon: 'bi-calendar-check' },
    { id: 'paiements', label: `Paiements (${paiements.length})`, icon: 'bi-credit-card' },
    { id: 'users', label: `Users (${users.length})`, icon: 'bi-people' }
  ];

  return (
    <div className="container-fluid p-4" style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}><div className="text-muted small">Total Élèves</div><div className="fs-2 fw-bold text-primary">{stats.totalEtudiants}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}><div className="text-muted small">Total Tuteurs</div><div className="fs-2 fw-bold text-warning">{stats.totalEnseignants}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}><div className="text-muted small">Réservations</div><div className="fs-2 fw-bold text-success">{stats.totalReservations}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}><div className="text-muted small">Commission</div><div className="fs-2 fw-bold text-purple">{stats.revenusTotal} DH</div></div></div>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-bottom" style={{ borderBottomColor: '#e2e8f0' }}>
        <div className="d-flex">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setOnglet(tab.id)} style={{ flex: 1, border: 'none', background: 'none', padding: '12px 4px', fontSize: '13px', fontWeight: 'bold', color: onglet === tab.id ? '#3b82f6' : '#64748b', borderBottom: onglet === tab.id ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'none' }}>
              <i className={`bi ${tab.icon} me-1`}></i> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Tab */}
      {onglet === 'stats' && (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card p-3 border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
              <h6 className="text-center mb-2">Répartition Élèves / Tuteurs</h6>
              <div style={{ height: '260px' }}>
                <canvas ref={graphRef}></canvas>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
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
            <div className="card p-3 border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
              <h6 className="fw-bold mb-2">SUIVI DES FLUX FINANCIERS</h6>
              <div className="p-2 rounded bg-light">
                <p className="mb-0">10% de commission, 90% pour l'enseignant.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demandes Table */}
      {onglet === 'demandes' && (
        <div className="card border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
          <div className="card-header bg-white p-3 border-bottom">
            <h5 className="mb-0">Liste des demandes</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table mb-0" style={{ minWidth: '800px' }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '50px' }}>ID</th>
                    <th>Étudiant</th>
                    <th style={{ width: '100px' }}>Type</th>
                    <th>Message</th>
                    <th style={{ width: '100px' }}>Statut</th>
                    <th style={{ width: '100px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {demandes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">Aucune demande trouvée</td>
                    </tr>
                  ) : (
                    demandes.map((d, i) => (
                      <tr key={d.id} style={{ transition: 'none' }}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="fw-semibold">{d.etudiant?.nom} {d.etudiant?.prenom}</div>
                          <small className="text-muted">{d.etudiant?.email}</small>
                        </td>
                        <td><span className="badge bg-info">{d.type || 'demande'}</span></td>
                        <td>{d.message?.substring(0, 60)}...</td>
                        <td>
                          <span className={`badge ${d.statut === 'traite' ? 'bg-success' : 'bg-warning'}`}>
                            {d.statut || 'en attente'}
                          </span>
                        </td>
                        <td>{new Date(d.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Réservations Table */}
      {onglet === 'reservations' && (
        <div className="card border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
          <div className="card-header bg-white p-3 border-bottom">
            <h5 className="mb-0">Liste des réservations</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table mb-0" style={{ minWidth: '900px' }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '50px' }}>ID</th>
                    <th>Étudiant</th>
                    <th>Enseignant</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Commission</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">Aucune réservation trouvée</td>
                    </tr>
                  ) : (
                    reservations.map((r, i) => (
                      <tr key={r.id} style={{ transition: 'none' }}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="fw-semibold">{r.etudiant?.nom} {r.etudiant?.prenom}</div>
                          <small className="text-muted">{r.etudiant?.email}</small>
                        </td>
                        <td>
                          <div className="fw-semibold">{r.creneau?.enseignant?.user?.nom} {r.creneau?.enseignant?.user?.prenom}</div>
                          <small className="text-muted">{r.creneau?.enseignant?.user?.email}</small>
                        </td>
                        <td>{r.creneau?.date} {r.creneau?.heure_debut}</td>
                        <td className="fw-semibold">{r.montant} DH</td>
                        <td>{r.paiement?.comission || 0} DH</td>
                        <td>
                          <span className={`badge ${r.statut === 'confirmee' ? 'bg-success' : r.statut === 'annulee' ? 'bg-danger' : 'bg-warning'}`}>
                            {r.statut || 'en attente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Paiements Table */}
      {onglet === 'paiements' && (
        <div className="card border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
          <div className="card-header bg-white p-3 border-bottom">
            <h5 className="mb-0">Historique des paiements</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table mb-0" style={{ minWidth: '800px' }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '50px' }}>ID</th>
                    <th>Étudiant</th>
                    <th>Montant</th>
                    <th>Commission</th>
                    <th>Mode</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paiements.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">Aucun paiement trouvé</td>
                    </tr>
                  ) : (
                    paiements.map((p, i) => (
                      <tr key={p.id} style={{ transition: 'none' }}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="fw-semibold">{p.reservation?.etudiant?.nom} {p.reservation?.etudiant?.prenom}</div>
                          <small className="text-muted">{p.reservation?.etudiant?.email}</small>
                        </td>
                        <td className="fw-semibold text-success">{p.montant} DH</td>
                        <td>{p.comission} DH</td>
                        <td><span className="badge bg-secondary">{p.mode_paiement || 'carte'}</span></td>
                        <td>
                          <span className={`badge ${p.statut === 'paye' ? 'bg-success' : 'bg-danger'}`}>
                            {p.statut || 'en attente'}
                          </span>
                        </td>
                        <td>{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Teachers & Reports & Users */}
      {onglet === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsAttente} onRefresh={rafraichirDonnees} />}
      {onglet === 'reports' && <Signalements signalements={signalements} onRefresh={rafraichirDonnees} />}
      {onglet === 'users' && <ManageUsers users={users} onRefresh={rafraichirDonnees} />}
    </div>
  );
}

export default AdminDashboard;