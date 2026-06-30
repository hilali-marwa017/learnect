import React from 'react';
import { Shield, Scale, Send } from 'lucide-react';

export default function FeaturesSection({ isDark }) {
  const features = [
    { icon: Shield, title: 'Vérification stricte', desc: "Vérification manuelle de l'identité et des diplômes.", color: '#1c64f2' },
    { icon: Scale, title: 'Zéro commission cachée', desc: "10% de frais fixes, pas d'abonnement.", color: '#047857' },
    { icon: Send, title: 'Publier une demande', desc: 'Recevez des propositions de tuteurs qualifiés.', color: '#e04f00' },
  ];

  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const card = isDark ? '#1a1a1c' : '#ffffff';
  const iconBg = isDark ? '#252527' : '#f1f3f5';

  return (
    <section style={{ background: bg, padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Titre à gauche */}
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: text, margin: 0 }}>Qualité garantie, transparence totale.</h2>
        </div>
        {/* Contenu centré */}
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', textAlign: 'left' }}>
                <div style={{ width: '48px', height: '48px', background: iconBg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontWeight: 700, color: text, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.8rem', color: muted }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}