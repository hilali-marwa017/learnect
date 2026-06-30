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
    role: e.titre || 'Professeur de Soutien Scolaire',
    city: e.user?.ville || 'Maroc',
    rating: parseFloat(e.noteMoyenne) || 0,
    bio: e.description_profil || '',
    avatar: e.user?.photo
      ? `http://localhost:8000/storage/${e.user.photo}`
      : 'https://ui-avatars.com/api/?background=e04f00&color=fff&size=200',
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

  // Récupérer le thème depuis le body
  const isDark = typeof window !== 'undefined' && document.body.classList.contains('dark');

  useEffect(function() {
    async function fetchTutors() {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/enseignants');
        setTutors(response.data.map(mapEnseignant));
      } catch (err) {
        console.error('Erreur fetch tutors:', err);
        setError('Impossible de charger les professeurs.');
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter(function(t) {
    const subjectMatch = activePill
      ? t.subjects.some(function(s) { 
          return s.toLowerCase().includes(activePill.toLowerCase()); 
        })
      : querySubject
        ? t.subjects.some(function(s) { 
            return s.toLowerCase().includes(querySubject.toLowerCase()); 
          }) || t.role.toLowerCase().includes(querySubject.toLowerCase())
        : true;
    
    const cityMatch = queryCity
      ? t.city.toLowerCase().includes(queryCity.toLowerCase())
      : true;
    
    return subjectMatch && cityMatch;
  });

  function handleSearch() {}
  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
  }

  function handleToggleFavorite(e, id) {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(function(x) { return x !== id; }));
    } else {
      setFavorites([...favorites, id]);
    }
  }

  return (
    <>
      <HeroSection
        isDark={isDark}
        querySubject={querySubject}
        setQuerySubject={setQuerySubject}
        queryCity={queryCity}
        setQueryCity={setQueryCity}
        activePill={activePill}
        setActivePill={setActivePill}
        onSearch={handleSearch}
        onReset={handleReset}
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
        error={error}
        onReset={handleReset}
        querySubject={querySubject}
        queryCity={queryCity}
      />

      <FeaturesSection isDark={isDark} />

      {/* CTA Section */}
      <section style={{ background: '#111111', padding: '5rem 2rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: '#e04f00', display: 'block', marginBottom: '0.5rem' }}>
          Rejoignez Notre Réseau d'Élite
        </span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: '0 auto 1rem', maxWidth: 520 }}>
          Vivez de votre passion,<br />enseignez sur Learnect.
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.75 }}>
          Rejoignez plus de 450 professeurs certifiés qui transmettent leur savoir sur la plateforme la plus innovante du Maroc.
        </p>
        <button
          onClick={() => window.location.href = '/register'}
          style={{
            background: '#e04f00',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '13px 30px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Devenir Tuteur Partenaire
        </button>
      </section>

      <FaqSection isDark={isDark} />
    </>
  );
}