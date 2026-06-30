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

  async function chargerDonnees() {
    setChargement(true);
    setErreur(null);
    try {
      const [resStats, resTeachers, resReports, resUsers, resDemandes, resReservations, resPaiements] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/enseignants/attente'),
        api.get('/admin/signalements'),
        api.get('/admin/users'),
        api.get('/admin/demandes'),
        api.get('/admin/reservations'),
        api.get('/admin/paiements')
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
    } catch (err) {
      setErreur(err.message || 'Erreur de chargement');
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

      {/* Tabs - sans espacements */}
<div className="mb-4 border-bottom" style={{ borderBottomColor: '#e2e8f0' }}>
  <div className="d-flex gap-0" style={{ flexWrap: 'wrap' }}>
    <button
      onClick={() => setOnglet('stats')}
      className="py-2 px-2"
      style={{
        border: 'none',
        background: 'none',
        fontSize: '13px',
        fontWeight: onglet === 'stats' ? '600' : '400',
        color: onglet === 'stats' ? '#3b82f6' : '#64748b',
        borderBottom: onglet === 'stats' ? '2px solid #3b82f6' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'none'
      }}
    >
      <i className="bi bi-graph-up me-1"></i> Stats
    </button>
    <button
      onClick={() => setOnglet('teachers')}
      className="py-2 px-2"
      style={{
        border: 'none',
        background: 'none',
        fontSize: '13px',
        fontWeight: onglet === 'teachers' ? '600' : '400',
        color: onglet === 'teachers' ? '#3b82f6' : '#64748b',
        borderBottom: onglet === 'teachers' ? '2px solid #3b82f6' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'none'
      }}
    >
      <i className="bi bi-person-badge me-1"></i> Vérif ({enseignantsAttente.length})
    </button>
    <button
      onClick={() => setOnglet('reports')}
      className="py-2 px-2"
      style={{
        border: 'none',
        background: 'none',
        fontSize: '13px',
        fontWeight: onglet === 'reports' ? '600' : '400',
        color: onglet === 'reports' ? '#3b82f6' : '#64748b',
        borderBottom: onglet === 'reports' ? '2px solid #3b82f6' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'none'
      }}
    >
      <i className="bi bi-flag me-1"></i> Sig ({signalements.length})
    </button>
    <button
      onClick={() => setOnglet('demandes')}
      className="py-2 px-2"
      style={{
        border: 'none',
        background: 'none',
        fontSize: '13px',
        fontWeight: onglet === 'demandes' ? '600' : '400',
        color: onglet === 'demandes' ? '#3b82f6' : '#64748b',
        borderBottom: onglet === 'demandes' ? '2px solid #3b82f6' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'none'
      }}
    >
      <i className="bi bi-envelope me-1"></i> Demandes ({demandes.length})
    </button>
    <button
      onClick={() => setOnglet('reservations')}
      className="py-2 px-2"
      style={{
        border: 'none',
        background: 'none',
        fontSize: '13px',
        fontWeight: onglet === 'reservations' ? '600' : '400',
        color: onglet === 'reservations' ? '#3b82f6' : '#64748b',
        borderBottom: onglet === 'reservations' ? '2px solid #3b82f6' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'none'
      }}
    >
      <i className="bi bi-calendar-check me-1"></i> Résa ({reservations.length})
    </button>
    <button
      onClick={() => setOnglet('paiements')}
      className="py-2 px-2"
      style={{
        border: 'none',
        background: 'none',
        fontSize: '13px',
        fontWeight: onglet === 'paiements' ? '600' : '400',
        color: onglet === 'paiements' ? '#3b82f6' : '#64748b',
        borderBottom: onglet === 'paiements' ? '2px solid #3b82f6' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'none'
      }}
    >
      <i className="bi bi-credit-card me-1"></i> Paiements ({paiements.length})
    </button>
    <button
      onClick={() => setOnglet('users')}
      className="py-2 px-2"
      style={{
        border: 'none',
        background: 'none',
        fontSize: '13px',
        fontWeight: onglet === 'users' ? '600' : '400',
        color: onglet === 'users' ? '#3b82f6' : '#64748b',
        borderBottom: onglet === 'users' ? '2px solid #3b82f6' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'none'
      }}
    >
      <i className="bi bi-people me-1"></i> Users ({users.length})
    </button>
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
              <div className="p-2 rounded" style={{ background: '#f1f5f9' }}>
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
            <h5 className="mb-0 fw-semibold">Liste des demandes</h5>
            <p className="text-muted small mb-0 mt-1">Gestion des demandes des étudiants</p>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table mb-0" style={{ minWidth: '800px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th className="px-3 py-3 text-muted small fw-semibold">ID</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Étudiant</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Type</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Message</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Statut</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {demandes.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-5 text-muted">Aucune demande trouvée</td></tr>
                  ) : (
                    demandes.map((d, index) => (
                      <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td className="px-3 py-3">{index + 1}</td>
                        <td className="px-3 py-3">
                          <div className="fw-semibold">{d.etudiant?.nom} {d.etudiant?.prenom}</div>
                          <small className="text-muted">{d.etudiant?.email}</small>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`badge ${d.type === 'reclamation' ? 'bg-danger' : 'bg-info'}`}>
                            {d.type || 'demande'}
                          </span>
                        </td>
                        <td className="px-3 py-3">{d.message?.substring(0, 60)}...</td>
                        <td className="px-3 py-3">
                          <span className={`badge ${d.statut === 'traite' ? 'bg-success' : 'bg-warning'}`}>
                            {d.statut || 'en attente'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-muted">{new Date(d.created_at).toLocaleDateString()}</td>
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
            <h5 className="mb-0 fw-semibold">Liste des réservations</h5>
            <p className="text-muted small mb-0 mt-1">Gestion des réservations des cours</p>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table mb-0" style={{ minWidth: '900px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th className="px-3 py-3 text-muted small fw-semibold">ID</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Étudiant</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Enseignant</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Date</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Montant</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Commission</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-5 text-muted">Aucune réservation trouvée</td></tr>
                  ) : (
                    reservations.map((r, index) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td className="px-3 py-3">{index + 1}</td>
                        <td className="px-3 py-3">
                          <div className="fw-semibold">{r.etudiant?.nom} {r.etudiant?.prenom}</div>
                          <small className="text-muted">{r.etudiant?.email}</small>
                        </td>
                        <td className="px-3 py-3">
                          <div className="fw-semibold">{r.creneau?.enseignant?.user?.nom} {r.creneau?.enseignant?.user?.prenom}</div>
                          <small className="text-muted">{r.creneau?.enseignant?.user?.email}</small>
                        </td>
                        <td className="px-3 py-3">{r.creneau?.date} {r.creneau?.heure_debut}</td>
                        <td className="px-3 py-3 fw-semibold">{r.montant} DH</td>
                        <td className="px-3 py-3">{r.paiement?.comission || 0} DH</td>
                        <td className="px-3 py-3">
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
            <h5 className="mb-0 fw-semibold">Historique des paiements</h5>
            <p className="text-muted small mb-0 mt-1">Suivi des transactions financières</p>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table mb-0" style={{ minWidth: '800px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th className="px-3 py-3 text-muted small fw-semibold">ID</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Étudiant</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Montant</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Commission</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Mode</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Statut</th>
                    <th className="px-3 py-3 text-muted small fw-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paiements.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-5 text-muted">Aucun paiement trouvé</td></tr>
                  ) : (
                    paiements.map((p, index) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td className="px-3 py-3">{index + 1}</td>
                        <td className="px-3 py-3">
                          <div className="fw-semibold">{p.reservation?.etudiant?.nom} {p.reservation?.etudiant?.prenom}</div>
                          <small className="text-muted">{p.reservation?.etudiant?.email}</small>
                        </td>
                        <td className="px-3 py-3 fw-semibold text-success">{p.montant} DH</td>
                        <td className="px-3 py-3">{p.comission} DH</td>
                        <td className="px-3 py-3"><span className="badge bg-secondary">{p.mode_paiement || 'carte'}</span></td>
                        <td className="px-3 py-3">
                          <span className={`badge ${p.statut === 'paye' ? 'bg-success' : 'bg-danger'}`}>
                            {p.statut || 'en attente'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Enseignants en attente */}
      {onglet === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsAttente} onRefresh={rafraichirDonnees} />}
      
      {/* Signalements */}
      {onglet === 'reports' && <Signalements signalements={signalements} onRefresh={rafraichirDonnees} />}
      
      {/* Utilisateurs */}
      {onglet === 'users' && <ManageUsers users={users} onRefresh={rafraichirDonnees} />}
    </div>
  );
}

export default AdminDashboard;