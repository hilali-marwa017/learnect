import React from 'react';
import TeacherCard from './TeacherCard';

export default function TeachersSection({ isDark, filteredTutors, favorites, handleToggleFavorite, activePill, loading, error, onReset, querySubject, queryCity }) {
  const bgColor = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const orange = '#e04f00';

  if (loading) {
    return (
      <section id="tutors-section" style={{ background: bgColor, padding: '3rem 2rem' }}>
        <div style={{ color: textMuted, textAlign: 'left' }}>Chargement des professeurs...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="tutors-section" style={{ background: bgColor, padding: '3rem 2rem' }}>
        <div style={{ color: '#dc2626', textAlign: 'left' }}>{error}</div>
      </section>
    );
  }

  if (filteredTutors.length === 0) {
    return (
      <section className='text-center' id="tutors-section" style={{ background: bgColor, padding: '3rem 2rem' }}>
        <p style={{ color: textMuted, textAlign: 'left' }}>Aucun professeur trouvé pour {(querySubject || activePill) && <strong>"{querySubject || activePill}"</strong>} {queryCity && <strong>à {queryCity}</strong>}</p>
        <button className='' onClick={onReset} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: orange, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Réinitialiser</button>
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