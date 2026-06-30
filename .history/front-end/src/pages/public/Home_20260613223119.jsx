import React, { useState, useEffect } from 'react';
import HeroSection from '../../components/home/HeroSection';
import StatsSection from '../../components/home/StatsSection';
import HowItWorks from '../../components/home/HowItWorks';
import FeaturesSection from '../../components/home/FeaturesSection';
import FaqSection from '../../components/home/FaqSection';
import TeachersSection from '../../components/home/TeachersSection';
import api from '../../api/axios';

function mapEnseignant(e) {
  return {
    id: String(e.utilisateur_id),
    name: ((e.user?.prenom || '') + ' ' + (e.user?.nom || '')).trim(),
    role: e.titre || 'Professeur',
    city: e.user?.ville || 'Maroc',
    rating: parseFloat(e.noteMoyenne) || 0,
    bio: e.description_profil || '',
    avatar: e.user?.photo ? `http://localhost:8000/storage/${e.user.photo}` : 'https://ui-avatars.com/api/?background=e04f00&color=fff&size=200',
    rate: parseFloat(e.tarifHeure) || 0,
    subjects: (e.matieres || []).map(function(m) { return m.nom; })
  };
}

export default function Home() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode
  useEffect(function() {
    const checkDark = function() {
      setIsDark(document.body.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return function() { observer.disconnect(); };
  }, []);

  // Fetch tutors
  useEffect(function() {
    async function fetchTutors() {
      try {
        const response = await api.get('/enseignants');
        setTutors(response.data.map(mapEnseignant));
        setLoading(false);
      } catch(err) {
        console.error('Erreur:', err);
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
    const cityMatch = queryCity
      ? t.city.toLowerCase().includes(queryCity.toLowerCase())
      : true;
    return subjectMatch && cityMatch;
  });

  function handleToggleFavorite(e, id) {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(function(x) { return x !== id; }));
    } else {
      setFavorites([...favorites, id]);
    }
  }

  const bg = isDark ? '#000000' : '#f8f9fc';

  return (
    <div style={{ background: bg }}>
      <HeroSection
        isDark={isDark}
        querySubject={querySubject}
        setQuerySubject={setQuerySubject}
        queryCity={queryCity}
        setQueryCity={setQueryCity}
        activePill={activePill}
        setActivePill={setActivePill}
      />
      <StatsSection isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <TeachersSection
        isDark={isDark}
        filteredTutors={filteredTutors}
        favorites={favorites}
        handleToggleFavorite={handleToggleFavorite}
        activePill={activePill}
        loading={loading}
        querySubject={querySubject}
        queryCity={queryCity}
        onReset={function() {
          setQuerySubject('');
          setQueryCity('');
          setActivePill(null);
        }}
      />
      <FeaturesSection isDark={isDark} />
      <FaqSection isDark={isDark} />
    </div>
  );
}