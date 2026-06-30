import React from 'react';
import { Search, MessageCircle, TrendingUp } from 'lucide-react';

export default function HowItWorks({ isDark }) {
  const bg = isDark ? '#0a0a0a' : '#f1f3f5';
  const bgCard = isDark ? '#111111' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#4a5568';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const orange = '#e04f00';
  const blue = '#1c64f2';
  const green = '#047857';

  const steps = [
    { num: '01', icon: Search, title: 'Cherchez le tuteur parfait', desc: 'Renseignez la matière et votre ville pour filtrer les professeurs à proximité.', color: orange },
    { num: '02', icon: MessageCircle, title: 'Échangez et offrez le diagnostic', desc: 'Entrez en contact et bénéficiez d\'une première heure d\'évaluation totalement offerte.', color: blue },
    { num: '03', icon: TrendingUp, title: 'Apprenez et progressez', desc: 'Prenez vos cours à domicile ou en ligne, sans contrat d\'engagement.', color: green },
  ];

  return (
    <section id="how-it-works" style={{ background: bg, padding: '4.5rem 2rem', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange }}>
            MÉTHODOLOGIE ET ACCOMPAGNEMENT
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: textColor, margin: '0.6rem 0 0.75rem', letterSpacing: '-0.02em' }}>
            Comment fonctionne Learnect ?
          </h2>
          <p style={{ fontSize: '0.88rem', color: textMuted, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Une mise en relation simple, rapide et entièrement sécurisée pour optimiser la réussite de chaque élève.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
          {steps.map(function(step) {
            const Icon = step.icon;
            return (
              <div key={step.num} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: bgCard, border: `1px solid ${border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'monospace', fontWeight: 800, fontSize: '1.3rem',
                  color: step.color,
                  boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.05)'
                }}>
                  {step.num}
                </div>
                <Icon size={26} color={step.color} />
                <h3 style={{ fontWeight: 700, color: textColor, fontSize: '1rem', margin: 0 }}>{step.title}</h3>
                <p style={{ fontSize: '0.84rem', color: textMuted, lineHeight: 1.65, maxWidth: 260, margin: 0 }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}