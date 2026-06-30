// src/components/home/HeroSection.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function HeroSection() {
  const navigate = useNavigate();

  const [matiereInput, setMatiereInput] = useState('');
  const [villeInput, setVilleInput] = useState('');
  const [matieres, setMatieres] = useState([]);
  const [villes, setVilles] = useState([]);
  const [showMatiere, setShowMatiere] = useState(false);
  const [showVille, setShowVille] = useState(false);

  useEffect(function() {
    api.get('/matieres').then(function(res) {
      setMatieres(res.data);
    }).catch(function(err) {
      console.log(err);
    });

    api.get('/villes').then(function(res) {
      setVilles(res.data);
    }).catch(function(err) {
      console.log(err);
    });
  }, []);

  const matieresFiltrees = matieres.filter(function(m) {
    return m.nom.toLowerCase().includes(matiereInput.toLowerCase());
  });

  const villesFiltrees = villes.filter(function(v) {
    return v.nom.toLowerCase().includes(villeInput.toLowerCase());
  });

  function handleSubmit(e) {
    e.preventDefault();
    const isOnline = villeInput.toLowerCase().includes('en ligne');
    navigate('/teachers?search=' + matiereInput + '&ville=' + (isOnline ? '' : villeInput) + '&enligne=' + isOnline);
  }

  function selectMatiere(nom) {
    setMatiereInput(nom);
    setShowMatiere(false);
  }

  function selectVille(nom) {
    setVilleInput(nom);
    setShowVille(false);
  }

  function handleMatiereChange(e) {
    setMatiereInput(e.target.value);
    setShowMatiere(true);
  }

  function handleVilleChange(e) {
    setVilleInput(e.target.value);
    setShowVille(true);
  }

  function handleMatiereBlur() {
    setTimeout(function() { setShowMatiere(false); }, 200);
  }

  function handleVilleBlur() {
    setTimeout(function() { setShowVille(false); }, 200);
  }

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
    <section style={{ padding: '3rem 0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
      <div className="container">
        <div style={{ maxWidth: 850, margin: '0 auto', textAlign: 'center' }}>

          <div style={{ display: 'inline-block', background: '#EFF6FF', color: '#0d6efd', padding: '5px 14px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.8rem', letterSpacing: '0.5px' }}>
            <i className="bi bi-star-fill me-1" style={{ fontSize: '0.65rem' }}></i>
            PLUS DE 500 PROFESSEURS QUALIFIÉS
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem', letterSpacing: '-1px', lineHeight: 1.2 }}>
            Trouvez votre{' '}
            <span style={{ background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              professeur parfait
            </span>
          </h1>

          <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '2rem', maxWidth: 550, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
            Des milliers de professeurs qualifiés près de chez vous. Premier cours offert !
          </p>

          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <div style={{ background: 'white', borderRadius: '60px', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.1)', padding: '6px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>

              <div style={{ flex: 2, position: 'relative', display: 'flex', alignItems: 'center', minWidth: '180px' }}>
                <i className="bi bi-book" style={{ position: 'absolute', left: '20px', color: '#0d6efd', fontSize: '1rem', zIndex: 1 }}></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Essayer 'Maths'"
                  value={matiereInput}
                  onChange={handleMatiereChange}
                  onFocus={function() { setShowMatiere(true); }}
                  onBlur={handleMatiereBlur}
                  style={{ width: '100%', padding: '14px 20px 14px 48px', border: 'none', borderRadius: '60px', fontSize: '0.85rem', outline: 'none', background: 'transparent', fontWeight: 600, color: '#334155' }}
                />
                {showMatiere && matieresFiltrees.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', marginTop: '8px', zIndex: 1000, maxHeight: '280px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '8px' }}>
                    {matieresFiltrees.slice(0, 10).map(function(m) {
                      return (
                        <div
                          key={m.id_matiere}
                          onMouseDown={function(e) { e.preventDefault(); selectMatiere(m.nom); }}
                          style={{ padding: '10px 12px', cursor: 'pointer', borderRadius: '12px', fontSize: '0.85rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <i className="bi bi-search" style={{ fontSize: '0.75rem', color: '#94A3B8' }}></i>
                          <span>{m.nom}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }}></div>

              <div style={{ flex: 2, position: 'relative', display: 'flex', alignItems: 'center', minWidth: '180px' }}>
                <i className="bi bi-geo-alt" style={{ position: 'absolute', left: '20px', color: '#0d6efd', fontSize: '1rem', zIndex: 1 }}></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Adresse ou ville"
                  value={villeInput}
                  onChange={handleVilleChange}
                  onFocus={function() { setShowVille(true); }}
                  onBlur={handleVilleBlur}
                  style={{ width: '100%', padding: '14px 20px 14px 48px', border: 'none', borderRadius: '60px', fontSize: '0.85rem', outline: 'none', background: 'transparent', fontWeight: 600, color: '#334155' }}
                />
                {showVille && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', marginTop: '8px', zIndex: 1000, maxHeight: '280px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}>
                    <div
                      onMouseDown={function(e) { e.preventDefault(); selectVille('En ligne'); }}
                      style={{ padding: '10px 12px', cursor: 'pointer', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}
                    >
                      En ligne
                    </div>
                    {villesFiltrees.filter(function(v) {
                      return v.nom !== 'En ligne';
                    }).slice(0, 15).map(function(v) {
                      return (
                        <div
                          key={v.id_ville}
                          onMouseDown={function(e) { e.preventDefault(); selectVille(v.nom); }}
                          style={{ padding: '10px 12px', cursor: 'pointer', borderRadius: '12px', fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <span>{v.nom}</span>
                          <span style={{ fontSize: '0.65rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: '20px', color: '#64748b' }}>Maroc</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button type="submit" style={{ padding: '10px 24px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Rechercher
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '1.5rem' }}>
            {tags.map(function(tag) {
              return (
                <button
                  key={tag.name}
                  onClick={function() { setMatiereInput(tag.name); }}
                  style={{ padding: '8px 20px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '40px', fontSize: '0.85rem', fontWeight: 500, color: '#4A5568', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className={`bi ${tag.icon}`} style={{ fontSize: '0.9rem', color: '#0d6efd' }}></i>
                  {tag.name}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;