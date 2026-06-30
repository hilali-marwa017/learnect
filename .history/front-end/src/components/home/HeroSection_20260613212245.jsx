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
  onSearch,
  onReset
}) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);

  const ink = isDark ? '#f0f0f0' : '#111111';
  const muted = isDark ? '#888888' : '#666666';
  const dimmed = isDark ? '#444444' : '#aaaaaa';
  const bgCard = isDark ? '#1a1a1a' : '#ffffff';
  const bdr = isDark ? '#2a2a2a' : '#e9ecef';
  const orange = '#e96f2a';

  // Fonction pour obtenir l'icône selon la catégorie
  const getCategoryIcon = function(categorie) {
    if (!categorie) return <BookOpen size={12} color={orange} />;
    switch(categorie) {
      case 'Sciences': return <Calculator size={12} color={orange} />;
      case 'Langues': return <Languages size={12} color={orange} />;
      case 'Lettres': return <PenTool size={12} color={orange} />;
      case 'Économie': return <TrendingUp size={12} color={orange} />;
      case 'Droit': return <Scale size={12} color={orange} />;
      case 'Arts': return <Palette size={12} color={orange} />;
      case 'Sport': return <Music size={12} color={orange} />;
      default: return <BookOpen size={12} color={orange} />;
    }
  };

  // MÉTHODE DAIF: Fetch subjects
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

  // MÉTHODE DAIF: Fetch cities
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

  // Filtrer les matières
  const getFilteredSubjects = function() {
    if (subjectsList.length === 0) return [];
    if (!querySubject) return subjectsList.slice(0, 7);
    
    return subjectsList.filter(function(s) {
      return s.nom.toLowerCase().includes(querySubject.toLowerCase());
    }).slice(0, 7);
  };

  // Filtrer les villes
  const getFilteredCities = function() {
    if (citiesList.length === 0) return [];
    if (!queryCity) return citiesList.slice(0, 6);
    
    return citiesList.filter(function(c) {
      return c.toLowerCase().includes(queryCity.toLowerCase());
    }).slice(0, 6);
  };

  // Top 7 matières pour les pills
  const subjectPills = subjectsList.slice(0, 7);

  // Fonction pour défiler vers la section des professeurs
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
    <section style={{ padding: '5rem 2rem 3rem', textAlign: 'center' }}>
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
        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
        fontWeight: 800,
        color: ink,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        margin: '0 auto 1.2rem',
        maxWidth: 620
      }}>
        Trouvez le professeur parfait
      </h1>

      <p style={{
        fontSize: '0.95rem',
        color: muted,
        maxWidth: 480,
        margin: '0 auto 2.5rem',
        lineHeight: 1.75
      }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
        Premier cours offert par nos tuteurs.
      </p>

      {/* Search bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: bgCard,
        border: `1.5px solid ${bdr}`,
        borderRadius: 14,
        padding: 6,
        maxWidth: 700,
        margin: '0 auto 1.5rem',
        boxShadow: isDark ? 'none' : '0 2px 16px rgba(0,0,0,0.06)'
      }}>
        {/* Subject input */}
        <div style={{ flex: 1, position: 'relative', borderRight: `1px solid ${bdr}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
            <Search size={16} color={dimmed} />
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
                fontSize: '0.83rem',
                width: '100%'
              }}
            />
            {querySubject && (
              <X size={14} color={dimmed} style={{ cursor: 'pointer' }} onClick={function() { setQuerySubject(''); }} />
            )}
          </div>

          {showSubjectDrop && !loadingSubjects && getFilteredSubjects().length > 0 && (
            <div style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              background: bgCard,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              zIndex: 60,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}>
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
                      gap: 8
                    }}
                    onMouseEnter={function(e) { 
                      e.currentTarget.style.background = isDark ? '#222' : '#fff7f0'; 
                    }}
                    onMouseLeave={function(e) { 
                      e.currentTarget.style.background = 'transparent'; 
                    }}
                  >
                    {getCategoryIcon(s.categorie)}
                    <span style={{ flex: 1 }}>{s.nom}</span>
                    <span style={{ fontSize: '0.6rem', color: dimmed }}>{s.categorie}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* City input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
            <MapPin size={16} color={dimmed} />
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
                fontSize: '0.83rem',
                width: '100%'
              }}
            />
            {queryCity && (
              <X size={14} color={dimmed} style={{ cursor: 'pointer' }} onClick={function() { setQueryCity(''); }} />
            )}
          </div>

          {showCityDrop && !loadingCities && getFilteredCities().length > 0 && (
            <div style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              background: bgCard,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              zIndex: 60,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}>
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
                      gap: 8
                    }}
                    onMouseEnter={function(e) { 
                      e.currentTarget.style.background = isDark ? '#222' : '#fff7f0'; 
                    }}
                    onMouseLeave={function(e) { 
                      e.currentTarget.style.background = 'transparent'; 
                    }}
                  >
                    <MapPin size={12} color={orange} />
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
            borderRadius: 10,
            padding: '11px 26px',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          Rechercher
        </button>
      </div>

      {/* Pills - Avec catégories et icônes */}
      {subjectPills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <span style={{
            fontSize: '0.62rem',
            color: dimmed,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            width: '100%',
            marginBottom: 4
          }}>
            Accès Rapide
          </span>
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
                  padding: '5px 16px',
                  borderRadius: 99,
                  border: `1px solid ${isActive ? orange : bdr}`,
                  background: isActive ? orange : 'transparent',
                  color: isActive ? '#fff' : muted,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'all .15s'
                }}
              >
                {getCategoryIcon(pill.categorie)}
                <span>{pill.nom}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Loading state */}
      {(loadingSubjects || loadingCities) && (
        <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: dimmed }}>
          Chargement des données...
        </div>
      )}
    </section>
  );
}