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
    delivery: e.cours_enligne ? 'webcam' : 'face à face'
  };
}

export default function Home() {
  const context = useOutletContext();
  const isDark = context ? context.isDark : false;
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(function() {
    async function fetchTutors() {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/enseignants');
        setTutors(response.data.map(mapEnseignant));
      } catch(err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les professeurs.');
        setTutors([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, []);

  return (
    <div>
      <HeroSection isDark={isDark} />
      <TeachersSection isDark={isDark} tutors={tutors} loading={loading} error={error} />
      <StatsSection isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <FeaturesSection isDark={isDark} />
      <CtaSection isDark={isDark} user={null} />
      <FaqSection isDark={isDark} />
    </div>
  );
}