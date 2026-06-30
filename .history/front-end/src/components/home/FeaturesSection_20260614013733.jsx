import React from 'react';
import { Shield, Scale, Send } from 'lucide-react';

export default function FeaturesSection({ isDark }) {
  const bg = isDark ? '#000000' : '#f8f9fc';
  const bgCard = isDark ? '#111111' : '#ffffff';
  const bgIcon = isDark ? '#1a1a1a' : '#f1f3f5';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#4a5568';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const blue = '#1c64f2';
  const orange = '#e04f00';
  const green = '#047857';

  const features = [
    { icon: Shield, title: 'Vérification stricte', desc: "Nous vérifions manuellement l'identité, les diplômes et l'expérience de chaque enseignant avant validation.", color: blue },
    { icon: Scale, title: 'Zéro commission cachée', desc: 'Seulement 10% de frais fixes de mise en relation. Aucun abonnement, aucun frais caché.', color: green },
    { icon: Send, title: 'Mise en relation directe', desc: 'Échangez directement avec votre tuteur potentiel, définissez vos objectifs, puis réservez votre première heure offerte.', color: orange },
  ];

  return (
    <section id="features-section" style={{ background: bg, padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>

        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: blue }}>
          CONFIANCE & INTÉGRITÉ
        </span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: textColor, margin: '0.5rem 0 2.5rem' }}>
          Qualité garantie, transparence totale.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
          {features.map(function(f, i) {
            const Icon = f.icon;
            return (
              <div key={i} style={{
                background: bgCard, border: `1px solid ${border}`,
                borderRadius: 16, padding: '1.75rem',
                boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{
                  width: 48, height: 48, background: bgIcon, border: `1px solid ${border}`,
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                }}>
                  <Icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontWeight: 700, color: textColor, marginBottom: 8, fontSize: '1rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.82rem', color: textMuted, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}