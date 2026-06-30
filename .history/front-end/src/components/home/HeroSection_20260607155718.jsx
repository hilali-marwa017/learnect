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

  const tags = matieres.slice(0, 8);

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '0.95rem',
    outline: 'none',
    background: 'white',
    transition: 'none'
  };

  const buttonStyle = {
    padding: '14px 28px',
    background: '#0d6efd',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer'
  };

  const tagStyle = {
    padding: '6px 16px',
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '30px',
    fontSize: '0.8rem',
    color: '#4A5568',
    cursor: 'pointer'
  };

  return (
    <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
      <div className="container text-center">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#0F172A' }}>
          Trouvez le <span style={{ color: '#0d6efd' }}>professeur parfait</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6B7280', marginBottom: '2.5rem' }}>
          Des milliers de professeurs qualifiés près de chez vous
        </p>

        <form onSubmit={handleSubmit} className="row justify-content-center g-3 mb-4">
          <div className="col-md-5 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Matière (Maths, Physique...)"
              value={matiereInput}
              onChange={e => { setMatiereInput(e.target.value); setShowMatiere(true); }}
              onFocus={() => setShowMatiere(true)}
              onBlur={() => setTimeout(() => setShowMatiere(false), 200)}
              style={inputStyle}
            />
            {showMatiere && matieresFiltrees.length > 0 && (
              <div className="dropdown-menu show position-absolute w-100 mt-1 p-0 shadow-sm" style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                {matieresFiltrees.slice(0, 25).map(m => (
                  <div key={m.id_matiere} className="dropdown-item d-flex justify-content-between align-items-center" onMouseDown={(e) => { e.preventDefault(); selectMatiere(m.nom); }} style={{ cursor: 'pointer', padding: '10px 16px' }}>
                    <span>{m.nom}</span>
                    <span className="badge bg-light text-secondary ms-2">{m.categorie}</span>
                  </div>
                ))}
                {matieresFiltrees.length > 25 && (
                  <div className="dropdown-item text-muted small text-center" style={{ padding: '10px' }}>+ {matieresFiltrees.length - 25} autres matières</div>
                )}
              </div>
            )}
          </div>

          <div className="col-md-4 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Ville (Casablanca, Rabat...)"
              value={villeInput}
              onChange={e => { setVilleInput(e.target.value); setShowVille(true); }}
              onFocus={() => setShowVille(true)}
              onBlur={() => setTimeout(() => setShowVille(false), 200)}
              style={inputStyle}
            />
            {showVille && villesFiltrees.length > 0 && (
              <div className="dropdown-menu show position-absolute w-100 mt-1 p-0 shadow-sm" style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div className="dropdown-item" onMouseDown={(e) => { e.preventDefault(); selectVille('En ligne'); }} style={{ cursor: 'pointer', padding: '10px 16px' }}>
                  <i className="bi bi-wifi text-primary me-2"></i>
                  <span>En ligne (webcam)</span>
                </div>
                <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0' }}></div>
                {villesFiltrees.filter(v => v.nom !== 'En ligne').slice(0, 25).map(v => (
                  <div key={v.id_ville} className="dropdown-item" onMouseDown={(e) => { e.preventDefault(); selectVille(v.nom); }} style={{ cursor: 'pointer', padding: '10px 16px' }}>
                    <i className="bi bi-geo-alt text-secondary me-2"></i>
                    {v.nom}
                  </div>
                ))}
                {villesFiltrees.filter(v => v.nom !== 'En ligne').length > 25 && (
                  <div className="dropdown-item text-muted small text-center" style={{ padding: '10px' }}>+ {villesFiltrees.filter(v => v.nom !== 'En ligne').length - 25} autres villes</div>
                )}
              </div>
            )}
          </div>

          <div className="col-md-auto">
            <button type="submit" style={buttonStyle}>
              <i className="bi bi-search me-2"></i>Rechercher
            </button>
          </div>
        </form>

        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
          {tags.map(m => (
            <button key={m.id_matiere} style={tagStyle} onClick={() => { setMatiereInput(m.nom); setShowMatiere(false); }}>
              {m.nom}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Link to="/register?role=enseignant" style={{ color: '#0d6efd', textDecoration: 'none' }}>
            <i className="bi bi-briefcase me-1"></i> Vous êtes enseignant ? Rejoignez la plateforme
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;