import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import HeroSection from '../../components/home/HeroSection';
import TeachersSection from '../../components/home/TeachersSection';
import StatsSection from '../../components/home/StatsSection';
import HowItWorks from '../../components/home/HowItWorks';
import FeaturesSection from '../../components/home/FeaturesSection';
import CtaSection from '../../components/home/CtaSection';
import FaqSection from '../../components/home/FaqSection';
import api from '../../api/axios';

function mapEnseignant(e) {
  let avatarUrl = 'https://ui-avatars.com/api/?background=e04f00&color=fff&size=200';
  
  if (e.user?.photo) {
    if (e.user.photo.startsWith('http')) {
      avatarUrl = e.user.photo;
    } else {
      avatarUrl = `http://localhost:8000/storage/${e.user.photo}`;
    }
  }

  // Déterminer le type de delivery
  let delivery = '';
  if (e.cours_domicile && e.cours_enligne) {
    delivery = 'face à face & webcam';
  } else if (e.cours_enligne) {
    delivery = 'webcam';
  } else if (e.cours_domicile) {
    delivery = 'face à face';
  }

  return {
    id: String(e.utilisateur_id),
    name: ((e.user?.prenom || '') + ' ' + (e.user?.nom || '')).trim(),
    role: e.titre || 'Professeur de Soutien Scolaire',
    city: e.user?.ville || 'Maroc',
    rating: parseFloat(e.noteMoyenne) || 0,
    bio: e.description_profil || '',
    avatar: avatarUrl,
    rate: parseFloat(e.tarifHeure) || 0,
    subjects: (e.matieres || []).map(function(m) { return m.nom; }),
    isFirstFree: true,
    isAmbassador: false,
    delivery: delivery
  };
}

export default function Home() {
  const context = useOutletContext();
  const isDark = context ? context.isDark : false;
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Charger les professeurs
  useEffect(function() {
    async function fetchTutors() {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/enseignants');
        console.log('API Response:', response.data);
        const mapped = response.data.map(mapEnseignant);
        console.log('Mapped tutors:', mapped);
        setTutors(mapped);
      } catch(err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les professeurs. Vérifiez que le serveur Laravel est démarré.');
        setTutors([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, []);

  // Filtrer les professeurs
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
    <div>
      {/* SECTION 1: HERO - Accroche et barre de recherche */}
      <HeroSection
        isDark={isDark}
        querySubject={querySubject}
        setQuerySubject={setQuerySubject}
        queryCity={queryCity}
        setQueryCity={setQueryCity}
        activePill={activePill}
        setActivePill={setActivePill}
      />

      {/* SECTION 2: TEACHERS - Liste des professeurs */}
      <TeachersSection
        isDark={isDark}
        tutors={filteredTutors}
        loading={loading}
        error={error}
        onReset={handleReset}
        querySubject={querySubject}
        queryCity={queryCity}
      />

      {/* SECTION 3: STATS - Chiffres clés */}
      <StatsSection isDark={isDark} />

      {/* SECTION 4: HOW IT WORKS - Fonctionnement */}
      <HowItWorks isDark={isDark} />

      {/* SECTION 5: FEATURES - Qualités */}
      <FeaturesSection isDark={isDark} />

      {/* SECTION 6: CTA - Publier une demande */}
      <CtaSection isDark={isDark} user={null} />

      {/* SECTION 7: FAQ - Questions fréquentes */}
      <FaqSection isDark={isDark} />
    </div>
  );
}