// ============================================================
// Home.jsx
// Page : Accueil publique
// Fonctionnalités : Recherche profs, filtres, sections marketing
// Backend : Laravel API (/enseignants) - chargé UNE FOIS, puis filtré en mémoire
// Méthodes utilisées : useState + useEffect + filter() (cours DAIF)
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
  // allTutors = la liste COMPLETE chargée une seule fois depuis le backend.
  // tutors = la liste affichée (filtrée), recalculée via useEffect ci-dessous.
  const [allTutors, setAllTutors] = useState([]);
  const [tutors, setTutors] = useState([]);

  // --- Loading / Error ---
  // Ce loading concerne UNIQUEMENT le chargement initial de la page.
  // Le filtrage, lui, ne déclenche jamais ce loading (pas d'appel API).
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Filtres ---
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);
  const [isWebcam, setIsWebcam] = useState(false);

  // ============================================================
  // SECTION 2 : CHARGEMENT INITIAL (une seule fois, au montage)
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
  // SECTION 3 : FILTRAGE INSTANTANÉ (useEffect + filter, sans loading)
  // ============================================================

  // Ce useEffect se relance automatiquement chaque fois qu'une des
  // dépendances change (querySubject, queryCity, isWebcam, allTutors).
  // Comme c'est juste un filter() en JS pur (pas d'appel API), c'est
  // synchrone et instantané : aucun écran de chargement entre la
  // frappe au clavier et l'affichage du résultat.
  useEffect(() => {
    let result = allTutors;

    // --- Filtre matière ---
    if (querySubject) {
      const search = querySubject.toLowerCase();
      result = result.filter(t => {
        const matieres = (t.matieres || []).map(m => (m.nom || '').toLowerCase());
        const titre = (t.titre || '').toLowerCase();
        return matieres.some(m => m.includes(search)) || titre.includes(search);
      });
    }

    // --- Filtre ville / webcam (mutuellement exclusifs) ---
    if (isWebcam) {
      result = result.filter(t => t.enligne === true || t.cours_enligne === true);
    } else if (queryCity) {
      const cityLower = queryCity.toLowerCase();
      result = result.filter(t => (t.ville || '').toLowerCase().includes(cityLower));
    }

    setTutors(result);
  }, [allTutors, querySubject, queryCity, isWebcam]);

  // ============================================================
  // SECTION 4 : RESET DES FILTRES
  // ============================================================

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
    setIsWebcam(false);
    // Pas besoin de re-fetch : le useEffect ci-dessus va se relancer
    // automatiquement (dépendances changées) et remettre tutors = allTutors.
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