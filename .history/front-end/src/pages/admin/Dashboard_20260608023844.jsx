import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';
import api from '../../api/axios';

Chart.register(...registerables);

function AdminDashboard() {
  const [onglet, setOnglet] = useState('stats');
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
    if (onglet === 'stats') {
      setTimeout(() => {
        if (chart) chart.destroy();
        if (graphRef.current && (stats.totalEtudiants > 0 || stats.totalEnseignants > 0)) {
          chart = new Chart(graphRef.current, {
            type: 'doughnut',
            data: {
              labels: ['Élèves', 'Tuteurs'],
              datasets: [{
                data: [stats.totalEtudiants, stats.totalEnseignants],
                backgroundColor: ['#dc2626', '#1f2937'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              animation: false,
              plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle' } },
                tooltip: { enabled: true, callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } }
              },
              hover: { mode: null },
              cutout: '50%'
            }
          });
        }
      }, 100);
    }
    return () => { if (chart) chart.destroy(); };
  }, [onglet, stats]);

  async function chargerDonnees() {
    try {
      const [resStats, resUsers] = await Promise.all([api.get('/admin/stats'), api.get('/admin/users')]);
      if (resStats.data) {
        setStats({
          totalEtudiants: resStats.data.total_etudiants || 0,
          totalEnseignants: resStats.data.total_enseignants || 0,
          totalReservations: resStats.data.total_reservations || 0,
          totalAvis: resStats.data.total_avis || 0,
          revenusTotal: resStats.data.revenus_total || 0
        });
      }
      if (resUsers.data) setUsers(Array.isArray(resUsers.data) ? resUsers.data : []);

      const [resTeachers, resReports, resDemandes, resReservations, resPaiements] = await Promise.all([
        api.get('/admin/enseignants/attente'), api.get('/admin/signalements'),
        api.get('/admin/demandes'), api.get('/admin/reservations'), api.get('/admin/paiements')
      ]);
      if (resTeachers.data) setEnseignantsAttente(Array.isArray(resTeachers.data) ? resTeachers.data : []);
      if (resReports.data) setSignalements(Array.isArray(resReports.data) ? resReports.data : []);
      if (resDemandes.data) setDemandes(Array.isArray(resDemandes.data) ? resDemandes.data : []);
      if (resReservations.data) setReservations(Array.isArray(resReservations.data) ? resReservations.data : []);
      if (resPaiements.data) setPaiements(Array.isArray(resPaiements.data) ? resPaiements.data : []);
    } catch (err) { console.error(err); }
  }

  async function rafraichirDonnees() { await chargerDonnees(); }

  return (
    <div className="container-fluid p-4" style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      {/* KPI Cards - NO HOVER */}
      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}><div className="text-muted small">Total Élèves</div><div className="fs-2 fw-bold text-primary">{stats.totalEtudiants}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}><div className="text-muted small">Total Tuteurs</div><div className="fs-2 fw-bold text-warning">{stats.totalEnseignants}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}><div className="text-muted small">Réservations</div><div className="fs-2 fw-bold text-success">{stats.totalReservations}</div></div></div>
        <div className="col-md-3"><div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}><div className="text-muted small">Commission</div><div className="fs-2 fw-bold text-purple">{stats.revenusTotal} DH</div></div></div>
      </div>

      {/* Tabs - NO HOVER */}
      <div className="mb-4 border-bottom">
        <div className="d-flex">
          {['stats','teachers','reports','demandes','reservations','paiements','users'].map((tab, idx) => {
            const labels = ['Stats','Vérifications','Signalements','Demandes','Réservations','Paiements','Users'];
            const counts = [0, enseignantsAttente.length, signalements.length, demandes.length, reservations.length, paiements.length, users.length];
            const icons = ['bi-graph-up','bi-person-badge','bi-flag','bi-envelope','bi-calendar-check','bi-credit-card','bi-people'];
            return (
              <button key={tab} onClick={() => setOnglet(tab)} style={{ flex: 1, border: 'none', background: 'none', padding: '12px 4px', fontSize: '13px', fontWeight: onglet === tab ? 'bold' : 'normal', color: onglet === tab ? '#0d6efd' : '#6c757d', borderBottom: onglet === tab ? '2px solid #0d6efd' : 'none', cursor: 'pointer', transition: 'none' }}>
                <i className={`bi ${icons[idx]} me-1`}></i> {labels[idx]} ({counts[idx]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Tab - Graph center */}
      {onglet === 'stats' && (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card p-4 border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
              <h6 className="text-center mb-3">Répartition Élèves / Tuteurs</h6>
              <div className="d-flex justify-content-center">
                <div style={{ height: '280px', width: '280px' }}>
                  <canvas ref={graphRef}></canvas>
                </div>
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
              <div className="p-2 rounded bg-light"><p className="mb-0">10% de commission, 90% pour l'enseignant.</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Demandes Table */}
      {onglet === 'demandes' && (
        <div className="card border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
          <div className="card-header bg-white"><h5 className="mb-0">LISTE DES DEMANDES ({demandes.length})</h5></div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <thead className="table-light"><tr><th>ÉTUDIANT</th><th>TYPE</th><th>MESSAGE</th><th>STATUT</th><th>DATE</th></tr></thead>
                <tbody>
                  {demandes.length === 0 ? <tr><td colSpan="5" className="text-center py-4 text-muted">Aucune demande</td></tr> :
                    demandes.map(d => <tr key={d.id}>
                      <td><div className="fw-bold">{d.etudiant?.nom} {d.etudiant?.prenom}</div><small className="text-muted">{d.etudiant?.email}</small></td>
                      <td><span className="badge bg-info">{d.type || 'demande'}</span></td>
                      <td>{d.message?.substring(0,80)}...</td>
                      <td><span className={`badge ${d.statut === 'traite' ? 'bg-success' : 'bg-warning'}`}>{d.statut === 'traite' ? 'TRAITÉ' : 'EN ATTENTE'}</span></td>
                      <td>{new Date(d.created_at).toLocaleDateString()}</td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Réservations Table */}
      {onglet === 'reservations' && (
        <div className="card border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
          <div className="card-header bg-white"><h5 className="mb-0">LISTE DES RÉSERVATIONS ({reservations.length})</h5></div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <thead className="table-light"><tr><th>ÉTUDIANT</th><th>ENSEIGNANT</th><th>DATE</th><th>MONTANT</th><th>COMMISSION</th><th>STATUT</th></tr></thead>
                <tbody>
                  {reservations.length === 0 ? <tr><td colSpan="6" className="text-center py-4 text-muted">Aucune réservation</td></tr> :
                    reservations.map(r => <tr key={r.id}>
                      <td><div className="fw-bold">{r.etudiant?.nom} {r.etudiant?.prenom}</div><small>{r.etudiant?.email}</small></td>
                      <td><div className="fw-bold">{r.creneau?.enseignant?.user?.nom} {r.creneau?.enseignant?.user?.prenom}</div><small>{r.creneau?.enseignant?.user?.email}</small></td>
                      <td>{r.creneau?.date} {r.creneau?.heure_debut}</td>
                      <td className="fw-bold text-success">{r.montant} DH</td>
                      <td>{r.paiement?.comission || 0} DH</td>
                      <td><span className={`badge ${r.statut === 'confirmee' ? 'bg-success' : 'bg-warning'}`}>{r.statut === 'confirmee' ? 'CONFIRMÉE' : 'EN ATTENTE'}</span></td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Paiements Table */}
      {onglet === 'paiements' && (
        <div className="card border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
          <div className="card-header bg-white"><h5 className="mb-0">HISTORIQUE DES PAIEMENTS ({paiements.length})</h5></div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <thead className="table-light"><tr><th>ÉTUDIANT</th><th>MONTANT</th><th>COMMISSION</th><th>MODE</th><th>STATUT</th><th>DATE</th></tr></thead>
                <tbody>
                  {paiements.length === 0 ? <tr><td colSpan="6" className="text-center py-4 text-muted">Aucun paiement</td></tr> :
                    paiements.map(p => <tr key={p.id}>
                      <td><div className="fw-bold">{p.reservation?.etudiant?.nom} {p.reservation?.etudiant?.prenom}</div><small>{p.reservation?.etudiant?.email}</small></td>
                      <td className="fw-bold text-success">{p.montant} DH</td>
                      <td>{p.comission} DH</td>
                      <td><span className="badge bg-secondary">{p.mode_paiement || 'carte'}</span></td>
                      <td><span className={`badge ${p.statut === 'paye' ? 'bg-success' : 'bg-danger'}`}>{p.statut === 'paye' ? 'PAYÉ' : 'EN ATTENTE'}</span></td>
                      <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>)}
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