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
    setTimeout(() => {
      document.getElementById('matiere-input').value = nom;
    }, 10);
  };

  const selectVille = (nom) => {
    setVilleInput(nom);
    setShowVille(false);
  };

  const tags = matieres.slice(0, 6);

  return (
    <section style={{ background: 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 60%)', padding: '5rem 0 4rem' }}>
      <div className="container text-center">

        {/* Badge animé */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#EFF6FF', border: '1px solid #BFDBFE',
          borderRadius: 50, padding: '6px 16px',
          marginBottom: '1.5rem', fontSize: '0.78rem',
          fontWeight: 700, color: '#1d4ed8', letterSpacing: 0.5,
        }}>
          🎓 1er cours offert · Commission 10% seulement
        </div>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 900, fontSize: '2.8rem',
          color: '#0F172A', letterSpacing: '-1px',
          lineHeight: 1.15, marginBottom: '1rem',
        }}>
          Trouvez le <span style={{ color: '#0d6efd' }}>professeur parfait</span><br />
          près de chez vous
        </h1>

        <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '2.5rem' }}>
          Des milliers de professeurs qualifiés · Diplômes vérifiés · Premier cours offert
        </p>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSubmit} className="row justify-content-center g-2 mb-3">
          <div className="col-md-5 position-relative">
            <input
              id="matiere-input"
              type="text"
              className="form-control"
              style={{ height: 48, borderRadius: 12, fontSize: '0.95rem' }}
              placeholder="Matière (Maths, Physique...)"
              value={matiereInput}
              onChange={e => { setMatiereInput(e.target.value); setShowMatiere(true); }}
              onFocus={() => setShowMatiere(true)}
              onBlur={() => setTimeout(() => setShowMatiere(false), 300)}
            />
            {showMatiere && matieresFiltrees.length > 0 && (
              <div className="dropdown-menu show position-absolute w-100 mt-1 p-0 shadow-sm" style={{ zIndex: 1000 }}>
                {matieresFiltrees.map(m => (
                  <div
                    key={m.id_matiere}
                    className="dropdown-item"
                    onMouseDown={(e) => { e.preventDefault(); selectMatiere(m.nom); }}
                    style={{ cursor: 'pointer' }}
                  >
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
              style={{ height: 48, borderRadius: 12, fontSize: '0.95rem' }}
              placeholder="Ville (Casablanca, Rabat...)"
              value={villeInput}
              onChange={e => { setVilleInput(e.target.value); setShowVille(true); }}
              onFocus={() => setShowVille(true)}
              onBlur={() => setTimeout(() => setShowVille(false), 300)}
            />
            {showVille && villesFiltrees.length > 0 && (
              <div className="dropdown-menu show position-absolute w-100 mt-1 p-0 shadow-sm" style={{ zIndex: 1000 }}>
                {villesFiltrees.map(v => (
                  <div
                    key={v.id_ville}
                    className="dropdown-item"
                    onMouseDown={(e) => { e.preventDefault(); selectVille(v.nom); }}
                    style={{ cursor: 'pointer' }}
                  >
                    {v.nom}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-md-auto">
            <button type="submit" className="btn btn-primary px-4" style={{ height: 48, borderRadius: 12, fontWeight: 700, fontSize: '0.95rem' }}>
              <i className="bi bi-search me-2"></i>Rechercher
            </button>
          </div>
        </form>

        {/* Tags matières */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          {tags.map(m => (
            <button
              key={m.id_matiere}
              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              onClick={() => setMatiereInput(m.nom)}
            >
              {m.nom}
            </button>
          ))}
        </div>

        {/* ===== BOUTON CTA ÉTUDIANT ===== */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '1.5rem',
          flexWrap: 'wrap', marginTop: '1.5rem',
        }}>

          {/* Bouton principal étudiant */}
          <Link
            to="/register?role=etudiant"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
              color: 'white', borderRadius: 14,
              padding: '14px 28px', fontWeight: 800,
              fontSize: '0.95rem', textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(13,110,253,0.35)',
              transition: 'all 0.2s',
              border: 'none',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(13,110,253,0.45)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(13,110,253,0.35)';
            }}
          >
            <i className="bi bi-person-plus-fill" style={{ fontSize: '1.1rem' }}></i>
            Je suis étudiant — Inscription gratuite
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 8, padding: '2px 8px',
              fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: 0.5,
            }}>
              GRATUIT
            </span>
          </Link>

          {/* Séparateur */}
          <span style={{ color: '#CBD5E1', fontWeight: 500, fontSize: '0.85rem' }}>ou</span>

          {/* Bouton secondaire enseignant */}
          <Link
            to="/register?role=enseignant"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'white', color: '#374151',
              borderRadius: 14, padding: '13px 24px',
              fontWeight: 700, fontSize: '0.88rem',
              textDecoration: 'none',
              border: '1.5px solid #E2E8F0',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = '#0d6efd';
              e.currentTarget.style.color = '#0d6efd';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i className="bi bi-briefcase"></i>
            Devenir enseignant
          </Link>
        </div>

        {/* Social proof sous les boutons */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 20,
          marginTop: '1.5rem', flexWrap: 'wrap',
        }}>
          {[
            { icon: 'bi-shield-check', text: 'Diplômes vérifiés' },
            { icon: 'bi-gift', text: '1er cours offert' },
            { icon: 'bi-star-fill', text: 'Note moyenne 4.9' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#6B7280', fontSize: '0.8rem', fontWeight: 600,
            }}>
              <i className={`bi ${item.icon}`} style={{ color: '#0d6efd', fontSize: '0.9rem' }}></i>
              {item.text}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HeroSection;