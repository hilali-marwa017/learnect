import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import HeroSection from '../../components/home/HeroSection';
import TeachersSection from '../../components/home/TeachersSection';
import api from '../../api/axios';

function mapEnseignant(e) {
  return {
    id: String(e.utilisateur_id),
    name: ((e.user?.prenom || '') + ' ' + (e.user?.nom || '')).trim(),
    role: e.titre || 'Professeur de Soutien Scolaire',
    city: e.user?.ville || 'Maroc',
    rating: parseFloat(e.noteMoyenne) || 0,
    bio: e.description_profil || '',
    avatar: e.user?.photo
      ? `http://localhost:8000/storage/${e.user.photo}`
      : 'https://ui-avatars.com/api/?background=e04f00&color=fff&size=200',
    rate: parseFloat(e.tarifHeure) || 0,
    subjects: (e.matieres || []).map(function(m) { return m.nom; }),
    isFirstFree: true,
    isAmbassador: false,
    delivery: e.cours_enligne ? 'webcam' : 'face à face'
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

  // Charger les professeurs depuis l'API - SANS FALLBACK
  useEffect(function() {
    async function fetchTutors() {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/enseignants');
        const mapped = response.data.map(mapEnseignant);
        setTutors(mapped);
      } catch(err) {
        console.error('Erreur chargement:', err);
        setError('Impossible de charger les professeurs. Vérifiez que le serveur est démarré.');
        setTutors([]);
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
    <div>
      {/* Hero Section */}
      <HeroSection
        isDark={isDark}
        querySubject={querySubject}
        setQuerySubject={setQuerySubject}
        queryCity={queryCity}
        setQueryCity={setQueryCity}
        activePill={activePill}
        setActivePill={setActivePill}
      />

      {/* Teachers Section - DIRECTEMENT SOUS HERO */}
      <TeachersSection
        isDark={isDark}
        filteredTutors={filteredTutors}
        favorites={favorites}
        handleToggleFavorite={handleToggleFavorite}
        activePill={activePill}
        loading={loading}
        error={error}
        onReset={handleReset}
        querySubject={querySubject}
        queryCity={queryCity}
      />
    </div>
  );
}