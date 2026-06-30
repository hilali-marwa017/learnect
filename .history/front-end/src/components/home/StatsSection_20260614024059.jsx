import React from 'react';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';

export default function StatsSection({ isDark }) {
  const stats = [
    { icon: GraduationCap, value: '450+', label: 'TUTEURS ACCRÉDITÉS', color: '#e04f00' },
    { icon: BookOpen, value: '45+', label: 'MATIÈRES COUVERTES', color: '#1c64f2' },
    { icon: Users, value: '3 200+', label: 'ÉLÈVES ACCOMPAGNÉS', color: '#047857' },
    { icon: Star, value: '4.9/5', label: 'SATISFACTION CLIENT', color: '#b45309' },
  ];

  const bg = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const orange = '#e04f00';

  return (
    <div style={{ background: bg, padding: '3rem 2rem', borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange }}>CHIFFRES CLÉS</span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: textColor, marginTop: '0.5rem' }}>Learnect en quelques chiffres</h2>
        <p style={{ color: textMuted, fontSize: '0.9rem' }}>Une communauté en pleine croissance</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: 1000, margin: '0 auto' }}>
        {stats.map(function(stat, i) {
          const Icon = stat.icon;
          return (
            <div key={i} style={{ textAlign: 'center' }}>
              <Icon size={28} color={stat.color} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: textColor }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: textMuted, letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}