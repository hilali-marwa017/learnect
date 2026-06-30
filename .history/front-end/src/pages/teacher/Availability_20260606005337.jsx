import { useState } from 'react';
import { Link } from 'react-router-dom';

function TeacherAvailability() {
  const [creneaux, setCreneaux] = useState([
    { id: 1, jour: 'Lundi', heure: '09:00 - 11:00', disponible: true },
    { id: 2, jour: 'Mercredi', heure: '14:00 - 16:00', disponible: true },
    { id: 3, jour: 'Vendredi', heure: '10:00 - 12:00', disponible: false }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [nouveauCreneau, setNouveauCreneau] = useState({ jour: 'Lundi', heureDebut: '09:00', heureFin: '11:00' });

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
    setNouveauCreneau({ jour: 'Lundi', heureDebut: '09:00', heureFin: '11:00' });
  };

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <div className="container py-4">
      {/* Navigation entre pages */}
      <div className="d-flex gap-2 mb-4">
        <Link to="/enseignant/dashboard" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-speedometer2 me-1"></i>Dashboard
        </Link>
        <Link to="/enseignant/disponibilites" className="btn btn-primary btn-sm">
          <i className="bi bi-calendar-week me-1"></i>Disponibilités
        </Link>
        <Link to="/enseignant/revenus" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-wallet2 me-1"></i>Revenus
        </Link>
        <Link to="/enseignant/profil" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-person-gear me-1"></i>Profil
        </Link>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Mes disponibilités</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className="bi bi-plus-lg me-2"></i>Ajouter un créneau
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4 p-4">
          <h5 className="fw-bold mb-3"><i className="bi bi-calendar-plus me-2"></i>Nouveau créneau</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <select className="form-select" value={nouveauCreneau.jour} onChange={e => setNouveauCreneau({...nouveauCreneau, jour: e.target.value})}>
                {jours.map(j => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <input type="time" className="form-control" value={nouveauCreneau.heureDebut} onChange={e => setNouveauCreneau({...nouveauCreneau, heureDebut: e.target.value})} />
            </div>
            <div className="col-md-3">
              <input type="time" className="form-control" value={nouveauCreneau.heureFin} onChange={e => setNouveauCreneau({...nouveauCreneau, heureFin: e.target.value})} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100" onClick={ajouterCreneau}>
                <i className="bi bi-check-lg me-1"></i>Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th><i className="bi bi-calendar me-2"></i>Jour</th>
                <th><i className="bi bi-clock me-2"></i>Horaire</th>
                <th><i className="bi bi-toggle-on me-2"></i>Statut</th>
                <th><i className="bi bi-gear me-2"></i>Action</th>
              </tr>
            </thead>
            <tbody>
              {creneaux.map(c => (
                <tr key={c.id}>
                  <td className="fw-semibold">{c.jour}</td>
                  <td>{c.heure}</td>
                  <td>
                    <span className={`badge ${c.disponible ? 'bg-success' : 'bg-secondary'}`}>
                      {c.disponible ? <i className="bi bi-check-circle me-1"></i> : <i className="bi bi-x-circle me-1"></i>}
                      {c.disponible ? 'Disponible' : 'Indisponible'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => toggleDisponibilite(c.id)}>
                      <i className={`bi ${c.disponible ? 'bi-x-lg' : 'bi-check-lg'} me-1`}></i>
                      {c.disponible ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3">
        <Link to="/enseignant/dashboard" className="text-primary text-decoration-none">
          <i className="bi bi-arrow-left me-1"></i> Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}

export default TeacherAvailability;