import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';
import {
  obtenirStatistiques,
  obtenirEnseignantsEnAttente,
  obtenirSignalements,
  obtenirUtilisateurs
} from '../../services/api';

Chart.register(...registerables);

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

  async function chargerDonnees() {
    setChargement(true);
    try {
      const [donneeStats, donneeEnseignants, donneeSignalements, donneeUtilisateurs] = await Promise.all([
        obtenirStatistiques(),
        obtenirEnseignantsEnAttente(),
        obtenirSignalements(),
        obtenirUtilisateurs()
      ]);

      setStatistiques({
        totalEtudiants: donneeStats.total_etudiants || 0,
        totalEnseignants: donneeStats.total_enseignants || 0,
        totalReservations: donneeStats.total_reservations || 0,
        totalAvis: donneeStats.total_avis || 0,
        revenusTotal: donneeStats.revenus_total || 0
      });

      setEnseignantsEnAttente(donneeEnseignants);
      setListeSignalements(donneeSignalements);
      setListeUtilisateurs(donneeUtilisateurs);

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
        <p className="mt-2">Chargement...</p>
      </div>
    );
  }

  const listeCartes = [
    { libelle: 'Total Élèves',  valeur: statistiques.totalEtudiants,      couleur: 'text-dark' },
    { libelle: 'Total Tuteurs', valeur: statistiques.totalEnseignants,     couleur: 'text-dark' },
    { libelle: 'Réservations',  valeur: statistiques.totalReservations,    couleur: 'text-dark' },
    { libelle: 'Commissions',   valeur: `${statistiques.revenusTotal} DH`, couleur: 'text-primary' }
  ];

  const listeOnglets = [
    { cle: 'stats',    icone: 'bi-shield-check',         libelle: 'Statistiques' },
    { cle: 'teachers', icone: 'bi-files',                libelle: `Vérification d'Enseignants (${enseignantsEnAttente.length})` },
    { cle: 'reports',  icone: 'bi-exclamation-triangle', libelle: `Avis Signalés (${listeSignalements.length})` },
    { cle: 'users',    icone: 'bi-people',               libelle: `Comptes Utilisateurs (${listeUtilisateurs.length})` }
  ];

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container-xl">

        {/* En-tête */}
        <div className="rounded-4 text-white p-4 mb-4" style={{ background: '#0f172a' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 rounded-3" style={{ background: '#1e293b' }}>
              <i className="bi bi-shield-check fs-5"></i>
            </div>
            <div>
              <span className="badge rounded-pill text-white mb-1" style={{ background: '#1e293b', fontSize: '10px' }}>CONSOLE ADMIN</span>
              <h1 className="fs-5 fw-bold mb-0">Learnect Back-office</h1>
              <p className="text-secondary mb-0" style={{ fontSize: '12px' }}>Validation des diplômes, modération des avis signalés</p>
            </div>
          </div>
        </div>

        {/* Onglets Bootstrap nav-tabs */}
        <ul className="nav nav-tabs justify-content-center mb-4">
          {listeOnglets.map(onglet => (
            <li className="nav-item" key={onglet.cle}>
              <button
                className={`nav-link ${ongletActif === onglet.cle ? 'active' : ''}`}
                onClick={() => setOngletActif(onglet.cle)}
              >
                <i className={`bi ${onglet.icone} me-1`}></i>
                {onglet.libelle}
              </button>
            </li>
          ))}
        </ul>

        {/* Onglet Statistiques */}
        {ongletActif === 'stats' && (
          <div>

            {/* Cartes KPI */}
            <div className="row g-3 mb-4">
              {listeCartes.map((carte, index) => (
                <div className="col-md-3" key={index}>
                  <div className="card border-0 shadow-sm p-3 text-center">
                    <div className="text-muted small mb-2">{carte.libelle}</div>
                    <div className={`fs-2 fw-bold ${carte.couleur}`}>{carte.valeur}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Graphiques */}
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <div className="card border-0 shadow-sm p-4">
                  <canvas ref={graphiqueUtilisateursRef}></canvas>
                </div>
              </div>
              <div className="col-md-7">
                <div className="card border-0 shadow-sm p-4">
                  <canvas ref={graphiqueRevenusRef}></canvas>
                </div>
              </div>
            </div>

            {/* Info flux financiers */}
            <div className="card border-0 shadow-sm p-4">
              <h6 className="fw-bold mb-3">SUIVI DES FLUX FINANCIERS</h6>
              <div className="bg-light p-3 rounded small">
                <p className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>10% de commission, 90% pour l'enseignant.</p>
                <p className="mb-0"><i className="bi bi-check-circle-fill text-primary me-2"></i>Modération instantanée visible globalement.</p>
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