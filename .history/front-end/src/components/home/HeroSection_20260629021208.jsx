// ============================================================
// Home.jsx — Page d'accueil
// ============================================================

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import HeroSection from '../components/home/HeroSection';
import TeachersSection from '../components/home/TeachersSection';

export default function Home({ isDark, user }) {
  // --- States filtres ---
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);

  // --- Données ---
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ============================================================
  // SECTION : CHARGEMENT DES PROFESSEURS AVEC FILTRES
  // ============================================================

  // --- Fonction qui charge les profs selon les filtres ---
  async function fetchTeachers(filters = {}) {
    setLoading(true);
    setError('');

    try {
      // Construction des params compatibles backend
      const params = {};

      // Filtre ville (si présent et pas Webcam)
      if (filters.ville) {
        params.ville = filters.ville;
      }

      // Filtre cours en ligne (Webcam)
      if (filters.cours_enligne) {
        params.cours_enligne = '1';
      }

      // Appel API avec les bons params
      const res = await api.get('/enseignants', { params });
      let data = res.data || [];

      // Filtre matière côté frontend (car backend ne filtre pas par matière)
      if (filters.matiere) {
        data = data.filter(t => {
          // Vérifie si le prof enseigne cette matière
          const matieres = t.matieres || [];
          return matieres.some(m =>
            m.nom?.toLowerCase().includes(filters.matiere.toLowerCase())
          );
        });
      }

      setTutors(data);
    } catch (e) {
      setError('Erreur lors du chargement des professeurs.');
    } finally {
      setLoading(false);
    }
  }

  // --- Chargement initial ---
  useEffect(() => {
    fetchTeachers();
  }, []);

  // ============================================================
  // SECTION : RENDU
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
        // --- NOUVEAU : callback quand les filtres changent ---
        onFiltersChange={(filters) => fetchTeachers(filters)}
      />

      <TeachersSection
        isDark={isDark}
        tutors={tutors}
        loading={loading}
        error={error}
        user={user}
      />
    </div>
  );
}