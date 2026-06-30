import React from 'react';
import { Search, MessageCircle, TrendingUp } from 'lucide-react';

export default function HowItWorks({ isDark }) {
  const steps = [
    { num: '01', icon: Search, title: 'Cherchez le tuteur parfait', desc: 'Renseignez la matière et votre ville pour filtrer les professeurs.', color: '#e04f00' },
    { num: '02', icon: MessageCircle, title: 'Échangez et offrez le diagnostic', desc: "Première heure d'évaluation totalement offerte.", color: '#1c64f2' },
    { num: '03', icon: TrendingUp, title: 'Apprenez et progressez', desc: 'Cours à domicile ou en ligne, sans engagement.', color: '#047857' },
  ];
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const card = isDark ? '#1a1a1c' : '#f8f9fc';

  return (
    <section style={{ background: bg, padding: '4rem 2rem', textAlign: 'center', borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: text, marginBottom: '0.5rem' }}>Comment fonctionne Learnect ?</h2>
        <p style={{ color: muted, marginBottom: '2rem' }}>Une mise en relation simple, rapide et sécurisée.</p>
        <div className="hiw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: card, border: `1px solid ${border}`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, color: step.color }}>{step.num}</div>
                <Icon size={28} color={step.color} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                <h3 style={{ fontWeight: 700, color: text, marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.8rem', color: muted }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .hiw-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
}