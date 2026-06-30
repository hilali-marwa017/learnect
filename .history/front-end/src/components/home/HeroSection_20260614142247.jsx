import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const orange = '#e04f00';
  const bgColor = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const cardBg = isDark ? '#1a1a1c' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const iconColor = isDark ? '#6b7280' : '#9ca3af';

  function getIcon(category) {
    const style = { width: 14, height: 14, color: orange };
    if (category === 'Sciences') return <Calculator style={style} />;
    if (category === 'Langues') return <Languages style={style} />;
    if (category === 'Économie') return <TrendingUp style={style} />;
    if (category === 'Droit') return <Scale style={style} />;
    return <BookOpen style={style} />;
  }

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await api.get('/matieres');
        const subjects = response.data.map(item => ({
          name: item.nom || item.name || '',
          category: item.categorie || 'Général'
        })).filter(item => item.name);
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

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await api.get('/villes');
        const cities = response.data.map(item => item.nom || item.name || item.ville || '').filter(city => city);
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
    return subjectsList.filter(s => s.name.toLowerCase().includes(querySubject.toLowerCase())).slice(0, 8);
  }

  function getFilteredCities() {
    if (!queryCity) return citiesList.slice(0, 8);
    return citiesList.filter(c => c.toLowerCase().includes(queryCity.toLowerCase())).slice(0, 8);
  }

  function scrollToTeachers() {
    setTimeout(() => {
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
      {/* Titre */}
      <div style={{ maxWidth: '800px', margin: '0 auto 1rem' }}>
        <h1 style={{ 
          fontFamily: "'EB Garamond', serif", 
          fontSize: 'clamp(3rem, 8vw, 5rem)', 
          fontWeight: 700, 
          color: textColor, 
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem'
        }}>
          <span style={{ display: 'block' }}>Trouvez le professeur</span>
          <span style={{ display: 'block', color: orange }}>qui vous correspond</span>
        </h1>
      </div>

      {/* Barre de recherche*/}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: cardBg, 
        borderRadius: '50px', 
        padding: '4px',
        maxWidth: '850px', 
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        
        {/* Matiere */}
        <div style={{ 
          flex: 1, 
          position: 'relative',
          background: cardBg,
          borderRadius: '50px',
          transition: 'box-shadow 0.2s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' }}>
            <Search size={20} color={iconColor} />
            <input
              value={querySubject}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder=."
              style={{ 
                flex: 1, 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                color: textColor, 
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
          </div>
          {showSubjectDrop && !loading && getFilteredSubjects().length > 0 && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              marginTop: '8px', 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: '16px', 
              zIndex: 200, 
              maxHeight: '300px', 
              overflowY: 'auto', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)' 
            }}>
              {getFilteredSubjects().map((subject, index) => (
                <div 
                  key={index} 
                  onMouseDown={() => onSelectSubject(subject.name)} 
                  style={{ 
                    padding: '12px 20px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    color: textColor, 
                    fontSize: '0.9rem' 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {getIcon(subject.category)} <span>{subject.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Div 2: Ville */}
        <div style={{ 
          flex: 1, 
          position: 'relative',
          background: cardBg,
          borderRadius: '50px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' }}>
            <MapPin size={20} color={iconColor} />
            <input
              value={queryCity}
              onChange={(e) => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder="Où ? Casablanca, Rabat, En ligne..."
              style={{ 
                flex: 1, 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                color: textColor, 
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
          </div>
          {showCityDrop && !loading && getFilteredCities().length > 0 && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              marginTop: '8px', 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: '16px', 
              zIndex: 200, 
              maxHeight: '300px', 
              overflowY: 'auto', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)' 
            }}>
              {getFilteredCities().map((city, index) => (
                <div 
                  key={index} 
                  onMouseDown={() => onSelectCity(city)} 
                  style={{ 
                    padding: '12px 20px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    color: textColor, 
                    fontSize: '0.9rem' 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MapPin size={16} color={orange} /> <span>{city}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Div 3: Bouton Rechercher */}
        <div>
          <button 
            onClick={scrollToTeachers} 
            style={{ 
              background: orange, 
              color: '#fff', 
              border: 'none', 
              borderRadius: '50px', 
              padding: '14px 32px', 
              fontWeight: 600, 
              fontSize: '0.95rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginRight: '4px'
            }}
          >
            <Search size={18} /> Rechercher
          </button>
        </div>
      </div>

      {/* Pills */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '2rem' }}>
          {subjectsList.slice(0, 8).map((pill, index) => {
            const isActive = activePill === pill.name;
            return (
              <button key={index} onClick={() => {
                if (isActive) { setActivePill(null); setQuerySubject(''); }
                else { setActivePill(pill.name); setQuerySubject(pill.name); }
                scrollToTeachers();
              }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '999px', fontSize: '0.85rem', cursor: 'pointer', border: `1px solid ${isActive ? orange : borderColor}`, background: isActive ? orange : 'transparent', color: isActive ? '#fff' : textColor }}>
                {getIcon(pill.category)} <span>{pill.name}</span>
              </button>
            );
          })}
          
          {hasActiveFilter && (
            <button onClick={handleReset} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '999px', fontSize: '0.85rem', cursor: 'pointer', border: '1px solid rgba(218,31,31,0.3)', background: 'rgba(218,31,31,0.08)', color: '#dc2626' }}>
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}