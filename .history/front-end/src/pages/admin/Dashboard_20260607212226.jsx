import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

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

  useEffect(() => {
    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    setChargement(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/stats', { headers }),
        fetch('http://localhost:8000/api/admin/enseignantsEnAttente', { headers }),
        fetch('http://localhost:8000/api/admin/signalements', { headers }),
        fetch('http://localhost:8000/api/admin/Users', { headers })
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStatistiques({
          totalEtudiants: data.total_etudiants || 0,
          totalEnseignants: data.total_enseignants || 0,
          totalReservations: data.total_reservations || 0,
          totalAvis: data.total_avis || 0,
          revenusTotal: data.revenus_total || 0
        });
      }
      if (teachersRes.ok) setEnseignantsEnAttente(await teachersRes.json());
      if (signalementsRes.ok) setListeSignalements(await signalementsRes.json());
      if (usersRes.ok) setListeUtilisateurs(await usersRes.json());
    } catch (erreur) {
      console.error(erreur);
    } finally {
      setChargement(false);
    }
  }

  const donneesGraphiqueUtilisateurs = {
    labels: ['Élèves', 'Tuteurs'],
    datasets: [{
      data: [statistiques.totalEtudiants, statistiques.totalEnseignants],
      backgroundColor: ['#3b82f6', '#0f172a'],
      borderWidth: 0
    }]
  };

  const donneesGraphiqueRevenus = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
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
  };

  const optionsGraphique = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true }
    }
  };

  if (chargement) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Chargement...</p>
      </div>
    );
  }

  const listeCartes = [
    { libelle: 'Total Élèves', valeur: statistiques.totalEtudiants, couleur: 'text-dark' },
    { libelle: 'Total Tuteurs', valeur: statistiques.totalEnseignants, couleur: 'text-dark' },
    { libelle: 'Réservations', valeur: statistiques.totalReservations, couleur: 'text-dark' },
    { libelle: 'Commissions', valeur: `${statistiques.revenusTotal} DH`, couleur: 'text-primary' }
  ];

  const listeOnglets = [
    { cle: 'stats', icone: 'bi-graph-up', libelle: 'Statistiques' },
    { cle: 'teachers', icone: 'bi-files', libelle: `Vérification (${enseignantsEnAttente.length})` },
    { cle: 'reports', icone: 'bi-exclamation-triangle', libelle: `Signalements (${listeSignalements.length})` },
    { cle: 'users', icone: 'bi-people', libelle: `Utilisateurs (${listeUtilisateurs.length})` }
  ];

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container-xl">

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

        {ongletActif === 'stats' && (
          <div>
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

            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <div className="card border-0 shadow-sm p-4 text-center">
                  <h6 className="fw-bold mb-3">Répartition des utilisateurs</h6>
                  <div style={{ height: '250px' }}>
                    <Doughnut data={donneesGraphiqueUtilisateurs} options={optionsGraphique} />
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="card border-0 shadow-sm p-4">
                  <h6 className="fw-bold mb-3">Activité mensuelle</h6>
                  <div style={{ height: '300px' }}>
                    <Bar data={donneesGraphiqueRevenus} options={optionsGraphique} />
                  </div>
                </div>
              </div>
            </div>

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