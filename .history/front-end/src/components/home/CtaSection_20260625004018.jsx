import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function CtaSection({ isDark, user }) {
  const navigate = useNavigate();
  const bg = isDark ? '#0a0a0c' : '#fff7f2';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#6b7280';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(224,79,0,0.12)';
  const orange = '#e04f00';

  function handleClick() {
    user ? navigate('/student/requests') : navigate('/register?role=etudiant');
  }

  return (
    <section style={{ background: bg, padding: '4rem 2rem', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div className="cta-wrap" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>

        {/* Partie gauche */}
        <div style={{ flex: 2, minWidth: '260px', textAlign: 'left' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: orange,
            background: isDark ? 'rgba(224,79,0,0.12)' : 'rgba(224,79,0,0.08)',
            padding: '5px 12px', borderRadius: '999px', marginBottom: '12px'
          }}>
            <Sparkles size={11} /> 100% Gratuit
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: text, margin: '0 0 0.6rem 0', lineHeight: 1.15 }}>
            Pas envie de chercher ?<br />Publiez votre demande.
          </h2>
          <p style={{ fontSize: '0.95rem', color: muted, margin: 0, lineHeight: 1.6, maxWidth: '480px' }}>
            Décrivez la matière, le niveau et votre ville en 2 minutes. Nos tuteurs vérifiés vous envoient leurs propositions — vous choisissez celui qui vous correspond le mieux.
          </p>
        </div>

        {/* Partie droite */}
        <div style={{ flex: 1, minWidth: '220px', textAlign: 'right' }}>
          <button
            onClick={handleClick}
            style={{
              background: `linear-gradient(135deg, ${orange}, #c43d00)`,
              color: '#ffffff',
              border: 'none',
              borderRadius: '40px',
              padding: '15px 32px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(224,79,0,0.35)',
            }}
          >
            <FileText size={16} />
            {user ? 'Mes demandes' : 'Publier une demande'}
            <ArrowRight size={16} />
          </button>
          <p style={{ fontSize: '0.7rem', margin:'2px', }}>
            Réponse moyenne en moins de 24h
          </p>
        </div>

      </div>

      <style>{`
        @media (max-width: 700px) {
          .cta-wrap { flex-direction: column; text-align: center !important; }
          .cta-wrap > div { text-align: center !important; }
        }
      `}</style>
    </section>
  );
}