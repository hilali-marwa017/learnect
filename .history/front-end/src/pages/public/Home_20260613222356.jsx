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
    subjects: (e.matieres || []).map(function(m) { return m.nom; }),
    domicile: Boolean(e.cours_domicile),
    enligne: Boolean(e.cours_enligne),
  };
}

export default function Home() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.body.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchTutors() {
      try {
        setLoading(true);
        const res = await api.get('/enseignants');
        setTutors(res.data.map(mapEnseignant));
      } catch (err) {
        setError('Erreur chargement');
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter((t) => {
    const subjectMatch = activePill ? t.subjects.some((s) => s === activePill) : querySubject ? t.subjects.some((s) => s.toLowerCase().includes(querySubject.toLowerCase())) : true;
    const cityMatch = queryCity ? t.city.toLowerCase().includes(queryCity.toLowerCase()) : true;
    return subjectMatch && cityMatch;
  });

  const handleToggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const bg = isDark ? '#000000' : '#f8f9fc';

  return (
    <div style={{ background: bg }}>
      <HeroSection isDark={isDark} querySubject={querySubject} setQuerySubject={setQuerySubject} queryCity={queryCity} setQueryCity={setQueryCity} activePill={activePill} setActivePill={setActivePill} onReset={() => { setQuerySubject(''); setQueryCity(''); setActivePill(null); }} />
      <StatsSection isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <TeachersSection isDark={isDark} filteredTutors={filteredTutors} favorites={favorites} handleToggleFavorite={handleToggleFavorite} activePill={activePill} loading={loading} error={error} onReset={() => { setQuerySubject(''); setQueryCity(''); setActivePill(null); }} querySubject={querySubject} queryCity={queryCity} />
      <FeaturesSection isDark={isDark} />
      <FaqSection isDark={isDark} />
    </div>
  );
}