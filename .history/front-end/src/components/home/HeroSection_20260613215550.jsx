import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, BookOpen, Calculator, Languages, TrendingUp, Scale } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({
  isDark,
  querySubject,
  setQuerySubject,
  queryCity,
  setQueryCity,
  activePill,
  setActivePill,
  onReset
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
    const style = { width: 14, height: 14, color: orange };
    if (!categorie) return <BookOpen style={style} />;
    switch(categorie.toLowerCase()) {
      case 'sciences': return <Calculator style={style} />;
      case 'langues': return <Languages style={style} />;
      case 'économie': return <TrendingUp style={style} />;
      case 'droit': return <Scale style={style} />;
      default: return <BookOpen style={style} />;
    }
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredSubjects = subjectsList.filter(function(s) {
    return !querySubject || s.nom.toLowerCase().includes(querySubject.toLowerCase());
  }).slice(0, 7);

  const filteredCities = citiesList.filter(function(c) {
    return !queryCity || c.toLowerCase().includes(queryCity.toLowerCase());
  }).slice(0, 6);

  const handleSearchScroll = function() {
    setTimeout(function() {
      document.getElementById('tutors-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubjectSelect = function(subject) {
    setQuerySubject(subject);
    setShowSubjectDrop(false);
    handleSearchScroll();
  };

  const handleCitySelect = function(city) {
    setQueryCity(city);
    setShowCityDrop(false);
    handleSearchScroll();
  };

  return (
    <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
      <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange, display: 'block', marginBottom: '0.5rem' }}>
        SOUTIEN SCOLAIRE D'EXCEPTION AU MAROC
      </span>

      <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, color: ink, lineHeight: 1.1, maxWidth: 700, margin: '0 auto 1rem' }}>
        Trouvez le professeur parfait
      </h1>

      <p style={{ fontSize: '0.95rem', color: charcoal, maxWidth: 550, margin: '0 auto 2rem', lineHeight: 1.6 }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
        Premier cours offert par nos tuteurs.
      </p>

      {/* Search bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        background: bgCard,
        border: `1px solid ${bdr}`,
        borderRadius: 16,
        padding: 8,
        maxWidth: 750,
        margin: '0 auto',
        gap: 8
      }}>
        {/* Subject */}
        <div style={{ flex: 2, position: 'relative', minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
            <Search size={18} color={mute} />
            <input
              value={querySubject}
              onChange={function(e) { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={function() { setShowSubjectDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowSubjectDrop(false); }, 200); }}
              placeholder={loading ? "Chargement..." : "Quelle matière ?"}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem' }}
            />
            {querySubject && <X size={16} color={mute} style={{ cursor: 'pointer' }} onClick={function() { setQuerySubject(''); }} />}
          </div>
          {showSubjectDrop && filteredSubjects.length > 0 && (
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
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              maxHeight: 300,
              overflowY: 'auto'
            }}>
              {filteredSubjects.map(function(s) {
                return (
                  <div
                    key={s.nom}
                    onMouseDown={function() { handleSubjectSelect(s.nom); }}
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.8rem',
                      color: ink,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10
                    }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {getIcon(s.categorie)}
                    <span style={{ flex: 1 }}>{s.nom}</span>
                    <span style={{ fontSize: '9px', color: mute }}>{s.categorie}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ width: 1, background: bdr }} />

        {/* City */}
        <div style={{ flex: 1, position: 'relative', minWidth: 160 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
            <MapPin size={18} color={mute} />
            <input
              value={queryCity}
              onChange={function(e) { setQueryCity(e.target.value); }}
              onFocus={function() { setShowCityDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowCityDrop(false); }, 200); }}
              placeholder={loading ? "Chargement..." : "Ville"}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem' }}
            />
            {queryCity && <X size={16} color={mute} style={{ cursor: 'pointer' }} onClick={function() { setQueryCity(''); }} />}
          </div>
          {showCityDrop && filteredCities.length > 0 && (
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
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              maxHeight: 250,
              overflowY: 'auto'
            }}>
              {filteredCities.map(function(c) {
                return (
                  <div
                    key={c}
                    onMouseDown={function() { handleCitySelect(c); }}
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.8rem',
                      color: ink,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10
                    }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5'; }}
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
          onClick={handleSearchScroll}
          style={{
            background: orange,
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '0 32px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Search size={16} />
          Rechercher
        </button>
      </div>

      {/* Pills - Top matières */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: '2rem' }}>
          {subjectsList.slice(0, 8).map(function(pill) {
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
                  handleSearchScroll();
                }}
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
          {(activePill || querySubject || queryCity) && (
            <button
              onClick={onReset}
              style={{
                padding: '6px 18px',
                borderRadius: 100,
                border: `1px solid ${bdr}`,
                background: 'transparent',
                color: '#da1f1f',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}