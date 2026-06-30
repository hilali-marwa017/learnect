// src/pages/admin/Dashboard.jsx
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';
import api from '../../api/axios';

Chart.register(...registerables);

function AdminDashboard() {
  const [onglet, setOnglet] = useState('stats');
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

  const donutRef = useRef(null);
  const barRef = useRef(null);
  const donutInstance = useRef(null);
  const barInstance = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    chargerDonnees(abortControllerRef.current.signal);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (onglet !== 'stats') return;
    if (stats.totalEtudiants === 0 && stats.totalEnseignants === 0) return;

    if (donutInstance.current) {
      donutInstance.current.destroy();
      donutInstance.current = null;
    }
    if (barInstance.current) {
      barInstance.current.destroy();
      barInstance.current = null;
    }

    if (donutRef.current) {
      donutInstance.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Élèves', 'Tuteurs'],
          datasets: [{
            data: [stats.totalEtudiants, stats.totalEnseignants],
            backgroundColor: ['#185FA5', '#0F6E56'],
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              cornerRadius: 8,
              titleFont: { size: 12, weight: '600' },
              bodyFont: { size: 12 },
              callbacks: {
                label: function(ctx) {
                  const total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  const pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0;
                  return ' ' + ctx.label + ' : ' + ctx.raw + ' (' + pct + '%)';
                }
              }
            }
          },
          plugins: [{
            id: 'centreDonut',
            afterDraw: function(chart) {
              const ctx = chart.ctx;
              const chartArea = chart.chartArea;
              const data = chart.data;
              const total = data.datasets[0].data.reduce(function(a, b) { return a + b; }, 0);
              const cx = (chartArea.left + chartArea.right) / 2;
              const cy = (chartArea.top + chartArea.bottom) / 2;
              ctx.save();
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = '700 26px Inter, sans-serif';
              ctx.fillStyle = '#0f172a';
              ctx.fillText(total, cx, cy - 10);
              ctx.font = '400 11px Inter, sans-serif';
              ctx.fillStyle = '#94a3b8';
              ctx.fillText('utilisateurs', cx, cy + 12);
              ctx.restore();
            }
          }]
        }
      });
    }

    if (barRef.current) {
      barInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: ['Réservations', 'Demandes', 'Paiements', 'Signalements', 'En attente'],
          datasets: [{
            label: 'Total',
            data: [
              stats.totalReservations,
              demandes.length,
              paiements.length,
              signalements.length,
              enseignantsAttente.length
            ],
            backgroundColor: ['#185FA5', '#0F6E56', '#3B6D11', '#854F0B', '#A32D2D'],
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 22
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function(ctx) {
                  return '  Total : ' + ctx.raw;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(0,0,0,0.04)' },
              ticks: { font: { size: 11 }, color: '#94a3b8', stepSize: 1 },
              border: { display: false }
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 12, weight: '500' }, color: '#475569' },
              border: { display: false }
            }
          }
        }
      });
    }
  }, [onglet, stats, demandes.length, paiements.length, signalements.length, enseignantsAttente.length]);

  async function chargerDonnees(signal) {
    try {
      const [resStats, resUsers] = await Promise.all([
        api.get('/admin/stats', { signal: signal }),
        api.get('/admin/users', { signal: signal })
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

      if (resUsers.data) {
        setUsers(Array.isArray(resUsers.data) ? resUsers.data : []);
      }

      const [resTeachers, resReports, resDemandes, resReservations, resPaiements] = await Promise.all([
        api.get('/admin/enseignants/attente', { signal: signal }),
        api.get('/admin/signalements', { signal: signal }),
        api.get('/admin/demandes', { signal: signal }),
        api.get('/admin/reservations', { signal: signal }),
        api.get('/admin/paiements', { signal: signal })
      ]);

      if (resTeachers.data) {
        setEnseignantsAttente(Array.isArray(resTeachers.data) ? resTeachers.data : []);
      }
      if (resReports.data) {
        setSignalements(Array.isArray(resReports.data) ? resReports.data : []);
      }
      if (resDemandes.data) {
        setDemandes(Array.isArray(resDemandes.data) ? resDemandes.data : []);
      }
      if (resReservations.data) {
        setReservations(Array.isArray(resReservations.data) ? resReservations.data : []);
      }
      if (resPaiements.data) {
        setPaiements(Array.isArray(resPaiements.data) ? resPaiements.data : []);
      }

    } catch (err) {
      if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      console.error('Erreur chargement dashboard:', err);
    }
  }

  async function rafraichirDonnees() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    await chargerDonnees(abortControllerRef.current.signal);
  }

  function handleOnglet(tab) {
    setOnglet(tab);
  }

  const tabs = ['stats', 'teachers', 'reports', 'demandes', 'reservations', 'paiements', 'users'];
  const labels = ['Tableau de bord', 'Vérifications', 'Signalements', 'Demandes', 'Réservations', 'Paiements', 'Utilisateurs'];
  const counts = [null, enseignantsAttente.length, signalements.length, demandes.length, reservations.length, paiements.length, users.length];
  const icons = ['bi-speedometer2', 'bi-person-check', 'bi-flag', 'bi-envelope', 'bi-calendar-check', 'bi-credit-card', 'bi-people'];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '28px 32px' }}>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total élèves', valeur: stats.totalEtudiants, icone: 'bi-mortarboard', couleur: '#185FA5', fond: '#e6f1fb' },
          { label: 'Total tuteurs', valeur: stats.totalEnseignants, icone: 'bi-person-workspace', couleur: '#0F6E56', fond: '#e1f5ee' },
          { label: 'Réservations', valeur: stats.totalReservations, icone: 'bi-calendar-check', couleur: '#3B6D11', fond: '#eaf3de' },
          { label: 'Commission totale', valeur: stats.revenusTotal + ' DH', icone: 'bi-cash-coin', couleur: '#854F0B', fond: '#faeeda' }
        ].map(function(kpi, idx) {
          return (
            <div key={idx} style={{ background: 'white', borderRadius: 14, padding: '20px 22px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{kpi.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: kpi.fond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={'bi ' + kpi.icone} style={{ fontSize: 16, color: kpi.couleur }}></i>
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>{kpi.valeur}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', overflowX: 'auto' }}>
          {tabs.map(function(tab, idx) {
            const actif = onglet === tab;
            return (
              <button
                key={tab}
                onClick={function() { handleOnglet(tab); }}
                style={{
                  flex: '0 0 auto',
                  border: 'none',
                  background: actif ? '#f0f7ff' : 'transparent',
                  padding: '14px 18px',
                  fontSize: 13,
                  fontWeight: actif ? 700 : 500,
                  color: actif ? '#185FA5' : '#64748b',
                  borderBottom: actif ? '2px solid #185FA5' : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap'
                }}
              >
                <i className={'bi ' + icons[idx]} style={{ fontSize: 14 }}></i>
                {labels[idx]}
                {counts[idx] !== null && counts[idx] > 0 && (
                  <span style={{ background: actif ? '#185FA5' : '#e5e7eb', color: actif ? 'white' : '#475569', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                    {counts[idx]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Stats Tab */}
        {onglet === 'stats' && (
          <div style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Donut Chart */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px 24px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Répartition des utilisateurs</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 16 }}>Élèves vs Tuteurs inscrits</div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: '#185FA5', display: 'inline-block' }}></span>
                    Élèves ({stats.totalEtudiants})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: '#0F6E56', display: 'inline-block' }}></span>
                    Tuteurs ({stats.totalEnseignants})
                  </span>
                </div>
                <div style={{ position: 'relative', height: 220, display: 'flex', justifyContent: 'center' }}>
                  <canvas ref={donutRef}></canvas>
                </div>
              </div>

              {/* Bar Chart - Activité de la plateforme SUPPRIMÉE, remplacée par Informations générales */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px 24px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Informations générales</div>
                {[
                  { label: 'Total avis', valeur: stats.totalAvis, icone: 'bi-star', couleur: '#854F0B' },
                  { label: 'Commission totale', valeur: stats.revenusTotal + ' DH', icone: 'bi-cash-coin', couleur: '#3B6D11' },
                  { label: 'Tuteurs en attente', valeur: enseignantsAttente.length, icone: 'bi-person-check', couleur: '#185FA5' },
                  { label: 'Signalements actifs', valeur: signalements.length, icone: 'bi-flag', couleur: '#A32D2D' }
                ].map(function(info, idx) {
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: idx < 3 ? '1px solid #e5e7eb' : 'none' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#475569' }}>
                        <i className={'bi ' + info.icone} style={{ color: info.couleur, fontSize: 16 }}></i>
                        {info.label}
                      </span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{info.valeur}</span>
                    </div>
                  );
                })}
              </div>

              {/* Informations générales (originale) - SUPPRIMÉE car remplacée */}
              {/* Le bloc ci-dessous est supprimé
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px 24px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Informations générales</div>
                ...
              </div>
              */}

              {/* Modèle financier */}
              <div style={{ background: 'linear-gradient(135deg, #185FA5 0%, #0a3d6e 100%)', borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 8 }}>
                  <i className="bi bi-graph-up-arrow" style={{ marginRight: 8 }}></i>
                  Modèle financier
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>Répartition des revenus par cours</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>10%</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Commission Learnect</div>
                  </div>
                  <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }}></div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#5DCAA5' }}>90%</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Revenus tuteur</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                    <i className="bi bi-info-circle" style={{ marginRight: 6 }}></i>
                    Commission prélevée automatiquement à chaque paiement confirmé
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Demandes Tab */}
        {onglet === 'demandes' && (
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Liste des demandes ({demandes.length})</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Gérez les demandes des étudiants inscrits sur Learnect.ma</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Étudiant</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Type</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Message</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Statut</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {demandes.length === 0 ? (
                    <tr><td colSpan="5" style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8' }}>Aucune demande trouvée</td></tr>
                  ) : (
                    demandes.map(function(d) {
                      return (
                        <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 0' }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{d.etudiant?.nom} {d.etudiant?.prenom}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{d.etudiant?.email}</div>
                           </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{d.type || 'demande'}</span>
                           </td>
                          <td style={{ padding: '12px 8px', fontSize: 13, color: '#475569', maxWidth: 220 }}>{(d.message || '').substring(0, 80)}{d.message && d.message.length > 80 ? '...' : ''}</td>
                          <td style={{ padding: '12px 8px'}}>
                            <span style={{ background: d.statut === 'traite' ? '#dcfce7' : '#fef9c3', color: d.statut === 'traite' ? '#166534' : '#854d0e', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                              {d.statut === 'traite' ? 'Traité' : 'En attente'}
                            </span>
                           </td>
                          <td style={{ padding: '12px 0', fontSize: 12, color: '#64748b' }}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
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
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Liste des réservations ({reservations.length})</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Gérez les réservations des cours sur Learnect.ma</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Étudiant</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Enseignant</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Date</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Montant</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Commission</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Statut</th>
                   </tr>
                </thead>
                <tbody>
                  {reservations.length === 0 ? (
                     <tr><td colSpan="6" style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8' }}>Aucune réservation trouvée</td></tr>
                  ) : (
                    reservations.map(function(r) {
                      return (
                        <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 0' }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{r.etudiant?.nom} {r.etudiant?.prenom}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{r.etudiant?.email}</div>
                           </td>
                          <td style={{ padding: '12px 8px' }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{r.creneau?.enseignant?.user?.nom} {r.creneau?.enseignant?.user?.prenom}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{r.creneau?.enseignant?.user?.email}</div>
                           </td>
                          <td style={{ padding: '12px 8px', fontSize: 13, color: '#475569' }}>{r.creneau?.date} {r.creneau?.heure_debut}</td>
                          <td style={{ padding: '12px 8px', fontWeight: 700, color: '#166534', fontSize: 13 }}>{r.montant} DH</td>
                          <td style={{ padding: '12px 8px', fontSize: 13, color: '#475569' }}>{r.paiement?.comission || 0} DH</td>
                          <td style={{ padding: '12px 0' }}>
                            <span style={{ background: r.statut === 'confirmee' ? '#dcfce7' : '#fef9c3', color: r.statut === 'confirmee' ? '#166534' : '#854d0e', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                              {r.statut === 'confirmee' ? 'Confirmée' : 'En attente'}
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
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Historique des paiements ({paiements.length})</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Suivi des transactions financières sur Learnect.ma</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 650 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Étudiant</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Montant</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Commission</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Mode</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Statut</th>
                    <th style={{ paddingBottom: 10, textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>Date</th>
                   </tr>
                </thead>
                <tbody>
                  {paiements.length === 0 ? (
                     <tr><td colSpan="6" style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8' }}>Aucun paiement trouvé</td></tr>
                  ) : (
                    paiements.map(function(p) {
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 0' }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{p.reservation?.etudiant?.nom} {p.reservation?.etudiant?.prenom}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{p.reservation?.etudiant?.email}</div>
                           </td>
                          <td style={{ padding: '12px 8px', fontWeight: 700, color: '#166534', fontSize: 13 }}>{p.montant} DH</td>
                          <td style={{ padding: '12px 8px', fontSize: 13, color: '#475569' }}>{p.comission} DH</td>
                          <td style={{ padding: '12px 8px'}}>
                            <span style={{ background: '#f1f5f9', color: '#475569', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{p.mode_paiement || 'carte'}</span>
                           </td>
                          <td style={{ padding: '12px 8px'}}>
                            <span style={{ background: p.statut === 'paye' ? '#dcfce7' : '#fee2e2', color: p.statut === 'paye' ? '#166534' : '#991b1b', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                              {p.statut === 'paye' ? 'Payé' : 'En attente'}
                            </span>
                           </td>
                          <td style={{ padding: '12px 0', fontSize: 12, color: '#64748b' }}>{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
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
    </div>
  );
}

export default AdminDashboard;  