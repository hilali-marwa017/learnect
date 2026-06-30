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
            data: {
              labels: ['Élèves', 'Tuteurs'],
              datasets: [{
                data: [stats.totalEtudiants, stats.totalEnseignants],
                backgroundColor: ['#b91c1c', '#1f2937'],
                borderWidth: 0,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              animation: false,
              plugins: {
                legend: { 
                  position: 'bottom', 
                  labels: { 
                    usePointStyle: true, 
                    pointStyle: 'circle',
                    boxWidth: 10,
                    boxHeight: 10,
                    padding: 15
                  } 
                },
                tooltip: { enabled: false }
              },
              hover: { mode: null },
              layout: {
                padding: {
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10
                }
              }
            }
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
          <button onClick={() => setOnglet('stats')} style={{ flex: 1, border: 'none', background: 'none', padding: '12px 4px', fontSize: '13px', fontWeight: 'bold', color: onglet === 'stats' ? '#3b82f6' : '#64748b', borderBottom: onglet === 'stats' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'none' }}>
            <i className="bi bi-graph-up me-1"></i> Stats
          </button>
          <button onClick={() => setOnglet('teachers')} style={{ flex: 1, border: 'none', background: 'none', padding: '12px 4px', fontSize: '13px', fontWeight: 'bold', color: onglet === 'teachers' ? '#3b82f6' : '#64748b', borderBottom: onglet === 'teachers' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'none' }}>
            <i className="bi bi-person-badge me-1"></i> Vérifications ({enseignantsAttente.length})
          </button>
          <button onClick={() => setOnglet('reports')} style={{ flex: 1, border: 'none', background: 'none', padding: '12px 4px', fontSize: '13px', fontWeight: 'bold', color: onglet === 'reports' ? '#3b82f6' : '#64748b', borderBottom: onglet === 'reports' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'none' }}>
            <i className="bi bi-flag me-1"></i> Signalements ({signalements.length})
          </button>
          <button onClick={() => setOnglet('demandes')} style={{ flex: 1, border: 'none', background: 'none', padding: '12px 4px', fontSize: '13px', fontWeight: 'bold', color: onglet === 'demandes' ? '#3b82f6' : '#64748b', borderBottom: onglet === 'demandes' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'none' }}>
            <i className="bi bi-envelope me-1"></i> Demandes ({demandes.length})
          </button>
          <button onClick={() => setOnglet('reservations')} style={{ flex: 1, border: 'none', background: 'none', padding: '12px 4px', fontSize: '13px', fontWeight: 'bold', color: onglet === 'reservations' ? '#3b82f6' : '#64748b', borderBottom: onglet === 'reservations' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'none' }}>
            <i className="bi bi-calendar-check me-1"></i> Réservations ({reservations.length})
          </button>
          <button onClick={() => setOnglet('paiements')} style={{ flex: 1, border: 'none', background: 'none', padding: '12px 4px', fontSize: '13px', fontWeight: 'bold', color: onglet === 'paiements' ? '#3b82f6' : '#64748b', borderBottom: onglet === 'paiements' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'none' }}>
            <i className="bi bi-credit-card me-1"></i> Paiements ({paiements.length})
          </button>
          <button onClick={() => setOnglet('users')} style={{ flex: 1, border: 'none', background: 'none', padding: '12px 4px', fontSize: '13px', fontWeight: 'bold', color: onglet === 'users' ? '#3b82f6' : '#64748b', borderBottom: onglet === 'users' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'none' }}>
            <i className="bi bi-people me-1"></i> Users ({users.length})
          </button>
        </div>
      </div>

      {/* Stats Tab */}
      {onglet === 'stats' && (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card p-4 border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
              <h6 className="text-center mb-3">Répartition Élèves / Tuteurs</h6>
              <div style={{ height: '280px', margin: '0 auto', maxWidth: '90%' }}>
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
        <div className="bg-white rounded-4 border p-4" style={{ transition: 'none', transform: 'none' }}>
          <div className="mb-4">
            <h3 className="h5 fw-bold mb-1">LISTE DES DEMANDES ({demandes.length})</h3>
            <p className="text-muted small mb-0">Gérez les demandes des étudiants inscrits sur Learnect Maroc.</p>
          </div>
          <div className="overflow-x-auto">
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ÉTUDIANT</th>
                  <th style={thStyle}>TYPE</th>
                  <th style={thStyle}>MESSAGE</th>
                  <th style={thStyle}>STATUT</th>
                  <th style={thStyle}>DATE</th>
                </tr>
              </thead>
              <tbody>
                {demandes.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Aucune demande trouvée</td>
                  </tr>
                ) : (
                  demandes.map((d) => (
                    <tr key={d.id} style={{ transition: 'none' }}>
                      <td style={tdStyle}><div className="fw-bold">{d.etudiant?.nom} {d.etudiant?.prenom}</div><div className="small text-muted">{d.etudiant?.email}</div></td>
                      <td style={tdStyle}><span className="badge px-3 py-2 rounded-pill" style={{ background: '#dbeafe', color: '#2563eb', fontSize: '11px', fontWeight: 'bold' }}>{d.type || 'demande'}</span></td>
                      <td style={tdStyle}>{d.message?.substring(0, 80)}...</td>
                      <td style={tdStyle}><span className="badge px-3 py-2 rounded-pill" style={{ background: d.statut === 'traite' ? '#dcfce7' : '#fef3c7', color: d.statut === 'traite' ? '#166534' : '#92400e', fontSize: '11px', fontWeight: 'bold' }}>{d.statut === 'traite' ? 'TRAITÉ' : 'EN ATTENTE'}</span></td>
                      <td style={tdStyle}>{new Date(d.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Réservations Table */}
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
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Aucune réservation trouvée</td>
                  </tr>
                ) : (
                  reservations.map((r) => (
                    <tr key={r.id} style={{ transition: 'none' }}>
                      <td style={tdStyle}><div className="fw-bold">{r.etudiant?.nom} {r.etudiant?.prenom}</div><div className="small text-muted">{r.etudiant?.email}</div></td>
                      <td style={tdStyle}><div className="fw-bold">{r.creneau?.enseignant?.user?.nom} {r.creneau?.enseignant?.user?.prenom}</div><div className="small text-muted">{r.creneau?.enseignant?.user?.email}</div></td>
                      <td style={tdStyle}>{r.creneau?.date} {r.creneau?.heure_debut}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: '#16a34a' }}>{r.montant} DH</td>
                      <td style={tdStyle}>{r.paiement?.comission || 0} DH</td>
                      <td style={tdStyle}><span className="badge px-3 py-2 rounded-pill" style={{ background: r.statut === 'confirmee' ? '#dcfce7' : '#fef3c7', color: r.statut === 'confirmee' ? '#166534' : '#92400e', fontSize: '11px', fontWeight: 'bold' }}>{r.statut === 'confirmee' ? 'CONFIRMÉE' : 'EN ATTENTE'}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paiements Table */}
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
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Aucun paiement trouvé</td>
                  </tr>
                ) : (
                  paiements.map((p) => (
                    <tr key={p.id} style={{ transition: 'none' }}>
                      <td style={tdStyle}><div className="fw-bold">{p.reservation?.etudiant?.nom} {p.reservation?.etudiant?.prenom}</div><div className="small text-muted">{p.reservation?.etudiant?.email}</div></td>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: '#16a34a' }}>{p.montant} DH</td>
                      <td style={tdStyle}>{p.comission} DH</td>
                      <td style={tdStyle}><span className="badge px-3 py-2 rounded-pill" style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: 'bold' }}>{p.mode_paiement || 'carte'}</span></td>
                      <td style={tdStyle}><span className="badge px-3 py-2 rounded-pill" style={{ background: p.statut === 'paye' ? '#dcfce7' : '#fee2e2', color: p.statut === 'paye' ? '#166534' : '#dc2626', fontSize: '11px', fontWeight: 'bold' }}>{p.statut === 'paye' ? 'PAYÉ' : 'EN ATTENTE'}</span></td>
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