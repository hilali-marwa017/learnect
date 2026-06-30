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

function mapEnseignant(e) {
  return {
    id: String(e.utilisateur_id),
    name: ((e.user?.prenom || '') + ' ' + (e.user?.nom || '')).trim(),
    role: e.titre || 'Professeur',
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

const FALLBACK = [
  { id: 'f1', name: 'Yassine B.', role: 'Professeur de Mathématiques (CPGE)', city: 'Casablanca', rating: 4.9, bio: 'Passionné par la transmission du savoir, j\'accompagne les élèves vers l\'excellence.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', rate: 200, subjects: ['Mathématiques', 'Physique'] },
  { id: 'f2', name: 'Nika K.', role: 'Enseignante d\'Anglais certifiée IELTS', city: 'Rabat', rating: 4.8, bio: 'Native speaker et formatrice certifiée, j\'aide chaque étudiant à atteindre son objectif.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400', rate: 180, subjects: ['Anglais', 'IELTS'] },
  { id: 'f3', name: 'Mehdi A.', role: 'Ingénieur et Formateur en Développement Web', city: 'Casablanca', rating: 4.9, bio: 'Développeur full-stack avec 8 ans d\'expérience. Je forme des développeurs compétents.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', rate: 250, subjects: ['Code', 'Python', 'Web Dev'] },
  { id: 'f4', name: 'Sofia T.', role: 'Professeure de Français Langue Étrangère', city: 'Marrakech', rating: 4.7, bio: 'Diplômée en lettres modernes, j\'aide les élèves à maîtriser le français avec fluidité.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', rate: 150, subjects: ['Français', 'Littérature'] },
  { id: 'f5', name: 'Dr. Amine L.', role: 'Docteur en Physique-Chimie — Prépa', city: 'Fès', rating: 5.0, bio: 'Ancien élève de grande école, je propose un accompagnement scientifique de haut niveau.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', rate: 300, subjects: ['Physique', 'Chimie', 'SVT'] },
  { id: 'f6', name: 'Noura S.', role: 'Professeure d\'Arabe et d\'Éducation Islamique', city: 'Casablanca', rating: 4.9, bio: 'Enseignante diplômée avec 10 ans d\'expérience. Pédagogie adaptée à chaque niveau.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', rate: 165, subjects: ['Arabe', 'Éducation Islamique'] },
];

export default function Home() {
  const { isDark } = useOutletContext() || { isDark: false };
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const orange = '#e04f00';
  const bg = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : 'rgba(255,255,255,0.6)';

  useEffect(function() {
    async function fetchTutors() {
      try {
        const res = await api.get('/enseignants');
        const mapped = res.data.map(mapEnseignant);
        setTutors(mapped.length > 0 ? mapped : FALLBACK);
      } catch(err) {
        setTutors(FALLBACK);
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
        ? t.subjects.some(function(s) { return s.toLowerCase().includes(querySubject.toLowerCase()); })
        : true;
    const cityMatch = queryCity ? t.city.toLowerCase().includes(queryCity.toLowerCase()) : true;
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
      <HeroSection isDark={isDark} querySubject={querySubject} setQuerySubject={setQuerySubject} queryCity={queryCity} setQueryCity={setQueryCity} activePill={activePill} setActivePill={setActivePill} />
      <StatsSection isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <TeachersSection isDark={isDark} filteredTutors={loading ? [] : filteredTutors} favorites={favorites} handleToggleFavorite={handleToggleFavorite} activePill={activePill} loading={loading} onReset={handleReset} querySubject={querySubject} queryCity={queryCity} />
      <FeaturesSection isDark={isDark} />

      {/* CTA Section */}
      <section style={{ background: '#07090d', padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(224,79,0,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, right: '20%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(28,100,242,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange }}>
            REJOIGNEZ NOTRE RÉSEAU D'ÉLITE
          </span>
          <h2 style={{ fontFamily: '"EB Garamond", Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', margin: '0.75rem 0 1rem', lineHeight: 1.15 }}>
            Vivez de votre passion,<br />enseignez sur Learnect.
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 450, margin: '0 auto 2rem' }}>
            Rejoignez plus de 450 professeurs certifiés qui transmettent leur savoir. Définissez vos tarifs et gérez votre emploi du temps en toute liberté.
          </p>
          <button
            onClick={function() { window.location.href = '/register'; }}
            style={{
              background: orange, color: '#fff', border: 'none',
              borderRadius: 12, padding: '14px 32px', fontWeight: 700,
              fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={function(e) { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={function(e) { e.currentTarget.style.opacity = '1'; }}>
            <Sparkles size={18} />
            Devenir Tuteur Partenaire
          </button>
        </div>
      </section>

      <FaqSection isDark={isDark} />
    </div>
  );
}