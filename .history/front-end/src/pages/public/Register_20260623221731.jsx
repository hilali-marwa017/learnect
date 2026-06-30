import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserPlus, BookOpen, CheckCircle, ArrowRight, House } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const context = useOutletContext();
  
  const isDark = context?.isDark ?? (localStorage.getItem('isDark') === 'true');
  
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const card = isDark ? '#1a1a1c' : '#f8f9fc';
  const orange = '#e04f00';
  const iconColor = isDark ? '#6b7280' : '#9ca3af';

  const studentFeatures = [
    "Annuaire d'enseignants accrédités",
    'Première heure de diagnostic offerte',
    'Messagerie privée sécurisée'
  ];

  const teacherFeatures = [
    'Visibilité auprès de milliers de familles',
    "Zéro commission d'engagement",
    "Panel d'administration des gains et cours"
  ];

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '0', position: 'relative' }}>

      {/* ── Bouton House RIGHT ── */}
      <button
        onClick={() => navigate('/')}
        title="Retour à l'accueil"
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '2rem',
          zIndex: 10,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '8px',
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <House size={20} />
      </button>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
            <GraduationCap size={28} color={orange} />
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: text }}>
              Learn<span style={{ color: orange }}>ect</span>.ma
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: text, marginBottom: '0.5rem' }}>
            COMMENCEZ DÈS AUJOURD'HUI
          </h1>
          <p style={{ fontSize: '1rem', color: muted, maxWidth: '600px', margin: '0 auto' }}>
            Rejoignez Learnect.ma — Sélectionnez votre profil d'inscription ci-dessous pour démarrer
            instantanément votre parcours pédagogique au Maroc.
          </p>
        </div>

        {/* ── Deux cartes ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>

          {/* Carte Étudiant */}
          <div style={{
            background: card, border: `1px solid ${border}`,
            borderRadius: '24px', padding: '2rem', transition: 'transform 0.2s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', background: `${orange}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={24} color={orange} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: text, margin: 0 }}>
                Je suis un Élève / Étudiant
              </h3>
            </div>
            <p style={{ color: muted, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Je souhaite trouver un professeur qualifié près de chez moi à Casablanca, Rabat ou de manière virtuelle,
              pour remonter mes notes, maîtriser le programme et réussir mes devoirs.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              {studentFeatures.map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', color: muted, fontSize: '0.85rem' }}>
                  <CheckCircle size={16} color={orange} />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/register/student')}
              style={{
                width: '100%', background: orange, color: '#fff', border: 'none',
                borderRadius: '40px', padding: '14px', fontWeight: 600, fontSize: '0.9rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              M'inscrire comme Étudiant <ArrowRight size={16} />
            </button>
          </div>

          {/* Carte Enseignant */}
          <div style={{
            background: card, border: `1px solid ${border}`,
            borderRadius: '24px', padding: '2rem', transition: 'transform 0.2s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', background: `${orange}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} color={orange} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: text, margin: 0 }}>
                Je suis un Enseignant / Tuteur
              </h3>
            </div>
            <p style={{ color: muted, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Je souhaite donner des cours de soutien scolaire à domicile ou en ligne, définir librement mes tarifs horaires en MAD,
              gérer mes réservations et vivre sereinement de mes cours.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              {teacherFeatures.map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', color: muted, fontSize: '0.85rem' }}>
                  <CheckCircle size={16} color={orange} />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/register/teacher')}
              style={{
                width: '100%', background: 'transparent', color: text,
                border: `1px solid ${border}`, borderRadius: '40px', padding: '14px',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              M'inscrire comme Tuteur <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: `1px solid ${border}` }}>
          <p style={{ fontSize: '0.8rem', color: muted }}>
            Déjà un compte ?{' '}
            <span style={{ color: orange, cursor: 'pointer' }} onClick={() => navigate('/login')}>
              Se connecter
            </span>
          </p>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}