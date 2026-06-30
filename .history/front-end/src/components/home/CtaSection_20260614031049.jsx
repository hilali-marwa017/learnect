import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function CtaSection({ isDark, user }) {
  const navigate = useNavigate();
  const bgColor = isDark ? '#06060a' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const orange = '#e04f00';

  function handleClick() {
    if (user) {
      navigate('/student/requests');
    } else {
      navigate('/register?role=etudiant');
    }
  }

  return (
    <section style={{ background: bgColor, padding: '4rem 2rem', borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        
        {/* Partie gauche - Texte */}
        <div style={{ flex: 2, minWidth: '250px' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange }}>VOUS CHERCHEZ UN PROFESSEUR ?</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: textColor, marginTop: '0.5rem', marginBottom: '0.5rem' }}>Publiez votre demande</h2>
          <p style={{ fontSize: '0.9rem', color: textMuted, lineHeight: 1.5 }}>
            Décrivez votre besoin (matière, niveau, ville) et recevez des propositions<br />
            de tuteurs qualifiés près de chez vous. Gratuit et sans engagement.
          </p>
        </div>

        {/* Partie droite - Bouton (sans animation) */}
        <div style={{ flex: 1, textAlign: 'right' }}>
          <button
            onClick={handleClick}
            style={{
              background: orange,
              color: '#fff',
              border: 'none',
              borderRadius: 40,
              padding: '14px 36px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <FileText size={16} />
            {user ? 'Mes demandes' : 'Publier une demande'}
          </button>
        </div>

      </div>
    </section>
  );
}