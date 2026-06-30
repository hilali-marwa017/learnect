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
        console.log('📦 [DEBUG] Tous les profs chargés:', res.data.length);
        
        // Afficher tous les profs avec leurs matières
        res.data.forEach((t, i) => {
          console.log(`📦 Prof #${i}: ${t.user?.prenom} ${t.user?.nom} | matieres:`, 
            t.matieres?.map(m => m.nom) || [], 
            '| langues:', t.langues,
            '| titre:', t.titre
          );
        });
        
        setAllTutors(res.data || []);
      } catch (err) {
        console.error('❌ Erreur chargement:', err);
        setError('Impossible de charger les professeurs.');
        setAllTutors([]);
      } finally {
        setLoading(false);
      }
    }
    loadAllTutors();
  }, []);

  // ============================================================
  // FILTRAGE - UNIQUEMENT par matieres.nom avec DEBUG
  // ============================================================
  useEffect(() => {
    console.log('=== FILTRAGE DÉCLENCHÉ ===');
    console.log('querySubject:', querySubject);
    console.log('queryCity:', queryCity);
    console.log('isWebcam:', isWebcam);
    console.log('allTutors.length:', allTutors.length);
    
    let result = allTutors;

    if (querySubject) {
      const search = querySubject.toLowerCase().trim();
      console.log('Recherche texte:', search);
      
      if (search.length > 0) {
        result = result.filter(t => {
          const matieres = (t.matieres || [])
            .map(m => (m.nom || '').toLowerCase().trim());
          
          // ✅ UNIQUEMENT les matières
          const matchMatiere = matieres.some(m => m.includes(search));
          
          // Log pour Sofia Benani
          if (t.user?.prenom === 'Sofia' && t.user?.nom === 'Benani') {
            console.log(`🔍 Sofia Benani: matieres=${JSON.stringify(matieres)} | match=${matchMatiere}`);
          }
          
          return matchMatiere;
        });
        
        console.log(`Après filtre matière: ${result.length} profs`);
      }
    }

    if (isWebcam) {
      console.log('Filtre webcam activé');
      result = result.filter(t =>
        t.cours_enligne === true || t.cours_enligne === 1
      );
    } else if (queryCity) {
      const cityLower = queryCity.toLowerCase().trim();
      console.log('Filtre ville:', cityLower);
      if (cityLower.length > 0) {
        result = result.filter(t => {
          const ville = (t.user?.ville || '').toLowerCase().trim();
          return ville.includes(cityLower);
        });
      }
    }

    console.log(`=== RÉSULTAT FINAL: ${result.length} profs ===`);
    result.forEach(t => {
      console.log(`✅ ${t.user?.prenom} ${t.user?.nom} - Matières:`, t.matieres?.map(m => m.nom));
    });
    
    setTutors(result);
  }, [allTutors, querySubject, queryCity, isWebcam]);

  // ============================================================
  // RESET
  // ============================================================
  function handleReset() {
    console.log('🔄 RESET des filtres');
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