import React from 'react';
import { Shield, Scale, Flame } from 'lucide-react';

export default function FeaturesSection({ isDark }) {
  const features = [
    { icon: Shield, title: 'Vérification stricte', desc: "Nous vérifions manuellement l'identité, les diplômes et l'expérience de chaque enseignant avant validation.", color: '#1c64f2' },
    { icon: Scale, title: 'Zéro commission cachée', desc: 'Seulement 10% de frais fixes de mise en relation. Aucun abonnement, aucun frais caché.', color: '#047857' },
    { icon: Flame, title: 'Mise en relation directe', desc: 'Échangez via notre messagerie sécurisée, définissez vos objectifs, puis réservez votre première heure offerte.', color: '#e04f00' }
  ];

  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bgSurf = isDark ? '#101012' : '#f1f3f5';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';
  const ink = isDark ? '#fcfdff' : '#07090d';
  const charcoal = isDark ? 'rgba(252, 253, 255, 0.7)' : '#4a5568';

  return (
    <section style={{ padding: '4rem 2rem', backgroundColor: isDark ? '#06060a' : '#f1f3f5' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: '#1c64f2', display: 'block', marginBottom: '0.5rem' }}>
            CONFIANCE & INTÉGRITÉ
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: ink }}>
            Qualité garantie, transparence totale.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {features.map(function(feature, i) {
            const Icon = feature.icon;
            return (
              <div key={i} style={{
                background: bgCard,
                border: `1px solid ${bdr}`,
                borderRadius: 16,
                padding: '1.5rem'
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: bgSurf,
                  border: `1px solid ${bdr}`,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Icon size={22} color={feature.color} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: ink, marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.8rem', color: charcoal, lineHeight: 1.5 }}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}