import React from 'react';

export default function HowItWorks() {
  const steps = [
    { num: '01', color: 'text-accent-orange', title: 'Cherchez le tuteur parfait', desc: 'Renseignez la matière et votre ville pour filtrer nos professeurs certifiés à proximité.' },
    { num: '02', color: 'text-accent-blue', title: 'Échangez et réservez', desc: 'Entrez en contact directement et bénéficiez d\'une première heure d\'évaluation totalement offerte.' },
    { num: '03', color: 'text-accent-green', title: 'Apprenez et progressez', desc: 'Prenez vos cours à domicile ou en ligne, sans contrat ni frais cachés.' },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-surface-deep/30 border-y border-hairline-strong relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-accent-orange-glow blur-3xl opacity-25 pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-accent-blue-glow blur-3xl opacity-25 pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-orange font-bold block">MÉTHODOLOGIE</span>
          <h2 className="font-display-lg text-4xl md:text-5xl text-ink leading-[1.1] tracking-tight">Comment fonctionne Learnect ?</h2>
          <p className="text-mute text-sm">Une mise en relation simple, rapide et entièrement sécurisée.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center space-y-4 group">
              <div className="h-16 w-16 rounded-2xl bg-surface-card border border-hairline-strong flex items-center justify-center text-xl font-bold font-mono shadow-md group-hover:scale-105 transition-transform duration-300">
                <span className={step.color}>{step.num}</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-heading-sm text-lg text-ink font-bold">{step.title}</h3>
                <p className="text-charcoal text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}