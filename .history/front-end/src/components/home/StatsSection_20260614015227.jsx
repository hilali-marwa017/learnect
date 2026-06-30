import React from 'react';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';

export default function StatsSection({ isDark }) {
  const bg = isDark ? '#000000' : '#ffffff';
  const bgCard = isDark ? '#0f0f0f' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  const stats = [
    { icon: GraduationCap, value: '450+', label: 'Tuteurs Accrédités', color: '#e04f00' },
    { icon: BookOpen, value: '45+', label: 'Matières Couvertes', color: '#1c64f2' },
    { icon: Users, value: '3 200+', label: 'Élèves Accompagnés', color: '#047857' },
    { icon: Star, value: '4.9/5', label: 'Satisfaction Client', color: '#b45309' },
  ];

  return (
    <div style={{ background: bg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, padding: '2rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {stats.map(function(stat, i) {
          const Icon = stat.icon;
          return (
            <div key={i} style={{
              background: bgCard, border: `1px solid ${border}`,
              borderRadius: 12, padding: '1.25rem',
              display: 'flex', flexDirection: 'column', gap: 10
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 9,
                background: bg, border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={19} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '1.75rem', fontWeight: 900, color: textColor, margin: 0, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '0.68rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, margin: '2px 0 0' }}>
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}