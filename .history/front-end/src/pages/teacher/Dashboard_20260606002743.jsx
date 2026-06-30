import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    tarif: 180,
    note: 4.8,
    creneaux: 4,
    revenus: 0,
    reservations: 1,
    messages: 3
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await api.get('/teacher/dashboard');
        // setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      
      {/* En-tête */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Tableau de bord</h2>
        <p className="text-muted">
          Bienvenue, <strong>{user?.prenom} {user?.nom}</strong> · {user?.ville || 'Casablanca'}
        </p>
      </div>

      {/* Statistiques */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="text-muted small">Tarif horaire</div>
            <div className="fs-2 fw-bold text-primary">{stats.tarif} <small className="fs-6">DH/h</small></div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="text-muted small">Note moyenne</div>
            <div className="fs-2 fw-bold text-primary">{stats.note}★</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="text-muted small">Créneaux libres</div>
            <div className="fs-2 fw-bold text-primary">{stats.creneaux}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="text-muted small">Messages</div>
            <div className="fs-2 fw-bold text-primary">{stats.messages}</div>
          </div>
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <Link to="/enseignant/disponibilites" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 text-center p-3">
              <i className="bi bi-calendar-week fs-2 text-primary"></i>
              <div className="fw-semibold mt-1 small">Disponibilités</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/enseignant/revenus" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 text-center p-3">
              <i className="bi bi-wallet2 fs-2 text-primary"></i>
              <div className="fw-semibold mt-1 small">Revenus</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/enseignant/messages" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 text-center p-3">
              <i className="bi bi-chat-dots fs-2 text-primary"></i>
              <div className="fw-semibold mt-1 small">Messages</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/enseignant/profil" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 text-center p-3">
              <i className="bi bi-person fs-2 text-primary"></i>
              <div className="fw-semibold mt-1 small">Profil</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Revenus & Réservations */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Revenus cumulés</div>
                <div className="fs-2 fw-bold text-primary">{stats.revenus} DH</div>
              </div>
              <i className="bi bi-cash-stack fs-1 text-primary opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Réservations</div>
                <div className="fs-2 fw-bold text-primary">{stats.reservations}</div>
              </div>
              <i className="bi bi-calendar-check fs-1 text-primary opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Élèves */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">📋 Suivi des élèves</h5>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead className="table-light">
                <tr>
                  <th>Élève</th>
                  <th>Cours</th>
                  <th>Gain</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Marwa Hilali</td>
                  <td>25/05/2026</td>
                  <td>0 DH</td>
                  <td><button className="btn btn-sm btn-outline-primary rounded-pill">Contacter</button></td>
                </tr>
                <tr>
                  <td>Yassine Amrani</td>
                  <td>28/05/2026</td>
                  <td>162 DH</td>
                  <td><button className="btn btn-sm btn-outline-primary rounded-pill">Contacter</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Demandes */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body">
          <h5 className="fw-bold mb-3">📢 Demandes</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="border rounded-3 p-3">
                <div className="fw-bold">Classes Préparatoires (MPSI)</div>
                <div className="text-muted small">Casablanca · 120-160 DH/h</div>
                <button className="btn btn-sm btn-outline-primary mt-2 rounded-pill">Faire une offre</button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded-3 p-3">
                <div className="fw-bold">Lycée - 2ème Bac Sciences Maths</div>
                <div className="text-muted small">Marrakech · 100-150 DH/h</div>
                <button className="btn btn-sm btn-outline-primary mt-2 rounded-pill">Faire une offre</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default TeacherDashboard;