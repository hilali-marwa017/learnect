import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Chart, registerables } from 'chart.js';
import { Users, ShieldCheck, GraduationCap, AlertCircle, LogOut } from 'lucide-react';
import api from '../../api/axios';

Chart.register(...registerables);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [ongletActif, setOngletActif] = useState('stats');
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
  const [chargement, setChargement] = useState(true);

  const donutRef = useRef(null);
  const barRef = useRef(null);
  const donutInstance = useRef(null);
  const barInstance = useRef(null);

  const liens = [
    { label: "Vue d'ensemble", path: '/admin', icon: Users, id: 'dashboard' },
    { label: 'Gérer Utilisateurs', path: '/admin/users', icon: GraduationCap, id: 'users' },
    { label: 'Tuteurs Validés', path: '/admin/validated', icon: ShieldCheck, id: 'validated' },
    { label: 'Signalements / Refus', path: '/admin/signalements', icon: AlertCircle, id: 'signalements' },
  ];

  useEffect(function() {
    chargerDonnees();
  }, []);

  useEffect(function() {
    if (ongletActif !== 'stats') return;
    if (stats.totalEtudiants === 0 && stats.totalEnseignants === 0) return;

    if (donutInstance.current) { donutInstance.current.destroy(); donutInstance.current = null; }
    if (barInstance.current) { barInstance.current.destroy(); barInstance.current = null; }

    if (donutRef.current) {
      donutInstance.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Élèves', 'Tuteurs'],
          datasets: [{
            data: [stats.totalEtudiants, stats.totalEnseignants],
            backgroundColor: ['#3b82f6', '#1e293b'],
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          cutout: '68%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function(ctx) {
                  var total = ctx.dataset.data[0] + ctx.dataset.data[1];
                  var pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0;
                  return ' ' + ctx.label + ' : ' + ctx.raw + ' (' + pct + '%)';
                }
              }
            },
            centreDonut: {
              id: 'centreDonut',
              afterDraw: function(chart) {
                var ctx2 = chart.ctx;
                var chartArea = chart.chartArea;
                var total = chart.data.datasets[0].data[0] + chart.data.datasets[0].data[1];
                var cx = (chartArea.left + chartArea.right) / 2;
                var cy = (chartArea.top + chartArea.bottom) / 2;
                ctx2.save();
                ctx2.textAlign = 'center';
                ctx2.textBaseline = 'middle';
                ctx2.font = 'bold 26px Inter, sans-serif';
                ctx2.fillStyle = '#0f172a';
                ctx2.fillText(total, cx, cy - 8);
                ctx2.font = '400 11px Inter, sans-serif';
                ctx2.fillStyle = '#94a3b8';
                ctx2.fillText('utilisateurs', cx, cy + 14);
                ctx2.restore();
              }
            }
          }
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
            backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'],
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 28
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
                label: function(ctx) { return '  Total : ' + ctx.raw; }
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
  }, [ongletActif, stats, demandes, paiements, signalements, enseignantsAttente]);

  function chargerDonnees() {
    setChargement(true);

    api.get('/admin/stats').then(function(r) {
      var d = r.data;
      setStats({
        totalEtudiants: d.total_etudiants || 0,
        totalEnseignants: d.total_enseignants || 0,
        totalReservations: d.total_reservations || 0,
        totalAvis: d.total_avis || 0,
        revenusTotal: d.revenus_total || 0
      });
    }).catch(function(err) { console.error('stats:', err); });

    api.get('/admin/users').then(function(r) {
      if (Array.isArray(r.data)) setUsers(r.data);
    }).catch(function(err) { console.error('users:', err); });

    api.get('/admin/enseignants/attente').then(function(r) {
      if (Array.isArray(r.data)) setEnseignantsAttente(r.data);
    }).catch(function(err) { console.error('attente:', err); });

    api.get('/admin/signalements').then(function(r) {
      if (Array.isArray(r.data)) setSignalements(r.data);
    }).catch(function(err) { console.error('signalements:', err); });

    api.get('/admin/demandes').then(function(r) {
      if (Array.isArray(r.data)) setDemandes(r.data);
    }).catch(function(err) { console.error('demandes:', err); });

    api.get('/admin/reservations').then(function(r) {
      if (Array.isArray(r.data)) setReservations(r.data);
    }).catch(function(err) { console.error('reservations:', err); });

    api.get('/admin/paiements').then(function(r) {
      if (Array.isArray(r.data)) setPaiements(r.data);
      setChargement(false);
    }).catch(function(err) {
      console.error('paiements:', err);
      setChargement(false);
    });
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  function handleOnglet(tab) {
    setOngletActif(tab);
  }

  const tabs = ['stats', 'teachers', 'reports', 'demandes', 'reservations', 'paiements', 'users'];
  const labels = ['Tableau de bord', 'Vérifications', 'Signalements', 'Demandes', 'Réservations', 'Paiements', 'Utilisateurs'];
  const counts = [null, enseignantsAttente.length, signalements.length, demandes.length, reservations.length, paiements.length, users.length];

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="animate-spin h-8 w-8 border-4 border-accent-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8">

        {/* Bannière */}
        <div className="border-b border-hairline-strong pb-6 flex justify-between items-end flex-wrap gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">ADMIN PANEL</span>
            <h1 className="text-3xl font-black text-ink tracking-tight">Console de Supervision</h1>
            <p className="text-charcoal text-xs">Pilotez la qualité pédagogique, vérifiez les dossiers d'accréditation et gérez les plaintes de Learnect.ma.</p>
          </div>
          <p className="text-[11px] font-mono text-charcoal bg-surface-card border border-hairline px-3.5 py-1.5 rounded-lg shrink-0">
            Connecté : <strong className="text-ink">{user?.prenom} {user?.nom}</strong>
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Menu latéral — style original */}
          <div className="bg-surface-card border border-hairline-strong rounded-xl p-4 space-y-2 shrink-0 md:w-64">
            <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-mute font-bold font-mono">
              Menu Administration
            </div>
            <nav className="space-y-1">
              {liens.map(function(lien) {
                const Icon = lien.icon;
                return (
                  <Link
                    key={lien.id}
                    to={lien.path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-charcoal hover:bg-surface-deep/40 hover:text-ink transition-all"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{lien.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-accent-red hover:bg-accent-red/10 cursor-pointer text-left border-none mt-4"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Fermer Administration</span>
              </button>
            </nav>
          </div>

          {/* Contenu principal */}
          <div className="flex-grow space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 font-medium">Total élèves</span>
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalEtudiants}</div>
              </div>

              <div className="bg-white rounded-xl p-5 border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 font-medium">Total tuteurs</span>
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalEnseignants}</div>
              </div>

              <div className="bg-white rounded-xl p-5 border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 font-medium">Réservations</span>
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalReservations}</div>
              </div>

              <div className="bg-white rounded-xl p-5 border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 font-medium">Commission totale</span>
                  <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.revenusTotal} DH</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="flex border-b overflow-x-auto">
                {tabs.map(function(tab, idx) {
                  const estActif = ongletActif === tab;
                  return (
                    <button
                      key={tab}
                      onClick={function() { handleOnglet(tab); }}
                      className={`flex items-center px-5 py-3 text-sm font-medium whitespace-nowrap ${
                        estActif
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {labels[idx]}
                      {counts[idx] !== null && counts[idx] > 0 && (
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                          estActif ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {counts[idx]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab : stats */}
              {ongletActif === 'stats' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-5 border">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">Répartition des utilisateurs</h3>
                      <p className="text-xs text-gray-400 mb-4">Élèves vs Tuteurs inscrits</p>
                      <div className="flex gap-6 mb-4">
                        <span className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-3 h-3 bg-blue-600 rounded-sm inline-block"></span>
                          Élèves ({stats.totalEtudiants})
                        </span>
                        <span className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-3 h-3 bg-gray-800 rounded-sm inline-block"></span>
                          Tuteurs ({stats.totalEnseignants})
                        </span>
                      </div>
                      <div className="relative h-64 flex justify-center">
                        <canvas ref={donutRef}></canvas>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">Activité de la plateforme</h3>
                      <p className="text-xs text-gray-400 mb-4">Vue d'ensemble par catégorie</p>
                      <div className="relative h-64">
                        <canvas ref={barRef}></canvas>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border">
                      <h3 className="text-sm font-bold text-gray-900 mb-4">Informations générales</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Total avis</span>
                          <span className="font-bold text-gray-900">{stats.totalAvis}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Commission totale</span>
                          <span className="font-bold text-gray-900">{stats.revenusTotal} DH</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Tuteurs en attente</span>
                          <span className="font-bold text-gray-900">{enseignantsAttente.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-600">Signalements actifs</span>
                          <span className="font-bold text-gray-900">{signalements.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-5 text-white">
                      <h3 className="text-sm font-bold mb-2">Modèle financier</h3>
                      <p className="text-xs text-blue-200 mb-4">Répartition des revenus par cours</p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold">10%</div>
                          <div className="text-xs text-blue-200 mt-1">Commission Learnect</div>
                        </div>
                        <div className="w-px h-10 bg-blue-400"></div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-300">90%</div>
                          <div className="text-xs text-blue-200 mt-1">Revenus tuteur</div>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-xs">
                        Commission prélevée automatiquement à chaque paiement confirmé
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab : teachers (enseignants en attente) */}
              {ongletActif === 'teachers' && (
                <div className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-1">Vérifications enseignants ({enseignantsAttente.length})</h3>
                  <p className="text-sm text-gray-500 mb-4">Validez ou refusez les candidatures en attente</p>
                  {enseignantsAttente.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">☕ Aucune candidature en attente</div>
                  ) : (
                    <div className="space-y-4">
                      {enseignantsAttente.map(function(candidat) {
                        return (
                          <div key={candidat.id} className="border rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50">
                            <div>
                              <div className="font-bold text-gray-900">{candidat.prenom} {candidat.nom}</div>
                              <div className="text-xs text-gray-500">{candidat.email} • {candidat.ville}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={function() {
                                  api.put('/admin/enseignants/' + candidat.id + '/refuser')
                                    .then(function() {
                                      setEnseignantsAttente(enseignantsAttente.filter(function(e) { return e.id !== candidat.id; }));
                                    })
                                    .catch(function() { alert('Erreur'); });
                                }}
                                className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold cursor-pointer"
                              >
                                Refuser
                              </button>
                              <button
                                onClick={function() {
                                  api.put('/admin/enseignants/' + candidat.id + '/valider')
                                    .then(function() {
                                      setEnseignantsAttente(enseignantsAttente.filter(function(e) { return e.id !== candidat.id; }));
                                    })
                                    .catch(function() { alert('Erreur'); });
                                }}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold cursor-pointer"
                              >
                                Valider
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab : signalements */}
              {ongletActif === 'reports' && (
                <div className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Signalements ({signalements.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Signalé par</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Raison</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Statut</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {signalements.length === 0 ? (
                          <tr><td colSpan="4" className="text-center py-8 text-gray-400">Aucun signalement</td></tr>
                        ) : (
                          signalements.map(function(s) {
                            return (
                              <tr key={s.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 text-sm font-medium text-gray-900">{s.signaleur?.nom} {s.signaleur?.prenom}</td>
                                <td className="py-3 text-sm text-gray-600">{s.raison}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.statut === 'traite' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {s.statut === 'traite' ? 'Traité' : 'En attente'}
                                  </span>
                                </td>
                                <td className="py-3 text-sm text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab : demandes */}
              {ongletActif === 'demandes' && (
                <div className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Demandes ({demandes.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Étudiant</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Message</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Statut</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demandes.length === 0 ? (
                          <tr><td colSpan="4" className="text-center py-8 text-gray-400">Aucune demande</td></tr>
                        ) : (
                          demandes.map(function(d) {
                            return (
                              <tr key={d.id} className="border-b hover:bg-gray-50">
                                <td className="py-3">
                                  <div className="font-medium text-gray-900">{d.etudiant?.nom} {d.etudiant?.prenom}</div>
                                  <div className="text-xs text-gray-500">{d.etudiant?.email}</div>
                                </td>
                                <td className="py-3 text-sm text-gray-600 max-w-xs truncate">{d.message?.substring(0, 80)}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.statut === 'traite' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {d.statut === 'traite' ? 'Traité' : 'En attente'}
                                  </span>
                                </td>
                                <td className="py-3 text-sm text-gray-500">{new Date(d.created_at).toLocaleDateString()}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab : réservations */}
              {ongletActif === 'reservations' && (
                <div className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Réservations ({reservations.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Étudiant</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Enseignant</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Montant</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Statut</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.length === 0 ? (
                          <tr><td colSpan="5" className="text-center py-8 text-gray-400">Aucune réservation</td></tr>
                        ) : (
                          reservations.map(function(r) {
                            return (
                              <tr key={r.id} className="border-b hover:bg-gray-50">
                                <td className="py-3">
                                  <div className="font-medium text-gray-900">{r.etudiant?.nom} {r.etudiant?.prenom}</div>
                                  <div className="text-xs text-gray-500">{r.etudiant?.email}</div>
                                </td>
                                <td className="py-3 text-sm text-gray-600">
                                  {r.creneau?.enseignant?.user?.nom} {r.creneau?.enseignant?.user?.prenom}
                                </td>
                                <td className="py-3 font-medium text-green-600">{r.montant} DH</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.statut === 'confirmee' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {r.statut === 'confirmee' ? 'Confirmée' : r.statut}
                                  </span>
                                </td>
                                <td className="py-3 text-sm text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab : paiements */}
              {ongletActif === 'paiements' && (
                <div className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Paiements ({paiements.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Montant</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Commission</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Statut</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paiements.length === 0 ? (
                          <tr><td colSpan="4" className="text-center py-8 text-gray-400">Aucun paiement</td></tr>
                        ) : (
                          paiements.map(function(p) {
                            return (
                              <tr key={p.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 font-medium text-green-600">{p.montant} DH</td>
                                <td className="py-3 text-gray-600">{p.comission || 0} DH</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.statut === 'paye' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {p.statut === 'paye' ? 'Payé' : 'En attente'}
                                  </span>
                                </td>
                                <td className="py-3 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab : users */}
              {ongletActif === 'users' && (
                <div className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Utilisateurs ({users.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Nom</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Rôle</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr><td colSpan="4" className="text-center py-8 text-gray-400">Aucun utilisateur</td></tr>
                        ) : (
                          users.map(function(u) {
                            return (
                              <tr key={u.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 font-medium text-gray-900">{u.prenom} {u.nom}</td>
                                <td className="py-3 text-sm text-gray-600">{u.email}</td>
                                <td className="py-3">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{u.role}</span>
                                </td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.statut === 'actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {u.statut === 'actif' ? 'Actif' : 'Bloqué'}
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

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}