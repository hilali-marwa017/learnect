// ============================================================
// HeroSection.jsx
// Composant : Barre de recherche + filtres (matière, ville, Webcam)
// Fonctionnalités : Recherche avec dropdowns, pills matières, scroll auto
// Backend : Laravel API (/matieres, /villes, /enseignants)
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, BookOpen, Calculator, Languages,
  TrendingUp, Scale, RefreshCw, Wifi
} from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({
  isDark,
  querySubject,
  setQuerySubject,
  queryCity,
  setQueryCity,
  activePill,
  setActivePill,
  isWebcam,
  setIsWebcam,
  onSearch
}) {

  // ============================================================
  // SECTION 1 : STATES
  // ============================================================

  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Référence vers le timeout de debounce, pour pouvoir l'annuler.
  // Sans ça, chaque frappe clavier empile un nouveau setTimeout et
  // les appels à onSearch() se chevauchent dans le désordre.
  const debounceRef = useRef(null);

  // ============================================================
  // SECTION 2 : VARIABLES DE STYLE
  // ============================================================

  const bgInput = isDark ? '#1a1a1c' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const mutedColor = isDark ? '#6b7280' : '#9ca3af';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const orange = '#e04f00';

  // ============================================================
  // SECTION 3 : EFFETS (useEffect)
  // ============================================================

  // --- Chargement des matières depuis le backend ---
  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await api.get('/matieres');
        const mapped = res.data
          .map(item => ({
            name: item.nom || '',
            category: item.categorie || 'Général'
          }))
          .filter(item => item.name);
        setSubjectsList(mapped);
      } catch (e) {
        setSubjectsList([
          { name: 'Mathématiques', category: 'Sciences' },
          { name: 'Français', category: 'Langues' },
          { name: 'Physique', category: 'Sciences' },
          { name: 'Anglais', category: 'Langues' }
        ]);
      }
    }
    fetchSubjects();
  }, []);

  // --- Chargement des villes depuis le backend ---
  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await api.get('/villes');
        const mapped = res.data
          .map(item => item.nom || item.name || item.ville || '')
          .filter(c => c);
        setCitiesList(mapped);
      } catch (e) {
        setCitiesList(['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir']);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  // --- Nettoyage du timeout au démontage du composant ---
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ============================================================
  // SECTION 4 : FONCTIONS UTILITAIRES
  // ============================================================

  function getIcon(category) {
    const style = { width: 14, height: 14, color: orange };
    if (category === 'Sciences') return <Calculator style={style} />;
    if (category === 'Langues') return <Languages style={style} />;
    if (category === 'Économie') return <TrendingUp style={style} />;
    if (category === 'Droit') return <Scale style={style} />;
    return <BookOpen style={style} />;
  }

  function getFilteredSubjects() {
    if (!querySubject) return subjectsList.slice(0, 8);
    return subjectsList
      .filter(s => s.name.toLowerCase().includes(querySubject.toLowerCase()))
      .slice(0, 8);
  }

  function getFilteredCities() {
    if (!queryCity) return citiesList.slice(0, 8);
    return citiesList
      .filter(c => c.toLowerCase().includes(queryCity.toLowerCase()))
      .slice(0, 8);
  }

  function scrollToTeachers() {
    const element = document.getElementById('tutors-section');
    if (!element) return;
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }

  // --- Déclenche la recherche avec debounce + valeurs explicites ---
  // C'est LE point clé du fix : on n'appelle jamais onSearch() "à vide"
  // en espérant que le state du parent soit à jour. On lui donne
  // directement les valeurs fraîches via "overrides".
  function triggerSearch(overrides, delay = 400) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      scrollToTeachers();
      if (onSearch) onSearch(overrides);
    }, delay);
  }

  // ============================================================
  // SECTION 5 : GESTION DES ÉVÉNEMENTS
  // ============================================================

  function onSelectSubject(name) {
    setQuerySubject(name);
    setShowSubjectDrop(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      scrollToTeachers();
      if (onSearch) onSearch({ matiere: name });
    }, 300);
  }

  function onSelectCity(name) {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (name === 'Webcam') {
      setQueryCity('');
      setIsWebcam(true);
      setShowCityDrop(false);
      debounceRef.current = setTimeout(() => {
        scrollToTeachers();
        if (onSearch) onSearch({ ville: '', cours_enligne: true });
      }, 300);
    } else {
      setQueryCity(name);
      setIsWebcam(false);
      setShowCityDrop(false);
      debounceRef.current = setTimeout(() => {
        scrollToTeachers();
        if (onSearch) onSearch({ ville: name, cours_enligne: false });
      }, 300);
    }
  }

  function handleSubjectChange(e) {
    const value = e.target.value;
    setQuerySubject(value);
    setActivePill(null);
    triggerSearch({ matiere: value }, 500);
  }

  function handleCityChange(e) {
    const value = e.target.value;
    setQueryCity(value);
    setIsWebcam(false);
    triggerSearch({ ville: value, cours_enligne: false }, 500);
  }

  function handleReset() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
    setIsWebcam(false);
    debounceRef.current = setTimeout(() => {
      scrollToTeachers();
      if (onSearch) onSearch({ matiere: '', ville: '', cours_enligne: false });
    }, 300);
  }

  function handleSearchClick() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    scrollToTeachers();
    // Ici pas besoin d'overrides : c'est un clic direct, le state
    // querySubject / queryCity / isWebcam est déjà à jour à ce stade.
    if (onSearch) onSearch();
  }

  function handleWebcamClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsWebcam(false);
    debounceRef.current = setTimeout(() => {
      if (onSearch) onSearch({ cours_enligne: false, ville: queryCity });
    }, 300);
  }

  const hasFilter = activePill || querySubject || queryCity || isWebcam;

  // ============================================================
  // SECTION 6 : RENDU JSX
  // ============================================================

  return (
    <section style={{
      background: isDark ? '#000000' : '#f8f9fc',
      padding: '4rem 2rem',
      textAlign: 'center'
    }}>

      {/* BLOC 1 : TITRE */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 700,
          color: textColor,
          lineHeight: 1.1,
          marginBottom: '0.5rem'
        }}>
          Trouvez le professeur
        </h1>
        <h2 style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          fontWeight: 600,
          color: orange,
          lineHeight: 1.2
        }}>
          qui vous correspond
        </h2>
      </div>

      {/* BLOC 2 : BARRE DE RECHERCHE */}
      <div className="search-bar-wrapper" style={{
        display: 'flex',
        alignItems: 'center',
        background: bgInput,
        borderRadius: '50px',
        padding: '4px',
        maxWidth: '850px',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>

        {/* Input Matière */}
        <div style={{
          flex: 1,
          position: 'relative',
          background: bgInput,
          borderRadius: '50px',
          minWidth: 0
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px'
          }}>
            <Search size={20} color={mutedColor} style={{ flexShrink: 0 }} />
            <input
              value={querySubject}
              onChange={handleSubjectChange}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder='Essayer "Maths"'
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: textColor,
                fontSize: '0.95rem',
                minWidth: 0
              }}
            />
          </div>

          {/* Dropdown matières */}
          {showSubjectDrop && !loading && getFilteredSubjects().length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              background: bgInput,
              border: `1px solid ${borderColor}`,
              borderRadius: '16px',
              zIndex: 200,
              maxHeight: '300px',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }}>
              {getFilteredSubjects().map((s, i) => (
                <div
                  key={i}
                  onMouseDown={() => onSelectSubject(s.name)}
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: textColor
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getIcon(s.category)} <span>{s.name}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                    {s.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Ville */}
        <div style={{
          flex: 1,
          position: 'relative',
          background: bgInput,
          borderRadius: '50px',
          minWidth: 0
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px'
          }}>
            <MapPin size={20} color={mutedColor} style={{ flexShrink: 0 }} />
            <input
              value={isWebcam ? 'Webcam' : queryCity}
              onChange={handleCityChange}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder="Ville ou Webcam"
              readOnly={isWebcam}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: isWebcam ? orange : textColor,
                fontSize: '0.95rem',
                minWidth: 0
              }}
            />
            {isWebcam && (
              <button
                onClick={handleWebcamClear}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#dc2626',
                  fontSize: '0.75rem'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown villes */}
          {showCityDrop && !loading && getFilteredCities().length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              background: bgInput,
              border: `1px solid ${borderColor}`,
              borderRadius: '16px',
              zIndex: 200,
              maxHeight: '300px',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }}>
              {/* Option Webcam */}
              <div
                onMouseDown={() => onSelectCity('Webcam')}
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: textColor,
                  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Wifi size={16} color={orange} /> <span>Webcam (Cours en ligne)</span>
              </div>

              {/* Liste des villes */}
              {getFilteredCities().map((c, i) => (
                <div
                  key={i}
                  onMouseDown={() => onSelectCity(c)}
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: textColor
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MapPin size={16} color={orange} /> <span>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bouton Rechercher */}
        <button
          onClick={handleSearchClick}
          style={{
            background: orange,
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            padding: '14px 32px',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginRight: '4px',
            flexShrink: 0
          }}
        >
          <Search size={18} />
          <span className="search-btn-label">Rechercher</span>
        </button>
      </div>

      {/* BLOC 3 : PILLS (matières rapides) - ✅ CORRIGÉ : plus d'espace à gauche */}
      {!loading && subjectsList.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '2rem',
          paddingLeft: '0',    // ✅ Supprime l'espace à gauche
          paddingRight: '0',   // ✅ Supprime l'espace à droite
          marginLeft: '0',     // ✅ Supprime l'espace à gauche
          marginRight: '0',    // ✅ Supprime l'espace à droite
          maxWidth: '100%',
        }}>
          {subjectsList.slice(0, 8).map((pill, i) => {
            const isActive = activePill === pill.name;
            const pillBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
            const pillColor = isDark ? '#d1d5db' : '#4b5563';

            return (
              <button
                key={i}
                onClick={() => {
                  if (debounceRef.current) clearTimeout(debounceRef.current);

                  if (isActive) {
                    setActivePill(null);
                    setQuerySubject('');
                    debounceRef.current = setTimeout(() => {
                      scrollToTeachers();
                      if (onSearch) onSearch({ matiere: '' });
                    }, 300);
                  } else {
                    setActivePill(pill.name);
                    setQuerySubject(pill.name);
                    debounceRef.current = setTimeout(() => {
                      scrollToTeachers();
                      if (onSearch) onSearch({ matiere: pill.name });
                    }, 300);
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: `1px solid ${isActive ? orange : pillBorder}`,
                  background: isActive ? orange : 'transparent',
                  color: isActive ? '#fff' : pillColor,
                  margin: '0',           // ✅ Supprime margin individuel
                }}
              >
                {getIcon(pill.category)}
                <span>{pill.name}</span>
              </button>
            );
          })}

          {/* Bouton réinitialiser */}
          {hasFilter && (
            <button
              onClick={handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                border: '1px solid rgba(218,31,31,0.3)',
                background: 'rgba(218,31,31,0.08)',
                color: '#dc2626',
                fontWeight: 600,
                margin: '0',             // ✅ Supprime margin individuel
              }}
            >
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
        </div>
      )}

      {/* BLOC 4 : STYLES RESPONSIVE */}
      <style>{`
        @media (max-width: 768px) {
          .search-bar-wrapper {
            flex-direction: column !important;
            border-radius: 24px !important;
            padding: 8px !important;
            gap: 4px;
          }
          .search-bar-wrapper > div {
            width: 100% !important;
            border-radius: 16px !important;
          }
          .search-bar-wrapper button {
            width: 100% !important;
            justify-content: center !important;
            margin-right: 0 !important;
            border-radius: 16px !important;
          }
        }
        @media (max-width: 480px) {
          .search-btn-label { display: inline; }
        }
      `}</style>
    </section>
  );
}