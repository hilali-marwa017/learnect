import React from 'react';
import { Search, MessageCircle, TrendingUp } from 'lucide-react';

export default function HowItWorks({ isDark }) {
  const bg = isDark ? '#06060a' : '#f7f8fa';
  const bgCard = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const orange = '#e04f00';
  const blue = '#1c64f2';
  const green = '#047857';

  const steps = [
    { num: '01', icon: Search, title: 'Cherchez le tuteur parfait', desc: 'Renseignez la matière et votre ville pour filtrer nos professeurs à proximité.', color: orange },
    { num: '02', icon: MessageCircle, title: 'Échangez et offrez le diagnostic', desc: "Entrez en contact directement et bénéficiez d'une première heure d'évaluation totalement offerte.", color: blue },
    { num: '03', icon: TrendingUp, title: 'Apprenez et progressez', desc: "Prenez vos cours à domicile ou en ligne, sans contrat d'engagement.", color: green }
  ];

  return (
    <section style={{ background: bg, padding: '4rem 2rem', textAlign: 'center', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange }}>MÉTHODOLOGIE ET ACCOMPAGNEMENT</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: textColor, margin: '0.5rem 0' }}>Comment fonctionne Learnect ?</h2>
        <p style={{ color: textMuted, marginBottom: '2rem' }}>Une mise en relation simple, rapide et entièrement sécurisée.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num}>
                <div style={{ width: 60, height: 60, background: bgCard, border: `1px solid ${border}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, color: step.color }}>{step.num}</div>
                <Icon size={28} color={step.color} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
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