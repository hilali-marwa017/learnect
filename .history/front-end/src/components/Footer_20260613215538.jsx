import React from 'react';
import { Mail, Phone, MapPin, Heart, Share2, Star, Globe } from 'lucide-react';

export default function Footer({ isDark }) {
  const orange = '#e04f00';

  return (
    <footer style={{
      background: '#111111',
      padding: '3rem 2rem 1.5rem',
      color: 'rgba(255,255,255,0.5)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
        maxWidth: 1200,
        margin: '0 auto 2rem auto'
      }}>
        {/* Brand */}
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: '0.75rem' }}>
            Learn<span style={{ color: orange }}>ect</span>
          </div>
          <p style={{ fontSize: '0.78rem', lineHeight: 1.6 }}>
            Soutien scolaire certifié et méthodologique pour les étudiants marocains.
            Trouvez le professeur parfait près de chez vous.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>Navigation</h4>
          {['Nos professeurs', 'Comment ça marche', 'FAQ', 'Devenir tuteur'].map(function(item) {
            return <div key={item} style={{ fontSize: '0.78rem', marginBottom: 8, cursor: 'pointer' }}>{item}</div>;
          })}
        </div>

        {/* Légal */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>Légal</h4>
          {["Conditions d'utilisation", 'Confidentialité', 'Mentions légales'].map(function(item) {
            return <div key={item} style={{ fontSize: '0.78rem', marginBottom: 8, cursor: 'pointer' }}>{item}</div>;
          })}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>Contact</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', marginBottom: 8 }}>
            <Mail size={14} /> <span>contact@learnect.ma</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', marginBottom: 8 }}>
            <Phone size={14} /> <span>+212 5XX-XXXXXX</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', marginBottom: 8 }}>
            <MapPin size={14} /> <span>Casablanca, Maroc</span>
          </div>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            {[Heart, Share2, Star, Globe].map(function(Icon, idx) {
              return (
                <div key={idx} style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.background = orange; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <Icon size={15} color="#fff" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '1.5rem',
        textAlign: 'center',
        fontSize: '0.7rem'
      }}>
        © 2026 Learnect.ma — Tous droits réservés.
      </div>
    </footer>
  );
}