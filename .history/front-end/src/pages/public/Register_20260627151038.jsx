import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { GraduationCap, UserPlus, BookOpen, CheckCircle, ArrowRight, House } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  // couleurs selon theme
  const bg = isDark ?'#0a0a0c' : '#ffffff';
  const text   = isDark ?'#ffffff' : '#07090d';
  const muted  = isDark ?'#a1a4a5' : '#718096';
  const border = isDark ?'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const card   = isDark ?'#1a1a1c' : '#f8f9fc';
  const orange = '#e04f00';
  const iconColor = isDark ? '#6b7280' : '#9ca3af';

  // avantages etudiant
  const studentFeatures = [
    "Annuaire d'enseignants accredites",
    'Premiere heure de diagnostic offerte',
    'Messagerie privee securisee'
  ];

  // avantages enseignant
  const teacherFeatures = [
    'Visibilite aupres de milliers de familles',
    "Zero commission d'engagement",
    "Panel d'administration des gains et cours"
  ];

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '0', position: 'relative' }}>

      {/* Bouton retour accueil */}
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', zIndex: 10 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <House size={24} />
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

        {/* En-tete */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
            <GraduationCap size={28} color={orange} />
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: text }}>
              Learn<span style={{ color: orange }}>ect</span>.ma
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: text, marginBottom: '0.5rem' }}>
            COMMENCEZ DES AUJOURD'HUI
          </h1>
          <p style={{ fontSize: '1rem', color: muted, maxWidth: '600px', margin: '0 auto' }}>
            Rejoignez Learnect.ma — Selectionnez votre profil d'inscription ci-dessous pour demarrer instantanement votre parcours pedagogique au Maroc.
          </p>
        </div>

        {/* Deux cartes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

          {/* Carte etudiant */}
          <div style={{ background: card, border: '1px solid ' + border, borderRadius: '24px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', background: orange + '15', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={24} color={orange} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: text, margin: 0 }}>
                Je suis un Eleve / Etudiant
              </h3>
            </div>
            <p style={{ color: muted, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Je souhaite trouver un professeur qualifie pres de chez moi a Casablanca, Rabat ou de maniere virtuelle, pour remonter mes notes, maitriser le programme et reussir mes devoirs.
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
              style={{ width: '100%', background: orange, color: '#fff', border: 'none', borderRadius: '40px', padding: '14px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              M'inscrire comme Etudiant <ArrowRight size={16} />
            </button>
          </div>

          {/* Carte enseignant */}
          <div style={{ background: card, border: '1px solid ' + border, borderRadius: '24px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', background: orange + '15', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} color={orange} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: text, margin: 0 }}>
                Je suis un Enseignant / Tuteur
              </h3>
            </div>
            <p style={{ color: muted, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Je souhaite donner des cours de soutien scolaire a domicile ou en ligne, definir librement mes tarifs horaires en MAD, gerer mes reservations et vivre sereinement de mes cours.
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
              style={{ width: '100%', background: 'transparent', color: text, border: '1px solid ' + border, borderRadius: '40px', padding: '14px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              M'inscrire comme Tuteur <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Lien connexion */}
        <div style={{ textAlign: 'center', margin: '2.5rem' }}>
          <p style={{ fontSize: '0.9rem', color: muted }}>
            Deja un compte ?{' '}
            <span style={{ color: orange, cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>
              Se connecter
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}