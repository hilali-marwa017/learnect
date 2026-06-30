import React from 'react';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';

export default function StatsSection({ isDark }) {
  const stats = [
    { icon: GraduationCap, value: '450+', label: 'Tuteurs Accrédités', color: '#e04f00' },
    { icon: BookOpen, value: '45+', label: 'Matières Couvertes', color: '#1c64f2' },
    { icon: Users, value: '3 200+', label: 'Élèves Accompagnés', color: '#047857' },
    { icon: Star, value: '4.9/5', label: 'Satisfaction Client', color: '#b45309' }
  ];

  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bgSurf = isDark ? '#101012' : '#f1f3f5';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';
  const ink = isDark ? '#fcfdff' : '#07090d';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
      padding: '2rem',
      backgroundColor: isDark ? '#101012' : '#f1f3f5'
    }}>
      {stats.map(function(stat, i) {
        const Icon = stat.icon;
        return (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: bgCard,
            border: `1px solid ${bdr}`,
            borderRadius: 12,
            padding: '1rem'
          }}>
            <div style={{
              padding: 8,
              background: bgSurf,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={20} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: ink }}>{stat.value}</div>
              <div style={{ fontSize: '0.65rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}