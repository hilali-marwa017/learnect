import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? '#000000' : '#f8f9fc';
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

  function getIcon(cat) {
    const s = { width: 15, height: 15, color: orange };
    if (cat === 'Sciences') return <Calculator style={s} />;
    if (cat === 'Langues') return <Languages style={s} />;
    if (cat === 'Économie') return <TrendingUp style={s} />;
    if (cat === 'Droit') return <Scale style={s} />;
    return <BookOpen style={s} />;
  }

  useEffect(function() {
    async function loadSubjects() {
      try {
        const res = await api.get('/matieres');
        setSubjectsList(res.data.map(function(item) {
          return { name: item.nom || '', category: item.categorie || 'Général' };
        }).filter(function(item) { return item.name; }));
      } catch(err) {
        setSubjectsList([
          { name: 'Mathématiques', category: 'Sciences' },
          { name: 'Physique', category: 'Sciences' },
          { name: 'Chimie', category: 'Sciences' },
          { name: 'Français', category: 'Langues' },
          { name: 'Anglais', category: 'Langues' },
          { name: 'Arabe', category: 'Langues' },
        ]);
      }
    }
    loadSubjects();
  }, []);

  useEffect(function() {
    async function loadCities() {
      try {
        const res = await api.get('/villes');
        setCitiesList(res.data.map(function(item) {
          return item.nom || item.name || item.ville || '';
        }).filter(Boolean));
      } catch(err) {
        setCitiesList(['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda']);
      } finally {
        setLoading(false);
      }
    }
    loadCities();
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
    }, 80);
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
  }

  return (
    <section style={{ background: bg, padding: '5rem 2rem 4rem', textAlign: 'center' }}>

      <h1 style={{
        fontFamily: '"EB Garamond", Georgia, serif',
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        fontWeight: 700, color: textColor,
        lineHeight: 1.08, letterSpacing: '-0.02em',
        maxWidth: 800, margin: '0 auto 1rem'
      }}>
        Trouvez le professeur parfait
      </h1>

      <p style={{
        fontSize: '1.1rem', color: textMuted,
        maxWidth: 600, margin: '0 auto 2rem', lineHeight: 1.7
      }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
        Premier cours offert par nos tuteurs.
      </p>

      {/* Search bar - PLUS GRANDE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: searchBg,
        border: `1px solid ${searchBorder}`,
        borderRadius: 60,
        padding: '8px',
        maxWidth: 850,
        margin: '0 auto',
        boxShadow: isDark ? '0 0 0 1px rgba(255,255,255,0.04)' : '0 4px 20px rgba(0,0,0,0.08)'
      }}>

        {/* Subject input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
            <Search size={22} color={iconColor} />
            <input
              value={querySubject}
              onChange={function(e) { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={function() { setShowSubjectDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowSubjectDrop(false); }, 180); }}
              placeholder="Essayer &quot;Maths&quot;"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: inputColor,
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {showSubjectDrop && getFilteredSubjects().length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: dropBg,
              border: `1px solid ${searchBorder}`,
              borderRadius: 16,
              zIndex: 200,
              boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
              maxHeight: 300,
              overflowY: 'auto'
            }}>
              {getFilteredSubjects().map(function(subject) {
                return (
                  <div
                    key={subject.name}
                    onMouseDown={function() { onSelectSubject(subject.name); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 20px',
                      cursor: 'pointer',
                      color: inputColor,
                      fontSize: '0.9rem',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = dropHover; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {getIcon(subject.category)}
                    <span>{subject.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Separateur vertical */}
        <div style={{ width: 1, height: 40, background: separator }} />

        {/* City input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
            <MapPin size={22} color={iconColor} />
            <input
              value={queryCity}
              onChange={function(e) { setQueryCity(e.target.value); }}
              onFocus={function() { setShowCityDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowCityDrop(false); }, 180); }}
              placeholder="Adresse ou ville"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: inputColor,
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {showCityDrop && getFilteredCities().length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: dropBg,
              border: `1px solid ${searchBorder}`,
              borderRadius: 16,
              zIndex: 200,
              boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
              maxHeight: 300,
              overflowY: 'auto'
            }}>
              {getFilteredCities().map(function(city) {
                return (
                  <div
                    key={city}
                    onMouseDown={function() { onSelectCity(city); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 20px',
                      cursor: 'pointer',
                      color: inputColor,
                      fontSize: '0.9rem',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = dropHover; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <MapPin size={15} color={orange} />
                    <span>{city}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search button - PLUS GRAND */}
        <button
          onClick={scrollToTeachers}
          style={{
            background: searchBtnBg,
            color: searchBtnText,
            border: 'none',
            borderRadius: 50,
            padding: '14px 36px',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginRight: '4px',
            transition: 'opacity 0.15s'
          }}
          onMouseEnter={function(e) { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={function(e) { e.currentTarget.style.opacity = '1'; }}
        >
          <Search size={18} />
          Rechercher
        </button>
      </div>

      {/* Pills - PLUS GRANDS */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: '2.5rem' }}>
          {subjectsList.slice(0, 8).map(function(pill) {
            const isActive = activePill === pill.name;
            return (
              <button
                key={pill.name}
                onClick={function() {
                  if (isActive) { setActivePill(null); setQuerySubject(''); }
                  else { setActivePill(pill.name); setQuerySubject(pill.name); }
                  scrollToTeachers();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 20px',
                  borderRadius: 999,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? `1px solid ${orange}` : `1px solid ${pillBorder}`,
                  background: isActive ? orange : 'transparent',
                  color: isActive ? '#ffffff' : pillText,
                  transition: 'all 0.15s'
                }}
              >
                {getIcon(pill.category)}
                <span>{pill.name}</span>
              </button>
            );
          })}

          {(activePill || querySubject || queryCity) && (
            <button
              onClick={handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 999,
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 500,
                border: '1px solid rgba(218,31,31,0.3)',
                background: 'rgba(218,31,31,0.08)',
                color: '#dc2626',
                transition: 'all 0.15s'
              }}
            >
              <RefreshCw size={14} />
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}