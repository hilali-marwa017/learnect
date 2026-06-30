// ============================================================
// Home.jsx
// Page : Accueil publique
// Fonctionnalités : Recherche profs, filtres, sections marketing
// Backend : Laravel API (/enseignants?ville=&cours_enligne=)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';

import HeroSection from '../../components/home/HeroSection';
import TeachersSection from '../../components/home/TeachersSection';
import StatsSection from '../../components/home/StatsSection';
import HowItWorks from '../../components/home/HowItWorks';
import FeaturesSection from '../../components/home/FeaturesSection';
import CtaSection from '../../components/home/CtaSection';
import FaqSection from '../../components/home/FaqSection';

import api from '../../api/axios';

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export default function Home() {
  // --- Récupération contexte Layout ---
  const context = useOutletContext() || {};
  const isDark = context.isDark || false;
  const user = context.user || null;

  // ============================================================
  // SECTION 1 : STATES
  // ============================================================

  // --- Données ---
  const [tutors, setTutors] = useState([]);
  const [allTutors, setAllTutors] = useState([]);

  // --- Loading / Error ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Filtres ---
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);
  const [isWebcam, setIsWebcam] = useState(false);

  // ============================================================
  // SECTION 2 : FONCTIONS API
  // ============================================================

  const fetchTutors = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');

    try {
      // Construction params compatibles backend Laravel
      const params = {};
      if (filters.ville) params.ville = filters.ville;
      if (filters.cours_enligne) params.cours_enligne = '1';
      if (filters.tarif_max) params.tarif_max = filters.tarif_max;
      if (filters.note_min) params.note_min = filters.note_min;

      const res = await api.get('/enseignants', { params });
      const data = res.data || [];

      // Filtre matière côté frontend (backend ne supporte pas)
      let filtered = data;
      if (filters.matiere) {
        const search = filters.matiere.toLowerCase();
        filtered = data.filter(t => {
          const matieres = (t.matieres || []).map(m => (m.nom || '').toLowerCase());
          const titre = (t.titre || '').toLowerCase();
          return matieres.some(m => m.includes(search)) || titre.includes(search);
        });
      }

      setTutors(filtered);
      if (!filters.matiere && !filters.ville && !filters.cours_enligne) {
        setAllTutors(data);
      }
    } catch (err) {
      setError('Impossible de charger les professeurs.');
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // SECTION 3 : EFFETS
  // ============================================================

  // Chargement initial
  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  // ============================================================
  // SECTION 4 : GESTION DES FILTRES
  // ============================================================

  function handleSearch() {
    fetchTutors({
      ville: isWebcam ? '' : queryCity,
      cours_enligne: isWebcam,
      matiere: querySubject,
    });
  }

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
    setIsWebcam(false);
    fetchTutors();
  }

  // ============================================================
  // SECTION 5 : RENDU JSX
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
        onSearch={handleSearch}
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

      <StatsSection isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <FeaturesSection isDark={isDark} />
      <CtaSection isDark={isDark} user={user} />
      <FaqSection isDark={isDark} />
    </div>
  );
}