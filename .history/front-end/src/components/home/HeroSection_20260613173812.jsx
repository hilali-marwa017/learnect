import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ querySubject, setQuerySubject, queryCity, setQueryCity, activeSubjectFilter, setActiveSubjectFilter, onSearchSubmit }) {
  const [matieres, setMatieres] = useState([]);
  const [isSubjectFocused, setIsSubjectFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);

  const CITIES = ['Casablanca','Rabat','Marrakech','Tanger','Agadir','Fès','Meknès','Oujda','Kénitra','Tétouan','Salé'];

  // Charger les matières depuis /api/matieres (route publique)
  useEffect(() => {
    api.get('/matieres').then(res => setMatieres(res.data)).catch(() => {});
  }, []);

  const filteredMatieres = querySubject
    ? matieres.filter(m => m.nom.toLowerCase().includes(querySubject.toLowerCase()))
    : matieres.slice(0, 7);

  const filteredCities = queryCity
    ? CITIES.filter(c => c.toLowerCase().includes(queryCity.toLowerCase()))
    : CITIES.slice(0, 6);

  // Pills rapides basées sur les catégories du backend
  const categories = [...new Set(matieres.map(m => m.categorie))].slice(0, 6);

  return (
    <section className="relative pt-32 pb-24 atmospheric-glow-orange overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-8 space-y-8">

        <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-orange font-bold animate-pulse">
          Soutien Scolaire d'Exception au Maroc
        </span>

        <h1 className="font-display-xxl text-5xl md:text-7xl lg:text-8xl text-ink leading-[1.05] tracking-tight max-w-4xl mx-auto">
          Trouvez le professeur parfait
        </h1>

        <p className="font-subtitle text-lg md:text-xl text-charcoal max-w-2xl mx-auto leading-relaxed">
          Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.
        </p>

        {/* Barre de recherche */}
        <div className="relative max-w-3xl mx-auto bg-surface-card border border-hairline-strong p-3 flex flex-col md:flex-row items-center gap-3 rounded-xl shadow-2xl">

          {/* Matière — depuis /api/matieres */}
          <div className="flex-1 flex items-center gap-3 px-3 w-full relative">
            <Search className="h-5 w-5 text-charcoal shrink-0" />
            <input
              type="text"
              value={querySubject}
              onFocus={() => setIsSubjectFocused(true)}
              onBlur={() => setTimeout(() => setIsSubjectFocused(false), 200)}
              onChange={(e) => { setQuerySubject(e.target.value); setActiveSubjectFilter(null); }}
              className="bg-transparent border-none text-ink placeholder:text-stone w-full py-2.5 text-sm outline-none"
              placeholder="Quelle matière ? (Ex: Maths, Code...)"
            />
            {querySubject && <button onClick={() => setQuerySubject('')} className="text-stone hover:text-ink text-xs px-1">✕</button>}
            {isSubjectFocused && filteredMatieres.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-mute border-b border-hairline bg-surface-deep/40">
                  {querySubject ? 'Matières associées' : 'Matières populaires'}
                </div>
                {filteredMatieres.map((m) => (
                  <button key={m.id_matiere} type="button"
                    onClick={() => { setQuerySubject(m.nom); setActiveSubjectFilter(null); setIsSubjectFocused(false); onSearchSubmit(); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-ink hover:bg-accent-orange-glow hover:text-accent-orange font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-accent-orange shrink-0" />
                    <span>{m.nom}</span>
                    <span className="text-[10px] text-mute ml-auto">{m.categorie}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-hairline-strong hidden md:block" />

          {/* Ville */}
          <div className="flex-1 flex items-center gap-3 px-3 w-full relative">
            <MapPin className="h-5 w-5 text-charcoal shrink-0" />
            <input
              type="text"
              value={queryCity}
              onFocus={() => setIsCityFocused(true)}
              onBlur={() => setTimeout(() => setIsCityFocused(false), 200)}
              onChange={(e) => setQueryCity(e.target.value)}
              className="bg-transparent border-none text-ink placeholder:text-stone w-full py-2.5 text-sm outline-none"
              placeholder="À Casablanca, Rabat, Marrakech..."
            />
            {queryCity && <button onClick={() => setQueryCity('')} className="text-stone hover:text-ink text-xs px-1">✕</button>}
            {isCityFocused && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-mute border-b border-hairline bg-surface-deep/40">