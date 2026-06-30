import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function Home() {
  const {
    teachers,
    users,
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
  const [showMatiereDropdown, setShowMatiereDropdown] = useState(false);
  const [matieres, setMatieres] = useState([]);
  const [loadingMatieres, setLoadingMatieres] = useState(true);

  // Charger les matières depuis l'API
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const response = await api.get('/matieres');
        setMatieres(response.data);
      } catch (error) {
        console.error('Erreur chargement matières:', error);
        // Données fictives en fallback
        setMatieres([
          { id_matiere: 1, nom: 'Mathématiques', categorie: 'Sciences' },
          { id_matiere: 2, nom: 'Anglais', categorie: 'Langues' },
          { id_matiere: 3, nom: 'Français', categorie: 'Langues' },
          { id_matiere: 4, nom: 'Arabe', categorie: 'Langues' },
          { id_matiere: 5, nom: 'Physique-Chimie', categorie: 'Sciences' },
          { id_matiere: 6, nom: 'SVT', categorie: 'Sciences' },
          { id_matiere: 7, nom: 'Informatique', categorie: 'Technologie' },
        ]);
      } finally {
        setLoadingMatieres(false);
      }
    };
    fetchMatieres();
  }, []);

  // Matières filtrées pour le dropdown
  const filteredMatieres = matieres.filter(m =>
    m.nom.toLowerCase().includes(matiereInput.toLowerCase())
  );

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

  const handleMatiereClick = (nom) => {
    setMatiereInput(nom);
    setSearchMatiere(nom);
    setShowMatiereDropdown(false);
    setActiveStudentTab('explore');
    onSetRole('etudiant');
    setActiveView('simulator');
  };

  // Matières populaires à afficher (limité à 6)
  const popularMatieres = matieres.slice(0, 6);

  return (
    <div>
      {/* HERO SECTION - Style comme image 2 et 3 */}
      <div className="hero-bg py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              
              <h1 className="display-4 fw-bold text-center mb-3">
                Trouvez le <span className="text-primary">professeur parfait</span>
              </h1>
              
              <p className="text-center text-muted mb-5">
                Des milliers de professeurs qualifiés près de chez vous
              </p>

              {/* Search Form - Style comme image */}
              <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
                <form onSubmit={handleSearch}>
                  <div className="row g-3 align-items-end">
                    
                    {/* Champ Matière avec dropdown */}
                    <div className="col-md-5">
                      <label className="form-label fw-semibold small text-secondary">Essayer "Maths"</label>
                      <div className="position-relative">
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-search text-primary"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Mathématiques, Physique..."
                            value={matiereInput}
                            onChange={(e) => {
                              setMatiereInput(e.target.value);
                              setShowMatiereDropdown(true);
                            }}
                            onFocus={() => setShowMatiereDropdown(true)}
                          />
                        </div>
                        {showMatiereDropdown && matiereInput && filteredMatieres.length > 0 && (
                          <div className="dropdown-menu show position-absolute w-100 mt-1 shadow-sm border-0 rounded-3" style={{ zIndex: 1000 }}>
                            {filteredMatieres.map((matiere) => (
                              <button
                                key={matiere.id_matiere}
                                type="button"
                                className="dropdown-item py-2"
                                onClick={() => handleMatiereClick(matiere.nom)}
                              >
                                <i className="bi bi-book text-primary me-2"></i>
                                {matiere.nom}
                                <span className="badge bg-light text-secondary ms-2">{matiere.categorie}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Champ Ville */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small text-secondary">Adresse ou ville</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-geo-alt text-primary"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Casablanca, Rabat..."
                          value={villeInput}
                          onChange={(e) => setVilleInput(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Checkbox En ligne */}
                    <div className="col-md-2">
                      <div className="form-check mt-4">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="coursEnLigne"
                          checked={coursEnLigne}
                          onChange={(e) => setCoursEnLigne(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="coursEnLigne">
                          En ligne
                        </label>
                      </div>
                    </div>

                    {/* Bouton Rechercher */}
                    <div className="col-md-1">
                      <button type="submit" className="btn btn-primary w-100 py-2">
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Liens rapides - Autour de moi / En ligne */}
                <div className="d-flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setVilleInput('Casablanca');
                      setCoursEnLigne(false);
                    }}
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                  >
                    <i className="bi bi-geo-alt me-1"></i> Autour de moi
                  </button>
                  <button
                    onClick={() => {
                      setVilleInput('');
                      setCoursEnLigne(true);
                    }}
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                  >
                    <i className="bi bi-wifi me-1"></i> En ligne
                  </button>
                </div>
              </div>

              {/* Matières populaires */}
              <div className="mt-5">
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {popularMatieres.map((matiere) => (
                    <button
                      key={matiere.id_matiere}
                      onClick={() => handleMatiereClick(matiere.nom)}
                      className="btn btn-sm btn-outline-secondary rounded-pill px-4 py-2"
                    >
                      {matiere.nom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lien pour enseignant */}
              <div className="text-center mt-4">
                <Link to="/register?role=enseignant" className="text-primary text-decoration-none fw-semibold">
                  <i className="bi bi-person-workspace me-1"></i> Je suis enseignant
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* PROFESSEURS RECOMMANDÉS */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Professeurs recommandés</h3>
          <button
            onClick={() => {
              setSearchMatiere('');
              setSearchVille('');
              setFilterEnLigne(false);
              setActiveStudentTab('explore');
              onSetRole('etudiant');
              setActiveView('simulator');
            }}
            className="btn btn-link text-primary text-decoration-none"
          >
            Voir tous <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="row g-4">
          {teachers && teachers.slice(0, 4).map((teacher) => {
            const user = users?.find(u => u.id === teacher.userId) || {};
            return (
              <div key={teacher.id} className="col-md-3 col-sm-6">
                <div
                  className="card h-100 shadow-sm border-0 rounded-4 text-center cursor-pointer"
                  onClick={() => handleTeacherClick(teacher.id)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                >
                  <div className="card-body p-4">
                    <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                      <i className="bi bi-person fs-1 text-secondary"></i>
                    </div>
                    <h6 className="fw-bold mb-1">{user.prenom || 'Professeur'} {user.nom || ''}</h6>
                    <p className="text-primary small mb-2">{teacher.matiere || 'Tuteur'}</p>
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
          <div className="row g-4">
            <div className="col-md-4">
              <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>1</div>
              <h5>Recherchez</h5>
              <p className="text-muted small">Trouvez le professeur idéal</p>
            </div>
            <div className="col-md-4">
              <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>2</div>
              <h5>Réservez</h5>
              <p className="text-muted small">Choisissez votre créneau</p>
            </div>
            <div className="col-md-4">
              <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>3</div>
              <h5>Apprenez</h5>
              <p className="text-muted small">Progressez à votre rythme</p>
            </div>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .hero-bg {
          background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 40%, #EDE9FE 100%);
        }
        .cursor-pointer { cursor: pointer; }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
        }
        .dropdown-item:hover {
          background-color: #EFF6FF;
        }
      `}</style>
    </div>
  );
}

export default Home;