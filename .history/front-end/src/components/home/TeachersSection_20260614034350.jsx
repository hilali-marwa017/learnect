import React, { useState } from 'react';
import TeacherCard from './TeacherCard';

export default function TeachersSection({ isDark, tutors, loading, error }) {
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const bgColor = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const orange = '#e04f00';

  function handleToggleFavorite(e, id) {
    e.stopPropagation();
    setFavorites(function(prev) {
      return prev.includes(id) ? prev.filter(function(x) { return x !== id; }) : [...prev, id];
    });
  }

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
  }

  const filteredTutors = tutors.filter(function(t) {
    const subjectMatch = activePill
      ? t.subjects.some(function(s) { return s === activePill; })
      : querySubject
        ? t.subjects.some(function(s) { return s.toLowerCase().includes(querySubject.toLowerCase()); }) || t.role.toLowerCase().includes(querySubject.toLowerCase())
        : true;
    const cityMatch = queryCity
      ? t.city.toLowerCase().includes(queryCity.toLowerCase())
      : true;
    return subjectMatch && cityMatch;
  });

  if (loading) {
    return (
      <section id="tutors-section" style={{ background: bgColor, padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ color: textMuted }}>Chargement des professeurs...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="tutors-section" style={{ background: bgColor, padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ color: '#dc2626' }}>{error}</div>
      </section>
    );
  }

  if (filteredTutors.length === 0) {
    return (
      <section id="tutors-section" style={{ background: bgColor, padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ color: textMuted }}>Aucun professeur trouvé pour {(querySubject || activePill) && <strong>"{querySubject || activePill}"</strong>} {queryCity && <strong>à {queryCity}</strong>}</p>
        <button onClick={handleReset} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: orange, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Réinitialiser</button>
      </section>
    );
  }

  return (
    <section id="tutors-section" style={{ background: bgColor, padding: '3rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: textColor, textAlign: 'left' }}>
            {activePill ? `Les profs de : ${activePill}` : 'Les profs de la semaine'}
          </h2>
          <p style={{ color: textMuted, textAlign: 'left' }}>Nos meilleurs enseignants accrédités partout au Maroc.</p>
        </div>

        {/* Barre de recherche filtrée interne */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Rechercher une matière..."
            value={querySubject}
            onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
            style={{ padding: '0.5rem 1rem', borderRadius: 8, border: `1px solid ${isDark ? '#333' : '#ddd'}`, background: isDark ? '#1a1a1a' : '#fff', color: textColor }}
          />
          <input
            type="text"
            placeholder="Rechercher une ville..."
            value={queryCity}
            onChange={(e) => setQueryCity(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: 8, border: `1px solid ${isDark ? '#333' : '#ddd'}`, background: isDark ? '#1a1a1a' : '#fff', color: textColor }}
          />
          {(querySubject || queryCity || activePill) && (
            <button onClick={handleReset} style={{ padding: '0.5rem 1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Réinitialiser</button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {filteredTutors.map(function(tutor) {
            return (
              <TeacherCard
                key={tutor.id}
                teacher={tutor}
                isDark={isDark}
                isFav={favorites.includes(tutor.id)}
                onToggleFav={handleToggleFavorite}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}