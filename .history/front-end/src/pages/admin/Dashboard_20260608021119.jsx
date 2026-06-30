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
  const instanceGraph = useRef(null);

  useEffect(() => {
    chargerDonnees();
  }, []);

  useEffect(() => {
    if (onglet === 'stats' && !chargement) {
      setTimeout(() => {
        if (instanceGraph.current) {
          instanceGraph.current.destroy();
          instanceGraph.current = null;
        }
        if (graphRef.current) {
          instanceGraph.current = new Chart(graphRef.current, {
            type: 'doughnut',
            data: {
              labels: ['Élèves', 'Tuteurs'],
              datasets: [{
                data: [stats.totalEtudiants, stats.totalEnseignants],
                backgroundColor: ['#f50303', '#303c4d'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              animation: false,
              hover: { mode: null },
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
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }
          });
        }
      }, 100);
    }
    return () => {
      if (instanceGraph.current) {
        instanceGraph.current.destroy();
        instanceGraph.current = null;
      }
    };
  }, [onglet, chargement, stats]);

  async function chargerDonnees() {
    setChargement(true);
    try {
      const [resStats, resTeachers, resReports, resUsers, resDemandes, resReservations, resPaiements] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/enseignants/attente'),
        api.get('/admin/signalements'),
        api.get('/admin/users'),
        api.get('/admin/demandes'),
        api.get('/admin/reservations'),
        api.get('/admin/paiements')
      ]);

      if (resStats.status === 'fulfilled') {
        setStats({
          totalEtudiants: resStats.value.data.total_etudiants || 0,
          totalEnseignants: resStats.value.data.total_enseignants || 0,
          totalReservations: resStats.value.data.total_reservations || 0,
          totalAvis: resStats.value.data.total_avis || 0,
          revenusTotal: resStats.value.data.revenus_total || 0
        });
      }

      if (resTeachers.status === 'fulfilled') {
        const donnees = resTeachers.value.data;
        setEnseignantsAttente(Array.isArray(donnees) ? donnees : donnees.data || []);
      }

      if (resReports.status === 'fulfilled') {
        const donnees = resReports.value.data;
        setSignalements(Array.isArray(donnees) ? donnees : donnees.data || []);
      }

      if (resUsers.status === 'fulfilled') {
        const donnees = resUsers.value.data;
        setUsers(Array.isArray(donnees) ? donnees : donnees.data || []);
      }

      if (resDemandes.status === 'fulfilled') {
        const donnees = resDemandes.value.data;
        setDemandes(Array.isArray(donnees) ? donnees : donnees.data || []);
      }

      if (resReservations.status === 'fulfilled') {
        const donnees = resReservations.value.data;
        setReservations(Array.isArray(donnees) ? donnees : donnees.data || []);
      }

      if (resPaiements.status === 'fulfilled') {
        const donnees = resPaiements.value.data;
        setPaiements(Array.isArray(donnees) ? donnees : donnees.data || []);
      }

    } catch (erreur) {
      console.error(erreur);
    } finally {
      setChargement(false);
    }
  }

  async function rafraichirDonnees() {
    await chargerDonnees();
  }

  if (chargement) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  const tableStyle = { borderCollapse: 'collapse', width: '100%' };

  const thStyle = {
    padding: '16px 12px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#64748b',
    borderBottom: '2px solid #e2e8f0'
  };

  const tdStyle = {
    padding: '16px 12px',
    fontSize: '13px',
    borderBottom: '1px solid #e2e8f0',
    verticalAlign: 'top'
  };

  const styleOnglet = (cle) => ({
    flex: 1,
    border: 'none',
    background: 'none',
    padding: '12px 4px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: onglet === cle ? '#3b82f6' : '#64748b',
    borderBottom: onglet === cle ? '2px solid #3b82f6' : '2px solid transparent',
    cursor: 'pointer',
    transition: 'none'
  });

  const listeOnglets = [
    { cle: 'stats',        icone: 'bi-graph-up',       libelle: 'Stats' },
    { cle: 'teachers',     icone: 'bi-person-badge',   libelle: `Vérifications (${enseignantsAttente.length})` },
    { cle: 'reports',      icone: 'bi-flag',           libelle: `Signalements (${signalements.length})` },
    { cle: 'demandes',     icone: 'bi-envelope',       libelle: `Demandes (${demandes.length})` },
    { cle: 'reservations', icone: 'bi-calendar-check', libelle: `Réservations (${reservations.length})` },
    { cle: 'paiements',    icone: 'bi-credit-card',    libelle: `Paiements (${paiements.length})` },
    { cle: 'users',        icone: 'bi-people',         libelle: `Users (${users.length})` }
  ];

  const listeCartes = [
    { libelle: 'Total Élèves',  valeur: stats.totalEtudiants,      couleur: 'text-primary' },
    { libelle: 'Total Tuteurs', valeur: stats.totalEnseignants,     couleur: 'text-warning' },
    { libelle: 'Réservations',  valeur: stats.totalReservations,    couleur: 'text-success' },
    { libelle: 'Commission',    valeur: `${stats.revenusTotal} DH`, couleur: 'text-danger' }
  ];

  return (
    <div className="container-fluid p-4" style={{ background: '#f5f7fa', minHeight: '100vh' }}>

      {/* Cartes KPI */}
      <div className="row g-3 mb-4">
        {listeCartes.map((carte, index) => (
          <div className="col-md-3" key={index}>
            <div className="card p-3 text-center border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
              <div className="text-muted small">{carte.libelle}</div>
              <div className={`fs-2 fw-bold ${carte.couleur}`}>{carte.valeur}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div className="mb-4 border-bottom">
        <div className="d-flex">
          {listeOnglets.map(o => (
            <button key={o.cle} onClick={() => setOnglet(o.cle)} style={styleOnglet(o.cle)}>
              <i className={`bi ${o.icone} me-1`}></i>{o.libelle}
            </button>
          ))}
        </div>
      </div>

      {/* Onglet Stats */}
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

      {/* Onglet Demandes */}
      {onglet === 'demandes' && (
        <div className="bg-white rounded-4 border p-4" style={{ transition: 'none', transform: 'none' }}>
          <h3 className="h5 fw-bold mb-1">LISTE DES DEMANDES ({demandes.length})</h3>
          <p className="text-muted small mb-4">Gérez les demandes des étudiants inscrits sur Learnect.</p>
          <div className="table-responsive">
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
                  demandes.map(d => (
                    <tr key={d.id}>
                      <td style={tdStyle}>
                        <div className="fw-bold">{d.etudiant?.nom} {d.etudiant?.prenom}</div>
                        <div className="small text-muted">{d.etudiant?.email}</div>
                      </td>
                      <td style={tdStyle}>
                        <span className="badge px-3 py-2 rounded-pill" style={{ background: '#dbeafe', color: '#2563eb', fontSize: '11px' }}>
                          {d.type || 'demande'}
                        </span>
                      </td>
                      <td style={tdStyle}>{d.message?.substring(0, 80)}...</td>
                      <td style={tdStyle}>
                        <span className="badge px-3 py-2 rounded-pill" style={{ background: d.statut === 'traite' ? '#dcfce7' : '#fef3c7', color: d.statut === 'traite' ? '#166534' : '#92400e', fontSize: '11px' }}>
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

      {/* Onglet Réservations */}
      {onglet === 'reservations' && (
        <div className="bg-white rounded-4 border p-4" style={{ transition: 'none', transform: 'none' }}>
          <h3 className="h5 fw-bold mb-1">LISTE DES RÉSERVATIONS ({reservations.length})</h3>
          <p className="text-muted small mb-4">Gérez les réservations des cours sur Learnect.</p>
          <div className="table-responsive">
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
                  reservations.map(r => (
                    <tr key={r.id}>
                      <td style={tdStyle}>
                        <div className="fw-bold">{r.etudiant?.nom} {r.etudiant?.prenom}</div>
                        <div className="small text-muted">{r.etudiant?.email}</div>
                      </td>
                      <td style={tdStyle}>
                        <div className="fw-bold">{r.creneau?.enseignant?.user?.nom} {r.creneau?.enseignant?.user?.prenom}</div>
                        <div className="small text-muted">{r.creneau?.enseignant?.user?.email}</div>
                      </td>
                      <td style={tdStyle}>{r.creneau?.date} {r.creneau?.heure_debut}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: '#16a34a' }}>{r.montant} DH</td>
                      <td style={tdStyle}>{r.paiement?.comission || 0} DH</td>
                      <td style={tdStyle}>
                        <span className="badge px-3 py-2 rounded-pill" style={{ background: r.statut === 'confirmee' ? '#dcfce7' : '#fef3c7', color: r.statut === 'confirmee' ? '#166534' : '#92400e', fontSize: '11px' }}>
                          {r.statut === 'confirmee' ? 'CONFIRMÉE' : 'EN ATTENTE'}
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

      {/* Onglet Paiements */}
      {onglet === 'paiements' && (
        <div className="bg-white rounded-4 border p-4" style={{ transition: 'none', transform: 'none' }}>
          <h3 className="h5 fw-bold mb-1">HISTORIQUE DES PAIEMENTS ({paiements.length})</h3>
          <p className="text-muted small mb-4">Suivi des transactions financières sur Learnect.</p>
          <div className="table-responsive">
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
                  paiements.map(p => (
                    <tr key={p.id}>
                      <td style={tdStyle}>
                        <div className="fw-bold">{p.reservation?.etudiant?.nom} {p.reservation?.etudiant?.prenom}</div>
                        <div className="small text-muted">{p.reservation?.etudiant?.email}</div>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: '#16a34a' }}>{p.montant} DH</td>
                      <td style={tdStyle}>{p.comission} DH</td>
                      <td style={tdStyle}>
                        <span className="badge px-3 py-2 rounded-pill" style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px' }}>
                          {p.mode_paiement || 'carte'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span className="badge px-3 py-2 rounded-pill" style={{ background: p.statut === 'paye' ? '#dcfce7' : '#fee2e2', color: p.statut === 'paye' ? '#166534' : '#dc2626', fontSize: '11px' }}>
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

      {onglet === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsAttente} onRefresh={rafraichirDonnees} />}
      {onglet === 'reports' && <Signalements signalements={signalements} onRefresh={rafraichirDonnees} />}
      {onglet === 'users' && <ManageUsers users={users} onRefresh={rafraichirDonnees} />}

    </div>
  );
}

export default AdminDashboard;