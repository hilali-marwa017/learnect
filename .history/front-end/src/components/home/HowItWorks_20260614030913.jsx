import React from 'react';
import { Search, MessageCircle, TrendingUp } from 'lucide-react';

export default function HowItWorks({ isDark }) {
  const steps = [
    { num: '01', icon: Search, title: 'Cherchez le tuteur parfait', desc: 'Renseignez la matière et votre ville pour filtrer les professeurs.', color: '#e04f00' },
    { num: '02', icon: MessageCircle, title: 'Échangez et offrez le diagnostic', desc: "Première heure d'évaluation totalement offerte.", color: '#1c64f2' },
    { num: '03', icon: TrendingUp, title: 'Apprenez et progressez', desc: 'Cours à domicile ou en ligne, sans engagement.', color: '#047857' },
  ];

  const bgColor = isDark ? '#06060a' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <section style={{ background: bgColor, padding: '4rem 2rem', borderBottom: `1px solid ${borderColor}` }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: textColor, marginBottom: '0.5rem', textAlign: 'left' }}>Comment fonctionne Learnect ?</h2>
        <p style={{ color: textMuted, marginBottom: '2rem', textAlign: 'left' }}>Une mise en relation simple, rapide et sécurisée.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {steps.map(function(step) {
            const Icon = step.icon;
            return (
              <div key={step.num} style={{ textAlign: 'left' }}>
                <div style={{ width: 60, height: 60, background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${borderColor}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, color: step.color }}>{step.num}</div>
                <Icon size={28} color={step.color} style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ fontWeight: 700, color: textColor, marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.8rem', color: textMuted }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}