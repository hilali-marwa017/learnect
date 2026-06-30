import React from 'react';
import { Search, MessageCircle, TrendingUp } from 'lucide-react';

export default function HowItWorks({ isDark }) {
  const bg = isDark ? '#0a0a0a' : '#f1f3f5';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#4a5568';
  const bgCard = isDark ? '#111111' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const orange = '#e04f00';

  const steps = [
    { num: '01', icon: Search, title: 'Cherchez le tuteur parfait', desc: 'Renseignez la matière et votre ville pour filtrer les professeurs à proximité.', color: '#e04f00' },
    { num: '02', icon: MessageCircle, title: 'Échangez et offrez le diagnostic', desc: 'Entrez en contact directement et bénéficiez d\'une première heure d\'évaluation totalement offerte.', color: '#1c64f2' },
    { num: '03', icon: TrendingUp, title: 'Apprenez et progressez', desc: 'Prenez vos cours à domicile ou en ligne, sans contrat d\'engagement.', color: '#047857' },
  ];

  return (
    <section id="how-it-works" style={{ background: bg, padding: '4rem 2rem', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange }}>
            MÉTHODOLOGIE ET ACCOMPAGNEMENT
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: textColor, margin: '0.5rem 0 0.75rem' }}>
            Comment fonctionne Learnect ?
          </h2>
          <p style={{ fontSize: '0.9rem', color: textMuted, maxWidth: 480, margin: '0 auto' }}>
            Une mise en relation simple, rapide et entièrement sécurisée pour optimiser la réussite de chaque élève.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {steps.map(function(step) {
            const Icon = step.icon;
            return (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, margin: '0 auto 1rem',
                  borderRadius: 16, background: bgCard, border: `1px solid ${border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'monospace', fontWeight: 800, fontSize: '1.3rem',
                  color: step.color, boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.06)'
                }}>
                  {step.num}
                </div>
                <Icon size={28} color={step.color} style={{ marginBottom: 12 }} />
                <h3 style={{ fontWeight: 700, color: textColor, marginBottom: 8, fontSize: '1rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: textMuted, lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}