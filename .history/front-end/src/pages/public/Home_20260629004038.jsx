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
        // ✅ PASSER LES DONNEES BRUTES SANS TRANSFORMATION
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
    var result = [];
    for (var i = 0; i < tutors.length; i++) {
      var t = tutors[i];
      var subjectMatch = false;
      var cityMatch = false;
      var nomComplet = ((t.user?.prenom || '') + ' ' + (t.user?.nom || '')).toLowerCase();
      var matieres = (t.matieres || []).map(function(m) { return m.nom.toLowerCase(); }).join(' ');

      if (activePill) {
        for (var j = 0; j < matieres.split(' ').length; j++) {
          if (matieres.split(' ')[j] === activePill.toLowerCase()) { subjectMatch = true; break; }
        }
      } else if (querySubject) {
        subjectMatch = nomComplet.indexOf(querySubject.toLowerCase()) !== -1 || 
                       matieres.indexOf(querySubject.toLowerCase()) !== -1 || 
                       (t.titre || '').toLowerCase().indexOf(querySubject.toLowerCase()) !== -1;
      } else {
        subjectMatch = true;
      }

      if (queryCity === 'Webcam') {
        cityMatch = t.cours_enligne === 1 || t.cours_enligne === true;
      } else if (queryCity) {
        cityMatch = (t.user?.ville || '').toLowerCase().indexOf(queryCity.toLowerCase()) !== -1;
      } else {
        cityMatch = true;
      }

      if (subjectMatch && cityMatch) result.push(t);
    }
    return result;
  }

  var filteredTutors = filterTutors();

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
  }

  return (
    <div>
      <HeroSection
        isDark={isDark}
        querySubject={querySubject} setQuerySubject={setQuerySubject}
        queryCity={queryCity} setQueryCity={setQueryCity}
        activePill={activePill} setActivePill={setActivePill}
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