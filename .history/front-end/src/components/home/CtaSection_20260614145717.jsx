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
    <section style={{ background: bg, padding: '4rem 2rem', textAlign: 'center', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange }}>VOUS CHERCHEZ UN PROFESSEUR ?</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: text, marginTop: '0.5rem' }}>Publiez votre demande</h2>
        <p style={{ fontSize: '0.9rem', color: muted, marginBottom: '1.5rem' }}>Décrivez votre besoin et recevez des propositions de tuteurs qualifiés. Gratuit.</p>
        <button onClick={handleClick} style={{ background: orange, color: '#fff', border: 'none', borderRadius: '40px', padding: '12px 32px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} /> {user ? 'Mes demandes' : 'Publier une demande'}
        </button>
      </div>
    </section>
  );
}