import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function TeacherAvailability() {
  const { user } = useAuth();
  const location = useLocation();
  const [creneaux, setCreneaux] = useState([
    { id: 1, jour: 'Lundi', heure: '09:00 - 11:00', disponible: true },
    { id: 2, jour: 'Mercredi', heure: '14:00 - 16:00', disponible: true },
    { id: 3, jour: 'Vendredi', heure: '10:00 - 12:00', disponible: false }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [nouveauCreneau, setNouveauCreneau] = useState({ jour: 'Lundi', heureDebut: '09:00', heureFin: '11:00' });

  const navItems = [
    { path: '/enseignant/dashboard', label: 'Synthèse & Élèves', icon: 'bi-graph-up' },
    { path: '/enseignant/disponibilites', label: 'Créneaux libres', icon: 'bi-calendar-week' },
    { path: '/enseignant/revenus', label: 'Portefeuille & Revenus', icon: 'bi-wallet2' },
    { path: '/enseignant/profil', label: 'Mon Profil', icon: 'bi-person-gear' }
  ];

  const toggleDisponibilite = (id) => {
    setCreneaux(creneaux.map(c => 
      c.id === id ? { ...c, disponible: !c.disponible } : c
    ));
  };

  const ajouterCreneau = () => {
    const nouveau = {
      id: Date.now(),
      jour: nouveauCreneau.jour,
      heure: `${nouveauCreneau.heureDebut} - ${nouveauCreneau.heureFin}`,
      disponible: true
    };
    setCreneaux([...creneaux, nouveau]);
    setShowForm(false);
  };

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const creneauxLibres = creneaux.filter(c => c.disponible).length;

  return (
    <div className="container py-4">
      
      {/* En-tête */}
      <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
          <i className="bi bi-person fs-2"></i>
        </div>
        <div>
          <h4 className="fw-bold mb-0">{user?.prenom} {user?.nom}</h4>
          <p className="text-muted mb-0">
            <i className="bi bi-briefcase me-1"></i>Enseignant · {user?.ville || 'Casablanca'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="row g-3 mb-4">
        {navItems.map((item) => (
          <div key={item.path} className="col-md-3 col-6">
            <Link to={item.path} className="text-decoration-none">
              <div className={`card border-0 shadow-sm p-3 text-center ${location.pathname === item.path ? 'active-card' : ''}`}>
                <i className={`${item.icon} fs-2 ${location.pathname === item.path ? 'text-primary' : 'text-secondary'}`}></i>
                <div className="fw-semibold mt-2">{item.label}</div>
                {item.path === '/enseignant/disponibilites' && (
                  <span className="badge bg-primary mt-1 rounded-pill">{creneauxLibres}</span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Contenu */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0"><i className="bi bi-calendar-week me-2 text-primary"></i>Mes créneaux</h5>
        <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className="bi bi-plus-lg me-1"></i>Ajouter
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4 p-3">
          <div className="row g-2">
            <div className="col-md-4">
              <select className="form-select form-select-sm" value={nouveauCreneau.jour} onChange={e => setNouveauCreneau({...nouveauCreneau, jour: e.target.value})}>
                {jours.map(j => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <input type="time" className="form-control form-control-sm" value={nouveauCreneau.heureDebut} onChange={e => setNouveauCreneau({...nouveauCreneau, heureDebut: e.target.value})} />
            </div>
            <div className="col-md-3">
              <input type="time" className="form-control form-control-sm" value={nouveauCreneau.heureFin} onChange={e => setNouveauCreneau({...nouveauCreneau, heureFin: e.target.value})} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success btn-sm w-100" onClick={ajouterCreneau}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Jour</th>
                <th>Horaire</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {creneaux.map(c => (
                <tr key={c.id}>
                  <td className="fw-semibold">{c.jour}</td>
                  <td>{c.heure}</td>
                  <td>
                    <span className={`badge ${c.disponible ? 'bg-success' : 'bg-secondary'}`}>
                      {c.disponible ? 'Disponible' : 'Indisponible'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => toggleDisponibilite(c.id)}>
                      {c.disponible ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .active-card {
          border-color: #0d6efd !important;
          background: rgba(13, 110, 253, 0.05);
        }
      `}</style>
    </div>
  );
}

export default TeacherAvailability;