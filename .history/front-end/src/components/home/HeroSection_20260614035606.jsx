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
        const uniqueSubjects = [];
        const seenNames = new Set();
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i];
          const name = item.nom || item.name || '';
          const category = item.categorie || 'Général';
          if (name && !seenNames.has(name)) {
            seenNames.add(name);
            uniqueSubjects.push({ name: name, category: category });
          }
        }
        setSubjectsList(uniqueSubjects);
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
        const uniqueCities = [];
        const seenCities = new Set();
        for (let i = 0; i < response.data.length; i++) {
          const city = response.data[i].nom || response.data[i].name || response.data[i].ville || '';
          if (city && !seenCities.has(city)) {
            seenCities.add(city);
            uniqueCities.push(city);
          }
        }
        setCitiesList(uniqueCities);
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
  }

  function onSelectCity(cityName) {
    setQueryCity(cityName);
    setShowCityDrop(false);
  }

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
    scrollToTeachers();
  }

  const hasActiveFilter = activePill || querySubject || queryCity;

  return (
    <section style={{ background: bgColor, padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: '"EB Garamond", serif', fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', fontWeight: 700, color: textColor, maxWidth: 800, margin: '0 auto 0.5rem' }}>
        Trouvez le professeur parfait
      </h1>
      <p style={{ fontSize: '1rem', color: textMuted, maxWidth: 600, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.
      </p>

      {/* Barre de recherche - 2 inputs comme l'image */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: searchBg, 
        border: `1px solid ${searchBorder}`, 
        borderRadius: 60, 
        padding: '6px',
        maxWidth: 800, 
        margin: '0 auto',
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        
        {/* Input Matière */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
            <Search size={20} color={iconColor} />
            <input
              value={querySubject}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder="Essayer &quot;Maths&quot;"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: inputColor, fontSize: '1rem', fontFamily: 'inherit' }}
            />
          </div>
          {showSubjectDrop && getFilteredSubjects().length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, background: dropBg, border: `1px solid ${searchBorder}`, borderRadius: 16, zIndex: 200, maxHeight: 300, overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              {getFilteredSubjects().map(function(subject, index) {
                return (
                  <div key={subject.name + index} onMouseDown={() => onSelectSubject(subject.name)} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, color: inputColor, fontSize: '0.9rem' }} onMouseEnter={(e) => e.currentTarget.style.background = dropHover} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    {getIcon(subject.category)} <span>{subject.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Séparateur vertical */}
        <div style={{ width: 1, height: 40, background: separator }} />

        {/* Input Ville */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
            <MapPin size={20} color={iconColor} />
            <input
              value={queryCity}
              onChange={(e) => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder="Adresse ou ville"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: inputColor, fontSize: '1rem', fontFamily: 'inherit' }}
            />
          </div>
          {showCityDrop && getFilteredCities().length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, background: dropBg, border: `1px solid ${searchBorder}`, borderRadius: 16, zIndex: 200, maxHeight: 300, overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              {getFilteredCities().map(function(city, index) {
                return (
                  <div key={city + index} onMouseDown={() => onSelectCity(city)} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, color: inputColor, fontSize: '0.9rem' }} onMouseEnter={(e) => e.currentTarget.style.background = dropHover} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <MapPin size={16} color={orange} /> <span>{city}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bouton Rechercher */}
        <button onClick={scrollToTeachers} style={{ background: searchBtnBg, color: searchBtnText, border: 'none', borderRadius: 50, padding: '14px 32px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, marginRight: '4px', boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Search size={18} /> Rechercher
        </button>
      </div>

      {/* Pills + Bouton Réinitialiser */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: '2rem' }}>
          {subjectsList.slice(0, 8).map(function(pill, index) {
            const isActive = activePill === pill.name;
            return (
              <button key={pill.name + index} onClick={() => {
                if (isActive) { setActivePill(null); setQuerySubject(''); }
                else { setActivePill(pill.name); setQuerySubject(pill.name); }
                scrollToTeachers();
              }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 999, fontSize: '0.85rem', cursor: 'pointer', border: `1px solid ${isActive ? orange : pillBorder}`, background: isActive ? orange : 'transparent', color: isActive ? '#fff' : pillText, transition: 'all 0.2s' }}>
                {getIcon(pill.category)} <span>{pill.name}</span>
              </button>
            );
          })}
          
          {hasActiveFilter && (
            <button onClick={handleReset} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, fontSize: '0.85rem', cursor: 'pointer', border: '1px solid rgba(218,31,31,0.3)', background: 'rgba(218,31,31,0.08)', color: '#dc2626' }}>
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}