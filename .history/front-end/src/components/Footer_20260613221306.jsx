import React from 'react';
import { Mail, Phone, MapPin, Heart, Share2, Star, Globe, MessageCircle, Github, Linkedin, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ isDark }) {
  const orange = '#e04f00';
  const currentYear = new Date().getFullYear();

  const scrollToSection = function(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Icônes sociales qui existent dans lucide-react
  const socialIcons = [
    { icon: MessageCircle, name: 'Twitter', color: '#1DA1F2' },
    { icon: Github, name: 'GitHub', color: '#333333' },
    { icon: Linkedin, name: 'LinkedIn', color: '#0077B5' },
    { icon: Camera, name: 'Instagram', color: '#E4405F' }
  ];

  return (
    <footer style={{
      background: '#0a0a0c',
      padding: '3rem 2rem 1.5rem',
      color: 'rgba(255,255,255,0.6)',
      borderTop: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: 1200,
        margin: '0 auto 2rem auto'
      }}>
        
        {/* Brand Section */}
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: '1.3rem',
            color: '#fff',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ color: orange }}>Learn</span>ect<span style={{ color: orange }}>.ma</span>
          </div>
          <p style={{
            fontSize: '0.8rem',
            lineHeight: 1.6,
            marginBottom: '1rem',
            color: 'rgba(255,255,255,0.6)'
          }}>
            Soutien scolaire certifié et méthodologique pour les étudiants marocains.
            Trouvez le professeur parfait près de chez vous.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: '1rem' }}>
            {socialIcons.map(function(item, idx) {
              const Icon = item.icon;
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
                onMouseEnter={function(e) { 
                  e.currentTarget.style.background = orange; 
                  e.currentTarget.style.transform = 'translateY(-2px)'; 
                }}
                onMouseLeave={function(e) { 
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; 
                  e.currentTarget.style.transform = 'translateY(0)'; 
                }}>
                  <Icon size={15} color="#fff" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <h4 style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Navigation
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.6rem' }}>
              <span
                onClick={function() { scrollToSection('tutors-section'); }}
                style={{
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  color: 'rgba(255,255,255,0.6)'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                Nos professeurs
              </span>
            </li>
            <li style={{ marginBottom: '0.6rem' }}>
              <span
                onClick={function() { scrollToSection('how-it-works'); }}
                style={{
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  color: 'rgba(255,255,255,0.6)'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                Comment ça marche
              </span>
            </li>
            <li style={{ marginBottom: '0.6rem' }}>
              <span
                onClick={function() { scrollToSection('faq-section'); }}
                style={{
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  color: 'rgba(255,255,255,0.6)'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                FAQ
              </span>
            </li>
            <li style={{ marginBottom: '0.6rem' }}>
              <Link
                to="/register"
                style={{
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                Devenir tuteur
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h4 style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Légal
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.6rem' }}>
              <Link
                to="/conditions"
                style={{
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                Conditions d'utilisation
              </Link>
            </li>
            <li style={{ marginBottom: '0.6rem' }}>
              <Link
                to="/confidentialite"
                style={{
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                Politique de confidentialité
              </Link>
            </li>
            <li style={{ marginBottom: '0.6rem' }}>
              <Link
                to="/mentions-legales"
                style={{
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                Mentions légales
              </Link>
            </li>
            <li style={{ marginBottom: '0.6rem' }}>
              <Link
                to="/cookies"
                style={{
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none'
                }}
                onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                Cookies
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Contact
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: '0.75rem',
              fontSize: '0.78rem'
            }}>
              <Mail size={14} color={orange} />
              <a href="mailto:contact@learnect.ma" style={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
              onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                contact@learnect.ma
              </a>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: '0.75rem',
              fontSize: '0.78rem'
            }}>
              <Phone size={14} color={orange} />
              <a href="tel:+212522123456" style={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
              onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                +212 522 123 456
              </a>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: '0.75rem',
              fontSize: '0.78rem'
            }}>
              <MapPin size={14} color={orange} />
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                Casablanca, Maroc
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '1.5rem',
        marginTop: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.4)'
        }}>
          © {currentYear} Learnect.ma — Tous droits réservés.
        </div>
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          fontSize: '0.7rem'
        }}>
          <Link to="/conditions" style={{
            color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
          onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
            CGU
          </Link>
          <Link to="/confidentialite" style={{
            color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
          onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
            Confidentialité
          </Link>
          <Link to="/mentions-legales" style={{
            color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={function(e) { e.currentTarget.style.color = orange; }}
          onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}