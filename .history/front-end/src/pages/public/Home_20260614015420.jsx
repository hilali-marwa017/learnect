import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import HeroSection from '../../components/home/HeroSection';
import StatsSection from '../../components/home/StatsSection';
import HowItWorks from '../../components/home/HowItWorks';
import FeaturesSection from '../../components/home/FeaturesSection';
import FaqSection from '../../components/home/FaqSection';
import TeachersSection from '../../components/home/TeachersSection';
import api from '../../api/axios';
import { Sparkles } from 'lucide-react';

// Fallback si backend vide ou déconnecté
const FALLBACK_TUTORS = [
  { id: 'f1', name: 'Yassine B.', role: 'Professeur de Mathématiques (CPGE)', city: 'Casablanca', rating: 4.9, bio: 'Passionné par la transmission du savoir, j\'accompagne les élèves vers l\'excellence avec rigueur.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', rate: 200, subjects: ['Mathématiques', 'Physique'] },
  { id: 'f2', name: 'Nika K.', role: 'Enseignante d\'Anglais certifiée IELTS / TOEFL', city: 'Rabat', rating: 4.8, bio: 'Formatrice certifiée, j\'aide chaque étudiant à atteindre son objectif linguistique rapidement.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80', rate: 180, subjects: ['Anglais', 'IELTS'] },
  { id: 'f3', name: 'Mehdi A.', role: 'Ingénieur Formateur en Développement Web & Code', city: 'Casablanca', rating: 4.9, bio: 'Développeur full-stack 8 ans d\'expérience. Je transforme les débutants en développeurs compétents.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', rate: 250, subjects: ['Code', 'Python', 'Web Dev'] },
  { id: 'f4', name: 'Sofia T.', role: 'Professeure de Français Langue Étrangère (FLE)', city: 'Marrakech', rating: 4.7, bio: 'Diplômée en lettres modernes, j\'aide les élèves à maîtriser le français avec fluidité et confiance.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', rate: 150, subjects: ['Français', 'Littérature'] },
  { id: 'f5', name: 'Dr. Amine L.', role: 'Docteur en Physique-Chimie — Prépa & Université', city: 'Fès', rating: 5.0, bio: 'Ancien élève de grande école, je propose un accompagnement scientifique de haut niveau.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', rate: 300, subjects: ['Physique', 'Chimie', 'SVT'] },
  { id: 'f6', name: 'Noura S.', role: 'Professeure d\'Arabe et d\'Éducation Islamique', city: 'Casablanca', rating: 4.9, bio: 'Enseignante diplômée avec 10 ans d\'expérience. Pédagogie adaptée à chaque niveau scolaire.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', rate: 165, subjects: ['Arabe', 'Éducation Islamique'] },
];

function mapEnseignant(e) {
  return {
    id: String(e.utilisateur_id),
    name: ((e.user?.prenom || '') + ' ' + (e.user?.nom || '')).trim(),
    role: e.titre || 'Professeur de Soutien Scolaire',
    city: e.user?.ville || 'Maroc',
    rating: parseFloat(e.noteMoyenne) || 5.0,
    bio: e.description_profil || '',
    avatar: e.user?.photo
      ? 'http://localhost:8000/storage/' + e.user.photo
      : 'https://ui-avatars.com/api/?name=' + encodeURIComponent((e.user?.prenom || 'P') + '+' + (e.user?.nom || 'N')) + '&background=e04f00&color=fff&size=300',
    rate: parseFloat(e.tarifHeure) || 0,
    subjects: (e.matieres || []).map(function(m) { return m.nom; })
  };
}

export default function Home() {
  const context = useOutletContext();
  const isDark = context ? context.isDark : false;

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const orange = '#e04f00';
  const bg = isDark ? '#000000' : '#f8f9fc';

  useEffect(function() {
    async function fetchTutors() {
      try {
        const res = await api.get('/enseignants');
        const mapped = res.data.map(mapEnseignant);
        setTutors(mapped.length > 0 ? mapped : FALLBACK_TUTORS);
      } catch(err) {
        // Pas de connexion backend → données de démo
        setTutors(FALLBACK_TUTORS);
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter(function(t) {
    const subjectMatch = activePill
      ? t.subjects.some(function(s) { return s === activePill; })
      : querySubject
        ? t.subjects.some(function(s) { return s.toLowerCase().includes(querySubject.toLowerCase()); }) || t.role.toLowerCase().includes(querySubject.toLowerCase())
        : true;
    const cityMatch = queryCity
      ? t.city.toLowerCase().includes(queryCity.toLowerCase())
      : true;
    return subjectMatch && cityMatch;
  });

  function handleToggleFavorite(e, id) {
    e.stopPropagation();
    setFavorites(function(prev) {
      return prev.includes(id) ? prev.filter(function(x) { return x !== id; }) : [...prev, id];
    });
  }

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
  }

  return (
    <div style={{ background: bg }}>

      <HeroSection
        isDark={isDark}
        querySubject={querySubject} setQuerySubject={setQuerySubject}
        queryCity={queryCity} setQueryCity={setQueryCity}
        activePill={activePill} setActivePill={setActivePill}
      />

      <StatsSection isDark={isDark} />

      <HowItWorks isDark={isDark} />

      <TeachersSection
        isDark={isDark}
        filteredTutors={loading ? [] : filteredTutors}
        favorites={favorites}
        handleToggleFavorite={handleToggleFavorite}
        activePill={activePill}
        loading={loading}
        onReset={handleReset}
        querySubject={querySubject}
        queryCity={queryCity}
      />

      <FeaturesSection isDark={isDark} />

      {/* ===== CTA : Vivez de votre passion ===== */}
      <section style={{
        background: '#07090d',
        padding: '5.5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glows déco */}
        <div style={{ position: 'absolute', top: '-20%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(224,79,0,0.06)', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '15%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(28,100,242,0.05)', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange }}>
            REJOIGNEZ NOTRE RÉSEAU D'ÉLITE
          </span>
          <h2 style={{
            fontFamily: '"EB Garamond", Georgia, serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 700, color: '#ffffff',
            margin: '0.75rem 0 1rem', lineHeight: 1.12, letterSpacing: '-0.02em'
          }}>
            Vivez de votre passion,<br />enseignez sur Learnect.
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 440, margin: '0 auto 2.25rem' }}>
            Rejoignez plus de 450 professeurs certifiés qui transmettent leur savoir sur la plateforme la plus innovante du Maroc. Définissez vos tarifs en toute liberté.
          </p>
          <button
            onClick={function() { window.location.href = '/register'; }}
            style={{
              background: '#ffffff', color: '#07090d',
              border: 'none', borderRadius: 10,
              padding: '14px 32px', fontWeight: 700,
              fontSize: '0.9rem', cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'opacity 0.15s, transform 0.15s'
            }}
            onMouseEnter={function(e) { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={function(e) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Sparkles size={17} color="#e04f00" />
            Devenir Tuteur Partenaire
          </button>
        </div>
      </section>

      <FaqSection isDark={isDark} />

    </div>
  );
}