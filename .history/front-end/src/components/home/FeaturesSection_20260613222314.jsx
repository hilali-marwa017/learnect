import React from 'react';
import { Shield, Scale, Flame } from 'lucide-react';

export default function FeaturesSection({ isDark }) {
  const bg = isDark ? '#000000' : '#f8f9fc';
  const bgCard = isDark ? '#1a1a1a' : '#ffffff';
  const bgIcon = isDark ? '#2a2a2a' : '#e5e7eb';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#4a5568';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const blue = '#1c64f2';
  const green = '#047857';
  const orange = '#e04f00';

  const features = [
    { icon: Shield, title: 'Vérification stricte', desc: "Nous vérifions manuellement l'identité, les diplômes et l'expérience de chaque enseignant avant validation.", color: blue },
    { icon: Scale, title: 'Zéro commission cachée', desc: 'Seulement 10% de frais fixes de mise en relation. Aucun abonnement, aucun frais caché.', color: green },
    { icon: Flame, title: 'Mise en relation directe', desc: 'Échangez via notre messagerie sécurisée, définissez vos objectifs, puis réservez votre première heure offerte.', color: orange }
  ];

  return (
    <section style={{ background: bg, padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: blue }}>CONFIANCE & INTÉGRITÉ</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: textColor, marginBottom: '2rem' }}>Qualité garantie, transparence totale.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: 16, padding: '1.5rem', textAlign: 'left' }}>
                <div style={{ width: 48, height: 48, background: bgIcon, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontWeight: 700, color: textColor, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.8rem', color: textMuted }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}