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

  // Fetch subjects - méthode DAIF simple
  useEffect(function() {
    async function fetchSubjects() {
      try {
        const response = await api.get('/matieres');
        const subjects = response.data.map(function(item) {
          return {
            nom: item.nom || item.name || '',
            categorie: item.categorie || 'Général'
          };
        }).filter(function(s) { return s.nom !== ''; });
        setSubjectsList(subjects);
      } catch(error) {
        console.error('Erreur:', error);
      }
    }
    fetchSubjects();
  }, []);

  // Fetch cities - méthode DAIF simple
  useEffect(function() {
    async function fetchCities() {
      try {
        const response = await api.get('/villes');
        const cities = response.data.map(function(item) {
          return item.nom || item.name || item.ville || '';
        }).filter(function(c) { return c !== ''; });
        setCitiesList(cities);
        setLoading(false);
      } catch(error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  const filteredSubjects = function() {
    var result = [];
    for (var i = 0; i < subjectsList.length; i++) {
      var s = subjectsList[i];
      if (!querySubject || s.nom.toLowerCase().indexOf(querySubject.toLowerCase()) !== -1) {
        result.push(s);
      }
    }
    return result.slice(0, 7);
  };

  const filteredCities = function() {
    var result = [];
    for (var i = 0; i < citiesList.length; i++) {
      var c = citiesList[i];
      if (!queryCity || c.toLowerCase().indexOf(queryCity.toLowerCase()) !== -1) {
        result.push(c);
      }
    }
    return result.slice(0, 6);
  };

  const handleSearchScroll = function() {
    setTimeout(function() {
      var section = document.getElementById('tutors-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSubjectSelect = function(subject) {
    setQuerySubject(subject);
    setShowSubjectDrop(false);
  };

  const handleCitySelect = function(city) {
    setQueryCity(city);
    setShowCityDrop(false);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'transparent', borderRadius: 12, height: '100%' }}>
            <Search size={18} color={mute} style={{ flexShrink: 0 }} />
            <input
              value={querySubject}
              onChange={function(e) { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={function() { setShowSubjectDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowSubjectDrop(false); }, 200); }}
              placeholder={loading ? "Chargement..." : "Quelle matière ?"}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%', minWidth: 0 }}
            />
            {querySubject && <X size={16} color={mute} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={function() { setQuerySubject(''); }} />}
          </div>
          {showSubjectDrop && !loading && filteredSubjects().length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: bgCard, border: `1px solid ${bdr}`, borderRadius: 12, zIndex: 60, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: 300, overflowY: 'auto', overflowX: 'hidden' }}>
              {filteredSubjects().map(function(s) {
                return (
                  <div key={s.nom} onMouseDown={function() { handleSubjectSelect(s.nom); }} style={{ padding: '12px 16px', fontSize: '0.8rem', color: ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.15s' }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'transparent', borderRadius: 12, height: '100%' }}>
            <MapPin size={18} color={mute} style={{ flexShrink: 0 }} />
            <input
              value={queryCity}
              onChange={function(e) { setQueryCity(e.target.value); }}
              onFocus={function() { setShowCityDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowCityDrop(false); }, 200); }}
              placeholder={loading ? "Chargement..." : "Ville"}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%', minWidth: 0 }}
            />
            {queryCity && <X size={16} color={mute} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={function() { setQueryCity(''); }} />}
          </div>
          {showCityDrop && !loading && filteredCities().length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: bgCard, border: `1px solid ${bdr}`, borderRadius: 12, zIndex: 60, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: 300, overflowY: 'auto', overflowX: 'hidden' }}>
              {filteredCities().map(function(c) {
                return (
                  <div key={c} onMouseDown={function() { handleCitySelect(c); }} style={{ padding: '12px 16px', fontSize: '0.8rem', color: ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.15s' }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                    <MapPin size={14} color={orange} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, textAlign: 'left' }}>{c}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search button */}
        <button onClick={handleSearchScroll} style={{ background: orange, color: '#fff', border: 'none', borderRadius: 12, padding: '0 28px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}
          onMouseEnter={function(e) { e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={function(e) { e.currentTarget.style.opacity = '1'; }}>
          <Search size={16} />
          Rechercher
        </button>
      </div>

      {/* Pills */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: '2rem' }}>
          {subjectsList.slice(0, 8).map(function(pill) {
            var isActive = activePill === pill.nom;
            return (
              <button key={pill.nom} onClick={function() {
                if (isActive) {
                  setActivePill(null);
                  setQuerySubject('');
                } else {
                  setActivePill(pill.nom);
                  setQuerySubject(pill.nom);
                }
              }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 100, border: `1px solid ${isActive ? orange : bdr}`, background: isActive ? orange : 'transparent', color: isActive ? '#fff' : charcoal, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                {getIcon(pill.categorie)}
                <span>{pill.nom}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}