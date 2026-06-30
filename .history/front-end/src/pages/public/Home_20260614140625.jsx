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

  let delivery = '';
  if (e.cours_domicile && e.cours_enligne) {
    delivery = 'face à face & webcam';
  } else if (e.cours_enligne) {
    delivery = 'webcam';
  } else if (e.cours_domicile) {
    delivery = 'face à face';
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
    isAmbassador: false,
    delivery: delivery
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

  useEffect(function() {
    async function fetchTutors() {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/enseignants');
        const mapped = response.data.map(mapEnseignant);
        setTutors(mapped);
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

  // FILTRAGE MÉTHODE DAIF - sans .some()
  function filterTutors() {
    var result = [];
    
    for (var i = 0; i < tutors.length; i++) {
      var t = tutors[i];
      var subjectMatch = false;
      var cityMatch = false;
      
      // Vérifier la matière
      if (activePill !== null) {
        // Si un pill est actif, vérifier si la matière correspond exactement
        for (var j = 0; j < t.subjects.length; j++) {
          if (t.subjects[j] === activePill) {
            subjectMatch = true;
            break;
          }
        }
      } else if (querySubject !== '') {
        // Si recherche par texte, vérifier si matière ou rôle contient le texte
        var subjectFound = false;
        for (var k = 0; k < t.subjects.length; k++) {
          if (t.subjects[k].toLowerCase().indexOf(querySubject.toLowerCase()) !== -1) {
            subjectFound = true;
            break;
          }
        }
        if (subjectFound === true || t.role.toLowerCase().indexOf(querySubject.toLowerCase()) !== -1) {
          subjectMatch = true;
        }
      } else {
        subjectMatch = true;
      }
      
      // Vérifier la ville
      if (queryCity !== '') {
        if (t.city.toLowerCase().indexOf(queryCity.toLowerCase()) !== -1) {
          cityMatch = true;
        }
      } else {
        cityMatch = true;
      }
      
      // Ajouter au résultat si les deux conditions sont remplies
      if (subjectMatch === true && cityMatch === true) {
        result.push(t);
      }
    }
    
    return result;
  }

  var filteredTutors = filterTutors();

  function handleToggleFavorite(e, id) {
    e.stopPropagation();
    var newFavorites = [];
    var found = false;
    
    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i] === id) {
        found = true;
      } else {
        newFavorites.push(favorites[i]);
      }
    }
    
    if (found === false) {
      newFavorites.push(id);
    }
    
    setFavorites(newFavorites);
  }

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
      />

      <StatsSection isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <FeaturesSection isDark={isDark} />
      <CtaSection isDark={isDark} user={null} />
      <FaqSection isDark={isDark} />
    </div>
  );
}