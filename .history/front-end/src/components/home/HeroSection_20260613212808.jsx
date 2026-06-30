import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, BookOpen, Calculator, Languages, PenTool, TrendingUp, Scale, Palette, Music } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({
  isDark,
  querySubject,
  setQuerySubject,
  queryCity,
  setQueryCity,
  activePill,
  setActivePill,
  onSearch
}) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);

  const ink = isDark ? '#fcfdff' : '#07090d';
  const charcoal = isDark ? 'rgba(252, 253, 255, 0.7)' : '#4a5568';
  const mute = isDark ? '#a1a4a5' : '#718096';
  const stone = isDark ? '#464a4d' : '#a0aec0';
  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bgSurf = isDark ? '#101012' : '#f1f3f5';
  const bgDeep = isDark ? '#06060a' : '#edf2f7';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';
  const bdrLight = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  const orange = '#e04f00';
  const orangeGlow = isDark ? 'rgba(255, 89, 0, 0.12)' : 'rgba(224, 79, 0, 0.06)';

  const getCategoryIcon = function(categorie) {
    const iconStyle = { width: 14, height: 14, color: orange, flexShrink: 0 };
    if (!categorie) return <BookOpen style={iconStyle} />;
    switch(categorie.toLowerCase()) {
      case 'sciences': return <Calculator style={iconStyle} />;
      case 'langues': return <Languages style={iconStyle} />;
      case 'lettres': return <PenTool style={iconStyle} />;
      case 'économie': return <TrendingUp style={iconStyle} />;
      case 'droit': return <Scale style={iconStyle} />;
      case 'arts': return <Palette style={iconStyle} />;
      case 'sport': return <Music style={iconStyle} />;
      default: return <BookOpen style={iconStyle} />;
    }
  };

  useEffect(function() {
    async function fetchSubjects() {
      try {
        setLoadingSubjects(true);
        const response = await api.get('/matieres');
        let subjects = [];
        if (Array.isArray(response.data)) {
          subjects = response.data.map(function(item) {
            if (typeof item === 'string') {
              return { nom: item, categorie: 'Général' };
            }
            return {
              nom: item.nom || item.name || item.libelle || '',
              categorie: item.categorie || 'Général'
            };
          }).filter(function(s) { return s.nom !== ''; });
        }
        setSubjectsList(subjects);
      } catch (error) {
        console.error('Erreur fetch matieres:', error);
        setSubjectsList([]);
      } finally {
        setLoadingSubjects(false);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(function() {
    async function fetchCities() {
      try {
        setLoadingCities(true);
        const response = await api.get('/villes');
        let cities = [];
        if (Array.isArray(response.data)) {
          cities = response.data.map(function(item) {
            if (typeof item === 'string') return item;
            return item.nom || item.name || item.ville || item.libelle || '';
          }).filter(function(c) { return c !== ''; });
        }
        setCitiesList(cities);
      } catch (error) {
        console.error('Erreur fetch villes:', error);
        setCitiesList([]);
      } finally {
        setLoadingCities(false);
      }
    }
    fetchCities();
  }, []);

  const getFilteredSubjects = function() {
    if (subjectsList.length === 0) return [];
    if (!querySubject) return subjectsList.slice(0, 7);
    return subjectsList.filter(function(s) {
      return s.nom.toLowerCase().includes(querySubject.toLowerCase());
    }).slice(0, 7);
  };

  const getFilteredCities = function() {
    if (citiesList.length === 0) return [];
    if (!queryCity) return citiesList.slice(0, 6);
    return citiesList.filter(function(c) {
      return c.toLowerCase().includes(queryCity.toLowerCase());
    }).slice(0, 6);
  };

  const subjectPills = subjectsList.slice(0, 7);

  const handleSearchWithScroll = function() {
    onSearch();
    setTimeout(function() {
      const tutorsSection = document.getElementById('tutors-section');
      if (tutorsSection) {
        tutorsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section style={{
      position: 'relative',
      paddingTop: '8rem',
      paddingBottom: '6rem',
      background: `radial-gradient(circle at 50% -20%, ${orangeGlow} 0%, transparent 70%)`,
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        
        <span style={{
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: orange,
          display: 'block',
          marginBottom: '0.75rem'
        }}>
          SOUTIEN SCOLAIRE D'EXCEPTION AU MAROC
        </span>

        <h1 style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 800,
          color: ink,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          maxWidth: '800px',
          margin: '0 auto 1rem'
        }}>
          Trouvez le professeur parfait
        </h1>

        <p style={{
          fontSize: '1rem',
          color: charcoal,
          maxWidth: '550px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
          Premier cours offert par nos tuteurs.
        </p>

        {/* Search bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          background: bgCard,
          border: `1px solid ${bdr}`,
          borderRadius: 16,
          padding: '8px',
          maxWidth: 800,
          margin: '0 auto 1.5rem',
          boxShadow: isDark ? 'none' : '0 8px 32px rgba(0,0,0,0.08)',
          gap: '8px'
        }}>
          {/* Subject input */}
          <div style={{ flex: 2, position: 'relative', minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
              <Search size={18} color={stone} />
              <input
                value={querySubject}
                onChange={function(e) { 
                  setQuerySubject(e.target.value); 
                  setActivePill(null); 
                }}
                onFocus={function() { setShowSubjectDrop(true); }}
                onBlur={function() { setTimeout(function() { setShowSubjectDrop(false); }, 200); }}
                placeholder={loadingSubjects ? "Chargement des matières..." : "Quelle matière ? (Maths, SVT...)"}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: ink,
                  fontSize: '0.85rem',
                  width: '100%'
                }}
              />
              {querySubject && (
                <X size={16} color={stone} style={{ cursor: 'pointer' }} onClick={function() { setQuerySubject(''); }} />
              )}
            </div>

            {showSubjectDrop && !loadingSubjects && getFilteredSubjects().length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 8,
                background: bgCard,
                border: `1px solid ${bdr}`,
                borderRadius: 12,
                zIndex: 60,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
              }}>
                <div style={{
                  padding: '8px 12px',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 'bold',
                  color: mute,
                  borderBottom: `1px solid ${bdrLight}`,
                  background: bgDeep
                }}>
                  {querySubject ? 'Matières correspondantes' : 'Matières populaires'}
                </div>
                {getFilteredSubjects().map(function(s) {
                  return (
                    <div
                      key={s.nom}
                      onMouseDown={function() { 
                        setQuerySubject(s.nom); 
                        setShowSubjectDrop(false);
                        handleSearchWithScroll();
                      }}
                      style={{
                        padding: '10px 16px',
                        fontSize: '0.8rem',
                        color: ink,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={function(e) { e.currentTarget.style.background = orangeGlow; }}
                      onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {getCategoryIcon(s.categorie)}
                      <span style={{ flex: 1 }}>{s.nom}</span>
                      <span style={{ fontSize: '9px', color: mute, fontFamily: 'monospace' }}>{s.categorie}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: 32, background: bdrLight }} />

          {/* City input */}
          <div style={{ flex: 1, position: 'relative', minWidth: '180px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
              <MapPin size={18} color={stone} />
              <input
                value={queryCity}
                onChange={function(e) { setQueryCity(e.target.value); }}
                onFocus={function() { setShowCityDrop(true); }}
                onBlur={function() { setTimeout(function() { setShowCityDrop(false); }, 200); }}
                placeholder={loadingCities ? "Chargement des villes..." : "À Casablanca, Rabat..."}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: ink,
                  fontSize: '0.85rem',
                  width: '100%'
                }}
              />
              {queryCity && (
                <X size={16} color={stone} style={{ cursor: 'pointer' }} onClick={function() { setQueryCity(''); }} />
              )}
            </div>

            {showCityDrop && !loadingCities && getFilteredCities().length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 8,
                background: bgCard,
                border: `1px solid ${bdr}`,
                borderRadius: 12,
                zIndex: 60,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
              }}>
                <div style={{
                  padding: '8px 12px',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 'bold',
                  color: mute,
                  borderBottom: `1px solid ${bdrLight}`,
                  background: bgDeep
                }}>
                  {queryCity ? 'Villes correspondantes' : 'Villes principales'}
                </div>
                {getFilteredCities().map(function(c) {
                  return (
                    <div
                      key={c}
                      onMouseDown={function() { 
                        setQueryCity(c); 
                        setShowCityDrop(false);
                        handleSearchWithScroll();
                      }}
                      style={{
                        padding: '10px 16px',
                        fontSize: '0.8rem',
                        color: ink,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={function(e) { e.currentTarget.style.background = orangeGlow; }}
                      onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <MapPin size={14} color={orange} />
                      <span>{c}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleSearchWithScroll}
            style={{
              background: ink,
              color: bgCard,
              border: 'none',
              borderRadius: 12,
              padding: '10px 28px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
            onMouseEnter={function(e) { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={function(e) { e.currentTarget.style.opacity = '1'; }}
          >
            <Search size={16} />
            <span>Rechercher</span>
          </button>
        </div>

        {/* Pills */}
        {subjectPills.length > 0 && (
          <div>
            <span style={{
              fontSize: '9px',
              color: mute,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'block',
              marginBottom: 12
            }}>
              Accès Rapide
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
              {subjectPills.map(function(pill) {
                const isActive = activePill === pill.nom;
                return (
                  <button
                    key={pill.nom}
                    onClick={function() { 
                      if (isActive) {
                        setActivePill(null);
                        setQuerySubject('');
                      } else {
                        setActivePill(pill.nom);
                        setQuerySubject(pill.nom);
                      }
                      handleSearchWithScroll();
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 18px',
                      borderRadius: 100,
                      border: `1px solid ${isActive ? orange : bdr}`,
                      background: isActive ? orange : 'transparent',
                      color: isActive ? '#fff' : charcoal,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 0.15s'
                    }}
                  >
                    {getCategoryIcon(pill.categorie)}
                    <span>{pill.nom}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading dots */}
        {(loadingSubjects || loadingCities) && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
            <div style={{ width: 8, height: 8, background: orange, borderRadius: '50%', animation: 'bounce 0.6s ease-in-out infinite', animationDelay: '0ms' }} />
            <div style={{ width: 8, height: 8, background: orange, borderRadius: '50%', animation: 'bounce 0.6s ease-in-out infinite', animationDelay: '150ms' }} />
            <div style={{ width: 8, height: 8, background: orange, borderRadius: '50%', animation: 'bounce 0.6s ease-in-out infinite', animationDelay: '300ms' }} />
            <span style={{ fontSize: '0.7rem', color: mute, marginLeft: 8 }}>Chargement des données...</span>
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 96,
        background: 'linear-gradient(to top, var(--canvas-light), transparent)',
        pointerEvents: 'none'
      }} />
    </section>
  );
}