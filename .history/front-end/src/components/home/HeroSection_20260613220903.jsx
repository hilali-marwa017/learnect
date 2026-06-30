import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({
  isDark,
  querySubject,
  setQuerySubject,
  queryCity,
  setQueryCity,
  activePill,
  setActivePill
}) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const ink = isDark ? '#fcfdff' : '#07090d';
  const charcoal = isDark ? 'rgba(252, 253, 255, 0.7)' : '#4a5568';
  const mute = isDark ? '#a1a4a5' : '#718096';
  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';
  const orange = '#e04f00';

  const getIcon = function(categorie) {
    const style = { width: 14, height: 14, color: orange, flexShrink: 0 };
    if (!categorie) return <BookOpen style={style} />;
    const cat = categorie.toLowerCase();
    if (cat === 'sciences') return <Calculator style={style} />;
    if (cat === 'langues') return <Languages style={style} />;
    if (cat === 'économie') return <TrendingUp style={style} />;
    if (cat === 'droit') return <Scale style={style} />;
    return <BookOpen style={style} />;
  };

  useEffect(function() {
    async function fetchData() {
      try {
        setLoading(true);
        const [subjectsRes, citiesRes] = await Promise.all([
          api.get('/matieres'),
          api.get('/villes')
        ]);
        
        let subjects = [];
        if (Array.isArray(subjectsRes.data)) {
          subjects = subjectsRes.data.map(function(item) {
            return {
              nom: item.nom || item.name || '',
              categorie: item.categorie || 'Général'
            };
          }).filter(function(s) { return s.nom; });
        }
        setSubjectsList(subjects);

        let cities = [];
        if (Array.isArray(citiesRes.data)) {
          cities = citiesRes.data.map(function(item) {
            return item.nom || item.name || item.ville || '';
          }).filter(function(c) { return c; });
        }
        setCitiesList(cities);
      } catch(err) {
        console.error('Erreur chargement:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredSubjects = subjectsList.filter(function(s) {
    return !querySubject || s.nom.toLowerCase().includes(querySubject.toLowerCase());
  }).slice(0, 8);

  const filteredCities = citiesList.filter(function(c) {
    return !queryCity || c.toLowerCase().includes(queryCity.toLowerCase());
  }).slice(0, 8);

  // SCROLL UNIQUEMENT SUR LE BOUTON RECHERCHER
  const handleSearchScroll = function() {
    setTimeout(function() {
      const tutorsSection = document.getElementById('tutors-section');
      if (tutorsSection) {
        tutorsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Pas de scroll ici - on met juste à jour la valeur
  const handleSubjectSelect = function(subject) {
    setQuerySubject(subject);
    setShowSubjectDrop(false);
    // PAS DE SCROLL ICI
  };

  // Pas de scroll ici - on met juste à jour la valeur
  const handleCitySelect = function(city) {
    setQueryCity(city);
    setShowCityDrop(false);
    // PAS DE SCROLL ICI
  };

  // Scroll pour les pills quand on clique
  const handlePillClick = function(pillNom, isActive) {
    if (isActive) {
      setActivePill(null);
      setQuerySubject('');
    } else {
      setActivePill(pillNom);
      setQuerySubject(pillNom);
    }
    handleSearchScroll(); // Scroll seulement quand on clique sur une pill
  };

  return (
    <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
      <span style={{
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: orange,
        display: 'block',
        marginBottom: '0.5rem'
      }}>
        SOUTIEN SCOLAIRE D'EXCEPTION AU MAROC
      </span>

      <h1 style={{
        fontFamily: "'EB Garamond', serif",
        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
        fontWeight: 700,
        color: ink,
        lineHeight: 1.1,
        maxWidth: 700,
        margin: '0 auto 1rem'
      }}>
        Trouvez le professeur parfait
      </h1>

      <p style={{
        fontSize: '0.95rem',
        color: charcoal,
        maxWidth: 550,
        margin: '0 auto 2rem',
        lineHeight: 1.6
      }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
        Premier cours offert par nos tuteurs.
      </p>

      {/* Search bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        background: bgCard,
        border: `1px solid ${bdr}`,
        borderRadius: 16,
        padding: 4,
        maxWidth: 800,
        margin: '0 auto',
        gap: 4
      }}>
        {/* Subject input */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            background: 'transparent',
            borderRadius: 12,
            height: '100%'
          }}>
            <Search size={18} color={mute} style={{ flexShrink: 0 }} />
            <input
              value={querySubject}
              onChange={function(e) {
                setQuerySubject(e.target.value);
                setActivePill(null);
              }}
              onFocus={function() { setShowSubjectDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowSubjectDrop(false); }, 200); }}
              placeholder={loading ? "Chargement..." : "Quelle matière ?"}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: ink,
                fontSize: '0.85rem',
                width: '100%',
                minWidth: 0
              }}
            />
          </div>

          {showSubjectDrop && !loading && filteredSubjects.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: bgCard,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              zIndex: 60,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              maxHeight: 300,
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              {filteredSubjects.map(function(s) {
                return (
                  <div
                    key={s.nom}
                    onMouseDown={function() { handleSubjectSelect(s.nom); }}
                    style={{
                      padding: '12px 16px',
                      fontSize: '0.8rem',
                      color: ink,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={function(e) {
                      e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5';
                    }}
                    onMouseLeave={function(e) {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {getIcon(s.categorie)}
                    <span style={{ flex: 1, textAlign: 'left' }}>{s.nom}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Separator */}
        <div style={{ width: 1, background: bdr, margin: '8px 0' }} />

        {/* City input */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            background: 'transparent',
            borderRadius: 12,
            height: '100%'
          }}>
            <MapPin size={18} color={mute} style={{ flexShrink: 0 }} />
            <input
              value={queryCity}
              onChange={function(e) { setQueryCity(e.target.value); }}
              onFocus={function() { setShowCityDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowCityDrop(false); }, 200); }}
              placeholder={loading ? "Chargement..." : "Ville"}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: ink,
                fontSize: '0.85rem',
                width: '100%',
                minWidth: 0
              }}
            />
          </div>

          {showCityDrop && !loading && filteredCities.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: bgCard,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              zIndex: 60,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              maxHeight: 300,
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              {filteredCities.map(function(c) {
                return (
                  <div
                    key={c}
                    onMouseDown={function() { handleCitySelect(c); }}
                    style={{
                      padding: '12px 16px',
                      fontSize: '0.8rem',
                      color: ink,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={function(e) {
                      e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5';
                    }}
                    onMouseLeave={function(e) {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <MapPin size={14} color={orange} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, textAlign: 'left' }}>{c}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search button - SEUL ENDROIT OÙ IL Y A SCROLL */}
        <button
          onClick={handleSearchScroll}
          style={{
            background: orange,
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '0 28px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'opacity 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={function(e) { e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={function(e) { e.currentTarget.style.opacity = '1'; }}
        >
          <Search size={16} />
          Rechercher
        </button>
      </div>

      {/* Pills - Top matières */}
      {!loading && subjectsList.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 10,
          marginTop: '2rem'
        }}>
          {subjectsList.slice(0, 8).map(function(pill) {
            const isActive = activePill === pill.nom;
            return (
              <button
                key={pill.nom}
                onClick={function() { handlePillClick(pill.nom, isActive); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 18px',
                  borderRadius: 100,
                  border: `1px solid ${isActive ? orange : bdr}`,
                  background: isActive ? orange : 'transparent',
                  color: isActive ? '#fff' : charcoal,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {getIcon(pill.categorie)}
                <span>{pill.nom}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div style={{ marginTop: '1rem' }}>
          <span style={{ fontSize: '0.7rem', color: mute }}>Chargement des données...</span>
        </div>
      )}
    </section>
  );
}