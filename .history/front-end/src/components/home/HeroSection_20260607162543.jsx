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

  const matieresFiltrees = matieres.filter(m => m.nom.toLowerCase().includes(matiereInput.toLowerCase()));
  const villesFiltrees = villes.filter(v => v.nom.toLowerCase().includes(villeInput.toLowerCase()));

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

  const tags = ['Anglais', 'Maths', 'Français', 'Arabe', 'Coaching Sportif', 'Physique', 'Informatique', 'SVT'];

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="text-center" style={{ maxWidth: 750, margin: '0 auto' }}>
          
          <h1 className="fw-bold" style={{ fontSize: '2rem', color: '#0F172A', marginBottom: '0.5rem' }}>
            Trouvez votre professeur
          </h1>
          <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '2rem' }}>
            Des milliers de professeurs qualifiés près de chez vous
          </p>

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="d-flex gap-3 flex-wrap justify-content-center">
              
              {/* Input Matière */}
              <div className="position-relative" style={{ flex: 2, minWidth: 220 }}>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3 border-secondary-subtle shadow-sm"
                  placeholder="Essayer 'Maths'"
                  value={matiereInput}
                  onChange={e => { setMatiereInput(e.target.value); setShowMatiere(true); }}
                  onFocus={() => setShowMatiere(true)}
                  onBlur={() => setTimeout(() => setShowMatiere(false), 200)}
                  style={{ padding: '12px 18px' }}
                />
                {showMatiere && matieresFiltrees.length > 0 && (
                  <div className="dropdown-menu show position-absolute w-100 mt-1 p-0 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto', borderRadius: '12px', border: '1px solid #dee2e6' }}>
                    {matieresFiltrees.slice(0, 10).map(m => (
                      <div key={m.id_matiere} className="dropdown-item" onMouseDown={(e) => { e.preventDefault(); selectMatiere(m.nom); }} style={{ cursor: 'pointer', padding: '10px 16px' }}>
                        {m.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Ville */}
              <div className="position-relative" style={{ flex: 2, minWidth: 200 }}>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3 border-secondary-subtle shadow-sm"
                  placeholder="Adresse ou ville"
                  value={villeInput}
                  onChange={e => { setVilleInput(e.target.value); setShowVille(true); }}
                  onFocus={() => setShowVille(true)}
                  onBlur={() => setTimeout(() => setShowVille(false), 200)}
                  style={{ padding: '12px 18px' }}
                />
                {showVille && villesFiltrees.length > 0 && (
                  <div className="dropdown-menu show position-absolute w-100 mt-1 p-0 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto', borderRadius: '12px', border: '1px solid #dee2e6' }}>
                    <div className="dropdown-item" onMouseDown={(e) => { e.preventDefault(); selectVille('En ligne'); }} style={{ cursor: 'pointer', padding: '10px 16px' }}>
                      <i className="bi bi-wifi text-primary me-2"></i>En ligne (webcam)
                    </div>
                    <div className="dropdown-divider m-0"></div>
                    {villesFiltrees.filter(v => v.nom !== 'En ligne').slice(0, 15).map(v => (
                      <div key={v.id_ville} className="dropdown-item" onMouseDown={(e) => { e.preventDefault(); selectVille(v.nom); }} style={{ cursor: 'pointer', padding: '10px 16px' }}>
                        <i className="bi bi-geo-alt text-secondary me-2"></i>{v.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bouton Rechercher */}
              <button type="submit" className="btn btn-primary btn-lg rounded-3 px-5 shadow-sm" style={{ fontWeight: 600 }}>
                Rechercher
              </button>
            </div>
          </form>

          {/* Tags */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
            {tags.map(tag => (
              <button
                key={tag}
                className="btn btn-outline-secondary rounded-pill px-3 py-1"
                onClick={() => setMatiereInput(tag)}
                style={{ fontSize: '0.85rem' }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;