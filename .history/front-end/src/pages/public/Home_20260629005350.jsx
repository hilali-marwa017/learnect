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
  const context = useOutletContext();
  const isDark = context ? context.isDark : false;
  const user = context ? context.user : null;

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);

  useEffect(() => {
    async function fetchTutors() {
      try {
        setLoading(true);
        const res = await api.get('/enseignants');
        setTutors(res.data);
      } catch(err) {
        setError('Impossible de charger les professeurs.');
        setTutors([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, []);

  function filterTutors() {
    const result = [];
    for (let i = 0; i < tutors.length; i++) {
      const t = tutors[i];
      let subjectMatch = false;
      let cityMatch = false;
      const matieres = (t.matieres || []).map(m => m.nom.toLowerCase()).join(' ');

      if (activePill) {
        subjectMatch = matieres.includes(activePill.toLowerCase());
      } else if (querySubject) {
        subjectMatch = matieres.includes(querySubject.toLowerCase()) || 
                       (t.titre || '').toLowerCase().includes(querySubject.toLowerCase());
      } else {
        subjectMatch = true;
      }

      if (queryCity === 'Webcam') {
        cityMatch = t.cours_enligne === 1 || t.cours_enligne === true;
      } else if (queryCity) {
        cityMatch = (t.user?.ville || '').toLowerCase().includes(queryCity.toLowerCase());
      } else {
        cityMatch = true;
      }

      if (subjectMatch && cityMatch) result.push(t);
    }
    return result;
  }

  const filteredTutors = filterTutors();

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
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
      />
      <TeachersSection
        isDark={isDark}
        tutors={filteredTutors}
        loading={loading}
        error={error}
        onReset={handleReset}
        querySubject={querySubject}
        queryCity={queryCity}
        user={user}
      />
      <StatsSection isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <FeaturesSection isDark={isDark} />
      <CtaSection isDark={isDark} user={user} />
      <FaqSection isDark={isDark} />
    </div>
  );
} 