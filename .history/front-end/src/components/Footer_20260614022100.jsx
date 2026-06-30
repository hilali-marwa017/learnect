import React from 'react';
import { Mail, Phone, MapPin, GraduationCap, Heart, Share2, Star, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ isDark }) {
  const orange = '#e04f00';
  const currentYear = new Date().getFullYear();

  const bg = isDark ? '#000000' : '#0a0a0c';
  const textColor = '#ffffff';
  const textMuted = 'rgba(255,255,255,0.5)';
  const border = 'rgba(255,255,255,0.08)';
  const iconBg = 'rgba(255,255,255,0.08)';

  const scrollToSection = function(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer style={{ background: bg, borderTop: `1px solid ${border}`, padding: '3rem 2rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <GraduationCap size={20} color={orange} />
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: textColor }}>
                Learnect<span style={{ color: orange }}>.ma</span>
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: textMuted, lineHeight: 1.6, maxWidth: 220 }}>
              Soutien scolaire certifié pour les étudiants marocains.
              Trouvez le professeur parfait près de chez vous.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {[Heart, Share2, Star, Globe].map(function(Icon, idx) {
                return (
                  <div
                    key={idx}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={function(e) {
                      e.currentTarget.style.background = orange;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={function(e) {
                      e.currentTarget.style.background = iconBg;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Icon size={14} color={textColor} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explorer */}
          <div>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: textColor, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              EXPLORER
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <button
                  onClick={() => scrollToSection('tutors-section')}
                  style={{ fontSize: '0.75rem', color: textMuted, cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
                >
                  Nos professeurs
                </button>
              </li>
              <li style={{ marginBottom: 8 }}>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  style={{ fontSize: '0.75rem', color: textMuted, cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
                >
                  Comment ça marche
                </button>
              </li>
              <li style={{ marginBottom: 8 }}>
                <button
                  onClick={() => scrollToSection('faq-section')}
                  style={{ fontSize: '0.75rem', color: textMuted, cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
                >
                  FAQ
                </button>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link
                  to="/register"
                  style={{ fontSize: '0.75rem', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
                >
                  Devenir tuteur
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: textColor, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              LÉGAL
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <Link
                  to="/conditions"
                  style={{ fontSize: '0.75rem', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link
                  to="/confidentialite"
                  style={{ fontSize: '0.75rem', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link
                  to="/mentions-legales"
                  style={{ fontSize: '0.75rem', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
                >
                  Mentions légales
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link
                  to="/cookies"
                  style={{ fontSize: '0.75rem', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: textColor, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CONTACT
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Mail size={13} color={orange} />
                <a href="mailto:contact@learnect.ma" style={{ fontSize: '0.75rem', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}>
                  contact@learnect.ma
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Phone size={13} color={orange} />
                <a href="tel:+212522123456" style={{ fontSize: '0.75rem', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}>
                  +212 522 123 456
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <MapPin size={13} color={orange} />
                <span style={{ fontSize: '0.75rem', color: textMuted }}>Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar - Copyright à gauche, liens à droite */}
        <div style={{
          borderTop: `1px solid ${border}`,
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Copyright à gauche */}
          <div style={{ fontSize: '0.7rem', color: textMuted }}>
            © {currentYear} Learnect.ma — Tous droits réservés.
          </div>
          
          {/* Liens légaux à droite */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.65rem' }}>
            <Link
              to="/conditions"
              style={{ color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
              onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
            >
              CGU
            </Link>
            <Link
              to="/confidentialite"
              style={{ color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
              onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
            >
              Confidentialité
            </Link>
            <Link
              to="/mentions-legales"
              style={{ color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
              onMouseLeave={function(e) { e.currentTarget.style.color = textMuted; }}
            >
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}