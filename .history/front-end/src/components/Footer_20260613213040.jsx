import React from 'react';
import { Mail, Phone, MapPin, Heart, Share2, Star, Globe } from 'lucide-react';

export default function Footer({ isDark }) {
  const orange = '#e04f00';
  const bgFooter = '#111111';

  const footerLinks = {
    navigation: ['Nos professeurs', 'Comment ça marche', 'FAQ', 'Devenir tuteur'],
    legal: ["Conditions d'utilisation", 'Confidentialité', 'Mentions légales'],
    contact: [
      { icon: Mail, text: 'contact@learnect.ma' },
      { icon: Phone, text: '+212 5XX-XXXXXX' },
      { icon: MapPin, text: 'Casablanca, Maroc' },
    ],
    social: [
      { icon: Heart, href: '#', label: 'Suivez-nous', color: '#e04f00' },
      { icon: Share2, href: '#', label: 'Partager', color: '#1c64f2' },
      { icon: Star, href: '#', label: 'Noter', color: '#b45309' },
      { icon: Globe, href: '#', label: 'Site web', color: '#047857' },
    ],
  };

  return (
    <footer style={{
      background: bgFooter,
      padding: '3.5rem 2rem 1.5rem',
      color: 'rgba(255,255,255,0.5)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem',
        maxWidth: 1200,
        margin: '0 auto 2rem auto'
      }}>
        {/* Brand column */}
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: '1.1rem',
            color: '#fff',
            marginBottom: '0.75rem'
          }}>
            Learn<span style={{ color: orange }}>ect</span>
          </div>
          <div style={{ fontSize: '0.78rem', lineHeight: 1.75 }}>
            Soutien scolaire certifié et méthodologique pour les étudiants marocains.
            Trouvez le professeur parfait près de chez vous.
          </div>
        </div>

        {/* Navigation column */}
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            Navigation
          </div>
          {footerLinks.navigation.map(function(item) {
            return (
              <div
                key={item}
                style={{
                  fontSize: '0.78rem',
                  marginBottom: 8,
                  cursor: 'pointer',
                  transition: 'color .15s'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                {item}
              </div>
            );
          })}
        </div>

        {/* Legal column */}
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            Légal
          </div>
          {footerLinks.legal.map(function(item) {
            return (
              <div
                key={item}
                style={{
                  fontSize: '0.78rem',
                  marginBottom: 8,
                  cursor: 'pointer',
                  transition: 'color .15s'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                {item}
              </div>
            );
          })}
        </div>

        {/* Contact column */}
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            Contact
          </div>
          {footerLinks.contact.map(function(item) {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '0.78rem',
                  marginBottom: 8
                }}
              >
                <Icon size={14} />
                <span>{item.text}</span>
              </div>
            );
          })}

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            {footerLinks.social.map(function(item, idx) {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all .2s',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={function(e) { 
                    e.currentTarget.style.background = item.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={function(e) { 
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={16} color="#fff" />
                </a>
              );
            })}
          </div>
          
          {/* Social text */}
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: 12, textAlign: 'center' }}>
            Suivez-nous sur les réseaux
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