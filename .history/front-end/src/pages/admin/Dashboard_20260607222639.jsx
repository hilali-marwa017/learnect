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
    if (ongletActif === 'stats' && !chargement && statistiques.totalEtudiants > 0) {
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
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { enabled: true }
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
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { enabled: true }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({ 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' });

  async function chargerDonnees() {
    setChargement(true);
    try {
      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/enseignants/attente`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/signalements`, { headers: getHeaders() }),
        fetch(`${API_URL}/admin/users`, { headers: getHeaders() })
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
    } catch (err) {
      console.error(err);
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

  const listeCartes = [
    { libelle: 'Total Élèves', valeur: statistiques.totalEtudiants, icone: 'bi-people' },
    { libelle: 'Total Tuteurs', valeur: statistiques.totalEnseignants, icone: 'bi-briefcase' },
    { libelle: 'Réservations', valeur: statistiques.totalReservations, icone: 'bi-calendar-check' },
    { libelle: 'Commissions', valeur: `${statistiques.revenusTotal} DH`, icone: 'bi-cash-stack' }
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

        <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '32px' }}>
            <button onClick={() => setOngletActif('stats')} style={{ border: 'none', background: 'none', padding: '12px 0', fontSize: '14px', fontWeight: ongletActif === 'stats' ? '600' : '400', color: ongletActif === 'stats' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'stats' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Statistiques</button>
            <button onClick={() => setOngletActif('teachers')} style={{ border: 'none', background: 'none', padding: '12px 0', fontSize: '14px', fontWeight: ongletActif === 'teachers' ? '600' : '400', color: ongletActif === 'teachers' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'teachers' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Vérification ({enseignantsEnAttente.length})</button>
            <button onClick={() => setOngletActif('reports')} style={{ border: 'none', background: 'none', padding: '12px 0', fontSize: '14px', fontWeight: ongletActif === 'reports' ? '600' : '400', color: ongletActif === 'reports' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'reports' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Signalements ({listeSignalements.length})</button>
            <button onClick={() => setOngletActif('users')} style={{ border: 'none', background: 'none', padding: '12px 0', fontSize: '14px', fontWeight: ongletActif === 'users' ? '600' : '400', color: ongletActif === 'users' ? '#0d6efd' : '#64748b', borderBottom: ongletActif === 'users' ? '2px solid #0d6efd' : 'none', cursor: 'pointer' }}>Utilisateurs ({listeUtilisateurs.length})</button>
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
                  </div>
                </div>
              ))}
            </div>
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
            <div className="card border-0 shadow-sm p-4">
              <h6 className="fw-bold mb-3">SUIVI DES FLUX FINANCIERS</h6>
              <div className="bg-light p-3 rounded-3 small">
                <p className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>10% de commission, 90% pour l'enseignant.</p>
                <p className="mb-0"><i className="bi bi-check-circle-fill text-primary me-2"></i>Modération instantanée visible globalement.</p>
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'teachers' && <ValidatedTeachers pendingTeachers={enseignantsEnAttente} onRefresh={rafraichirUtilisateurs} />}
        {ongletActif === 'reports' && <Signalements signalements={listeSignalements} onRefresh={rafraichirUtilisateurs} />}
        {ongletActif === 'users' && <ManageUsers users={listeUtilisateurs} onRefresh={rafraichirUtilisateurs} />}
      </div>
    </div>
  );
}

export default AdminDashboard;