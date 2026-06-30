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
    setSelectedTeacherId,
    setActiveStudentTab,
    setActiveView
  } = useAuth();

  const [villeInput, setVilleInput] = useState('');
  const [matieres, setMatieres] = useState([]);

  // Charger les matières depuis API
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const res = await api.get('/matieres');
        setMatieres(res.data);
      } catch (error) {
        // Fallback si API non disponible
        setMatieres([
          { id: 1, nom: 'Mathématiques' },
          { id: 2, nom: 'Physique-Chimie' },
          { id: 3, nom: 'Français' },
          { id: 4, nom: 'Anglais' },
          { id: 5, nom: 'Arabe' },
          { id: 6, nom: 'SVT' },
          { id: 7, nom: 'Informatique' },
          { id: 8, nom: 'Histoire-Géo' },
        ]);
      }
    };
    fetchMatieres();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchVille(villeInput);
    setActiveStudentTab('explore');
    setSelectedTeacherId(null);
    onSetRole('etudiant');
    setActiveView('simulator');
  };

  const handleMatiereClick = (matiere) => {
    setSearchMatiere(matiere);
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

  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      
      {/* HERO SECTION - TRÈS SIMPLE */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            
            {/* Logo/Titre */}
            <div className="mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-mortarboard fs-2"></i>
              </div>
              <h1 className="display-5 fw-bold">
                Trouvez le <span className="text-primary">professeur parfait</span>
              </h1>
              <p className="text-muted mt-2">
                Des milliers de professeurs qualifiés près de chez vous
              </p>
            </div>

            {/* FORMULAIRE DE RECHERCHE */}
            <div className="card shadow-sm border-0 rounded-4 p-3 mb-5">
              <form onSubmit={handleSearch}>
                <div className="row g-2 align-items-center">
                  <div className="col">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-geo-alt text-primary"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Adresse ou ville"
                        value={villeInput}
                        onChange={(e) => setVilleInput(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-auto">
                    <button type="submit" className="btn btn-primary px-4 py-2">
                      <i className="bi bi-search me-2"></i>Rechercher
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* MATIÈRES POPULAIRES */}
            <div className="mb-5">
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {matieres.slice(0, 8).map((matiere) => (
                  <button
                    key={matiere.id || matiere.id_matiere}
                    onClick={() => handleMatiereClick(matiere.nom)}
                    className="btn btn-outline-secondary rounded-pill px-4 py-2"
                    style={{ fontSize: '14px' }}
                  >
                    {matiere.nom}
                  </button>
                ))}
              </div>
            </div>

            {/* LIEN ENSEIGNANT */}
            <div>
              <Link to="/register?role=enseignant" className="text-primary text-decoration-none fw-semibold">
                <i className="bi bi-person-workspace me-1"></i> Vous êtes enseignant ? Inscrivez-vous
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* PROFESSEURS RECOMMANDÉS */}
      <div className="bg-white py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold fs-4">Professeurs recommandés</h3>
            <button
              onClick={() => {
                setSearchMatiere('');
                setSearchVille('');
                setActiveStudentTab('explore');
                onSetRole('etudiant');
                setActiveView('simulator');
              }}
              className="btn btn-link text-primary text-decoration-none p-0"
            >
              Voir tous <i className="bi bi-arrow-right"></i>
            </button>
          </div>

          <div className="row g-4">
            {teachers && teachers.slice(0, 4).map((teacher) => {
              const user = users?.find(u => u.id === teacher.userId);
              return (
                <div key={teacher.id} className="col-md-3 col-sm-6">
                  <div
                    className="card h-100 border-0 shadow-sm rounded-4 text-center cursor-pointer"
                    onClick={() => handleTeacherClick(teacher.id)}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div className="card-body p-4">
                      <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                        <i className="bi bi-person fs-1 text-secondary"></i>
                      </div>
                      <h6 className="fw-bold mb-1">{user?.prenom || 'Professeur'} {user?.nom || ''}</h6>
                      <p className="text-primary small mb-2">{teacher.matiere || 'Cours particuliers'}</p>
                      <div className="mb-2">
                        <i className="bi bi-star-fill text-warning"></i>
                        <span className="fw-bold ms-1">{teacher.noteMoyenne || 4.8}</span>
                        <span className="text-muted ms-1">({teacher.avisCount || 45})</span>
                      </div>
                      <p className="fw-bold text-primary mb-0">{teacher.tarifHeure} DH/h</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3 ÉTAPES SIMPLES */}
      <div className="container py-5 text-center">
        <h3 className="fw-bold mb-4">Comment ça marche ?</h3>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>1</div>
            <h6 className="fw-bold">Recherchez</h6>
            <p className="text-muted small">Trouvez votre professeur</p>
          </div>
          <div className="col-md-4">
            <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>2</div>
            <h6 className="fw-bold">Réservez</h6>
            <p className="text-muted small">Choisissez votre créneau</p>
          </div>
          <div className="col-md-4">
            <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>3</div>
            <h6 className="fw-bold">Apprenez</h6>
            <p className="text-muted small">Progressez à votre rythme</p>
          </div>
        </div>
      </div>

      <style>{`
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
        }
        .cursor-pointer { cursor: pointer; }
        .btn-outline-secondary:hover {
          background-color: #0d6efd;
          border-color: #0d6efd;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default Home;