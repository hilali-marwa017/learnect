import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#4a5568';
  const bgCard = isDark ? '#111111' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const iconColor = isDark ? '#a1a4a5' : '#a0aec0';
  const orange = '#e04f00';

  function getIcon(categorie) {
    const style = { width: 14, height: 14, color: orange };
    if (categorie === 'Sciences') return <Calculator style={style} />;
    if (categorie === 'Langues') return <Languages style={style} />;
    if (categorie === 'Économie') return <TrendingUp style={style} />;
    if (categorie === 'Droit') return <Scale style={style} />;
    return <BookOpen style={style} />;
  }

  useEffect(function() {
    async function loadSubjects() {
      try {
        const res = await api.get('/matieres');
        const list = res.data.map(function(item) {
          return { name: item.nom || '', category: item.categorie || 'Général' };
        }).filter(function(item) { return item.name; });
        setSubjectsList(list);
      } catch(err) {
        // fallback si pas de route /villes
        setSubjectsList([
          { name: 'Mathématiques', category: 'Sciences' },
          { name: 'Physique', category: 'Sciences' },
          { name: 'Chimie', category: 'Sciences' },
          { name: 'Français', category: 'Langues' },
          { name: 'Anglais', category: 'Langues' },
          { name: 'Arabe', category: 'Langues' },
          { name: 'SVT', category: 'Sciences' },
          { name: 'Code', category: 'Général' },
        ]);
      }
    }
    loadSubjects();
  }, []);

  useEffect(function() {
    async function loadCities() {
      try {
        const res = await api.get('/villes');
        const list = res.data.map(function(item) {
          return item.nom || item.name || item.ville || '';
        }).filter(Boolean);
        setCitiesList(list);
      } catch(err) {
        // fallback si pas de route /villes
        setCitiesList(['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan']);
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
    }, 100);
  }

  return (
    <section style={{ background: bg, padding: '5rem 2rem 4rem', textAlign: 'center' }}>
      
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange, marginBottom: '1rem' }}>
        Soutien Scolaire d'Exception au Maroc
      </p>

      <h1 style={{
        fontFamily: '"EB Garamond", Georgia, serif',
        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
        fontWeight: 700,
        color: textColor,
        lineHeight: 1.1,
        maxWidth: 700,
        margin: '0 auto 1.5rem'
      }}>
        Trouvez le professeur parfait
      </h1>

      <p style={{ fontSize: '1rem', color: textMuted, maxWidth: 500, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.
      </p>

      {/* Barre de recherche */}
      <div style={{
        display: 'flex', alignItems: 'stretch',
        background: bgCard, border: `1px solid ${border}`,
        borderRadius: 16, padding: 6,
        maxWidth: 680, margin: '0 auto',
        gap: 4, boxShadow: isDark ? 'none' : '0 8px 30px rgba(0,0,0,0.08)'
      }}>

        {/* Matière */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
            <Search size={18} color={iconColor} />
            <input
              value={querySubject}
              onChange={function(e) { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={function() { setShowSubjectDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowSubjectDrop(false); }, 200); }}
              placeholder={loading ? 'Chargement...' : 'Quelle matière ?'}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: textColor, fontSize: '0.9rem', fontFamily: 'inherit'
              }}
            />
          </div>
          {showSubjectDrop && getFilteredSubjects().length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
              background: bgCard, border: `1px solid ${border}`, borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100,
              maxHeight: 240, overflowY: 'auto'
            }}>
              {getFilteredSubjects().map(function(subject) {
                return (
                  <div key={subject.name}
                    onMouseDown={function() { setQuerySubject(subject.name); setActivePill(null); setShowSubjectDrop(false); scrollToTeachers(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', color: textColor, fontSize: '0.85rem' }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = isDark ? '#1a1a1a' : '#fff8f5'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                    {getIcon(subject.category)}
                    <span>{subject.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Separator */}
        <div style={{ width: 1, background: border, margin: '8px 0' }} />

        {/* Ville */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
            <MapPin size={18} color={iconColor} />
            <input
              value={queryCity}
              onChange={function(e) { setQueryCity(e.target.value); }}
              onFocus={function() { setShowCityDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowCityDrop(false); }, 200); }}
              placeholder={loading ? 'Chargement...' : 'Ville'}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: textColor, fontSize: '0.9rem', fontFamily: 'inherit'
              }}
            />
          </div>
          {showCityDrop && getFilteredCities().length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
              background: bgCard, border: `1px solid ${border}`, borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100,
              maxHeight: 240, overflowY: 'auto'
            }}>
              {getFilteredCities().map(function(city) {
                return (
                  <div key={city}
                    onMouseDown={function() { setQueryCity(city); setShowCityDrop(false); scrollToTeachers(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', color: textColor, fontSize: '0.85rem' }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = isDark ? '#1a1a1a' : '#fff8f5'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                    <MapPin size={13} color={orange} />
                    <span>{city}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button onClick={scrollToTeachers}
          style={{
            background: orange, color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 24px', fontWeight: 700, fontSize: '0.9rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'inherit', whiteSpace: 'nowrap'
          }}>
          <Search size={16} />
          Rechercher
        </button>
      </div>

      {/* Pills */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
          {subjectsList.slice(0, 8).map(function(pill) {
            const isActive = activePill === pill.name;
            return (
              <button key={pill.name}
                onClick={function() {
                  if (isActive) { setActivePill(null); setQuerySubject(''); }
                  else { setActivePill(pill.name); setQuerySubject(pill.name); }
                  scrollToTeachers();
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 16px', borderRadius: 999, fontSize: '0.8rem',
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: isActive ? 700 : 500,
                  border: isActive ? `1px solid ${orange}` : `1px solid ${border}`,
                  background: isActive ? orange : 'transparent',
                  color: isActive ? '#fff' : textMuted,
                  transition: 'all 0.15s'
                }}>
                {getIcon(pill.category)}
                <span>{pill.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}