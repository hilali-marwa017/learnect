import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function CtaSection({ isDark, user }) {
  const navigate = useNavigate();
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const orange = '#e04f00';

  function handleClick() {
    user ? navigate('/student/requests') : navigate('/register?role=etudiant');
  }

  return (
    <section style={{ background: bg, padding: '4rem 2rem', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        
        {/* Partie gauche - Texte long */}
        <div style={{ flex: 2, minWidth: '250px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: text, margin: '0 0 0.5rem 0' }}>Publiez votre demande</h2>
          <p style={{ fontSize: '1rem', color: muted, margin: '0', lineHeight: 1.5 }}>
            Décrivez votre besoin (matière, niveau, ville) et recevez des propositions<br />
            de tuteurs qualifiés près de chez vous. Gratuit et sans engagement.
          </p>
        </div>

        {/* Partie droite - Bouton sombre */}
        <div style={{ flex: 1, textAlign: 'right' }}>
          <button 
            onClick={handleClick} 
            style={{ 
              background: isDark ? '#ffffff' : '#1f2937', 
              color: isDark ? '#1f2937' : '#ffffff', 
              border: 'none', 
              borderRadius: '40px', 
              padding: '14px 36px', 
              fontWeight: 600, 
              fontSize: '0.9rem', 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              transition: 'opacity 0.2s'
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