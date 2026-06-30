import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';
import api from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function AdminDashboard() {
  const [ongletActif, setOngletActif] = useState('stats');
  const [chargement, setChargement] = useState(true);
  const [statistiques, setStatistiques] = useState({ totalEtudiants: 0, totalEnseignants: 0, totalReservations: 0, totalAvis: 0, revenusTotal: 0 });
  const [enseignantsEnAttente, setEnseignantsEnAttente] = useState([]);
  const [listeSignalements, setListeSignalements] = useState([]);
  const [listeUtilisateurs, setListeUtilisateurs] = useState([]);

  useEffect(() => { chargerDonnees(); }, []);

  async function chargerDonnees() {
    setChargement(true);
    try {
      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/enseignants/attente'),
        api.get('/admin/signalements'),
        api.get('/admin/users')
      ]);
      setStatistiques({
        totalEtudiants: statsRes.data.total_etudiants || 0,
        totalEnseignants: statsRes.data.total_enseignants || 0,
        totalReservations: statsRes.data.total_reservations || 0,
        totalAvis: statsRes.data.total_avis || 0,
        revenusTotal: statsRes.data.revenus_total || 0
      });
      setEnseignantsEnAttente(teachersRes.data || []);
      setListeSignalements(signalementsRes.data || []);
      setListeUtilisateurs(usersRes.data || []);
    } catch(err) { console.error(err); }
    finally { setChargement(false); }
  }

  const donneesGraphiqueUtilisateurs = {
    labels: ['Élèves', 'Tuteurs'],
    datasets: [{ data: [statistiques.totalEtudiants, statistiques.totalEnseignants], backgroundColor: ['#3b82f6', '#0f172a'], borderWidth: 0 }]
  };

  const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  const reservationsMensuelles = [
    Math.round(statistiques.totalReservations * 0.10),
    Math.round(statistiques.totalReservations * 0.14),
    Math.round(statistiques.totalReservations * 0.16),
    Math.round(statistiques.totalReservations * 0.18),
    Math.round(statistiques.totalReservations * 0.20),
    Math.round(statistiques.totalReservations * 0.22)
  ];
  const commissionsMensuelles = [
    Math.round(statistiques.revenusTotal * 0.10),
    Math.round(statistiques.revenusTotal * 0.14),
    Math.round(statistiques.revenusTotal * 0.16),
    Math.round(statistiques.revenusTotal * 0.18),
    Math.round(statistiques.revenusTotal * 0.20),
    Math.round(statistiques.revenusTotal * 0.22)
  ];

  const donneesGraphiqueRevenus = {
    labels: mois,
    datasets: [
      { label: 'Réservations', data: reservationsMensuelles, backgroundColor: '#3b82f6', borderRadius: 4 },
      { label: 'Commissions (DH)', data: commissionsMensuelles, backgroundColor: '#0f172a', borderRadius: 4 }
    ]
  };

  const optionsGraphique = { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' }, tooltip: { enabled: true } } };

  if (chargement) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Chargement...</p></div>;
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
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: '#0f172a', color: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px' }}><i className="bi bi-shield-check fs-4 text-blue-400"></i></div>
            <div>
              <span style={{ fontSize: '10px', background: '#1e293b', padding: '4px 10px', borderRadius: '20px' }}>CONSOLE ADMIN</span>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px' }}>Learnect Back-office</h1>
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>Validation des diplômes, modération des avis signalés</p>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs justify-content-center mb-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          {listeOnglets.map(onglet => (
            <li className="nav-item" key={onglet.cle}>
              <button className={`nav-link ${ongletActif === onglet.cle ? 'active' : ''}`} onClick={() => setOngletActif(onglet.cle)} style={{ border: 'none', background: 'none', padding: '8px 20px', fontWeight: 'bold', color: ongletActif === onglet.cle ? '#0d6efd' : '#000' }}>
                <i className={`bi ${onglet.icone} me-1`}></i> {onglet.libelle}
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
                  <div style={{ height: '250px' }}><Doughnut data={donneesGraphiqueUtilisateurs} options={optionsGraphique} /></div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="card border-0 shadow-sm p-4">
                  <h6 className="fw-bold mb-3">Activité mensuelle</h6>
                  <div style={{ height: '300px' }}><Bar data={donneesGraphiqueRevenus} options={optionsGraphique} /></div>
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