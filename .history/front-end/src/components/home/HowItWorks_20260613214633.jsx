import React from 'react';
import { Search, MessageCircle, TrendingUp } from 'lucide-react';

export default function HowItWorks({ isDark }) {
  const steps = [
    { num: '01', icon: Search, title: 'Cherchez le tuteur parfait', desc: 'Renseignez la matière et votre ville pour filtrer nos professeurs à proximité.', color: '#e04f00' },
    { num: '02', icon: MessageCircle, title: 'Échangez et offrez le diagnostic', desc: "Entrez en contact directement et bénéficiez d'une première heure d'évaluation totalement offerte.", color: '#1c64f2' },
    { num: '03', icon: TrendingUp, title: 'Apprenez et progressez', desc: "Prenez vos cours à domicile ou en ligne, sans contrat d'engagement.", color: '#047857' }
  ];

  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';
  const ink = isDark ? '#fcfdff' : '#07090d';
  const charcoal = isDark ? 'rgba(252, 253, 255, 0.7)' : '#4a5568';

  return (
    <section style={{ padding: '4rem 2rem', backgroundColor: isDark ? '#06060a' : '#f7f8fa', textAlign: 'center' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: '#e04f00', display: 'block', marginBottom: '0.5rem' }}>
          MÉTHODOLOGIE ET ACCOMPAGNEMENT
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: ink, marginBottom: '0.5rem' }}>
          Comment fonctionne Learnect ?
        </h2>
        <p style={{ fontSize: '0.85rem', color: charcoal, marginBottom: '2.5rem' }}>
          Une mise en relation simple, rapide et entièrement sécurisée.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {steps.map(function(step) {
            const Icon = step.icon;
            return (
              <div key={step.num}>
                <div style={{
                  width: 60,
                  height: 60,
                  background: bgCard,
                  border: `1px solid ${bdr}`,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: step.color
                }}>
                  {step.num}
                </div>
                <Icon size={28} color={step.color} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                <h3 style={{ fontWeight: 700, color: ink, marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.8rem', color: charcoal, maxWidth: 250, margin: '0 auto' }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}