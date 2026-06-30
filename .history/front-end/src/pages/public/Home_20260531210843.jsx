import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Home() {
  const {
    teachers = [],  // ✅ Valeur par défaut si undefined
    users = [],     // ✅ Valeur par défaut si undefined
    onSetRole,
    setSearchMatiere,
    setSearchVille,
    setFilterEnLigne,
    setSelectedTeacherId,
    setActiveStudentTab,
    setActiveView
  } = useAuth();

  const [matiereInput, setMatiereInput] = useState('');
  const [villeInput, setVilleInput] = useState('');
  const [coursEnLigne, setCoursEnLigne] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchMatiere(matiereInput);
    setSearchVille(villeInput);
    setFilterEnLigne(coursEnLigne);
    setActiveStudentTab('explore');
    setSelectedTeacherId(null);
    onSetRole('etudiant');
    setActiveView('simulator');
  };

  const handleTeacherClick = (id) => {
    setSelectedTeacherId(id);
    setActiveStudentTab('explore');
    onSetRole('etudiant');
    setActiveView('simulator');
  };

  const handleSeeAll = () => {
    setSearchMatiere('');
    setSearchVille('');
    setFilterEnLigne(false);
    setActiveStudentTab('explore');
    setSelectedTeacherId(null);
    onSetRole('etudiant');
    setActiveView('simulator');
  };

  const matieres = ['Mathématiques', 'Physique', 'Français', 'Anglais', 'Informatique', 'Arabe'];

  // Données fictives si teachers est vide (pour le développement)
  const displayTeachers = teachers.length > 0 ? teachers : [
    { id: 1, userId: 1, matiere: 'Mathématiques', noteMoyenne: 4.9, tarifHeure: 150 },
    { id: 2, userId: 2, matiere: 'Physique', noteMoyenne: 4.8, tarifHeure: 140 },
    { id: 3, userId: 3, matiere: 'Français', noteMoyenne: 4.9, tarifHeure: 130 },
    { id: 4, userId: 4, matiere: 'Anglais', noteMoyenne: 4.7, tarifHeure: 120 }
  ];

  const displayUsers = users.length > 0 ? users : [
    { id: 1, prenom: 'Karim', nom: 'Amrani', photo: null },
    { id: 2, prenom: 'Sofia', nom: 'Benjelloun', photo: null },
    { id: 3, prenom: 'Yassine', nom: 'El Fassi', photo: null },
    { id: 4, prenom: 'Leila', nom: 'Mernissi', photo: null }
  ];

  const getUser = (userId) => {
    return displayUsers.find(u => u.id === userId) || { prenom: 'Professeur', nom: '', photo: null };
  };

  return (
    <div>
      {/* HERO SECTION */}
      <div className="bg-primary bg-opacity-10 py-5">
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-3">
            Trouvez le <span className="text-primary">prof idéal</span>
          </h1>
          <p className="lead text-muted mb-4">
            Des milliers de professeurs qualifiés près de chez vous
          </p>

          <form onSubmit={handleSearch} className="row justify-content-center g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Matière"
                value={matiereInput}
                onChange={(e) => setMatiereInput(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Ville"
                value={villeInput}
                onChange={(e) => setVilleInput(e.target.value)}
              />
            </div>
            <div className="col-md-auto">
              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="enLigne"
                  checked={coursEnLigne}
                  onChange={(e) => setCoursEnLigne(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="enLigne">
                  En ligne
                </label>
              </div>
            </div>
            <div className="col-md-auto">
              <button type="submit" className="btn btn-primary px-4">
                <i className="bi bi-search me-2"></i>Chercher
              </button>
            </div>
          </form>

          <div className="mt-4 d-flex justify-content-center gap-3">
            <Link to="/register?role=etudiant" className="btn btn-outline-primary">
              <i className="bi bi-person-graduation me-2"></i>Je suis élève
            </Link>
            <Link to="/register?role=enseignant" className="btn btn-success">
              <i className="bi bi-person-workspace me-2"></i>Je suis enseignant
            </Link>
          </div>
        </div>
      </div>

      {/* MATIERES RAPIDES */}
      <div className="container py-4">
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {matieres.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMatiereInput(m);
                setSearchMatiere(m);
                setActiveStudentTab('explore');
                onSetRole('etudiant');
                setActiveView('simulator');
              }}
              className="btn btn-sm btn-outline-secondary rounded-pill"
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* PROFESSEURS RECOMMANDÉS */}
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold">Professeurs recommandés</h3>
          <button onClick={handleSeeAll} className="btn btn-link text-primary">
            Voir tous <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="row g-4">
          {displayTeachers.slice(0, 4).map((teacher) => {
            const user = getUser(teacher.userId || teacher.id);
            return (
              <div key={teacher.id} className="col-md-3 col-sm-6">
                <div
                  className="card h-100 shadow-sm text-center cursor-pointer"
                  onClick={() => handleTeacherClick(teacher.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body">
                    <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                      {user.photo ? (
                        <img src={user.photo} alt="profil" className="rounded-circle w-100 h-100 object-fit-cover" />
                      ) : (
                        <i className="bi bi-person fs-1 text-secondary"></i>
                      )}
                    </div>
                    <h6 className="fw-bold mb-1">{user.prenom} {user.nom}</h6>
                    <p className="text-primary small mb-2">{teacher.matiere || 'Professeur'}</p>
                    <div className="mb-2">
                      <i className="bi bi-star-fill text-warning"></i>
                      <span className="fw-bold ms-1">{teacher.noteMoyenne || 4.8}</span>
                    </div>
                    <p className="fw-bold text-primary mb-0">{teacher.tarifHeure} DH/h</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h3 className="fw-bold mb-4">Comment ça marche ?</h3>
          <div className="row">
            <div className="col-md-4">
              <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                1
              </div>
              <h5>Recherchez</h5>
              <p className="text-muted small">Trouvez le professeur idéal</p>
            </div>
            <div className="col-md-4">
              <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                2
              </div>
              <h5>Réservez</h5>
              <p className="text-muted small">Choisissez votre créneau</p>
            </div>
            <div className="col-md-4">
              <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                3
              </div>
              <h5>Apprenez</h5>
              <p className="text-muted small">Progressez à votre rythme</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="container py-5">
        <h3 className="text-center fw-bold mb-4">Questions fréquentes</h3>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="mb-3">
              <h6 className="fw-bold">Comment trouver un professeur ?</h6>
              <p className="text-muted small">Utilisez notre moteur de recherche par matière ou par ville.</p>
            </div>
            <div className="mb-3">
              <h6 className="fw-bold">Les cours sont-ils payants ?</h6>
              <p className="text-muted small">Oui, vous payez directement le professeur après validation.</p>
            </div>
            <div className="mb-3">
              <h6 className="fw-bold">Puis-je annuler un cours ?</h6>
              <p className="text-muted small">Oui, jusqu'à 24h avant la séance sans frais.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .card:hover {
          transform: translateY(-3px);
          transition: all 0.2s;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
        }
        .object-fit-cover {
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}

export default Home;