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
  const chartInstance = useRef(null);

  useEffect(function() {
    chargerDonnees();
  }, []);

  useEffect(function() {
    if (onglet === 'stats' && stats.totalEtudiants > 0 && stats.totalEnseignants > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
      
      chartInstance.current = new Chart(graphRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Élèves', 'Tuteurs'],
          datasets: [{
            data: [stats.totalEtudiants, stats.totalEnseignants],
            backgroundColor: ['#0d6efd', '#0f172a'],
            borderWidth: 4,
            borderColor: '#ffffff',
            hoverBorderWidth: 4,
            hoverOffset: 8
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
                padding: 24,
                font: { size: 13, weight: '600', family: 'Inter, sans-serif' },
                color: '#334155'
              }
            },
            tooltip: {
              enabled: true,
              backgroundColor: '#0f172a',
              padding: 12,
              cornerRadius: 10,
              titleFont: { size: 13, weight: '700' },
              bodyFont: { size: 13 },
              callbacks: {
                label: function(ctx) {
                  const total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  const pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0;
                  return '  ' + ctx.label + ' : ' + ctx.raw + '  (' + pct + '%)';
                }
              }
            }
          },
          hover: { mode: 'nearest', intersect: true },
          cutout: '68%'
        },
        plugins: [{
          id: 'centerText',
          afterDraw: function(chart) {
            const { ctx, data, chartArea } = chart;
            const total = data.datasets[0].data.reduce(function(a, b) { return a + b; }, 0);
            const cx = (chartArea.left + chartArea.right) / 2;
            const cy = (chartArea.top + chartArea.bottom) / 2;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 28px Inter, sans-serif';
            ctx.fillStyle = '#0f172a';
            ctx.fillText(total, cx, cy - 10);
            ctx.font = '500 12px Inter, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('utilisateurs', cx, cy + 14);
            ctx.restore();
          }
        }]
      });
    }
  }, [onglet, stats]);

  async function chargerDonnees() {
    try {
      const [resStats, resUsers] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
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
        api.get('/admin/enseignants/attente'),
        api.get('/admin/signalements'),
        api.get('/admin/demandes'),
        api.get('/admin/reservations'),
        api.get('/admin/paiements')
      ]);
      if (resTeachers.data) setEnseignantsAttente(Array.isArray(resTeachers.data) ? resTeachers.data : []);
      if (resReports.data) setSignalements(Array.isArray(resReports.data) ? resReports.data : []);
      if (resDemandes.data) setDemandes(Array.isArray(resDemandes.data) ? resDemandes.data : []);
      if (resReservations.data) setReservations(Array.isArray(resReservations.data) ? resReservations.data : []);
      if (resPaiements.data) setPaiements(Array.isArray(resPaiements.data) ? resPaiements.data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function rafraichirDonnees() {
    await chargerDonnees();
  }

  function handleOnglet(tab) {
    setOnglet(tab);
  }

  const tabs = ['stats', 'teachers', 'reports', 'demandes', 'reservations', 'paiements', 'users'];
  const labels = ['Stats', 'Vérifications', 'Signalements', 'Demandes', 'Réservations', 'Paiements', 'Users'];
  const counts = [0, enseignantsAttente.length, signalements.length, demandes.length, reservations.length, paiements.length, users.length];
  const icons = ['bi-graph-up', 'bi-person-badge', 'bi-flag', 'bi-envelope', 'bi-calendar-check', 'bi-credit-card', 'bi-people'];

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
      <div className="mb-4 border-bottom">
        <div className="d-flex">
          {tabs.map(function(tab, idx) {
            return (
              <button
                key={tab}
                onClick={function() { handleOnglet(tab); }}
                style={{ flex: 1, border: 'none', background: 'none', padding: '12px 4px', fontSize: '13px', fontWeight: onglet === tab ? 'bold' : 'normal', color: onglet === tab ? '#0d6efd' : '#6c757d', borderBottom: onglet === tab ? '2px solid #0d6efd' : 'none', cursor: 'pointer', transition: 'none' }}
              >
                <i className={`bi ${icons[idx]} me-1`}></i> {labels[idx]} ({counts[idx]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Tab */}
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
              <div className="p-2 rounded bg-light">
                <p className="mb-0">10% de commission, 90% pour l'enseignant.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demandes Tab */}
      {onglet === 'demandes' && (
        <div className="bg-white rounded-4 border p-4" style={{ transition: 'none', transform: 'none' }}>
          <div className="mb-4">
            <h3 className="h5 fw-bold mb-1">LISTE DES DEMANDES ({demandes.length})</h3>
            <p className="text-muted small mb-0">Gérez les demandes des étudiants inscrits sur Learnect Maroc.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-100" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>ÉTUDIANT</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>TYPE</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>MESSAGE</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>STATUT</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>DATE</th>
                </tr>
              </thead>
              <tbody>
                {demandes.length === 0 ? (
                  <tr><td colSpan="5" className="py-4 text-center text-muted">Aucune demande trouvée</td></tr>
                ) : (
                  demandes.map(function(d) {
                    return (
                      <tr key={d.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td className="py-3">
                          <div className="fw-bold" style={{ fontSize: '14px' }}>{d.etudiant?.nom} {d.etudiant?.prenom}</div>
                          <div className="small" style={{ color: '#64748b' }}>{d.etudiant?.email}</div>
                        </td>
                        <td className="py-3">
                          <span className="badge px-3 py-2 rounded-pill" style={{ background: '#dbeafe', color: '#2563eb', fontSize: '11px', fontWeight: 'bold' }}>
                            {d.type || 'demande'}
                          </span>
                        </td>
                        <td className="py-3">{d.message?.substring(0, 80)}...</td>
                        <td className="py-3">
                          <span className={`badge px-3 py-2 rounded-pill ${d.statut === 'traite' ? 'bg-success' : 'bg-warning'}`}>
                            {d.statut === 'traite' ? 'TRAITÉ' : 'EN ATTENTE'}
                          </span>
                        </td>
                        <td className="py-3">{new Date(d.created_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservations Tab */}
      {onglet === 'reservations' && (
        <div className="bg-white rounded-4 border p-4" style={{ transition: 'none', transform: 'none' }}>
          <div className="mb-4">
            <h3 className="h5 fw-bold mb-1">LISTE DES RÉSERVATIONS ({reservations.length})</h3>
            <p className="text-muted small mb-0">Gérez les réservations des cours sur Learnect Maroc.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>ÉTUDIANT</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>ENSEIGNANT</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>DATE</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>MONTANT</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>COMMISSION</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr><td colSpan="6" className="py-4 text-center text-muted">Aucune réservation trouvée</td></tr>
                ) : (
                  reservations.map(function(r) {
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td className="py-3">
                          <div className="fw-bold" style={{ fontSize: '14px' }}>{r.etudiant?.nom} {r.etudiant?.prenom}</div>
                          <div className="small" style={{ color: '#64748b' }}>{r.etudiant?.email}</div>
                        </td>
                        <td className="py-3">
                          <div className="fw-bold" style={{ fontSize: '14px' }}>{r.creneau?.enseignant?.user?.nom} {r.creneau?.enseignant?.user?.prenom}</div>
                          <div className="small" style={{ color: '#64748b' }}>{r.creneau?.enseignant?.user?.email}</div>
                        </td>
                        <td className="py-3">{r.creneau?.date} {r.creneau?.heure_debut}</td>
                        <td className="py-3 fw-bold text-success">{r.montant} DH</td>
                        <td className="py-3">{r.paiement?.comission || 0} DH</td>
                        <td className="py-3">
                          <span className={`badge px-3 py-2 rounded-pill ${r.statut === 'confirmee' ? 'bg-success' : 'bg-warning'}`}>
                            {r.statut === 'confirmee' ? 'CONFIRMÉE' : 'EN ATTENTE'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paiements Tab */}
      {onglet === 'paiements' && (
        <div className="bg-white rounded-4 border p-4" style={{ transition: 'none', transform: 'none' }}>
          <div className="mb-4">
            <h3 className="h5 fw-bold mb-1">HISTORIQUE DES PAIEMENTS ({paiements.length})</h3>
            <p className="text-muted small mb-0">Suivi des transactions financières sur Learnect Maroc.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>ÉTUDIANT</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>MONTANT</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>COMMISSION</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>MODE</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>STATUT</th>
                  <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>DATE</th>
                </tr>
              </thead>
              <tbody>
                {paiements.length === 0 ? (
                  <tr><td colSpan="6" className="py-4 text-center text-muted">Aucun paiement trouvé</td></tr>
                ) : (
                  paiements.map(function(p) {
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td className="py-3">
                          <div className="fw-bold" style={{ fontSize: '14px' }}>{p.reservation?.etudiant?.nom} {p.reservation?.etudiant?.prenom}</div>
                          <div className="small" style={{ color: '#64748b' }}>{p.reservation?.etudiant?.email}</div>
                        </td>
                        <td className="py-3 fw-bold text-success">{p.montant} DH</td>
                        <td className="py-3">{p.comission} DH</td>
                        <td className="py-3">
                          <span className="badge px-3 py-2 rounded-pill" style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: 'bold' }}>
                            {p.mode_paiement || 'carte'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`badge px-3 py-2 rounded-pill ${p.statut === 'paye' ? 'bg-success' : 'bg-danger'}`}>
                            {p.statut === 'paye' ? 'PAYÉ' : 'EN ATTENTE'}
                          </span>
                        </td>
                        <td className="py-3">{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {onglet === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsAttente} onRefresh={rafraichirDonnees} />}
      {onglet === 'reports' && <Signalements signalements={signalements} onRefresh={rafraichirDonnees} />}
      {onglet === 'users' && <ManageUsers users={users} onRefresh={rafraichirDonnees} />}
    </div>
  );
}

export default AdminDashboard;