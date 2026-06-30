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
        
        // 🔍 Afficher les données de Sofia Benani
        const sofia = res.data.find(t => t.user?.prenom === 'Sofia' && t.user?.nom === 'Benani');
        if (sofia) {
          console.log('🔍 [DEBUG] Sofia Benani trouvée:', {
            id: sofia.utilisateur_id,
            nom: sofia.user?.prenom + ' ' + sofia.user?.nom,
            matieres: sofia.matieres?.map(m => m.nom) || [],
            langues: sofia.langues,
            titre: sofia.titre
          });
        }
        
        setAllTutors(res.data || []);
      } catch (err) {
        console.error('❌ [DEBUG] Erreur chargement:', err);
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
    console.log('🔍 [DEBUG] Début filtrage...');
    console.log('🔍 [DEBUG] querySubject =', querySubject);
    
    let result = allTutors;

    if (querySubject) {
      const search = querySubject.toLowerCase();
      console.log('🔍 [DEBUG] Recherche de:', search);
      
      result = result.filter(t => {
        const matieres = (t.matieres || [])
          .map(m => (m.nom || '').toLowerCase());
        
        const langues = (t.langues || '').toLowerCase();
        const titre = (t.titre || '').toLowerCase();
        
        // 🔍 Afficher ce qu'on vérifie pour chaque prof
        if (t.user?.prenom === 'Sofia' && t.user?.nom === 'Benani') {
          console.log('🔍 [DEBUG] Sofia Benani - matières:', matieres);
          console.log('🔍 [DEBUG] Sofia Benani - langues:', langues);
          console.log('🔍 [DEBUG] Sofia Benani - titre:', titre);
        }
        
        const matchMatiere = matieres.some(m => m.includes(search));
        const matchLangues = langues.includes(search);
        const matchTitre = titre.includes(search);
        
        // 🔍 Afficher pourquoi Sofia est incluse/exclue
        if (t.user?.prenom === 'Sofia' && t.user?.nom === 'Benani') {
          console.log('🔍 [DEBUG] Sofia - matchMatiere:', matchMatiere);
          console.log('🔍 [DEBUG] Sofia - matchLangues:', matchLangues);
          console.log('🔍 [DEBUG] Sofia - matchTitre:', matchTitre);
          console.log('🔍 [DEBUG] Sofia - INCLUSE?', matchMatiere || matchLangues || matchTitre);
        }
        
        // ✅ UNIQUEMENT les matières
        return matchMatiere;
      });
      
      console.log('🔍 [DEBUG] Résultat après filtrage:', result.length, 'professeurs');
      
      // 🔍 Afficher les profs trouvés
      result.forEach(t => {
        console.log('🔍 [DEBUG] Trouvé:', t.user?.prenom, t.user?.nom, '- Matières:', t.matieres?.map(m => m.nom));
      });
      
    } else {
      console.log('🔍 [DEBUG] Pas de recherche, tous les profs affichés');
    }

    if (isWebcam) {
      console.log('🔍 [DEBUG] Filtre webcam activé');
      result = result.filter(t =>
        t.cours_enligne === true || t.cours_enligne === 1
      );
    } else if (queryCity) {
      console.log('🔍 [DEBUG] Filtre ville:', queryCity);
      const cityLower = queryCity.toLowerCase();
      result = result.filter(t => {
        const ville = (t.user?.ville || '').toLowerCase();
        return ville.includes(cityLower);
      });
    }

    console.log('🔍 [DEBUG] Résultat final:', result.length, 'professeurs');
    setTutors(result);
  }, [allTutors, querySubject, queryCity, isWebcam]);

  // ============================================================
  // RESET
  // ============================================================
  function handleReset() {
    console.log('🔍 [DEBUG] Reset des filtres');
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