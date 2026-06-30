import React from 'react';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';

export default function StatsSection({ isDark }) {
  const stats = [
    { icon: GraduationCap, value: '450+', label: 'TUTEURS ACCRÉDITÉS' },
    { icon: BookOpen, value: '45+', label: 'MATIÈRES COUVERTES' },
    { icon: Users, value: '3 200+', label: 'ÉLÈVES ACCOMPAGNÉS' },
    { icon: Star, value: '4.9/5', label: 'SATISFACTION CLIENT' }
  ];

  const bg = isDark ? '#0a0a0c' : '#f8f9fc';
  const bgCard = isDark ? '#1a1a1a' : '#ffffff';
  const bgIcon = isDark ? '#2a2a2a' : '#f1f3f5';
  const textColor = isDark ? '#fcfdff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const orange = '#e04f00';
  const blue = '#1c64f2';
  const green = '#047857';
  const yellow = '#b45309';

  const iconColors = [orange, blue, green, yellow];

  return (
    <div style={{
      background: bg,
      padding: '2rem',
      borderBottom: `1px solid ${border}`
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        {stats.map(function(stat, index) {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{
              background: bgCard,
              border: `1px solid ${border}`,
              borderRadius: '0.75rem',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                background: bgIcon,
                padding: '0.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} color={iconColors[index]} />
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: textColor }}>{stat.value}</div>
                <div style={{ fontSize: '0.6rem', color: textMuted, letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}