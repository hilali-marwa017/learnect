import React from 'react';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';

export default function StatsSection({ isDark }) {
  const stats = [
    { icon: GraduationCap, value: '450+', label: 'TUTEURS ACCRÉDITÉS', color: '#e04f00' },
    { icon: BookOpen, value: '45+', label: 'MATIÈRES COUVERTES', color: '#1c64f2' },
    { icon: Users, value: '3 200+', label: 'ÉLÈVES ACCOMPAGNÉS', color: '#047857' },
    { icon: Star, value: '4.9/5', label: 'SATISFACTION CLIENT', color: '#b45309' },
  ];

  const bgColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#6b7280';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <div style={{ background: bgColor, padding: '3rem 2rem', borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: textColor, textAlign: 'left' }}>Learnect en quelques chiffres</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: 1000, margin: '0 auto' }}>
        {stats.map(function(stat, index) {
          const Icon = stat.icon;
          return (
            <div key={index} style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', marginBottom: '0.75rem' }}>
                <Icon size={32} color={stat.color} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: textColor, marginBottom: '0.25rem' }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: textMuted, letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}