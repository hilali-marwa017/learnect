import React from 'react';
import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

export default function Footer({ isDark }) {
  const bg = isDark ? '#000000' : '#07090d';
  const textColor = '#ffffff';
  const textMuted = isDark ? '#a1a4a5' : 'rgba(255,255,255,0.55)';
  const border = 'rgba(255,255,255,0.08)';
  const orange = '#e04f00';
  const year = new Date().getFullYear();

  const cols = [
    {
      title: 'Navigation',
      items: ['Nos professeurs', 'Comment ça marche', 'FAQ', 'Devenir tuteur']
    },
    {
      title: 'Légal',
      items: ['Conditions d\'utilisation', 'Politique de confidentialité', 'Mentions légales']
    }
  ];

  return (
    <footer style={{ background: bg, padding: '3rem 2rem 1.5rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <GraduationCap size={22} color={orange} />
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: textColor }}>
                Learn<span style={{ color: orange }}>ect</span>.ma
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: textMuted, lineHeight: 1.7, maxWidth: 240 }}>
              Soutien scolaire certifié pour les étudiants marocains. Trouvez le professeur parfait près de chez vous.
            </p>
          </div>

          {/* Columns */}
          {cols.map(function(col) {
            return (
              <div key={col.title}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: textColor, marginBottom: 12 }}>{col.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.items.map(function(item) {
                    return (
                      <li key={item} style={{ fontSize: '0.8rem', color: textMuted, cursor: 'pointer' }}>{item}</li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: textColor, marginBottom: 12 }}>Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: Mail, text: 'contact@learnect.ma' },
                { icon: Phone, text: '+212 522 123 456' },
                { icon: MapPin, text: 'Casablanca, Maroc' },
              ].map(function(item) {
                const Icon = item.icon;
                return (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={14} color={orange} />
                    <span style={{ fontSize: '0.8rem', color: textMuted }}>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: textMuted }}>
            © {year} Learnect.ma — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}