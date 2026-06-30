import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColor = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const searchBg = isDark ? '#111111' : '#ffffff';
  const searchBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const iconColor = isDark ? '#a1a4a5' : '#9ca3af';
  const inputColor = isDark ? '#ffffff' : '#111827';
  const dropBg = isDark ? '#111111' : '#ffffff';
  const dropHover = isDark ? '#1a1a1a' : '#f9fafb';
  const pillBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
  const pillText = isDark ? '#d1d5db' : '#4b5563';
  const searchBtnBg = isDark ? '#ffffff' : '#111827';
  const searchBtnText = isDark ? '#111827' : '#ffffff';
  const orange = '#e04f00';
  const separator = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  function getIcon(category) {
    const style = { width: 14, height: 14, color: orange };
    if (category === 'Sciences') return <Calculator style={style} />;
    if (category === 'Langues') return <Languages style={style} />;
    if (category === 'Économie') return <TrendingUp style={style} />;
    if (category === 'Droit') return <Scale style={style} />;
    return <BookOpen style={style} />;
  }

  useEffect(function() {
    async function fetchSubjects() {
      try {
        const response = await api.get('/matieres');
        const subjects = response.data.map(function(item) {
          return { name: item.nom || item.name || '', category: item.categorie || 'Général' };
        }).filter(function(item) { return item.name; });
        setSubjectsList(subjects);
      } catch(error) {
        setSubjectsList([
          { name: 'Mathématiques', category: 'Sciences' },
          { name: 'Physique-Chimie', category: 'Sciences' },
          { name: 'SVT', category: 'Sciences' },
        ]);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(function() {
    async function fetchCities() {
      try {
        const response = await api.get('/villes');
        const cities = response.data.map(function(item) {
          return item.nom || item.name || item.ville || '';
        }).filter(function(c) { return c; });
        setCitiesList(cities);
      } catch(error) {
        setCitiesList(['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès']);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  function getFilteredSubjects() {
    if (!querySubject) return subjectsList.slice(0, 8);
    return subjectsList.filter(function(s) {
      return s.name.toLowerCase().includes(querySubject.toLowerCase());
    }).slice(0, 8);
  }

  function getFilteredCities() {
    if (!queryCity) return citiesList.slice(0, 8);
    return citiesList.filter(function(c) {
      return c.toLowerCase().includes(queryCity.toLowerCase());
    }).slice(0, 8);
  }

  function scrollToTeachers() {
    setTimeout(function() {
      const section = document.getElementById('tutors-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function onSelectSubject(subjectName) {
    setQuerySubject(subjectName);
    setShowSubjectDrop(false);
    scrollToTeachers();
  }

  function onSelectCity(cityName) {
    setQueryCity(cityName);
    setShowCityDrop(false);
    scrollToTeachers();
  }

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
    scrollToTeachers();
  }

  const hasActiveFilter = activePill || querySubject || queryCity;

  return (
    <section style={{ background: bgColor, padding: '3rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: '"EB Garamond", serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, color: textColor, maxWidth: 750, margin: '0 auto 0.5rem' }}>
        Trouvez le professeur parfait
      </h1>
      <p style={{ fontSize: '0.95rem', color: textMuted, maxWidth: 550, margin: '0 auto 1.5rem' }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.
      </p>

      {/* Barre de recherche */}
      <div style={{ display: 'flex', alignItems: 'center', background: searchBg, border: `1px solid ${searchBorder}`, borderRadius: 48, padding: '4px', maxWidth: 700, margin: '0 auto' }}>
        
        {/* Input Matière */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
            <Search size={18} color={iconColor} />
            <input
              value={querySubject}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder={loading ? "Chargement..." : "Essayer \"Maths\""}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: inputColor, fontSize: '0.9rem' }}
            />
          </div>
          {showSubjectDrop && getFilteredSubjects().length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, background: dropBg, border: `1px solid ${searchBorder}`, borderRadius: 16, zIndex: 200, maxHeight: 280, overflowY: 'auto' }}>
              {getFilteredSubjects().map(function(subject) {
                return (
                  <div key={subject.name} onMouseDown={() => onSelectSubject(subject.name)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: inputColor }} onMouseEnter={(e) => e.currentTarget.style.background = dropHover} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    {getIcon(subject.category)} <span>{subject.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 30, background: separator }} />

        {/* Input Ville */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
            <MapPin size={18} color={iconColor} />
            <input
              value={queryCity}
              onChange={(e) => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder={loading ? "Chargement..." : "Adresse ou ville"}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: inputColor, fontSize: '0.9rem' }}
            />
          </div>
          {showCityDrop && getFilteredCities().length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, background: dropBg, border: `1px solid ${searchBorder}`, borderRadius: 16, zIndex: 200, maxHeight: 280, overflowY: 'auto' }}>
              {getFilteredCities().map(function(city) {
                return (
                  <div key={city} onMouseDown={() => onSelectCity(city)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: inputColor }} onMouseEnter={(e) => e.currentTarget.style.background = dropHover} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <MapPin size={14} color={orange} /> <span>{city}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bouton Rechercher */}
        <button onClick={scrollToTeachers} style={{ background: searchBtnBg, color: searchBtnText, border: 'none', borderRadius: 40, padding: '10px 24px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
          <Search size={16} /> Rechercher
        </button>
      </div>

      {/* Pills + Bouton Réinitialiser */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: '1.5rem' }}>
          {subjectsList.slice(0, 8).map(function(pill) {
            const isActive = activePill === pill.name;
            return (
              <button key={pill.name} onClick={() => {
                if (isActive) { setActivePill(null); setQuerySubject(''); }
                else { setActivePill(pill.name); setQuerySubject(pill.name); }
                scrollToTeachers();
              }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 999, fontSize: '0.8rem', cursor: 'pointer', border: `1px solid ${isActive ? orange : pillBorder}`, background: isActive ? orange : 'transparent', color: isActive ? '#fff' : pillText }}>
                {getIcon(pill.category)} <span>{pill.name}</span>
              </button>
            );
          })}
          
          {/* Bouton Réinitialiser - s'affiche si un filtre est actif */}
          {hasActiveFilter && (
            <button onClick={handleReset} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(218,31,31,0.3)', background: 'rgba(218,31,31,0.08)', color: '#dc2626' }}>
              <RefreshCw size={12} /> Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}