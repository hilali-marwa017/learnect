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

  const tags = [
    'Anglais', 'Maths', 'Français', 'Arabe', 'Coaching Sportif',
    'Soutien scolaire', 'Physique - Chimie', 'Espagnol', 'SVT', 'Comptabilité'
  ];

  return (
    <section style={{ padding: '3rem 0', background: 'white' }}>
      <div className="container">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <div style={{ background: 'white', borderRadius: '60px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '8px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E2E8F0' }}>
              
              {/* Input Matière avec icône */}
              <div style={{ flex: 2, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: '18px', color: '#94A3B8', fontSize: '1rem', zIndex: 1 }}></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Anglais"
                  value={matiereInput}
                  onChange={e => { setMatiereInput(e.target.value); setShowMatiere(true); }}
                  onFocus={() => setShowMatiere(true)}
                  onBlur={() => setTimeout(() => setShowMatiere(false), 200)}
                  style={{ width: '100%', padding: '14px 20px 14px 48px', border: 'none', borderRadius: '60px', fontSize: '1rem', outline: 'none', background: 'transparent' }}
                />
                {showMatiere && matieresFiltrees.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', marginTop: '8px', zIndex: 1000, maxHeight: '280px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    {matieresFiltrees.slice(0, 10).map(m => (
                      <div key={m.id_matiere} onMouseDown={(e) => { e.preventDefault(); selectMatiere(m.nom); }} style={{ padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', fontSize: '0.9rem' }}>
                        {m.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Séparateur */}
              <div style={{ width: '1px', height: '30px', background: '#E2E8F0' }}></div>

              {/* Input Ville avec icône */}
              <div style={{ flex: 2, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <i className="bi bi-geo-alt" style={{ position: 'absolute', left: '18px', color: '#94A3B8', fontSize: '1rem', zIndex: 1 }}></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Adresse ou ville"
                  value={villeInput}
                  onChange={e => { setVilleInput(e.target.value); setShowVille(true); }}
                  onFocus={() => setShowVille(true)}
                  onBlur={() => setTimeout(() => setShowVille(false), 200)}
                  style={{ width: '100%', padding: '14px 20px 14px 48px', border: 'none', borderRadius: '60px', fontSize: '1rem', outline: 'none', background: 'transparent' }}
                />
                {showVille && villesFiltrees.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', marginTop: '8px', zIndex: 1000, maxHeight: '280px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <div onMouseDown={(e) => { e.preventDefault(); selectVille('En ligne'); }} style={{ padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}>
                      <i className="bi bi-wifi me-2" style={{ color: '#0d6efd' }}></i>En ligne (webcam)
                    </div>
                    {villesFiltrees.filter(v => v.nom !== 'En ligne').slice(0, 15).map(v => (
                      <div key={v.id_ville} onMouseDown={(e) => { e.preventDefault(); selectVille(v.nom); }} style={{ padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}>
                        <i className="bi bi-geo-alt me-2" style={{ color: '#94A3B8' }}></i>{v.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" style={{ padding: '14px 32px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '60px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Rechercher
              </button>
            </div>
          </form>

          {/* Tags comme sur l'image */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', rowGap: '12px', marginTop: '1rem' }}>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setMatiereInput(tag)}
                style={{ background: 'none', border: 'none', fontSize: '0.95rem', color: '#4A5568', cursor: 'pointer', padding: '4px 0' }}
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