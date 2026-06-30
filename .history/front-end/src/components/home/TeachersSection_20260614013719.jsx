import React from 'react';
import TeacherCard from './TeacherCard';

export default function TeachersSection({ isDark, filteredTutors, favorites, handleToggleFavorite, activePill, loading, onReset, querySubject, queryCity }) {
  const bg = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const bgCard = isDark ? '#111111' : '#ffffff';
  const blue = '#1c64f2';
  const orange = '#e04f00';

  return (
    <section id="tutors-section" style={{ background: bg, padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: blue }}>
              SÉLECTION HEBDOMADAIRE
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: textColor, margin: '0.25rem 0 0.5rem' }}>
              {activePill ? 'Les profs de : ' + activePill : 'Les profs de la semaine'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: textMuted }}>
              Nos meilleurs enseignants accrédités disponibles partout au Maroc.
            </p>
          </div>
          <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: 10, padding: '0.75rem 1.25rem' }}>
            <div style={{ fontSize: '0.65rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Professeurs trouvés</div>
            <div style={{ fontWeight: 800, color: textColor, fontSize: '0.9rem', fontFamily: 'monospace' }}>{filteredTutors.length} correspondances</div>
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[1, 2, 3, 4, 5, 6].map(function(i) {
              return (
                <div key={i} style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ height: 200, background: isDark ? '#1a1a1a' : '#f1f3f5', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ padding: '1rem' }}>
                    {[80, 60, 100, 50].map(function(w, j) {
                      return <div key={j} style={{ height: 12, background: isDark ? '#2a2a2a' : '#e2e8f0', borderRadius: 6, marginBottom: 8, width: w + '%' }} />;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No results */}
        {!loading && filteredTutors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: bgCard, borderRadius: 16, border: `1px solid ${border}` }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</p>
            <h3 style={{ fontWeight: 700, color: textColor, marginBottom: '0.5rem' }}>Aucun tuteur trouvé</h3>
            <p style={{ color: textMuted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Aucun professeur pour "{querySubject || activePill || 'Tout'}" dans "{queryCity || 'Tout le Maroc'}".
            </p>
            <button onClick={onReset}
              style={{ background: orange, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}>
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Grid tutors */}
        {!loading && filteredTutors.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
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