import React from 'react';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';

export default function StatsSection({ isDark }) {
  const stats = [
    { icon: GraduationCap, value: '450+', label: 'TUTEURS ACCRÉDITÉS', color: '#e04f00' },
    { icon: BookOpen, value: '45+', label: 'MATIÈRES COUVERTES', color: '#1c64f2' },
    { icon: Users, value: '3 200+', label: 'ÉLÈVES ACCOMPAGNÉS', color: '#047857' },
    { icon: Star, value: '4.9/5', label: 'SATISFACTION CLIENT', color: '#b45309' },
  ];
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div style={{ background: bg, padding: '3rem 2rem', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: text, margin: 0 }}>Learnect en quelques chiffres</h2>
        </div>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <Icon size={32} color={s.color} style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: text, marginBottom: '0.25rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: muted, letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 2rem !important; }
        }
        @media (max-width: 400px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}