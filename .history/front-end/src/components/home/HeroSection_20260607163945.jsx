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
    <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc)' }}>
      <div className="container">
        <div style={{ maxWidth: 850, margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-block', background: '#EFF6FF', color: '#0d6efd', padding: '6px 16px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.5px' }}>
            <i className="bi bi-star-fill me-1" style={{ fontSize: '0.7rem' }}></i>
            PLUS DE 500 PROFESSEURS QUALIFIÉS
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', letterSpacing: '-1px', lineHeight: 1.2 }}>
            Trouvez votre{' '}
            <span style={{ background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              professeur parfait
            </span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#6B7280', marginBottom: '2.5rem', maxWidth: 550, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Des milliers de professeurs qualifiés près de chez vous. Premier cours offert !
          </p>

          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <div style={{ background: 'white', borderRadius: '60px', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.1)', padding: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              
              <div style={{ flex: 2, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: '20px', color: '#94A3B8', fontSize: '1.1rem', zIndex: 1 }}></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Essayer 'Maths'"
                  value={matiereInput}
                  onChange={e => { setMatiereInput(e.target.value); setShowMatiere(true); }}
                  onFocus={() => setShowMatiere(true)}
                  onBlur={() => setTimeout(() => setShowMatiere(false), 200)}
                  style={{ width: '100%', padding: '16px 20px 16px 52px', border: 'none', borderRadius: '60px', fontSize: '1rem', outline: 'none', background: '#F8FAFC' }}
                />
                {showMatiere && matieresFiltrees.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', marginTop: '8px', zIndex: 1000, maxHeight: '280px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    {matieresFiltrees.slice(0, 10).map(m => (
                      <div key={m.id_matiere} onMouseDown={(e) => { e.preventDefault(); selectMatiere(m.nom); }} style={{ padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', fontSize: '0.95rem', fontWeight: 500 }}>
                        {m.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ width: '1px', height: '32px', background: '#E2E8F0' }}></div>

              <div style={{ flex: 2, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <i className="bi bi-geo-alt" style={{ position: 'absolute', left: '20px', color: '#94A3B8', fontSize: '1.1rem', zIndex: 1 }}></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Adresse ou ville"
                  value={villeInput}
                  onChange={e => { setVilleInput(e.target.value); setShowVille(true); }}
                  onFocus={() => setShowVille(true)}
                  onBlur={() => setTimeout(() => setShowVille(false), 200)}
                  style={{ width: '100%', padding: '16px 20px 16px 52px', border: 'none', borderRadius: '60px', fontSize: '1rem', outline: 'none', background: '#F8FAFC' }}
                />
                {showVille && villesFiltrees.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', marginTop: '8px', zIndex: 1000, maxHeight: '280px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <div onMouseDown={(e) => { e.preventDefault(); selectVille('En ligne'); }} style={{ padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', fontSize: '0.95rem', fontWeight: 500 }}>
                      <i className="bi bi-wifi me-2" style={{ color: '#0d6efd' }}></i>En ligne (webcam)
                    </div>
                    {villesFiltrees.filter(v => v.nom !== 'En ligne').slice(0, 15).map(v => (
                      <div key={v.id_ville} onMouseDown={(e) => { e.preventDefault(); selectVille(v.nom); }} style={{ padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', fontSize: '0.95rem', fontWeight: 500 }}>
                        <i className="bi bi-geo-alt me-2" style={{ color: '#94A3B8' }}></i>{v.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', color: 'white', border: 'none', borderRadius: '60px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(13,110,253,0.3)' }}>
                <i className="bi bi-search me-2"></i>Rechercher
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '2rem' }}>
            {tags.map(tag => (
              <button
                key={tag.name}
                onClick={() => setMatiereInput(tag.name)}
                style={{ padding: '10px 24px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '40px', fontSize: '0.9rem', fontWeight: 500, color: '#4A5568', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <i className={`bi ${tag.icon}`} style={{ fontSize: '1rem', color: '#0d6efd' }}></i>
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