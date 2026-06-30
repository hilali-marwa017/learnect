import React from 'react';
import TeacherCard from './TeacherCard';

export default function TeachersSection({
  isDark,
  filteredTutors,
  favorites,
  handleToggleFavorite,
  activePill,
  loading,
  error
}) {
  const ink = isDark ? '#fcfdff' : '#07090d';
  const charcoal = isDark ? 'rgba(252, 253, 255, 0.7)' : '#4a5568';
  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';

  return (
    <section id="tutors-section" style={{ padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: '#1c64f2', display: 'block', marginBottom: '0.5rem' }}>
            SÉLECTION HEBDOMADAIRE
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: ink }}>
            {activePill ? `Les profs de : ${activePill}` : 'Les profs de la semaine'}
          </h2>
          <p style={{ color: charcoal }}>Nos meilleurs enseignants accrédités disponibles partout au Maroc.</p>
        </div>

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#da1f1f' }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[1,2,3,4,5,6].map(function(i) {
              return (
                <div key={i} style={{ background: bgCard, border: `1px solid ${bdr}`, borderRadius: 12, height: 300 }} />
              );
            })}
          </div>
        )}

        {!loading && !error && filteredTutors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', background: bgCard, borderRadius: 12 }}>
            <p>Aucun tuteur trouvé</p>
          </div>
        )}

        {!loading && !error && filteredTutors.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
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
        )}
      </div>
    </section>
  );
}