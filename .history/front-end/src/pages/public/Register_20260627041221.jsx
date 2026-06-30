import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { GraduationCap, BookOpen, Award } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const context = useOutletContext?.() || {};
  const isDark = context?.isDark || false;

  const bg     = isDark ? '#0a0a0c' : '#f8f9fc';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#9ca3af' : '#6b7280';

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
            <GraduationCap size={28} color="#e04f00" />
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: text }}>Learn<span style={{ color: '#e04f00' }}>ect</span>.ma</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: text, margin: '0 0 8px' }}>Creer un compte</h1>
          <p style={{ fontSize: '0.82rem', color: muted, margin: 0 }}>Choisissez votre profil pour commencer</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Carte Etudiant */}
          <button onClick={() => navigate('/register/student')} style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e04f00'}
            onMouseLeave={e => e.currentTarget.style.borderColor = border}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(224,79,0,0.1)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={22} color="#e04f00" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: text, marginBottom: '4px' }}>Je suis Etudiant</div>
              <div style={{ fontSize: '0.78rem', color: muted, lineHeight: 1.5 }}>Je cherche un professeur pour progresser dans mes etudes</div>
            </div>
          </button>

          {/* Carte Enseignant */}
          <button onClick={() => navigate('/register/teacher')} style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.borderColor = border}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={22} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: text, marginBottom: '4px' }}>Je suis Enseignant</div>
              <div style={{ fontSize: '0.78rem', color: muted, lineHeight: 1.5 }}>Je veux proposer mes cours et partager mon savoir</div>
            </div>
          </button>
        </div>

        <p style={{ fontSize: '0.78rem', color: muted, textAlign: 'center', marginTop: '1.5rem' }}>
          Deja un compte ?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#e04f00', fontWeight: 700, cursor: 'pointer' }}>Se connecter</span>
        </p>
      </div>
    </div>
  );
}