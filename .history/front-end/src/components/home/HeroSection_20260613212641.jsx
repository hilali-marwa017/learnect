import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, BookOpen, Calculator, Languages, PenTool, TrendingUp, Scale, Palette, Music, Sparkles } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({
  isDark,
  querySubject,
  setQuerySubject,
  queryCity,
  setQueryCity,
  activePill,
  setActivePill,
  onSearch,
  onReset
}) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);

  const getCategoryIcon = function(categorie) {
    const iconClass = "w-3.5 h-3.5 text-accent-orange";
    if (!categorie) return <BookOpen className={iconClass} />;
    switch(categorie.toLowerCase()) {
      case 'sciences': return <Calculator className={iconClass} />;
      case 'langues': return <Languages className={iconClass} />;
      case 'lettres': return <PenTool className={iconClass} />;
      case 'économie': return <TrendingUp className={iconClass} />;
      case 'droit': return <Scale className={iconClass} />;
      case 'arts': return <Palette className={iconClass} />;
      case 'sport': return <Music className={iconClass} />;
      default: return <BookOpen className={iconClass} />;
    }
  };

  useEffect(function() {
    async function fetchSubjects() {
      try {
        setLoadingSubjects(true);
        const response = await api.get('/matieres');
        let subjects = [];
        if (Array.isArray(response.data)) {
          subjects = response.data.map(function(item) {
            if (typeof item === 'string') {
              return { nom: item, categorie: 'Général' };
            }
            return {
              nom: item.nom || item.name || item.libelle || '',
              categorie: item.categorie || 'Général'
            };
          }).filter(function(s) { return s.nom !== ''; });
        }
        setSubjectsList(subjects);
      } catch (error) {
        console.error('Erreur fetch matieres:', error);
        setSubjectsList([]);
      } finally {
        setLoadingSubjects(false);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(function() {
    async function fetchCities() {
      try {
        setLoadingCities(true);
        const response = await api.get('/villes');
        let cities = [];
        if (Array.isArray(response.data)) {
          cities = response.data.map(function(item) {
            if (typeof item === 'string') return item;
            return item.nom || item.name || item.ville || item.libelle || '';
          }).filter(function(c) { return c !== ''; });
        }
        setCitiesList(cities);
      } catch (error) {
        console.error('Erreur fetch villes:', error);
        setCitiesList([]);
      } finally {
        setLoadingCities(false);
      }
    }
    fetchCities();
  }, []);

  const getFilteredSubjects = function() {
    if (subjectsList.length === 0) return [];
    if (!querySubject) return subjectsList.slice(0, 7);
    return subjectsList.filter(function(s) {
      return s.nom.toLowerCase().includes(querySubject.toLowerCase());
    }).slice(0, 7);
  };

  const getFilteredCities = function() {
    if (citiesList.length === 0) return [];
    if (!queryCity) return citiesList.slice(0, 6);
    return citiesList.filter(function(c) {
      return c.toLowerCase().includes(queryCity.toLowerCase());
    }).slice(0, 6);
  };

  const subjectPills = subjectsList.slice(0, 7);

  const handleSearchWithScroll = function() {
    onSearch();
    setTimeout(function() {
      const tutorsSection = document.getElementById('tutors-section');
      if (tutorsSection) {
        tutorsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section className="relative pt-32 pb-24 atmospheric-glow-orange overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-8">
        
        <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-orange font-bold animate-pulse">
          SOUTIEN SCOLAIRE D'EXCEPTION AU MAROC
        </span>

        <h1 className="font-display-xxl text-5xl md:text-7xl lg:text-8xl text-ink leading-[1.05] tracking-tight max-w-4xl mx-auto">
          Trouvez le professeur parfait
        </h1>

        <p className="font-subtitle text-lg md:text-xl text-charcoal max-w-2xl mx-auto leading-relaxed">
          Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
          Premier cours offert par nos tuteurs.
        </p>

        {/* Search bar */}
        <div className="relative max-w-3xl mx-auto bg-surface-card border border-hairline-strong p-3 flex flex-col md:flex-row items-center gap-3 rounded-xl shadow-2xl backdrop-blur-sm">
          
          {/* Subject input */}
          <div className="flex-1 flex items-center gap-3 px-3 w-full relative">
            <Search className="h-5 w-5 text-charcoal shrink-0" />
            <input
              type="text"
              value={querySubject}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              onChange={function(e) { 
                setQuerySubject(e.target.value); 
                setActivePill(null); 
              }}
              className="bg-transparent border-none text-ink placeholder:text-stone w-full py-2.5 text-sm outline-none"
              placeholder={loadingSubjects ? "Chargement des matières..." : "Quelle matière ? (Maths, SVT...)"}
            />
            {querySubject && (
              <button onClick={() => setQuerySubject('')} className="text-stone hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Dropdown subjects */}
            {showSubjectDrop && !loadingSubjects && getFilteredSubjects().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-mute border-b border-hairline bg-surface-deep/40">
                  {querySubject ? 'Matières correspondantes' : 'Matières populaires'}
                </div>
                {getFilteredSubjects().map(function(s) {
                  return (
                    <button
                      key={s.nom}
                      type="button"
                      onMouseDown={function() { 
                        setQuerySubject(s.nom); 
                        setShowSubjectDrop(false);
                        handleSearchWithScroll();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-ink hover:bg-accent-orange-glow hover:text-accent-orange font-semibold transition-colors flex items-center gap-3 cursor-pointer"
                    >
                      {getCategoryIcon(s.categorie)}
                      <span className="flex-1">{s.nom}</span>
                      <span className="text-[9px] text-mute font-mono">{s.categorie}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-hairline-strong hidden md:block" />

          {/* City input */}
          <div className="flex-1 flex items-center gap-3 px-3 w-full relative">
            <MapPin className="h-5 w-5 text-charcoal shrink-0" />
            <input
              type="text"
              value={queryCity}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              onChange={function(e) { setQueryCity(e.target.value); }}
              className="bg-transparent border-none text-ink placeholder:text-stone w-full py-2.5 text-sm outline-none"
              placeholder={loadingCities ? "Chargement des villes..." : "À Casablanca, Rabat..."}
            />
            {queryCity && (
              <button onClick={() => setQueryCity('')} className="text-stone hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Dropdown cities */}
            {showCityDrop && !loadingCities && getFilteredCities().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-mute border-b border-hairline bg-surface-deep/40">
                  {queryCity ? 'Villes correspondantes' : 'Villes principales'}
                </div>
                {getFilteredCities().map(function(c) {
                  return (
                    <button
                      key={c}
                      type="button"
                      onMouseDown={function() { 
                        setQueryCity(c); 
                        setShowCityDrop(false);
                        handleSearchWithScroll();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-ink hover:bg-accent-orange-glow hover:text-accent-orange font-semibold transition-colors flex items-center gap-3 cursor-pointer"
                    >
                      <MapPin className="h-3 w-3 text-accent-orange shrink-0" />
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleSearchWithScroll}
            className="w-full md:w-auto bg-ink text-canvas px-8 py-3.5 rounded-lg font-button-md font-bold hover:bg-ash transition-all transform active:scale-95 cursor-pointer shrink-0 flex items-center gap-2 justify-center"
          >
            <Search className="h-4 w-4" />
            <span>Rechercher</span>
          </button>
        </div>

        {/* Pills */}
        {subjectPills.length > 0 && (
          <div className="pt-2">
            <span className="text-[10px] text-mute uppercase font-caption tracking-widest block mb-3">
              Accès Rapide
            </span>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {subjectPills.map(function(pill) {
                const isActive = activePill === pill.nom;
                return (
                  <button
                    key={pill.nom}
                    onClick={function() { 
                      if (isActive) {
                        setActivePill(null);
                        setQuerySubject('');
                      } else {
                        setActivePill(pill.nom);
                        setQuerySubject(pill.nom);
                      }
                      handleSearchWithScroll();
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? 'bg-accent-orange text-canvas border-accent-orange font-bold scale-102 shadow-lg'
                        : 'border-hairline bg-surface-deep/40 text-charcoal hover:border-hairline-strong hover:text-ink'
                    }`}
                  >
                    {getCategoryIcon(pill.categorie)}
                    <span>{pill.nom}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading state */}
        {(loadingSubjects || loadingCities) && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <div className="w-2 h-2 bg-accent-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-accent-orange rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-accent-orange rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-xs text-mute ml-2">Chargement des données...</span>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-canvas to-transparent" />
    </section>
  );
}