import React from 'react';
import TeacherCard from './TeacherCard';

export default function TeachersSection({ isDark, tutors, loading, error, onReset, querySubject, queryCity, user }) {
  const bg = isDark ? '#0a0a0c' : '#f8f9fc';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const orange = '#e04f00';

  if (loading) return (
    <section style={{ background: bg, padding: '3rem', textAlign: 'center' }}>
      <div style={{ color: muted }}>Chargement...</div>
    </section>
  );

  if (error) return (
    <section style={{ background: bg, padding: '3rem', textAlign: 'center' }}>
      <div style={{ color: '#dc2626' }}>{error}</div>
    </section>
  );

  if (!tutors || tutors.length === 0) return (
    <section style={{ background: bg, padding: '3rem', textAlign: 'center' }}>
      <p style={{ color: muted }}>Aucun professeur trouvé</p>
      {(querySubject || queryCity) && (
        <button onClick={onReset} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: orange, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Réinitialiser
        </button>
      )}
    </section>
  );

  return (
    <section id="tutors-section" style={{ background: bg, padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: text, margin: 0 }}>Les profs de la semaine</h2>
          <p style={{ color: muted, margin: '0.5rem 0 0 0' }}>Nos meilleurs enseignants accrédités partout au Maroc.</p>
        </div>

        <div className="teachers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {tutors.map(t => (
            <TeacherCard key={t.id} teacher={t} user={user} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .teachers-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 576px) {
          .teachers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}