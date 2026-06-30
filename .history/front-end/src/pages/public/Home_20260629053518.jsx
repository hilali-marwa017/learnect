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

export default function Home() {
  const context    = useOutletContext() || {};
  const isDark     = context.isDark || false;
  const user       = context.user   || null;

  const [allTutors,    setAllTutors]    = useState([]);
  const [tutors,       setTutors]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity,    setQueryCity]    = useState('');
  const [activePill,   setActivePill]   = useState(null);
  const [isWebcam,     setIsWebcam]     = useState(false);

  // ============================================================
  // CHARGEMENT INITIAL
  // ============================================================
  useEffect(() => {
    async function loadAllTutors() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/enseignants');
        setAllTutors(res.data || []);
      } catch (err) {
        setError('Impossible de charger les professeurs.');
        setAllTutors([]);
      } finally {
        setLoading(false);
      }
    }
    loadAllTutors();
  }, []);

  // ============================================================
  // FILTRAGE AMÉLIORÉ - Recherche par mots séparés
  // ============================================================
  useEffect(() => {
    let result = allTutors;

    // ✅ Filtre par matière/titre/langue avec recherche par mots
    if (querySubject) {
      const searchLower = querySubject.toLowerCase();
      // Séparer en mots pour une recherche plus précise
      const searchWords = searchLower.split(' ').filter(w => w.length > 0);
      
      result = result.filter(t => {
        const matieres = (t.matieres || [])
          .map(m => (m.nom || '').toLowerCase());
        const titre   = (t.titre   || '').toLowerCase();
        const langues = (t.langues || '').toLowerCase();
        
        // Vérifier si TOUS les mots recherchés sont présents
        // dans au moins un champ
        const matchMatiere = matieres.some(m => 
          searchWords.every(w => m.includes(w))
        );
        const matchTitre = searchWords.every(w => titre.includes(w));
        const matchLangues = searchWords.every(w => langues.includes(w));
        
        return matchMatiere || matchTitre || matchLangues;
      });
    }

    // ✅ Filtre par ville / webcam
    if (isWebcam) {
      result = result.filter(t =>
        t.cours_enligne === true || t.cours_enligne === 1
      );
    } else if (queryCity) {
      const cityLower = queryCity.toLowerCase();
      result = result.filter(t => {
        const ville = (t.user?.ville || '').toLowerCase();
        return ville.includes(cityLower);
      });
    }

    setTutors(result);
  }, [allTutors, querySubject, queryCity, isWebcam]);

  // ============================================================
  // RESET
  // ============================================================
  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
    setIsWebcam(false);
  }

  // ============================================================
  // RENDU
  // ============================================================
  return (
    <div>
      <HeroSection
        isDark={isDark}
        querySubject={querySubject}
        setQuerySubject={setQuerySubject}
        queryCity={queryCity}
        setQueryCity={setQueryCity}
        activePill={activePill}
        setActivePill={setActivePill}
        isWebcam={isWebcam}
        setIsWebcam={setIsWebcam}
      />
      <TeachersSection
        isDark={isDark}
        tutors={tutors}
        loading={loading}
        error={error}
        onReset={handleReset}
        querySubject={querySubject}
        queryCity={queryCity}
        user={user}
      />
      <StatsSection    isDark={isDark} />
      <HowItWorks      isDark={isDark} />
      <FeaturesSection isDark={isDark} />
      <CtaSection      isDark={isDark} user={user} />
      <FaqSection      isDark={isDark} />
    </div>
  );
}