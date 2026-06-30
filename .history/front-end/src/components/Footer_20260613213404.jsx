import React from 'react';
import { Mail, Phone, MapPin, Heart, Share2, Star, Globe } from 'lucide-react';

export default function Footer({ isDark }) {
  const orange = '#e04f00';

  const footerSections = [
    {
      title: 'Learnect',
      content: 'Soutien scolaire certifié et méthodologique pour les étudiants marocains. Trouvez le professeur parfait près de chez vous.'
    },
    {
      title: 'Navigation',
      links: ['Nos professeurs', 'Comment ça marche', 'FAQ', 'Devenir tuteur']
    },
    {
      title: 'Légal',
      links: ["Conditions d'utilisation", 'Confidentialité', 'Mentions légales']
    },
    {
      title: 'Contact',
      contacts: [
        { icon: Mail, text: 'contact@learnect.ma' },
        { icon: Phone, text: '+212 5XX-XXXXXX' },
        { icon: MapPin, text: 'Casablanca, Maroc' }
      ],
      social: [
        { icon: Heart, color: '#e04f00' },
        { icon: Share2, color: '#1c64f2' },
        { icon: Star, color: '#b45309' },
        { icon: Globe, color: '#047857' }
      ]
    }
  ];

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
          <p style={{ fontSize: '0.78rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            {footerSections[0].content}
          </p>
        </div>

        {/* Navigation column */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            {footerSections[1].title}
          </h4>
          {footerSections[1].links.map((item) => (
            <div
              key={item}
              style={{
                fontSize: '0.78rem',
                marginBottom: 8,
                cursor: 'pointer',
                transition: 'color .15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Legal column */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            {footerSections[2].title}
          </h4>
          {footerSections[2].links.map((item) => (
            <div
              key={item}
              style={{
                fontSize: '0.78rem',
                marginBottom: 8,
                cursor: 'pointer',
                transition: 'color .15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Contact column */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            {footerSections[3].title}
          </h4>
          {footerSections[3].contacts.map((item) => {
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
            {footerSections[3].social.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all .2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = item.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={15} color="#fff" />
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>
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