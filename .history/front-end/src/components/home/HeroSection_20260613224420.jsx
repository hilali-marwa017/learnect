import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const orange = '#e04f00';
  const textColor = isDark ? '#fcfdff' : '#07090d';
  const textMuted = isDark ? 'rgba(252, 253, 255, 0.7)' : '#4a5568';
  const iconColor = isDark ? '#a1a4a5' : '#718096';
  const bgInput = isDark ? '#0a0a0c' : '#ffffff';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';

  function getIcon(categorie) {
    const iconStyle = { width: 14, height: 14, color: orange };
    if (categorie === 'Sciences') return <Calculator style={iconStyle} />;
    if (categorie === 'Langues') return <Languages style={iconStyle} />;
    if (categorie === 'Économie') return <TrendingUp style={iconStyle} />;
    if (categorie === 'Droit') return <Scale style={iconStyle} />;
    return <BookOpen style={iconStyle} />;
  }

  // Charger les matières
  useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await api.get('/matieres');
        const subjects = response.data.map(item => ({
          name: item.nom || item.name || '',
          category: item.categorie || 'Général'
        })).filter(item => item.name);
        setSubjectsList(subjects);
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
    loadSubjects();
  }, []);

  // Charger les villes
  useEffect(() => {
    async function loadCities() {
      try {
        const response = await api.get('/villes');
        const cities = response.data.map(item => item.nom || item.name || item.ville || '').filter(city => city);
        setCitiesList(cities);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    }
    loadCities();
  }, []);

  // Filtrer les matières
  const getFilteredSubjects = () => {
    if (!querySubject) return subjectsList.slice(0, 8);
    return subjectsList.filter(s => s.name.toLowerCase().includes(querySubject.toLowerCase())).slice(0, 8);
  };

  // Filtrer les villes
  const getFilteredCities = () => {
    if (!queryCity) return citiesList.slice(0, 8);
    return citiesList.filter(c => c.toLowerCase().includes(queryCity.toLowerCase())).slice(0, 8);
  };

  // Scroll vers la section des professeurs
  const scrollToTeachers = () => {
    setTimeout(() => {
      const section = document.getElementById('tutors-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const onSelectSubject = (subjectName) => {
    setQuerySubject(subjectName);
    setShowSubjectDrop(false);
    scrollToTeachers();
  };

  const onSelectCity = (cityName) => {
    setQueryCity(cityName);
    setShowCityDrop(false);
    scrollToTeachers();
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
        color: textColor,
        lineHeight: 1.1,
        maxWidth: 700,
        margin: '0 auto 1rem'
      }}>
        Trouvez le professeur parfait
      </h1>

      <p style={{
        fontSize: '0.95rem',
        color: textMuted,
        maxWidth: 550,
        margin: '0 auto 2rem',
        lineHeight: 1.6
      }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
        Premier cours offert par nos tuteurs.
      </p>

      {/* Barre de recherche */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        background: bgInput,
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        padding: 4,
        maxWidth: 800,
        margin: '0 auto',
        gap: 4
      }}>
        {/* Champ matière */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
            <Search size={18} color={iconColor} />
            <input
              value={querySubject}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder={loading ? "Chargement..." : "Quelle matière ?"}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: textColor,
                fontSize: '0.85rem'
              }}
            />
          </div>
          
          {/* Dropdown matières */}
          {showSubjectDrop && !loading && getFilteredSubjects().length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: bgInput,
              border: `1px solid ${borderColor}`,
              borderRadius: 12,
              zIndex: 60,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              maxHeight: '260px',
              overflowY: 'scroll'
            }}>
              {getFilteredSubjects().map((subject) => (
                <div
                  key={subject.name}
                  onMouseDown={() => onSelectSubject(subject.name)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: textColor,
                    fontSize: '0.8rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {getIcon(subject.category)}
                  <span>{subject.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Séparateur */}
        <div style={{ width: 1, background: borderColor, margin: '8px 0' }} />

        {/* Champ ville */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
            <MapPin size={18} color={iconColor} />
            <input
              value={queryCity}
              onChange={(e) => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder={loading ? "Chargement..." : "Ville"}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: textColor,
                fontSize: '0.85rem'
              }}
            />
          </div>
          
          {/* Dropdown villes */}
          {showCityDrop && !loading && getFilteredCities().length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: bgInput,
              border: `1px solid ${borderColor}`,
              borderRadius: 12,
              zIndex: 60,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              maxHeight: '260px',
              overflowY: 'scroll'
            }}>
              {getFilteredCities().map((city) => (
                <div
                  key={city}
                  onMouseDown={() => onSelectCity(city)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: textColor,
                    fontSize: '0.8rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MapPin size={14} color={orange} />
                  <span>{city}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bouton recherche */}
        <button
          onClick={scrollToTeachers}
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
            gap: 8
          }}
        >
          <Search size={16} />
          Rechercher
        </button>
      </div>

      {/* Pills des matières populaires */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: '2rem' }}>
          {subjectsList.slice(0, 8).map((pill) => {
            const isActive = activePill === pill.name;
            return (
              <button
                key={pill.name}
                onClick={() => {
                  if (isActive) {
                    setActivePill(null);
                    setQuerySubject('');
                  } else {
                    setActivePill(pill.name);
                    setQuerySubject(pill.name);
                  }
                  scrollToTeachers();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 18px',
                  borderRadius: 100,
                  border: `1px solid ${isActive ? orange : borderColor}`,
                  background: isActive ? orange : 'transparent',
                  color: isActive ? '#fff' : textMuted,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
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