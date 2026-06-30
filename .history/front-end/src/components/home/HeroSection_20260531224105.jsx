import { useState, useEffect, useRef } from 'react';
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

  const matiereRef = useRef(null);
  const villeRef = useRef(null);

  // Charger les matières depuis l'API
  useEffect(() => {
    async function loadMatieres() {
      try {
        const res = await api.get('/matieres');
        setMatieres(res.data);
      } catch (err) {
        console.log('Erreur chargement matières:', err);
      }
    }
    loadMatieres();
  }, []);

  // Charger les villes depuis l'API
  useEffect(() => {
    async function loadVilles() {
      try {
        const res = await api.get('/villes');
        setVilles(res.data);
      } catch (err) {
        console.log('Erreur chargement villes:', err);
      }
    }
    loadVilles();
  }, []);

  // Fermer les dropdowns au clic externe
  useEffect(() => {
    function handleClickOutside(e) {
      if (matiereRef.current && !matiereRef.current.contains(e.target)) {
        setShowMatiere(false);
      }
      if (villeRef.current && !villeRef.current.contains(e.target)) {
        setShowVille(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matieresFiltrees = matieres.filter(m =>
    m.nom.toLowerCase().includes(matiereInput.toLowerCase())
  );

  const villesFiltrees = villes.filter(v =>
    v.nom.toLowerCase().includes(villeInput.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    const isOnline = villeInput.toLowerCase().includes('en ligne') ||
      villeInput.toLowerCase().includes('webcam');
    navigate(`/teachers?search=${matiereInput}&ville=${isOnline ? '' : villeInput}&enligne=${isOnline}`);
  }

  function selectMatiere(nom) {
    setMatiereInput(nom);
    setShowMatiere(false);
  }

  function selectVille(nom) {
    setVilleInput(nom);
    setShowVille(false);
  }

  const tags = matieres.slice(0, 6);

  return (
    <section style={{
      background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #F8FAFC 100%)',
      padding: '5rem 0 4rem',
      textAlign: 'center',
    }}>
      <div className="container">

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          border: '1px solid #BFDBFE', background: '#EFF6FF',
          color: '#1E40AF', padding: '5px 16px',
          borderRadius: 20, fontSize: '0.75rem', fontWeight: 500,
          marginBottom: '1.5rem',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#0d6efd', display: 'inline-block',
          }} />
          Cours particuliers au Maroc
        </div>

        {/* Titre principal */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800, color: '#0F172A',
          lineHeight: 1.2, letterSpacing: '-1px',
          marginBottom: '1rem',
        }}>
          Le cours particulier qui<br />vous correspond
        </h1>

        {/* Sous-titre */}
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          fontWeight: 700, color: '#0d6efd',
          marginBottom: '1rem',
        }}>
          Trouvez le professeur idéal
        </h2>

        {/* Description */}
        <p style={{
          color: '#64748B', fontSize: '0.95rem',
          maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.6,
        }}>
          Des professeurs qualifiés, une pédagogie sur-mesure.
          Premier cours offert pour chaque nouvelle matière.
        </p>

        {/* Search Box */}
        <form onSubmit={handleSubmit} style={{
          maxWidth: 720, margin: '0 auto 1.5rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: 20,
            border: '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center',
            padding: '6px 6px 6px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}>
            {/* Matière input */}
            <div style={{ flex: 1.5, position: 'relative' }} ref={matiereRef}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-book" style={{ color: '#0d6efd', fontSize: '1.1rem' }} />
                <input
                  style={{
                    border: 'none', outline: 'none',
                    fontSize: '0.9rem', color: '#0F172A',
                    background: 'transparent', width: '100%',
                    padding: '10px 0',
                  }}
                  placeholder="Quelle matière ? (Mathématiques, Physique...)"
                  value={matiereInput}
                  onChange={e => {
                    setMatiereInput(e.target.value);
                    setShowMatiere(true);
                  }}
                  onFocus={() => setShowMatiere(true)}
                />
              </div>

              {showMatiere && matieresFiltrees.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0,
                  width: '100%', minWidth: 300,
                  background: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  zIndex: 100, maxHeight: 280, overflowY: 'auto',
                  marginTop: 8,
                }}>
                  {matieresFiltrees.map(m => (
                    <div
                      key={m.id_matiere}
                      onClick={() => selectMatiere(m.nom)}
                      style={{
                        padding: '10px 16px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', gap: 8,
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="bi bi-mortarboard" style={{ color: '#0d6efd' }} />
                        <span style={{ fontSize: '0.88rem', color: '#0F172A', fontWeight: 500 }}>
                          {m.nom}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.7rem',
                        background: '#EFF6FF',
                        color: '#0d6efd',
                        padding: '2px 10px',
                        borderRadius: 20,
                        fontWeight: 600,
                      }}>
                        {m.categorie}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: 1, height: 32, background: '#E2E8F0', margin: '0 12px', flexShrink: 0 }} />

            {/* Ville input */}
            <div style={{ flex: 1, position: 'relative' }} ref={villeRef}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-geo-alt" style={{ color: '#0d6efd', fontSize: '1.1rem' }} />
                <input
                  style={{
                    border: 'none', outline: 'none',
                    fontSize: '0.9rem', color: '#0F172A',
                    background: 'transparent', width: '100%',
                    padding: '10px 0',
                  }}
                  placeholder="Adresse ou ville"
                  value={villeInput}
                  onChange={e => {
                    setVilleInput(e.target.value);
                    setShowVille(true);
                  }}
                  onFocus={() => setShowVille(true)}
                />
              </div>

              {showVille && villesFiltrees.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0,
                  width: '100%', minWidth: 220,
                  background: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  zIndex: 100, maxHeight: 240, overflowY: 'auto',
                  marginTop: 8,
                }}>
                  {/* Option en ligne */}
                  <div
                    onClick={() => selectVille('En ligne')}
                    style={{
                      padding: '10px 16px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8,
                      borderBottom: '1px solid #F1F5F9',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <i className="bi bi-camera-video" style={{ color: '#0d6efd' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F172A' }}>
                      En ligne
                    </span>
                  </div>

                  {/* Villes */}
                  {villesFiltrees.filter(v => v.nom !== 'En ligne').map(v => (
                    <div
                      key={v.id_ville}
                      onClick={() => selectVille(v.nom)}
                      style={{
                        padding: '10px 16px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                      <i className="bi bi-geo-alt" style={{ color: '#94A3B8' }} />
                      <span style={{ fontSize: '0.88rem', color: '#374151' }}>{v.nom}</span>
                      {v.region && (
                        <span style={{
                          fontSize: '0.65rem',
                          color: '#94A3B8',
                          marginLeft: 'auto',
                        }}>
                          {v.region}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" style={{
              background: '#0d6efd',
              color: 'white', border: 'none',
              padding: '12px 28px',
              borderRadius: 16,
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#0a58ca';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#0d6efd';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <i className="bi bi-search" />
              Rechercher
            </button>
          </div>
        </form>

        {/* Tags matières rapides */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap', gap: 10,
          marginTop: '2rem',
        }}>
          <span style={{
            color: '#94A3B8', fontSize: '0.7rem',
            fontWeight: 600, letterSpacing: 1,
            textTransform: 'uppercase',
          }}>
            RACCOURCIS :
          </span>
          {tags.map(m => (
            <button
              key={m.id_matiere}
              onClick={() => {
                setMatiereInput(m.nom);
                navigate(`/teachers?search=${m.nom}`);
              }}
              style={{
                background: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: 40,
                padding: '6px 18px',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#0d6efd';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = '#0d6efd';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {m.nom.length > 12 ? m.nom.slice(0, 16) + '...' : m.nom}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;