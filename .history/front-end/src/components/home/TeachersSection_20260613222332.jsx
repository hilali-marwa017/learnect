import React from 'react';
import TeacherCard from './TeacherCard';

export default function TeachersSection({ isDark, filteredTutors, favorites, handleToggleFavorite, activePill, loading, error, onReset, querySubject, queryCity }) {
  const bg = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const blue = '#1c64f2';
  const orange = '#e04f00';

  return (
    <section id="tutors-section" style={{ background: bg, padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: blue }}>SÉLECTION HEBDOMADAIRE</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: textColor }}>{activePill ? `Les profs de : ${activePill}` : 'Les profs de la semaine'}</h2>
          <p style={{ color: textMuted }}>Nos meilleurs enseignants accrédités disponibles partout au Maroc.</p>
        </div>
        {loading && <div style={{ textAlign: 'center', color: textMuted }}>Chargement...</div>}
        {error && <div style={{ textAlign: 'center', color: '#da1f1f' }}>{error}</div>}
        {!loading && !error && filteredTutors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', background: isDark ? '#1a1a1a' : '#ffffff', borderRadius: 12, border: `1px solid ${border}` }}>
            <p style={{ color: textMuted }}>Aucun tuteur trouvé</p>
            <button onClick={onReset} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: orange, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Réinitialiser</button>
          </div>
        )}
        {!loading && !error && filteredTutors.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {filteredTutors.map((tutor) => (
              <TeacherCard key={tutor.id} teacher={tutor} isDark={isDark} isFav={favorites.includes(tutor.id)} onToggleFav={handleToggleFavorite} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}