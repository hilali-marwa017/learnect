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

  useEffect(() => {
    let result = allTutors;

    // ✅ FIX : cherche dans matieres + titre + langues
    if (querySubject) {
      const search = querySubject.toLowerCase();
      result = result.filter(t => {
        const matieres = (t.matieres || []).map(m => (m.nom || '').toLowerCase());
        const titre    = (t.titre    || '').toLowerCase();
        const langues  = (t.langues  || '').toLowerCase();
        return (
          matieres.some(m => m.includes(search)) ||
          titre.includes(search)                 ||
          langues.includes(search)
        );
      });
    }

    // ✅ FIX : webcam = t.cours_enligne (pas t.enligne)
    if (isWebcam) {
      result = result.filter(t => t.cours_enligne === true || t.cours_enligne === 1);
    } else if (queryCity) {
      // ✅ FIX : ville vient de t.user.ville (pas t.ville)
      const cityLower = queryCity.toLowerCase();
      result = result.filter(t => {
        const ville = (t.user?.ville || t.ville || '').toLowerCase();
        return ville.includes(cityLower);
      });
    }

    setTutors(result);
  }, [allTutors, querySubject, queryCity, isWebcam]);

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
    setIsWebcam(false);
  }

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