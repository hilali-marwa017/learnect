import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles } from 'lucide-react';

export default function CtaSection({ isDark, user }) {
  const navigate = useNavigate();
  const orange = '#e04f00';
  
  // Fond blanc par défaut, noir en dark mode
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const buttonBg = isDark ? '#ffffff' : '#07090d';
  const buttonText = isDark ? '#07090d' : '#ffffff';

  const handleClick = function() {
    if (user) {
      navigate('/student/requests');
    } else {
      navigate('/register?role=etudiant');
    }
  };

  return (
    <section style={{
      background: bg,
      padding: '5rem 2rem',
      textAlign: 'center',
      borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
      borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
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
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          color: textColor,
          margin: '0.75rem 0 1rem',
          lineHeight: 1.1,
          letterSpacing: '-0.02em'
        }}>
          Publiez votre demande
        </h2>
        <p style={{
          fontSize: '0.9rem',
          color: textMuted,
          lineHeight: 1.6,
          maxWidth: 500,
          margin: '0 auto 2rem'
        }}>
          Décrivez votre besoin (matière, niveau, ville) et recevez des propositions
          de tuteurs qualifiés près de chez vous. Gratuit et sans engagement.
        </p>
        <button
          onClick={handleClick}
          style={{
            background: buttonBg,
            color: buttonText,
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
          <FileText size={17} color={orange} />
          {user ? 'Mes demandes' : 'Publier une demande'}
        </button>
      </div>
    </section>
  );
}