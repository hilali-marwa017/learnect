import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // COULEURS SELON THEME
  const bg = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  // Barre de recherche: fond sombre en dark, fond blanc en light
  const searchBg = isDark ? '#111111' : '#ffffff';
  const searchBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const iconColor = isDark ? '#a1a4a5' : '#a0aec0';
  const inputColor = isDark ? '#ffffff' : '#07090d';
  const dropBg = isDark ? '#111111' : '#ffffff';
  const dropHover = isDark ? '#1a1a1a' : '#fff8f5';
  const pillBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
  const pillText = isDark ? '#a1a4a5' : '#4a5568';
  // Bouton Rechercher: blanc en dark, NOIR en light (comme dans le design)
  const searchBtnBg = isDark ? '#ffffff' : '#07090d';
  const searchBtnText = isDark ? '#07090d' : '#ffffff';
  const orange = '#e04f00';
  const separator = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  function getIcon(cat) {
    const s = { width: 13, height: 13, color: orange };
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
          { name: 'SVT', category: 'Sciences' },
          { name: 'Code', category: 'Général' },
          { name: 'Python', category: 'Général' },
          { name: 'Philosophie', category: 'Général' },
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
        setCitiesList(['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Salé']);
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

  return (
    <section style={{ background: bg, padding: '5.5rem 2rem 4rem', textAlign: 'center' }}>

      {/* Tag */}
      <p style={{
        fontSize: '0.65rem', letterSpacing: '0.22em',
        fontWeight: 700, textTransform: 'uppercase',
        color: orange, marginBottom: '1.25rem', margin: '0 0 1rem'
      }}>
        Soutien Scolaire d'Exception au Maroc
      </p>

      {/* H1 */}
      <h1 style={{
        fontFamily: '"EB Garamond", Georgia, serif',
        fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
        fontWeight: 700, color: textColor,
        lineHeight: 1.08, letterSpacing: '-0.02em',
        maxWidth: 720, margin: '0 auto 1.5rem'
      }}>
        Trouvez le professeur parfait
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.05rem', color: textMuted,
        maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.75
      }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
        Premier cours offert par nos tuteurs.
      </p>

      {/* Search bar */}
      <div style={{
        display: 'flex', alignItems: 'stretch',
        background: searchBg,
        border: `1px solid ${searchBorder}`,
        borderRadius: 14, padding: 5,
        maxWidth: 700, margin: '0 auto',
        gap: 0,
        boxShadow: isDark ? '0 0 0 1px rgba(255,255,255,0.04)' : '0 4px 24px rgba(0,0,0,0.08)'
      }}>

        {/* Subject */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px' }}>
            <Search size={17} color={iconColor} />
            <input
              value={querySubject}
              onChange={function(e) { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={function() { setShowSubjectDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowSubjectDrop(false); }, 180); }}
              placeholder={loading ? 'Chargement...' : 'Quelle matière ? (Ex: Maths, Code...)'}
              style={{
                flex: 1, background: 'transparent',
                border: 'none', outline: 'none',
                color: inputColor, fontSize: '0.88rem',
                fontFamily: 'inherit'
              }}
            />
            {querySubject && (
              <button onClick={function() { setQuerySubject(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, fontSize: '0.8rem', padding: '0 2px' }}>
                ✕
              </button>
            )}
          </div>

          {showSubjectDrop && getFilteredSubjects().length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
              background: dropBg,
              border: `1px solid ${searchBorder}`,
              borderRadius: 12, zIndex: 200,
              boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
              maxHeight: 256, overflowY: 'auto'
            }}>
              <div style={{ padding: '8px 14px 6px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, borderBottom: `1px solid ${separator}` }}>
                {querySubject ? 'Matières associées' : 'Matières populaires'}
              </div>
              {getFilteredSubjects().map(function(subject) {
                return (
                  <div key={subject.name}
                    onMouseDown={function() {
                      setQuerySubject(subject.name);
                      setActivePill(null);
                      setShowSubjectDrop(false);
                      scrollToTeachers();
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', color: inputColor, fontSize: '0.84rem', transition: 'background 0.1s' }}
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

        {/* Separator */}
        <div style={{ width: 1, background: separator, margin: '10px 0' }} />

        {/* City */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px' }}>
            <MapPin size={17} color={iconColor} />
            <input
              value={queryCity}
              onChange={function(e) { setQueryCity(e.target.value); }}
              onFocus={function() { setShowCityDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowCityDrop(false); }, 180); }}
              placeholder={loading ? 'Chargement...' : 'À Casablanca, Rabat...'}
              style={{
                flex: 1, background: 'transparent',
                border: 'none', outline: 'none',
                color: inputColor, fontSize: '0.88rem',
                fontFamily: 'inherit'
              }}
            />
            {queryCity && (
              <button onClick={function() { setQueryCity(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, fontSize: '0.8rem', padding: '0 2px' }}>
                ✕
              </button>
            )}
          </div>

          {showCityDrop && getFilteredCities().length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
              background: dropBg,
              border: `1px solid ${searchBorder}`,
              borderRadius: 12, zIndex: 200,
              boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
              maxHeight: 256, overflowY: 'auto'
            }}>
              <div style={{ padding: '8px 14px 6px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, borderBottom: `1px solid ${separator}` }}>
                {queryCity ? 'Villes correspondantes' : 'Villes principales'}
              </div>
              {getFilteredCities().map(function(city) {
                return (
                  <div key={city}
                    onMouseDown={function() {
                      setQueryCity(city);
                      setShowCityDrop(false);
                      scrollToTeachers();
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', color: inputColor, fontSize: '0.84rem', transition: 'background 0.1s' }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = dropHover; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <MapPin size={13} color={orange} />
                    <span>{city}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search button: NOIR en light, BLANC en dark */}
        <button
          onClick={scrollToTeachers}
          style={{
            background: searchBtnBg,
            color: searchBtnText,
            border: 'none', borderRadius: 10,
            padding: '11px 28px',
            fontWeight: 700, fontSize: '0.88rem',
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 7,
            whiteSpace: 'nowrap', flexShrink: 0,
            transition: 'opacity 0.15s'
          }}
          onMouseEnter={function(e) { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={function(e) { e.currentTarget.style.opacity = '1'; }}
        >
          <Search size={15} />
          Rechercher
        </button>
      </div>

      {/* Pills */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
          <span style={{ fontSize: '0.65rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, display: 'flex', alignItems: 'center', marginRight: 4 }}>
            Accès Rapide
          </span>
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
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 15px', borderRadius: 999,
                  fontSize: '0.8rem', cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: isActive ? 700 : 500,
                  border: isActive ? '1px solid #e04f00' : `1px solid ${pillBorder}`,
                  background: isActive ? '#e04f00' : 'transparent',
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
              onClick={function() { setActivePill(null); setQuerySubject(''); setQueryCity(''); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem',
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                border: '1px solid rgba(218,31,31,0.3)',
                background: 'rgba(218,31,31,0.08)', color: '#da1f1f',
                transition: 'all 0.15s'
              }}
            >
              <RefreshCw size={12} />
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}