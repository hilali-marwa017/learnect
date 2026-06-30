import React from 'react';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';

export default function StatsSection({ isDark }) {
  const bg = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const bgCard = isDark ? '#111111' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  const stats = [
    { icon: GraduationCap, value: '450+', label: 'Tuteurs Accrédités', color: '#e04f00' },
    { icon: BookOpen, value: '45+', label: 'Matières Couvertes', color: '#1c64f2' },
    { icon: Users, value: '3 200+', label: 'Élèves Accompagnés', color: '#047857' },
    { icon: Star, value: '4.9/5', label: 'Satisfaction Client', color: '#b45309' },
  ];

  return (
    <div style={{ background: bg, padding: '2.5rem 2rem', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {stats.map(function(stat, i) {
          const Icon = stat.icon;
          return (
            <div key={i} style={{
              background: bgCard, border: `1px solid ${border}`, borderRadius: 12,
              padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: bg, borderRadius: 10, border: `1px solid ${border}` }}>
                <Icon size={20} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '1.8rem', fontWeight: 900, color: textColor, margin: 0, fontFamily: 'monospace' }}>{stat.value}</p>
                <p style={{ fontSize: '0.7rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, margin: '2px 0 0' }}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}