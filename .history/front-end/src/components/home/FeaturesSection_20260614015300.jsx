import React from 'react';
import { Shield, Scale, Send } from 'lucide-react';

export default function FeaturesSection({ isDark }) {
  const bg = isDark ? '#000000' : '#f8f9fc';
  const bgCard = isDark ? '#111111' : '#ffffff';
  const bgIcon = isDark ? '#1a1a1a' : '#f1f3f5';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#4a5568';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const blue = '#1c64f2';
  const green = '#047857';
  const orange = '#e04f00';

  const features = [
    {
      icon: Shield, color: blue,
      title: 'Processus de vérification strict',
      desc: "Nous vérifions manuellement l'identité, l'authenticité des diplômes et l'expérience académique de chaque enseignant avant activation de son compte."
    },
    {
      icon: Scale, color: green,
      title: 'Zéro commission cachée',
      desc: 'Seulement 10% de frais fixes de mise en relation pour assurer notre infrastructure. Pas d\'abonnement ou de frais cachés.'
    },
    {
      icon: Send, color: orange,
      title: 'Mise en relation directe',
      desc: 'Échangez directement avec votre tuteur potentiel via notre messagerie sécurisée, puis réservez votre première heure offerte d\'un simple clic.'
    },
  ];

  return (
    <section id="features-section" style={{ background: bg, padding: '4.5rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: blue }}>
          CONFIANCE & INTÉGRITÉ
        </span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: textColor, margin: '0.6rem 0 2.5rem', letterSpacing: '-0.02em' }}>
          Qualité garantie, transparence totale.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
          {features.map(function(f, i) {
            const Icon = f.icon;
            return (
              <div key={i}
                style={{
                  background: bgCard, border: `1px solid ${border}`,
                  borderRadius: 16, padding: '1.75rem',
                  boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={function(e) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  if (!isDark) e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)';
                }}
                onMouseLeave={function(e) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.04)';
                }}
              >
                <div style={{
                  width: 46, height: 46, background: bgIcon,
                  border: `1px solid ${border}`, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Icon size={21} color={f.color} />
                </div>
                <h3 style={{ fontWeight: 700, color: textColor, marginBottom: 8, fontSize: '0.98rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.82rem', color: textMuted, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}