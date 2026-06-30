// ============================================================
// Home.jsx — AVEC DEBUG CONSOLE.LOG
// ============================================================

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
  // SECTION 1 : CHARGEMENT INITIAL — AVEC DEBUG
  // ============================================================
  useEffect(() => {
    async function loadAllTutors() {
      setLoading(true);
      setError('');
      console.log('=== CHARGEMENT API /enseignants ===');
      try {
        const res = await api.get('/enseignants');
        const data = res.data || [];
        console.log('Total profs chargés:', data.length);
        
        // DEBUG : Afficher le premier prof pour voir sa structure
        if (data.length > 0) {
          console.log('Structure premier prof:', {
            nom: data[0].user?.nom,
            matieres: data[0].matieres,
            langues: data[0].langues,
            titre: data[0].titre,
          });
        }
        
        // DEBUG : Afficher tous les profs avec leurs matières
        data.forEach((t, i) => {
          const matieresNoms = (t.matieres || []).map(m => m.nom);
          console.log(`Prof #${i}: ${t.user?.nom} | matieres: [${matieresNoms.join(', ')}] | langues: "${t.langues}" | titre: "${t.titre}"`);
        });
        
        setAllTutors(data);
      } catch (err) {
        console.error('ERREUR API:', err);
        setError('Impossible de charger les professeurs.');
        setAllTutors([]);
      } finally {
        setLoading(false);
      }
    }
    loadAllTutors();
  }, []);

  // ============================================================
  // SECTION 2 : FILTRAGE — AVEC DEBUG COMPLET
  // ============================================================
  useEffect(() => {
    console.log('=== FILTRAGE DÉCLENCHÉ ===');
    console.log('querySubject:', querySubject);
    console.log('queryCity:', queryCity);
    console.log('isWebcam:', isWebcam);
    console.log('allTutors.length:', allTutors.length);

    let result = [...allTutors];
    console.log('Avant filtre:', result.length, 'profs');

    // --- Filtre par matière ---
    if (querySubject) {
      const search = querySubject.toLowerCase().trim();
      console.log('Recherche texte:', `"${search}"`);

      result = result.filter(t => {
        const matieres = (t.matieres || []).map(m => (m.nom || '').toLowerCase());
        const langues = (t.langues || '').toLowerCase();
        const titre = (t.titre || '').toLowerCase();

        const matchMatieres = matieres.some(m => m.includes(search));
        const matchLangues = langues.includes(search);
        const matchTitre = titre.includes(search);

        // DEBUG : Afficher pour CHAQUE prof ce qui matche
        console.log(`Prof ${t.user?.nom}: matieres=[${matieres.join(', ')}] | matchMatieres=${matchMatieres} | langues="${t.langues}" | matchLangues=${matchLangues} | titre="${t.titre}" | matchTitre=${matchTitre}`);

        // ✅ UNIQUEMENT matieres.nom — PAS langues, PAS titre
        return matchMatieres;
      });

      console.log('Après filtre matière:', result.length, 'profs');
    }

    // --- Filtre par ville / webcam ---
    if (isWebcam) {
      console.log('Filtre Webcam activé');
      result = result.filter(t => {
        const hasWebcam = t.cours_enligne === true || t.cours_enligne === 1;
        console.log(`Prof ${t.user?.nom}: cours_enligne=${t.cours_enligne} | match=${hasWebcam}`);
        return hasWebcam;
      });
    } else if (queryCity) {
      const cityLower = queryCity.toLowerCase().trim();
      console.log('Filtre ville:', `"${cityLower}"`);
      result = result.filter(t => {
        const ville = (t.user?.ville || '').toLowerCase();
        const match = ville.includes(cityLower);
        console.log(`Prof ${t.user?.nom}: ville="${t.user?.ville}" | match=${match}`);
        return match;
      });
    }

    console.log('=== RÉSULTAT FINAL:', result.length, 'profs ===');
    result.forEach(t => console.log('  -', t.user?.nom, '|', (t.matieres || []).map(m => m.nom).join(', ')));
    
    setTutors(result);
  }, [allTutors, querySubject, queryCity, isWebcam]);

  // ============================================================
  // SECTION 3 : RESET
  // ============================================================
  function handleReset() {
    console.log('=== RESET FILTRES ===');
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
    setIsWebcam(false);
  }

  // ============================================================
  // SECTION 4 : RENDU JSX
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