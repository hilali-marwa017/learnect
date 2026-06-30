import React from 'react';
import { Mail, Phone, MapPin, Heart, Share2, Star, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer({ isDark }) {
  const currentYear = new Date().getFullYear();
  const orange = '#e04f00';

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Couleurs dynamiques selon le thème
  const bgFooter = isDark ? '#0a0a0c' : '#f8f9fc';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? 'rgba(255,255,255,0.6)' : '#4a5568';
  const titleColor = isDark ? '#ffffff' : '#07090d';
  const iconBg = isDark ? 'rgba(255,255,255,0.08)' : '#f1f3f5';
  const linkHover = orange;

  return (
    <footer style={{ background: bgFooter, borderTop: `1px solid ${borderColor}` }}>
      {/* Main footer */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          
          {/* Brand column */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: titleColor, marginBottom: '1rem' }}>
              Learn<span style={{ color: orange }}>ect</span>.ma
            </h2>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: textColor, marginBottom: '1rem' }}>
              Soutien scolaire certifié et méthodologique pour les étudiants marocains.
              Trouvez le professeur parfait près de chez vous.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Heart, Share2, Star, Globe].map((Icon, i) => (
                <div
                  key={i}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = orange;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = iconBg;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={14} color={isDark ? '#fff' : '#07090d'} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 style={{ color: titleColor, fontWeight: 600, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Navigation
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.6rem' }}>
                <button
                  onClick={() => scrollToSection('tutors-section')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    color: textColor,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  Nos professeurs
                </button>
              </li>
              <li style={{ marginBottom: '0.6rem' }}>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    color: textColor,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  Comment ça marche
                </button>
              </li>
              <li style={{ marginBottom: '0.6rem' }}>
                <button
                  onClick={() => scrollToSection('faq-section')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    color: textColor,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  FAQ
                </button>
              </li>
              <li style={{ marginBottom: '0.6rem' }}>
                <Link
                  to="/register"
                  style={{
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    color: textColor,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  Devenir tuteur
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 style={{ color: titleColor, fontWeight: 600, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Légal
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.6rem' }}>
                <Link
                  to="/conditions"
                  style={{
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    color: textColor,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li style={{ marginBottom: '0.6rem' }}>
                <Link
                  to="/confidentialite"
                  style={{
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    color: textColor,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li style={{ marginBottom: '0.6rem' }}>
                <Link
                  to="/mentions-legales"
                  style={{
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    color: textColor,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  Mentions légales
                </Link>
              </li>
              <li style={{ marginBottom: '0.6rem' }}>
                <Link
                  to="/cookies"
                  style={{
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    color: textColor,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 style={{ color: titleColor, fontWeight: 600, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contact
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.78rem' }}>
                <Mail size={14} color={orange} />
                <a
                  href="mailto:contact@learnect.ma"
                  style={{ color: textColor, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  contact@learnect.ma
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.78rem' }}>
                <Phone size={14} color={orange} />
                <a
                  href="tel:+212522123456"
                  style={{ color: textColor, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  +212 522 123 456
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.78rem' }}>
                <MapPin size={14} color={orange} />
                <span style={{ color: textColor }}>Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid ${borderColor}`, padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.7rem', color: textColor }}>
            © {currentYear} Learnect.ma — Tous droits réservés.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.7rem' }}>
            <Link
              to="/conditions"
              style={{ color: textColor, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
              onMouseLeave={(e) => e.currentTarget.style.color = textColor}
            >
              CGU
            </Link>
            <Link
              to="/confidentialite"
              style={{ color: textColor, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
              onMouseLeave={(e) => e.currentTarget.style.color = textColor}
            >
              Confidentialité
            </Link>
            <Link
              to="/mentions-legales"
              style={{ color: textColor, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = linkHover}
              onMouseLeave={(e) => e.currentTarget.style.color = textColor}
            >
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;