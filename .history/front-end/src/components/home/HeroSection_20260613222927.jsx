import React, { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
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

  const ink = isDark ? '#ffffff' : '#07090d';
  const charcoal = isDark ? 'rgba(255,255,255,0.7)' : '#4a5568';
  const mute = isDark ? '#a1a4a5' : '#718096';
  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bdr = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)';
  const orange = '#e04f00';

  // Fetch subjects - methode simple
  useEffect(function() {
    async function fetchSubjects() {
      try {
        const response = await api.get('/matieres');
        if (Array.isArray(response.data)) {
          const subjects = response.data.map(function(item) {
            return {
              nom: item.nom || item.name || '',
              categorie: item.categorie || 'Général'
            };
          }).filter(function(s) { return s.nom; });
          setSubjectsList(subjects);
        }
      } catch(error) {
        console.error('Erreur:', error);
      }
    }
    fetchSubjects();
  }, []);

  // Fetch cities - methode simple
  useEffect(function() {
    async function fetchCities() {
      try {
        const response = await api.get('/villes');
        if (Array.isArray(response.data)) {
          const cities = response.data.map(function(item) {
            return item.nom || item.name || item.ville || '';
          }).filter(function(c) { return c; });
          setCitiesList(cities);
        }
        setLoading(false);
      } catch(error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  const filteredSubjects = subjectsList.filter(function(s) {
    if (!querySubject) return true;
    return s.nom.toLowerCase().includes(querySubject.toLowerCase());
  }).slice(0, 7);

  const filteredCities = citiesList.filter(function(c) {
    if (!queryCity) return true;
    return c.toLowerCase().includes(queryCity.toLowerCase());
  }).slice(0, 6);

  const handleSearchScroll = function() {
    setTimeout(function() {
      const section = document.getElementById('tutors-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
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
    <section style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: ink, marginBottom: '1rem' }}>
        TROUVEZ LE PROFESSEUR PARFAIT
      </h1>
      <p style={{ color: charcoal, maxWidth: 600, margin: '0 auto 2rem' }}>
        Bénéficiez de votre prof de ce qu'il est un expert dans le domaine de l'éducation.
        Faites votre choix parmi nos 450+ spécialistes.
      </p>

      {/* Search bar */}
      <div style={{
        display: 'flex',
        background: bgCard,
        border: `1px solid ${bdr}`,
        borderRadius: 50,
        padding: '0.5rem',
        maxWidth: 700,
        margin: '0 auto',
        gap: '0.5rem'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem 1rem' }}>
            <Search size={18} color={mute} />
            <input
              value={querySubject}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder="Quelle matière ?"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: ink }}
            />
          </div>
          {showSubjectDrop && filteredSubjects.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: bgCard,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              zIndex: 60,
              maxHeight: 250,
              overflowY: 'auto'
            }}>
              {filteredSubjects.map(function(s) {
                return (
                  <div
                    key={s.nom}
                    onMouseDown={() => handleSubjectSelect(s.nom)}
                    style={{ padding: '0.75rem 1rem', cursor: 'pointer', color: ink }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {s.nom}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ width: 1, background: bdr }} />

        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem 1rem' }}>
            <MapPin size={18} color={mute} />
            <input
              value={queryCity}
              onChange={(e) => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder="Ville"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: ink }}
            />
          </div>
          {showCityDrop && filteredCities.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: bgCard,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              zIndex: 60,
              maxHeight: 200,
              overflowY: 'auto'
            }}>
              {filteredCities.map(function(c) {
                return (
                  <div
                    key={c}
                    onMouseDown={() => handleCitySelect(c)}
                    style={{ padding: '0.75rem 1rem', cursor: 'pointer', color: ink }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {c}
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
            color: 'white',
            border: 'none',
            borderRadius: 50,
            padding: '0 2rem',
            fontWeight: 'bold',
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

      {/* Pills */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: '2rem' }}>
          {subjectsList.slice(0, 6).map(function(pill) {
            const isActive = activePill === pill.nom;
            return (
              <button
                key={pill.nom}
                onClick={() => {
                  if (isActive) {
                    setActivePill(null);
                    setQuerySubject('');
                  } else {
                    setActivePill(pill.nom);
                    setQuerySubject(pill.nom);
                  }
                }}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: 50,
                  border: `1px solid ${isActive ? orange : bdr}`,
                  background: isActive ? orange : 'transparent',
                  color: isActive ? 'white' : charcoal,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {pill.nom}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}