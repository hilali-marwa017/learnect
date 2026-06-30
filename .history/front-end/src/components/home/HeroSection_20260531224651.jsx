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

  // Chargement des données
  useEffect(() => {
    api.get('/matieres').then(res => setMatieres(res.data)).catch(err => console.log(err));
    api.get('/villes').then(res => setVilles(res.data)).catch(err => console.log(err));
  }, []);

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

        {/* Barre de recherche */}
        <form onSubmit={handleSubmit} className="row justify-content-center g-2 mb-4">
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
              onBlur={() => setTimeout(() => setShowMatiere(false), 200)}
            />
            {showMatiere && matieresFiltrees.length > 0 && (
              <div className="dropdown-menu show position-absolute w-100 mt-1 p-0 shadow-sm">
                {matieresFiltrees.map(m => (
                  <div key={m.id_matiere} className="dropdown-item" onClick={() => selectMatiere(m.nom)} style={{ cursor: 'pointer' }}>
                    {m.nom} <span className="badge bg-light text-secondary ms-2">{m.categorie}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              onBlur={() => setTimeout(() => setShowVille(false), 200)}
            />
            {showVille && villesFiltrees.length > 0 && (
              <div className="dropdown-menu show position-absolute w-100 mt-1 p-0 shadow-sm">
                {villesFiltrees.map(v => (
                  <div key={v.id_ville} className="dropdown-item" onClick={() => selectVille(v.nom)} style={{ cursor: 'pointer' }}>
                    {v.nom}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-md-auto">
            <button type="submit" className="btn btn-primary px-4">
              <i className="bi bi-search me-2"></i>Rechercher
            </button>
          </div>
        </form>

        {/* Tags populaires */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
          {tags.map(m => (
            <button
              key={m.id_matiere}
              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              onClick={() => {
                setMatiereInput(m.nom);
                navigate(`/teachers?search=${m.nom}`);
              }}
            >
              {m.nom}
            </button>
          ))}
        </div>

        {/* Lien étudiant (car le bouton enseignant est déjà dans la navbar) */}
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