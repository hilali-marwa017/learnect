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

  // Style pour les tableaux
  const tableStyle = { borderCollapse: 'collapse', width: '100%' };
  const thStyle = { padding: '16px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#64748b', borderBottom: '2px solid #e2e8f0' };
  const tdStyle = { padding: '16px 12px', fontSize: '13px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'top' };

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

      {/* Demandes Table - same style as Users */}
      {onglet === 'demandes' && (
        <div className="bg-white rounded-4 border p-4" style={{ transition: 'none', transform: 'none' }}>
          <div className="mb-4">
            <h3 className="h5 fw-bold mb-1">LISTE DES DEMANDES ({demandes.length})</h3>
            <p className="text-muted small mb-0">Gérez les demandes des étudiants inscrits sur Learnect Maroc.</p>
          </div>
          <div className="overflow-x-auto">
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ETUDIANT</th>
                  <th style={thStyle}>TYPE</th>
                  <th style={thStyle}>MESSAGE</th>
                  <th style={thStyle}>STATUT</th>
                  <th style={thStyle}>DATE</th>
                </tr>
              </thead>
              <tbody>
                {demandes.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Aucune demande trouvée</td></tr>
                ) : (
                  demandes.map((d, i) => (
                    <tr key={d.id} style={{ transition: 'none' }}>
                      <td style={tdStyle}>
                        <div className="fw-bold" style={{ fontSize: '14px' }}>{d.etudiant?.nom} {d.etudiant?.prenom}</div>
                        <div className="small" style={{ color: '#64748b' }}>{d.etudiant?.email}</div>
                      </td>
                      <td style={tdStyle}>
                        <span className="badge px-3 py-2 rounded-pill" style={{ background: d.type === 'reclamation' ? '#fee2e2' : '#dbeafe', color: d.type === 'reclamation' ? '#dc2626' : '#2563eb', fontSize: '11px', fontWeight: 'bold' }}>
                          {d.type || 'demande'}
                        </span>
                      </td>
                      <td style={tdStyle}>{d.message?.substring(0, 80)}...</td>
                      <td style={tdStyle}>
                        <span className="badge px-3 py-2 rounded-pill" style={{ background: d.statut === 'traite' ? '#dcfce7' : '#fef3c7', color: d.statut === 'traite' ? '#166534' : '#92400e', fontSize: '11px', fontWeight: 'bold' }}>
                          {d.statut === 'traite' ? 'TRAITÉ' : 'EN ATTENTE'}
                        </span>
                      </td>
                      <td style={tdStyle}>{new Date(d.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Réservations Table - same style as Users */}
      {onglet === 'reservations' && (
        <div className="bg-white rounded-4 border p-4" style={{ transition: 'none', transform: 'none' }}>
          <div className="mb-4">
            <h3 className="h5 fw-bold mb-1">LISTE DES RÉSERVATIONS ({reservations.length})</h3>
            <p className="text-muted small mb-0">Gérez les réservations des cours sur Learnect Maroc.</p>
          </div>
          <div className="overflow-x-auto">
            <table style={{ ...tableStyle, minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={thStyle}>ÉTUDIANT</th>
                  <th style={thStyle}>ENSEIGNANT</th>
                  <th style={thStyle}>DATE</th>
                  <th style={thStyle}>MONTANT</th>
                  <th style={thStyle}>COMMISSION</th>
                  <th style={thStyle}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Aucune réservation trouvée</td></tr>
                ) : (
                  reservations.map((r, i) => (
                    <tr key={r.id} style={{ transition: 'none' }}>
                      <td style={tdStyle}>
                        <div className="fw-bold" style={{ fontSize: '14px' }}>{r.etudiant?.nom} {r.etudiant?.prenom}</div>
                        <div className="small" style={{ color: '#64748b' }}>{r.etudiant?.email}</div>
                      </td>
                      <td style={tdStyle}>
                        <div className="fw-bold" style={{ fontSize: '14px' }}>{r.creneau?.enseignant?.user?.nom} {r.creneau?.enseignant?.user?.prenom}</div>
                        <div className="small" style={{ color: '#64748b' }}>{r.creneau?.enseignant?.user?.email}</div>
                      </td>
                      <td style={tdStyle}>{r.creneau?.date} {r.creneau?.heure_debut}</td>
                      <td style={tdStyle} className="fw-bold text-success">{r.montant} DH</td>
                      <td style={tdStyle}>{r.paiement?.comission || 0} DH</td>
                      <td style={tdStyle}>
                        <span className="badge px-3 py-2 rounded-pill" style={{ background: r.statut === 'confirmee' ? '#dcfce7' : r.statut === 'annulee' ? '#fee2e2' : '#fef3c7', color: r.statut === 'confirmee' ? '#166534' : r.statut === 'annulee' ? '#dc2626' : '#92400e', fontSize: '11px', fontWeight: 'bold' }}>
                          {r.statut === 'confirmee' ? 'CONFIRMÉE' : r.statut === 'annulee' ? 'ANNULÉE' : 'EN ATTENTE'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paiements Table - same style as Users */}
      {onglet === 'paiements' && (
        <div className="bg-white rounded-4 border p-4" style={{ transition: 'none', transform: 'none' }}>
          <div className="mb-4">
            <h3 className="h5 fw-bold mb-1">HISTORIQUE DES PAIEMENTS ({paiements.length})</h3>
            <p className="text-muted small mb-0">Suivi des transactions financières sur Learnect Maroc.</p>
          </div>
          <div className="overflow-x-auto">
            <table style={{ ...tableStyle, minWidth: '700px' }}>
              <thead>
                <tr>
                  <th style={thStyle}>ÉTUDIANT</th>
                  <th style={thStyle}>MONTANT</th>
                  <th style={thStyle}>COMMISSION</th>
                  <th style={thStyle}>MODE</th>
                  <th style={thStyle}>STATUT</th>
                  <th style={thStyle}>DATE</th>
                </tr>
              </thead>
              <tbody>
                {paiements.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Aucun paiement trouvé</td></tr>
                ) : (
                  paiements.map((p, i) => (
                    <tr key={p.id} style={{ transition: 'none' }}>
                      <td style={tdStyle}>
                        <div className="fw-bold" style={{ fontSize: '14px' }}>{p.reservation?.etudiant?.nom} {p.reservation?.etudiant?.prenom}</div>
                        <div className="small" style={{ color: '#64748b' }}>{p.reservation?.etudiant?.email}</div>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: '#16a34a' }}>{p.montant} DH</td>
                      <td style={tdStyle}>{p.comission} DH</td>
                      <td style={tdStyle}>
                        <span className="badge px-3 py-2 rounded-pill" style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: 'bold' }}>
                          {p.mode_paiement || 'carte'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span className="badge px-3 py-2 rounded-pill" style={{ background: p.statut === 'paye' ? '#dcfce7' : '#fee2e2', color: p.statut === 'paye' ? '#166534' : '#dc2626', fontSize: '11px', fontWeight: 'bold' }}>
                          {p.statut === 'paye' ? 'PAYÉ' : 'EN ATTENTE'}
                        </span>
                      </td>
                      <td style={tdStyle}>{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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