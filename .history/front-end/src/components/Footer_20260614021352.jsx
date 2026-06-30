import React from 'react';
import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

export default function Footer({ isDark }) {
  const bg = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#6b7280' : '#6b7280';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const orange = '#e04f00';

  return (
    <footer style={{ background: bg, padding: '3.5rem 2rem 1.5rem', borderTop: `1px solid ${border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <GraduationCap size={20} color={orange} />
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: textColor }}>
                Learnect<span style={{ color: orange }}>.ma</span>
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: textMuted, lineHeight: 1.75, maxWidth: 230 }}>
              Soutien scolaire certifié pour les étudiants marocains.
              Trouvez le professeur parfait près de chez vous.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: textColor, marginBottom: 14 }}>Navigation</h3>
            {['Nos professeurs', 'Comment ça marche', 'FAQ', 'Devenir tuteur'].map(function(item) {
              return (
                <div
                  key={item}
                  style={{ fontSize: '0.78rem', color: textMuted, marginBottom: 10, cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
                >
                  {item}
                </div>
              );
            })}
          </div>

          {/* Légal */}
          <div>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: textColor, marginBottom: 14 }}>Légal</h3>
            {['Conditions d\'utilisation', 'Politique de confidentialité', 'Mentions légales'].map(function(item) {
              return (
                <div
                  key={item}
                  style={{ fontSize: '0.78rem', color: textMuted, marginBottom: 10, cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
                >
                  {item}
                </div>
              );
            })}
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: textColor, marginBottom: 14 }}>Contact</h3>
            {[
              { icon: Mail, text: 'contact@learnect.ma' },
              { icon: Phone, text: '+212 522 123 456' },
              { icon: MapPin, text: 'Casablanca, Maroc' },
            ].map(function(item) {
              const Icon = item.icon;
              return (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Icon size={13} color={orange} />
                  <span style={{ fontSize: '0.78rem', color: textMuted }}>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', color: textMuted }}>
            © {new Date().getFullYear()} Learnect.ma — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}