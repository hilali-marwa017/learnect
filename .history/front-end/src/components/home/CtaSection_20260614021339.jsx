import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles } from 'lucide-react';

export default function CtaSection({ isDark, user }) {
  const navigate = useNavigate();
  const orange = '#e04f00';
  const bg = isDark ? '#0a0a0c' : '#07090d';
  const textColor = '#ffffff';

  const handleClick = function() {
    if (user) {
      // Si connecté, rediriger vers les demandes
      navigate('/student/requests');
    } else {
      // Si non connecté, rediriger vers inscription avec rôle étudiant
      navigate('/register?role=etudiant');
    }
  };

  return (
    <section style={{
      background: bg,
      padding: '5rem 2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow décoratif */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '15%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'rgba(224,79,0,0.06)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '15%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'rgba(28,100,242,0.05)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <span style={{
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: orange
        }}>
          VOUS CHERCHEZ UN PROFESSEUR ?
        </span>
        <h2 style={{
          fontFamily: '"EB Garamond", Georgia, serif',
          fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
          fontWeight: 700,
          color: textColor,
          margin: '0.75rem 0 1rem',
          lineHeight: 1.12,
          letterSpacing: '-0.02em'
        }}>
          Publiez votre demande
        </h2>
        <p style={{
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.75,
          maxWidth: 480,
          margin: '0 auto 2rem'
        }}>
          Décrivez votre besoin (matière, niveau, ville) et recevez des propositions
          de tuteurs qualifiés près de chez vous. Gratuit et sans engagement.
        </p>
        <button
          onClick={handleClick}
          style={{
            background: '#ffffff',
            color: '#07090d',
            border: 'none',
            borderRadius: 10,
            padding: '14px 32px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'opacity 0.15s, transform 0.15s'
          }}
          onMouseEnter={function(e) {
            e.currentTarget.style.opacity = '0.88';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={function(e) {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FileText size={17} color="#e04f00" />
          {user ? 'Mes demandes' : 'Publier une demande'}
        </button>
      </div>
    </section>
  );
}