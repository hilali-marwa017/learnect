import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

Chart.register(...registerables);

const API_URL = 'http://localhost:8000/api';

function AdminDashboard() {
  const [ongletActif, setOngletActif] = useState('stats');
  const [erreur, setErreur] = useState(null);
  const [statistiques, setStatistiques] = useState({
    totalEtudiants: 0,
    totalEnseignants: 4,
    totalReservations: 0,
    totalAvis: 0,
    revenusTotal: 0,
    historiqueReservations: [12, 19, 15, 17, 14, 18],
    historiqueCommissions: [120, 190, 150, 170, 140, 180]
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
    if (ongletActif === 'stats') {
      setTimeout(() => initialiserGraphiques(), 100);
    }
    return () => detruireGraphiques();
  }, [ongletActif, statistiques]);

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

    if (graphiqueUtilisateursRef.current) {
      const ctx = graphiqueUtilisateursRef.current.getContext('2d');
      instanceGraphiqueUtilisateurs.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Élèves', 'Tuteurs'],
          datasets: [{
            data: [statistiques.totalEtudiants, statistiques.totalEnseignants],
            backgroundColor: ['#3b82f6', '#0f172a'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    if (graphiqueRevenusRef.current) {
      const ctx = graphiqueRevenusRef.current.getContext('2d');
      instanceGraphiqueRevenus.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [
            {
              label: 'Réservations',
              data: statistiques.historiqueReservations,
              backgroundColor: '#3b82f6',
              borderRadius: 4
            },
            {
              label: 'Commissions (DH)',
              data: statistiques.historiqueCommissions,
              backgroundColor: '#0f172a',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: false,
          plugins: { legend: { position: 'bottom' } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  async function chargerDonnees() {
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
        totalEnseignants: statsData.total_enseignants || 4,
        totalReservations: statsData.total_reservations || 0,
        totalAvis: statsData.total_avis || 0,
        revenusTotal: statsData.revenus_total || 0,
        historiqueReservations: statsData.historique_reservations || [12, 19, 15, 17, 14, 18],
        historiqueCommissions: statsData.historique_commissions || [120, 190, 150, 170, 140, 180]
      });

      setEnseignantsEnAttente(await teachersRes.json());
      setListeSignalements(await signalementsRes.json());
      setListeUtilisateurs(await usersRes.json());

    } catch (err) {
      setErreur(err.message);
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

  // ========== CALCULS DYNAMIQUES ==========
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
  const reservationParTuteur = statistiques.totalEnseignants > 0 
    ? (statistiques.totalReservations / statistiques.totalEnseignants).toFixed(1) 
    : 0;

  const listeCartes = [
    { 
      libelle: 'Total Élèves', 
      valeur: statistiques.totalEtudiants, 
      icone: 'bi-people',
      detail: `Moyenne ${tauxRemplissage} élèves/tuteur`
    },
    { 
      libelle: 'Total Tuteurs', 
      valeur: statistiques.totalEnseignants, 
      icone: 'bi-briefcase',
      detail: `${revenuParTuteur} DH/tuteur | ${reservationParTuteur} réservations/tuteur`
    },
    { 
      libelle: 'Réservations', 
      valeur: statistiques.totalReservations, 
      icone: 'bi-calendar-check',
      detail: `${commissionMoyenneParReservation} DH/réservation`
    },
    { 
      libelle: 'Commissions', 
      valeur: `${commissionTotale} DH`, 
      icone: 'bi-cash-stack',
      detail: `Platforme: ${commissionPlateforme} DH | Enseignants: ${revenuEnseignants} DH`
    }
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
              <span className="badge rounded-pill text-white mb-1" style={{ background: '#1e293b' }}>CONSOLE ADMIN</span>
              <h1 className="fs-5 fw-bold mb-0">Learnect Back-office</h1>
            </div>
          </div>
        </div>

        {erreur && (
          <div className="alert alert-danger mb-4">{erreur}</div>
        )}

        <div className="mb-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div className="d-flex gap-4">
            <button onClick={() => setOngletActif('stats')} style={{ border: 'none', background: 'none', padding: '12px 0', fontWeight: ongletActif === 'stats' ? '600' : '400', color: ongletActif === 'stats' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'stats' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Statistiques</button>
            <button onClick={() => setOngletActif('teachers')} style={{ border: 'none', background: 'none', padding: '12px 0', fontWeight: ongletActif === 'teachers' ? '600' : '400', color: ongletActif === 'teachers' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'teachers' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Vérification ({enseignantsEnAttente.length})</button>
            <button onClick={() => setOngletActif('reports')} style={{ border: 'none', background: 'none', padding: '12px 0', fontWeight: ongletActif === 'reports' ? '600' : '400', color: ongletActif === 'reports' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'reports' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Signalements ({listeSignalements.length})</button>
            <button onClick={() => setOngletActif('users')} style={{ border: 'none', background: 'none', padding: '12px 0', fontWeight: ongletActif === 'users' ? '600' : '400', color: ongletActif === 'users' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'users' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Utilisateurs ({listeUtilisateurs.length})</button>
          </div>
        </div>

        {ongletActif === 'stats' && (
          <div>
            <div className="row g-3 mb-4">
              {listeCartes.map((carte, index) => (
                <div className="col-md-3" key={index}>
                  <div className="card border-0 shadow-sm p-3 text-center">
                    <i className={`bi ${carte.icone} fs-2 text-primary mb-2`}></i>
                    <div className="text-muted small mb-1">{carte.libelle}</div>
                    <div className="fs-2 fw-bold text-dark">{carte.valeur}</div>
                    <div className="text-muted small mt-2">{carte.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <div className="card border-0 shadow-sm p-4">
                  <h6 className="fw-bold mb-3 text-center">Répartition Élèves / Tuteurs</h6>
                  <div style={{ height: '280px' }}>
                    <canvas ref={graphiqueUtilisateursRef} style={{ width: '100%', height: '100%' }}></canvas>
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="card border-0 shadow-sm p-4">
                  <h6 className="fw-bold mb-3 text-center">Réservations & Commissions</h6>
                  <div style={{ height: '280px' }}>
                    <canvas ref={graphiqueRevenusRef} style={{ width: '100%', height: '100%' }}></canvas>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm p-4">
              <h6 className="fw-bold mb-3">SUIVI DES FLUX FINANCIERS</h6>
              <div className="bg-light p-3 rounded-3 small">
                <p><i className="bi bi-check-circle-fill text-primary me-2"></i>10% de commission, 90% pour l'enseignant.</p>
                <p className="mb-0"><i className="bi bi-check-circle-fill text-primary me-2"></i>Modération instantanée visible globalement.</p>
              </div>
            </div>
          </div>
        )}

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