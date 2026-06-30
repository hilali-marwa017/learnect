import React from 'react';
import { Shield, Scale, Send } from 'lucide-react';

export default function FeaturesSection({ isDark }) {
  const features = [
    { icon: Shield, title: 'Vérification stricte', desc: "Vérification manuelle de l'identité et des diplômes.", color: '#1c64f2' },
    { icon: Scale, title: 'Zéro commission cachée', desc: '10% de frais fixes, pas d’abonnement.', color: '#047857' },
    { icon: Send, title: 'Publier une demande', desc: 'Recevez des propositions de tuteurs qualifiés.', color: '#e04f00' },
  ];

  const bgColor = isDark ? '#000000' : '#ffffff';
  const bgCard = isDark ? '#1a1a1a' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <section style={{ background: bgColor, padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: textColor, marginBottom: '2rem', textAlign: 'left' }}>Qualité garantie, transparence totale.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {features.map(function(feature, index) {
            const Icon = feature.icon;
            return (
              <div key={index} style={{ background: bgCard, border: `1px solid ${borderColor}`, borderRadius: 16, padding: '1.5rem', textAlign: 'left' }}>
                <div style={{ width: 48, height: 48, background: isDark ? '#2a2a2a' : '#f1f3f5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={22} color={feature.color} />
                </div>
                <h3 style={{ fontWeight: 700, color: textColor, marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.8rem', color: textMuted }}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}