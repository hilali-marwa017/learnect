import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function HeroSection() {
  const navigate = useNavigate();

  const [matiereInput, setMatiereInput] = useState('');
  const [villeInput, setVilleInput] = useState('');
  const [matieres, setMatieres] = useState([]);
  const [villes, setVilles] = useState([]);
  const [showMatiere, setShowMatiere] = useState(false);
  const [showVille, setShowVille] = useState(false);

  useEffect(() => {
    api.get('/matieres').then(res => setMatieres(res.data)).catch(err => console.log(err));
    api.get('/villes').then(res => setVilles(res.data)).catch(err => console.log(err));
  }, []);

  // Filtrer en temps réel selon ce que l'utilisateur tape
  const matieresFiltrees = matieres.filter(m =>
    m.nom.toLowerCase().includes(matiereInput.toLowerCase())
  );

  const villesFiltrees = villes.filter(v =>
    v.nom.toLowerCase().includes(villeInput.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const isOnline = villeInput.toLowerCase().includes('en ligne');
    navigate(`/teachers?search=${matiereInput}&ville=${isOnline ? '' : villeInput}&enligne=${isOnline}`);
  };

  const selectMatiere = (nom) => {
    setMatiereInput(nom);
    setShowMatiere(false);
  };

  const selectVille = (nom) => {
    setVilleInput(nom);
    setShowVille(false);
  };

  // Tags matières populaires (6 premières)
  const tags = matieres.slice(0, 6);

  return (
    <section className="bg-light py-5">
      <div className="container text-center">
        
        <h1 className="display-4 fw-bold mb-3">
          Trouvez le <span className="text-primary">professeur parfait</span>
        </h1>
        <p className="lead text-muted mb-5">
          Des milliers de professeurs qualifiés près de chez vous
        </p>

        <form onSubmit={handleSubmit} className="row justify-content-center g-2 mb-4">
          
          {/* Champ MATIÈRE avec dropdown filtré */}
          <div className="col-md-5 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Matière (Maths, Physique...)"
              value={matiereInput}
              onChange={e => {
                setMatiereInput(e.target.value);
                setShowMatiere(true);
              }}
              onFocus={() => setShowMatiere(true)}
              onBlur={() => setTimeout(() => setShowMatiere(false), 200)}
            />
            {showMatiere && matieresFiltrees.length > 0 && (
              <div className="dropdown-menu show position-absolute w-100 mt-1 p-0 shadow-sm" style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto' }}>
                {matieresFiltrees.slice(0, 25).map(m => (
                  <div 
                    key={m.id_matiere} 
                    className="dropdown-item d-flex justify-content-between align-items-center"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectMatiere(m.nom);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>{m.nom}</span>
                    <span className="badge bg-light text-secondary ms-2">{m.categorie}</span>
                  </div>
                ))}
                {matieresFiltrees.length > 25 && (
                  <div className="dropdown-item text-muted small text-center">
                    + {matieresFiltrees.length - 25} autres matières
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Champ VILLE avec dropdown filtré */}
          <div className="col-md-4 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Ville (Casablanca, Rabat...)"
              value={villeInput}
              onChange={e => {
                setVilleInput(e.target.value);
                setShowVille(true);
              }}
              onFocus={() => setShowVille(true)}
              onBlur={() => setTimeout(() => setShowVille(false), 200)}
            />
            {showVille && villesFiltrees.length > 0 && (
              <div className="dropdown-menu show position-absolute w-100 mt-1 p-0 shadow-sm" style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto' }}>
                {/* Option "En ligne" */}
                <div 
                  className="dropdown-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectVille('En ligne');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="bi bi-wifi text-primary me-2"></i>
                  <span>En ligne (webcam)</span>
                </div>
                <div className="dropdown-divider"></div>
                {/* Liste des villes filtrées */}
                {villesFiltrees.filter(v => v.nom !== 'En ligne').slice(0, 25).map(v => (
                  <div 
                    key={v.id_ville} 
                    className="dropdown-item"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectVille(v.nom);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="bi bi-geo-alt text-secondary me-2"></i>
                    {v.nom}
                  </div>
                ))}
                {villesFiltrees.filter(v => v.nom !== 'En ligne').length > 25 && (
                  <div className="dropdown-item text-muted small text-center">
                    + {villesFiltrees.filter(v => v.nom !== 'En ligne').length - 25} autres villes
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-md-auto">
            <button type="submit" className="btn btn-primary px-4">
              <i className="bi bi-search me-2"></i>Rechercher
            </button>
          </div>
        </form>

        {/* Matières rapides (tags) */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
          {tags.map(m => (
            <button
              key={m.id_matiere}
              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              onClick={() => {
                setMatiereInput(m.nom);
                setShowMatiere(false);
              }}
            >
              {m.nom}
            </button>
          ))}
        </div>

        {/* Lien étudiant */}
        <div className="mt-4">
          <Link to="/register?role=etudiant" className="text-primary text-decoration-none">
            <i className="bi bi-person-graduation me-1"></i> Vous êtes étudiant ? Créez votre compte
          </Link>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;