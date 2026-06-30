import React from 'react';

export default function HowItWorks({ isDark }) {
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const bg = isDark ? '#06060a' : '#f7f8fa';
  const orange = '#e04f00';
  const blue = '#1c64f2';
  const green = '#047857';

  const steps = [
    { num: '01', title: 'Choisissez le mode parfait', desc: 'Sélectionnez la matière et la ville qui vous correspondent', color: orange },
    { num: '02', title: 'Échangez en ligne', desc: 'Discutez directement avec votre futur professeur', color: blue },
    { num: '03', title: 'Apprenez et progressez', desc: 'Suivez vos cours à domicile ou en ligne', color: green }
  ];

  return (
    <section style={{ background: bg, padding: '4rem 2rem', textAlign: 'center', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: textColor, marginBottom: '0.5rem' }}>
          Comment fonctionne Learnect ?
        </h2>
        <p style={{ color: textMuted, marginBottom: '3rem' }}>
          Une mise en relation simple, rapide et entièrement sécurisée.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {steps.map(function(step) {
            return (
              <div key={step.num}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: isDark ? '#1a1a1a' : '#ffffff',
                  border: `1px solid ${border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: step.color
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontWeight: 'bold', color: textColor, marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: textMuted }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}