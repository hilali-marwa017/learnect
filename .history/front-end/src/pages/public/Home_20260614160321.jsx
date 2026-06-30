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
    avatarUrl = e.user.photo.startsWith('http') ? e.user.photo : `http://localhost:8000/storage/${e.user.photo}`;
  }
  let delivery = '';
  if (e.cours_domicile && e.cours_enligne) delivery = 'face à face & webcam';
  else if (e.cours_enligne) delivery = 'webcam';
  else if (e.cours_domicile) delivery = 'face à face';
  return {
    id: String(e.utilisateur_id),
    name: ((e.user?.prenom || '') + ' ' + (e.user?.nom || '')).trim(),
    role: e.titre || 'Professeur de Soutien Scolaire',
    city: e.user?.ville || 'Maroc',
    rating: parseFloat(e.noteMoyenne) || 0,
    bio: e.description_profil || '',
    avatar: avatarUrl,
    rate: parseFloat(e.tarifHeure) || 0,
    subjects: (e.matieres || []).map(m => m.nom),
    isFirstFree: true,
    isAmbassador: false,
    delivery: delivery
  };
}

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
        setTutors(res.data.map(mapEnseignant));
      } catch(err) {
        setError('Impossible de charger les professeurs.');
        setTutors([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, []);

  // 
  function filterTutors() {
    var result = [];
    for (var i = 0; i < tutors.length; i++) {
      var t = tutors[i];
      var subjectMatch = false;
      var cityMatch = false;

      // filtrage par matiere
      if (activePill) {
        for (var j = 0; j < t.subjects.length; j++) {
          if (t.subjects[j] === activePill) { subjectMatch = true; break; }
        }
      } else if (querySubject) {
        var found = false;
        for (var k = 0; k < t.subjects.length; k++) {
          if (t.subjects[k].toLowerCase().indexOf(querySubject.toLowerCase()) !== -1) { found = true; break; }
        }
        subjectMatch = found || t.role.toLowerCase().indexOf(querySubject.toLowerCase()) !== -1;
      } else {
        subjectMatch = true;
      }

      // Filtrage par ville ou Webcam
      if (queryCity === 'Webcam') {
        cityMatch = (t.delivery === 'webcam' || t.delivery === 'face à face & webcam');
      } else if (queryCity) {
        cityMatch = t.city.toLowerCase().indexOf(queryCity.toLowerCase()) !== -1;
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