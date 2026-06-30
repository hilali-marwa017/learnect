import React from 'react';
import { Mail, Phone, MapPin, GraduationCap, Heart, Share2, Star, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ isDark }) {
  const year = new Date().getFullYear();
  const orange = '#e04f00';
  const bg = '#0a0a0c';
  const text = '#ffffff';
  const muted = '#a1a4a5';
  const border = 'rgba(255,255,255,0.08)';
  const iconBg = '#1a1a1c';

  return (
    <footer style={{ background: bg, borderTop: `1px solid ${border}`, padding: '3rem 2rem 1.5rem' }}>
      <div className="footer-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <GraduationCap size={20} color={orange} />
            <span style={{ fontWeight: 800, fontSize: '1rem', color: text }}>Learn<span style={{ color: orange }}>ect</span>.ma</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: muted, lineHeight: 1.5 }}>Soutien scolaire certifié pour les étudiants marocains.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
            {[Heart, Share2, Star, Globe].map((Icon, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon size={14} color={text} /></div>)}
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: text, marginBottom: '1rem' }}>EXPLORER</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: muted }}>Nos professeurs</li>
            <li style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: muted }}>Comment ça marche</li>
            <li style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: muted }}>FAQ</li>
            <li style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: muted }}>Devenir tuteur</li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: text, marginBottom: '1rem' }}>LÉGAL</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: muted }}><Link to="/conditions" style={{ color: muted, textDecoration: 'none' }}>Conditions</Link></li>
            <li style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: muted }}><Link to="/confidentialite" style={{ color: muted, textDecoration: 'none' }}>Confidentialité</Link></li>
            <li style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: muted }}><Link to="/mentions-legales" style={{ color: muted, textDecoration: 'none' }}>Mentions légales</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: text, marginBottom: '1rem' }}>CONTACT</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontSize: '0.75rem', color: muted }}><Mail size={12} color={orange} /> contact@learnect.ma</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontSize: '0.75rem', color: muted }}><Phone size={12} color={orange} /> +212 522 123 456</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontSize: '0.75rem', color: muted }}><MapPin size={12} color={orange} /> Casablanca, Maroc</li>
          </ul>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1rem', textAlign: 'center', fontSize: '0.7rem', color: muted }}>
        © {year} Learnect.ma — Tous droits réservés.
      </div>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}