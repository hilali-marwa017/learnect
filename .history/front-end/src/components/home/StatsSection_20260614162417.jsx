import React from 'react';
import { Search, MessageCircle, TrendingUp } from 'lucide-react';

export default function HowItWorks({ isDark }) {
  const steps = [
    { 
      num: '01', 
      icon: Search, 
      title: 'Cherchez le tuteur parfait', 
      desc: 'Renseignez la matière (Maths, SVT, Code...) et votre ville pour filtrer nos professeurs ou tuteurs indépendants à proximité.',
      color: '#e04f00' 
    },
    { 
      num: '02', 
      icon: MessageCircle, 
      title: 'Échangez et offrez le diagnostic', 
      desc: "Entrez en contact directement pour faire le diagnostic de vos besoins et bénéficier d'une première heure d'évaluation totalement offerte.",
      color: '#1c64f2' 
    },
    { 
      num: '03', 
      icon: TrendingUp, 
      title: 'Apprenez et progressez', 
      desc: "Prenez vos cours à domicile ou en ligne de haute qualité, sans contrat d'engagement ni frais de dossier obligatoires cachés.",
      color: '#047857' 
    },
  ];

  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#4a5568';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const card = isDark ? '#1a1a1c' : '#f8f9fc';

  return (
    <section style={{ background: bg, padding: '4rem 2rem', borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Titre à gauche */}
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: '#e04f00', display: 'block', marginBottom: '0.5rem' }}>
            MÉTHODOLOGIE ET ACCOMPAGNEMENT
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: text, margin: 0 }}>Comment fonctionne Learnect ?</h2>
          <p style={{ color: muted, margin: '0.5rem 0 0 0' }}>Une mise en relation simple, rapide et entièrement sécurisée.</p>
        </div>

        {/* 3 colonnes */}
        <div className="hiw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                {/* Cercle numéro */}
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  background: card, 
                  border: `1px solid ${border}`, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1rem', 
                  fontFamily: 'monospace', 
                  fontSize: '1.2rem', 
                  fontWeight: 800, 
                  color: step.color,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  {step.num}
                </div>
                
                {/* Icône */}
                <Icon size={32} color={step.color} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                
                {/* Titre */}
                <h3 style={{ fontWeight: 700, color: text, marginBottom: '0.75rem', fontSize: '1.1rem' }}>{step.title}</h3>
                
                {/* Description */}
                <p style={{ fontSize: '0.85rem', color: muted, lineHeight: 1.5, maxWidth: '280px', margin: '0 auto' }}>{step.desc}</p>
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