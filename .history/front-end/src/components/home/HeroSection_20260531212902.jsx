// src/components/home/HeroSection.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function HeroSection() {
  const navigate = useNavigate();

  const [matiereInput, setMatiereInput] = useState('');
  const [villeInput, setVilleInput] useState('');
  const [matieres, setMatieres] = useState([]);
  const [showMatiere, setShowMatiere] = useState(false);
  const [showVille, setShowVille] = useState(false);

  const matiereRef = useRef(null);
  const villeRef = useRef(null);

  const VILLES = [
    'Casablanca', 'Rabat', 'Marrakech', 'Tanger',
    'Fès', 'Agadir', 'Meknès', 'Oujda', 'Kénitra',
    'Tétouan', 'Salé', 'Temara', 'En ligne (webcam)'
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/matieres');
        setMatieres(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    load();
  }, []);

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

  const villesFiltrees = VILLES.filter(v =>
    v.toLowerCase().includes(villeInput.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    const isOnline = villeInput.toLowerCase().includes('ligne') ||
      villeInput.toLowerCase().includes('webcam');
    navigate(`/teachers?search=${matiereInput}&ville=${isOnline ? '' : villeInput}&enligne=${isOnline}`);
  }

  function selectMatiere(nom) {
    setMatiereInput(nom);
    setShowMatiere(false);
  }

  function selectVille(ville) {
    setVilleInput(ville);
    setShowVille(false);
  }

  const tags = matieres.slice(0, 6);

  return (
    <section style={{
      background: 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)',
      padding: '5rem 0 4rem',
      textAlign: 'center',
    }}>
      <div className="container">

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          border: '1px solid #E2E8F0', background: 'white',
          color: '#374151', padding: '5px 16px',
          borderRadius: 20, fontSize: '0.78rem', fontWeight: 500,
          marginBottom: '1.5rem',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#0d6efd', display: 'inline-block',
          }} />
          Soutien Scolaire Particulier au Maroc • 100% Direct & Transparent
        </div>

        {/* Titre */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800, color: '#0F172A',
          lineHeight: 1.15, letterSpacing: '-1px',
          marginBottom: '0.5rem',
        }}>
          Le cours particulier qui<br />vous ressemble.
        </h1>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
          fontWeight: 800, color: '#0d6efd',
          marginBottom: '1rem',
        }}>
          Trouvez le prof idéal.
        </h2>
        <p style={{
          color: '#6B7280', fontSize: '0.95rem',
          maxWidth: 500, margin: '0 auto 2.5rem', lineHeight: 1.7,
        }}>
          Des cours d'accompagnement d'exception certifiés,
          sans frais de dossier. <strong>10% de commission unique</strong> pour le professeur,
          1er cours offert pour l'élève.
        </p>

        {/* Search Box */}
        <form onSubmit={handleSubmit} style={{
          maxWidth: 660, margin: '0 auto 1.5rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center',
            padding: '5px 5px 5px 16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          }}>
            {/* Matière input */}
            <div style={{ flex: 1, position: 'relative' }} ref={matiereRef}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-book" style={{ color: '#0d6efd' }} />
                <input
                  style={{
                    border: 'none', outline: 'none',
                    fontSize: '0.9rem', color: '#0F172A',
                    background: 'transparent', width: '100%',
                    padding: '8px 0',
                  }}
                  placeholder="Quelle matière ? (ex: Mathématiques)"
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
                        <span style={{ fontSize: '0.88rem', color: '#0F172A' }}>
                          {m.nom}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        background: '#EFF6FF',
                        color: '#0d6efd',
                        padding: '2px 8px',
                        borderRadius: 10,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}>
                        {m.categorie}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: 1, height: 28, background: '#E2E8F0', margin: '0 8px', flexShrink: 0 }} />

            {/* Ville input */}
            <div style={{ flex: 1, position: 'relative' }} ref={villeRef}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-geo-alt" style={{ color: '#0d6efd' }} />
                <input
                  style={{
                    border: 'none', outline: 'none',
                    fontSize: '0.9rem', color: '#0F172A',
                    background: 'transparent', width: '100%',
                    padding: '8px 0',
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
                  <div
                    onClick={() => selectVille('Autour de moi')}
                    style={{
                      padding: '10px 16px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8,
                      borderBottom: '1px solid #F1F5F9',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <i className="bi bi-crosshair" style={{ color: '#0d6efd' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F172A' }}>
                      Autour de moi
                    </span>
                  </div>

                  <div
                    onClick={() => selectVille('En ligne (webcam)')}
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

                  {villesFiltrees.filter(v =>
                    !v.includes('ligne') && !v.includes('webcam')
                  ).map(v => (
                    <div
                      key={v}
                      onClick={() => selectVille(v)}
                      style={{
                        padding: '10px 16px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                      <i className="bi bi-geo-alt" style={{ color: '#94A3B8' }} />
                      <span style={{ fontSize: '0.88rem', color: '#374151' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" style={{
              background: '#0d6efd',
              color: 'white', border: 'none',
              padding: '11px 24px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center', gap: 6,
            }}>
              <i className="bi bi-search" />
              Rechercher
            </button>
          </div>
        </form>

        {/* Tags matières */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap', gap: 8,
          marginTop: '1.2rem',
        }}>
          <span style={{
            color: '#94A3B8', fontSize: '0.75rem',
            fontWeight: 600, letterSpacing: 1,
            textTransform: 'uppercase',
          }}>
            RACCOURCIS :
          </span>
          {tags.map(m => (
            <button
              key={m.id_matiere}
              onClick={() => navigate(`/teachers?search=${m.nom}`)}
              style={{
                background: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: 20,
                padding: '5px 14px',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#0d6efd';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = '#0d6efd';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              {m.nom.length > 12 ? m.nom.slice(0, 12) + '...' : m.nom}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;