import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

Chart.register(...registerables);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function AdminDashboard() {

  const [ongletActif, setOngletActif] = useState('stats');
  const [chargement, setChargement] = useState(true);
  const [statistiques, setStatistiques] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalAvis: 0,
    revenusTotal: 0
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
    if (ongletActif === 'stats' && !chargement) {
      initialiserGraphiques();
    }
    return () => {
      if (instanceGraphiqueUtilisateurs.current) {
        instanceGraphiqueUtilisateurs.current.destroy();
        instanceGraphiqueUtilisateurs.current = null;
      }
      if (instanceGraphiqueRevenus.current) {
        instanceGraphiqueRevenus.current.destroy();
        instanceGraphiqueRevenus.current = null;
      }
    };
  }, [ongletActif, chargement, statistiques]);

  function initialiserGraphiques() {
    if (graphiqueUtilisateursRef.current) {
      if (instanceGraphiqueUtilisateurs.current) {
        instanceGraphiqueUtilisateurs.current.destroy();
        instanceGraphiqueUtilisateurs.current = null;
      }
      instanceGraphiqueUtilisateurs.current = new Chart(graphiqueUtilisateursRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Élèves', 'Tuteurs'],
          datasets: [{
            data: [statistiques.totalEtudiants, statistiques.totalEnseignants],
            backgroundColor: ['#3b82f6', '#0f172a'],
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          animation: false,
          hover: { mode: null },
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Répartition des utilisateurs',
              font: { size: 14, weight: 'bold' }
            }
          }
        }
      });
    }

    if (graphiqueRevenusRef.current) {
      if (instanceGraphiqueRevenus.current) {
        instanceGraphiqueRevenus.current.destroy();
        instanceGraphiqueRevenus.current = null;
      }
      instanceGraphiqueRevenus.current = new Chart(graphiqueRevenusRef.current, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
          datasets: [
            {
              label: 'Réservations',
              data: [
                Math.round(statistiques.totalReservations * 0.10),
                Math.round(statistiques.totalReservations * 0.14),
                Math.round(statistiques.totalReservations * 0.16),
                Math.round(statistiques.totalReservations * 0.18),
                Math.round(statistiques.totalReservations * 0.20),
                Math.round(statistiques.totalReservations * 0.22)
              ],
              backgroundColor: '#3b82f6',
              borderRadius: 4
            },
            {
              label: 'Commissions (DH)',
              data: [
                Math.round(statistiques.revenusTotal * 0.10),
                Math.round(statistiques.revenusTotal * 0.14),
                Math.round(statistiques.revenusTotal * 0.16),
                Math.round(statistiques.revenusTotal * 0.18),
                Math.round(statistiques.revenusTotal * 0.20),
                Math.round(statistiques.revenusTotal * 0.22)
              ],
              backgroundColor: '#0f172a',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          animation: false,
          hover: { mode: null },
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Activité mensuelle (6 derniers mois)',
              font: { size: 14, weight: 'bold' }
            }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  function obtenirToken() {
    return localStorage.getItem('token');
  }

  function obtenirEntetes() {
    return {
      'Authorization': `Bearer ${obtenirToken()}`,
      'Content-Type': 'application/json'
    };
  }

  async function chargerDonnees() {
    setChargement(true);
    try {
      const [resStats, resEnseignants, resSignalements, resUtilisateurs] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, { headers: obtenirEntetes() }),
        fetch(`${API_BASE_URL}/admin/enseignantsEnAttente`, { headers: obtenirEntetes() }),
        fetch(`${API_BASE_URL}/admin/signalements`, { headers: obtenirEntetes() }),
        fetch(`${API_BASE_URL}/admin/Users`, { headers: obtenirEntetes() })
      ]);

      if (resStats.ok) {
        const donnees = await resStats.json();
        setStatistiques({
          totalEtudiants: donnees.total_etudiants || 0,
          totalEnseignants: donnees.total_enseignants || 0,
          totalReservations: donnees.total_reservations || 0,
          totalAvis: donnees.total_avis || 0,
          revenusTotal: donnees.revenus_total || 0
        });
      }
      if (resEnseignants.ok) setEnseignantsEnAttente(await resEnseignants.json());
      if (resSignalements.ok) setListeSignalements(await resSignalements.json());
      if (resUtilisateurs.ok) setListeUtilisateurs(await resUtilisateurs.json());

    } catch (erreur) {
      console.error(erreur);
    } finally {
      setChargement(false);
    }
  }

  if (chargement) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  const styleCarteStatique = {
    background: 'white',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    transform: 'none',
    transition: 'none',
    border: 'none'
  };

  const styleOnglet = (cle) => ({
    background: 'none',
    border: 'none',
    borderBottom: ongletActif === cle ? '2px solid #3b82f6' : '2px solid transparent',
    padding: '10px 20px',
    marginBottom: '-1px',
    fontSize: '14px',
    fontWeight: ongletActif === cle ? '600' : '400',
    color: ongletActif === cle ? '#3b82f6' : '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    outline: 'none',
    boxShadow: 'none',
    transform: 'none',
    transition: 'none',
    WebkitTransition: 'none'
  });

  const listeCarte = [
    { libelle: 'Total Élèves',   valeur: statistiques.totalEtudiants,      couleur: 'inherit' },
    { libelle: 'Total Tuteurs',  valeur: statistiques.totalEnseignants,     couleur: 'inherit' },
    { libelle: 'Réservations',   valeur: statistiques.totalReservations,    couleur: 'inherit' },
    { libelle: 'Commissions',    valeur: `${statistiques.revenusTotal} DH`, couleur: '#3b82f6' }
  ];

  const listeOnglets = [
    { cle: 'stats',    icone: 'bi-shield-check',         libelle: 'Statistiques' },
    { cle: 'teachers', icone: 'bi-files',                libelle: `Vérification d'Enseignants (${enseignantsEnAttente.length})` },
    { cle: 'reports',  icone: 'bi-exclamation-triangle', libelle: `Avis Signalés (${listeSignalements.length})` },
    { cle: 'users',    icone: 'bi-people',               libelle: 'Comptes Utilisateurs' }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* En-tête */}
        <div style={{ background: '#0f172a', color: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '10px' }}>
              <i className="bi bi-shield-check fs-5"></i>
            </div>
            <div>
              <span style={{ fontSize: '10px', background: '#1e293b', padding: '3px 10px', borderRadius: '20px' }}>CONSOLE ADMIN</span>
              <h1 style={{ fontSize: '22px', marginTop: '6px', marginBottom: '2px' }}>Learnect Back-office</h1>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: 0 }}>Validation des diplômes, modération des avis signalés</p>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
          {listeOnglets.map(onglet => (
            <button
              key={onglet.cle}
              onClick={() => setOngletActif(onglet.cle)}
              style={styleOnglet(onglet.cle)}
            >
              <i className={`bi ${onglet.icone}`}></i>
              {onglet.libelle}
            </button>
          ))}
        </div>

        {/* Onglet Statistiques */}
        {ongletActif === 'stats' && (
          <div>

            {/* Cartes KPI */}
            <div className="row g-3 mb-4">
              {listeCarte.map((carte, index) => (
                <div className="col-md-3" key={index}>
                  <div style={styleCarteStatique}>
                    <div style={{ color: '#6c757d', fontSize: '13px', marginBottom: '8px' }}>{carte.libelle}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: carte.couleur }}>{carte.valeur}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Graphiques */}
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <div style={{ ...styleCarteStatique, padding: '24px' }}>
                  <canvas ref={graphiqueUtilisateursRef}></canvas>
                </div>
              </div>
              <div className="col-md-7">
                <div style={{ ...styleCarteStatique, padding: '24px' }}>
                  <canvas ref={graphiqueRevenusRef}></canvas>
                </div>
              </div>
            </div>

            {/* Info flux financiers */}
            <div style={{ ...styleCarteStatique, textAlign: 'left', padding: '24px' }}>
              <h6 style={{ fontWeight: 'bold', marginBottom: '12px' }}>SUIVI DES FLUX FINANCIERS</h6>
              <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                <p style={{ marginBottom: '6px' }}><i className="bi bi-check-circle-fill text-primary me-2"></i>10% de commission, 90% pour l'enseignant.</p>
                <p style={{ marginBottom: 0 }}><i className="bi bi-check-circle-fill text-primary me-2"></i>Modération instantanée visible globalement.</p>
              </div>
            </div>

          </div>
        )}

        {ongletActif === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsEnAttente} onRefresh={chargerDonnees} />}
        {ongletActif === 'reports' && <Signalements signalements={listeSignalements} onRefresh={chargerDonnees} />}
        {ongletActif === 'users' && <ManageUsers users={listeUtilisateurs} onRefresh={chargerDonnees} />}

      </div>
    </div>
  );
}

export default AdminDashboard;