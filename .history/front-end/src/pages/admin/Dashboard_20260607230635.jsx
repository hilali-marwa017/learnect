import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

Chart.register(...registerables);

const API_URL = 'http://localhost:8000/api';

function AdminDashboard() {
  const [ongletActif, setOngletActif] = useState('stats');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [statistiques, setStatistiques] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalAvis: 0,
    revenusTotal: 0,
    historiqueReservations: [],
    historiqueCommissions: []
  });
  const [enseignantsEnAttente, setEnseignantsEnAttente] = useState([]);
  const [listeSignalements, setListeSignalements] = useState([]);
  const [listeUtilisateurs, setListeUtilisateurs] = useState([]);

  const graphiqueUtilisateursRef = useRef(null);
  const graphiqueRevenusRef = useRef(null);
  const instanceGraphiqueUtilisateurs = useRef(null);
  const instanceGraphiqueRevenus = useRef(null);

  useEffect(() => {
    chargerDonnees();
  }, []);

  useEffect(() => {
    if (ongletActif === 'stats' && !chargement && !erreur && statistiques.historiqueReservations.length > 0) {
      setTimeout(() => initialiserGraphiques(), 100);
    }
    return () => detruireGraphiques();
  }, [ongletActif, chargement, statistiques]);

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  });

  function detruireGraphiques() {
    if (instanceGraphiqueUtilisateurs.current) {
      instanceGraphiqueUtilisateurs.current.destroy();
      instanceGraphiqueUtilisateurs.current = null;
    }
    if (instanceGraphiqueRevenus.current) {
      instanceGraphiqueRevenus.current.destroy();
      instanceGraphiqueRevenus.current = null;
    }
  }

  function initialiserGraphiques() {
    detruireGraphiques();

    // Graphique Donut - Répartition Élèves/Tuteurs (amélioré)
    if (graphiqueUtilisateursRef.current && (statistiques.totalEtudiants > 0 || statistiques.totalEnseignants > 0)) {
      const ctx = graphiqueUtilisateursRef.current.getContext('2d');
      instanceGraphiqueUtilisateurs.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['👨‍🎓 Élèves', '👨‍🏫 Tuteurs'],
          datasets: [{
            data: [statistiques.totalEtudiants, statistiques.totalEnseignants],
            backgroundColor: ['#3b82f6', '#10b981'],
            borderWidth: 0,
            hoverOffset: 0,
            cutout: '60%'
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
                font: { size: 12, weight: '500' },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: { 
              enabled: true,
              backgroundColor: '#1e293b',
              titleColor: '#ffffff',
              bodyColor: '#cbd5e1',
              padding: 10,
              cornerRadius: 8
            }
          }
        }
      });
    }

    // Graphique Barres - Réservations & Commissions (amélioré)
    if (graphiqueRevenusRef.current && statistiques.historiqueReservations.length > 0) {
      const ctx = graphiqueRevenusRef.current.getContext('2d');
      instanceGraphiqueRevenus.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [
            {
              label: '📅 Réservations',
              data: statistiques.historiqueReservations,
              backgroundColor: '#3b82f6',
              borderRadius: 8,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            },
            {
              label: '💰 Commissions (DH)',
              data: statistiques.historiqueCommissions,
              backgroundColor: '#10b981',
              borderRadius: 8,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: false,
          plugins: {
            legend: { 
              position: 'top',
              labels: {
                font: { size: 11, weight: '500' },
                padding: 12,
                usePointStyle: true,
                pointStyle: 'rectRounded'
              }
            },
            tooltip: { 
              enabled: true,
              backgroundColor: '#1e293b',
              titleColor: '#ffffff',
              bodyColor: '#cbd5e1',
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  let value = context.raw;
                  if (context.dataset.label.includes('Commissions')) {
                    return `${label}: ${value.toLocaleString()} DH`;
                  }
                  return `${label}: ${value}`;
                }
              }
            }
          },
          scales: {
            y: { 
              beginAtZero: true, 
              grid: { color: '#e2e8f0', drawBorder: true, lineWidth: 0.5 },
              title: {
                display: true,
                text: 'Nombre / Montant (DH)',
                color: '#64748b',
                font: { size: 11, weight: '400' }
              },
              ticks: { 
                stepSize: 5,
                callback: function(value) {
                  return value.toLocaleString();
                }
              }
            },
            x: { 
              grid: { display: false },
              title: {
                display: true,
                text: 'Mois',
                color: '#64748b',
                font: { size: 11, weight: '400' }
              }
            }
          }
        }
      });
    }
  }

  async function chargerDonnees() {
    setChargement(true);
    setErreur(null);
    try {
      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/enseignants/attente`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/signalements`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/users`, { headers: getHeaders() })
      ]);

      if (!statsRes.ok || !teachersRes.ok || !signalementsRes.ok || !usersRes.ok) {
        throw new Error('Erreur de chargement');
      }

      const statsData = await statsRes.json();
      setStatistiques({
        totalEtudiants: statsData.total_etudiants || 0,
        totalEnseignants: statsData.total_enseignants || 0,
        totalReservations: statsData.total_reservations || 0,
        totalAvis: statsData.total_avis || 0,
        revenusTotal: statsData.revenus_total || 0,
        historiqueReservations: statsData.historique_reservations || [],
        historiqueCommissions: statsData.historique_commissions || []
      });

      setEnseignantsEnAttente(await teachersRes.json());
      setListeSignalements(await signalementsRes.json());
      setListeUtilisateurs(await usersRes.json());

    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  async function rafraichirUtilisateurs() {
    try {
      const res = await fetch(`${API_URL}/admin/users`, { headers: getHeaders() });
      if (res.ok) setListeUtilisateurs(await res.json());
      const teachersRes = await fetch(`${API_URL}/admin/enseignants/attente`, { headers: getHeaders() });
      if (teachersRes.ok) setEnseignantsEnAttente(await teachersRes.json());
    } catch (err) {
      console.error(err);
    }
  }

  if (chargement) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Chargement...</p>
      </div>
    );
  }

  const commissionTotale = statistiques.revenusTotal;
  const commissionMoyenneParReservation = statistiques.totalReservations > 0 
    ? (commissionTotale / statistiques.totalReservations).toFixed(2) 
    : 0;
  const tauxRemplissage = statistiques.totalEnseignants > 0 
    ? ((statistiques.totalEtudiants / statistiques.totalEnseignants) * 10).toFixed(1) 
    : 0;
  const revenuParTuteur = statistiques.totalEnseignants > 0 
    ? (commissionTotale / statistiques.totalEnseignants).toFixed(2) 
    : 0;
  const commissionPlateforme = (commissionTotale * 0.1).toFixed(2);
  const revenuEnseignants = (commissionTotale * 0.9).toFixed(2);

  const listeCartes = [
    { 
      libelle: 'Total Élèves', 
      valeur: statistiques.totalEtudiants, 
      icone: 'bi-people',
      detail: `Moyenne ${tauxRemplissage} élèves/tuteur`,
      couleur: '#3b82f6'
    },
    { 
      libelle: 'Total Tuteurs', 
      valeur: statistiques.totalEnseignants, 
      icone: 'bi-briefcase',
      detail: `${revenuParTuteur} DH/tuteur`,
      couleur: '#10b981'
    },
    { 
      libelle: 'Réservations', 
      valeur: statistiques.totalReservations, 
      icone: 'bi-calendar-check',
      detail: `${commissionMoyenneParReservation} DH/réservation`,
      couleur: '#f59e0b'
    },
    { 
      libelle: 'Commissions', 
      valeur: `${commissionTotale} DH`, 
      icone: 'bi-cash-stack',
      detail: `Plateforme: ${commissionPlateforme} DH | Enseignants: ${revenuEnseignants} DH`,
      couleur: '#8b5cf6'
    }
  ];

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container-xl">
        {/* Header */}
        <div className="rounded-4 text-white p-4 mb-4" style={{ background: '#0f172a' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 rounded-3" style={{ background: '#1e293b' }}>
              <i className="bi bi-shield-check fs-5"></i>
            </div>
            <div>
              <span className="badge rounded-pill text-white mb-1" style={{ background: '#1e293b' }}>CONSOLE ADMIN</span>
              <h1 className="fs-5 fw-bold mb-0">Learnect Back-office</h1>
            </div>
          </div>
        </div>

        {/* Erreur */}
        {erreur && (
          <div className="alert alert-danger mb-4">{erreur}</div>
        )}

        {/* Tabs */}
        <div className="mb-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div className="d-flex gap-4">
            <button onClick={() => setOngletActif('stats')} style={{ border: 'none', background: 'none', padding: '12px 0', fontWeight: ongletActif === 'stats' ? '600' : '400', color: ongletActif === 'stats' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'stats' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Statistiques</button>
            <button onClick={() => setOngletActif('teachers')} style={{ border: 'none', background: 'none', padding: '12px 0', fontWeight: ongletActif === 'teachers' ? '600' : '400', color: ongletActif === 'teachers' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'teachers' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Vérification ({enseignantsEnAttente.length})</button>
            <button onClick={() => setOngletActif('reports')} style={{ border: 'none', background: 'none', padding: '12px 0', fontWeight: ongletActif === 'reports' ? '600' : '400', color: ongletActif === 'reports' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'reports' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Signalements ({listeSignalements.length})</button>
            <button onClick={() => setOngletActif('users')} style={{ border: 'none', background: 'none', padding: '12px 0', fontWeight: ongletActif === 'users' ? '600' : '400', color: ongletActif === 'users' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'users' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Utilisateurs ({listeUtilisateurs.length})</button>
          </div>
        </div>

        {/* Stats Tab */}
        {ongletActif === 'stats' && (
          <div>
            {/* Cards KPI */}
            <div className="row g-3 mb-4">
              {listeCartes.map((carte, index) => (
                <div className="col-md-3" key={index}>
                  <div className="card border-0 shadow-sm p-3 text-center" style={{ transition: 'none', borderTop: `3px solid ${carte.couleur}` }}>
                    <i className={`bi ${carte.icone} fs-2 mb-2`} style={{ color: carte.couleur }}></i>
                    <div className="text-muted small mb-1">{carte.libelle}</div>
                    <div className="fs-2 fw-bold text-dark">{carte.valeur}</div>
                    <div className="text-muted small mt-2">{carte.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Graphs */}
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <div className="card border-0 shadow-sm p-4">
                  <h6 className="fw-bold mb-3 text-center">
                    <i className="bi bi-pie-chart text-primary me-2"></i>
                    Répartition Élèves / Tuteurs
                  </h6>
                  <div style={{ height: '300px' }}>
                    <canvas ref={graphiqueUtilisateursRef} style={{ width: '100%', height: '100%' }}></canvas>
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="card border-0 shadow-sm p-4">
                  <h6 className="fw-bold mb-3 text-center">
                    <i className="bi bi-bar-chart-steps text-primary me-2"></i>
                    Réservations & Commissions mensuelles
                  </h6>
                  <div style={{ height: '300px' }}>
                    <canvas ref={graphiqueRevenusRef} style={{ width: '100%', height: '100%' }}></canvas>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="card border-0 shadow-sm p-4">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-info-circle-fill text-primary me-2"></i>
                SUIVI DES FLUX FINANCIERS
              </h6>
              <div className="bg-light p-3 rounded-3 small">
                <p className="mb-2">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  <strong>10%</strong> de commission pour la plateforme, <strong>90%</strong> pour l'enseignant.
                </p>
                <p className="mb-0">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  Modération instantanée visible globalement sur tout le site.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {ongletActif === 'teachers' && (
          <ValidatedTeachers pendingTeachers={enseignantsEnAttente} onRefresh={rafraichirUtilisateurs} />
        )}
        {ongletActif === 'reports' && (
          <Signalements signalements={listeSignalements} onRefresh={rafraichirUtilisateurs} />
        )}
        {ongletActif === 'users' && (
          <ManageUsers users={listeUtilisateurs} onRefresh={rafraichirUtilisateurs} />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;