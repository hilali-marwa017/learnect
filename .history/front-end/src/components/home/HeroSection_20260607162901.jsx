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
    { name: 'Anglais', icon: 'bi-translate' },
    { name: 'Maths', icon: 'bi-calculator' },
    { name: 'Français', icon: 'bi-book' },
    { name: 'Arabe', icon: 'bi-chat-dots' },
    { name: 'Coaching Sportif', icon: 'bi-heart' },
    { name: 'Soutien scolaire', icon: 'bi-backpack' },
    { name: 'Physique - Chimie', icon: 'bi-flask' },
    { name: 'Espagnol', icon: 'bi-globe' },
    { name: 'SVT', icon: 'bi-tree' },
    { name: 'Comptabilité', icon: 'bi-calculator' }
  ];

  return (
    <section style={{ padding: '4rem 0', background: 'white' }}>
      <div className="container">
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
            Essayier <span style={{ color: '#0d6efd' }}>"Maths"</span>
          </h1>

          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <div style={{ background: 'white', borderRadius: '60px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 2, position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Essayer 'Maths'"
                  value={matiereInput}
                  onChange={e => { setMatiereInput(e.target.value); setShowMatiere(true); }}
                  onFocus={() => setShowMatiere(true)}
                  onBlur={() => setTimeout(() => setShowMatiere(false), 200)}
                  style={{ width: '100%', padding: '14px 20px', border: 'none', borderRadius: '60px', fontSize: '0.95rem', outline: 'none', background: 'transparent' }}
                />
                {showMatiere && matieresFiltrees.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', marginTop: '8px', zIndex: 1000, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {matieresFiltrees.slice(0, 10).map(m => (
                      <div key={m.id_matiere} onMouseDown={(e) => { e.preventDefault(); selectMatiere(m.nom); }} style={{ padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}>
                        {m.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ width: '1px', height: '30px', background: '#E2E8F0' }}></div>
              <div style={{ flex: 2, position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Adresse ou ville"
                  value={villeInput}
                  onChange={e => { setVilleInput(e.target.value); setShowVille(true); }}
                  onFocus={() => setShowVille(true)}
                  onBlur={() => setTimeout(() => setShowVille(false), 200)}
                  style={{ width: '100%', padding: '14px 20px', border: 'none', borderRadius: '60px', fontSize: '0.95rem', outline: 'none', background: 'transparent' }}
                />
                {showVille && villesFiltrees.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', marginTop: '8px', zIndex: 1000, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
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
              <button type="submit" style={{ padding: '14px 32px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '60px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Rechercher
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '1rem' }}>
            {tags.map(tag => (
              <button
                key={tag.name}
                onClick={() => setMatiereInput(tag.name)}
                style={{ padding: '8px 20px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '30px', fontSize: '0.85rem', color: '#4A5568', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className={`bi ${tag.icon}`} style={{ fontSize: '0.9rem' }}></i>
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;