import React, { useState } from 'react';
import { Search, MapPin, Sparkles, RefreshCw } from 'lucide-react';

const SUBJECTS_LIST = ['Mathématiques','Physique','Chimie','SVT','Français','Anglais','Arabe','Espagnol','Philosophie','Code','Python','Web Dev','Économie'];
const CITIES_LIST = ['Casablanca','Rabat','Marrakech','Tanger','Agadir','Fès','Meknès','Oujda','Kénitra','Tétouan','Salé'];
const SUBJECT_PILLS = ['Maths','Anglais','Arabe','Physique','Français','SVT','Code'];

export default function HeroSection({
  querySubject, setQuerySubject,
  queryCity, setQueryCity,
  activeSubjectFilter, setActiveSubjectFilter,
  onSearchSubmit,
}) {
  const [isSubjectFocused, setIsSubjectFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);

  const filteredSubjects = querySubject
    ? SUBJECTS_LIST.filter(s => s.toLowerCase().includes(querySubject.toLowerCase()))
    : SUBJECTS_LIST.slice(0, 7);

  const filteredCities = queryCity
    ? CITIES_LIST.filter(c => c.toLowerCase().includes(queryCity.toLowerCase()))
    : CITIES_LIST.slice(0, 6);

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

          {/* Matière */}
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
            {querySubject && (
              <button onClick={() => setQuerySubject('')} className="text-stone hover:text-ink text-xs px-1">✕</button>
            )}
            {isSubjectFocused && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-mute border-b border-hairline bg-surface-deep/40">
                  {querySubject ? 'Matières associées' : 'Matières populaires'}
                </div>
                {filteredSubjects.map((s) => (
                  <button key={s} type="button"
                    onClick={() => { setQuerySubject(s); setActiveSubjectFilter(null); setIsSubjectFocused(false); onSearchSubmit(); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-ink hover:bg-accent-orange-glow hover:text-accent-orange font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-accent-orange shrink-0" />
                    {s}
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
            {queryCity && (
              <button onClick={() => setQueryCity('')} className="text-stone hover:text-ink text-xs px-1">✕</button>
            )}
            {isCityFocused && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-mute border-b border-hairline bg-surface-deep/40">
                  {queryCity ? 'Villes correspondantes' : 'Villes principales'}
                </div>
                {filteredCities.map((c) => (
                  <button key={c} type="button"
                    onClick={() => { setQueryCity(c); setIsCityFocused(false); onSearchSubmit(); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-ink hover:bg-accent-orange-glow hover:text-accent-orange font-semibold transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <MapPin className="h-3 w-3 text-accent-orange shrink-0" />
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onSearchSubmit}
            className="w-full md:w-auto bg-ink text-canvas px-8 py-3.5 rounded-lg font-button-md font-bold hover:bg-ash transition-all transform active:scale-95 cursor-pointer shrink-0"
          >
            Rechercher
          </button>
        </div>

        {/* Pills rapides */}
        <div className="pt-2">
          <span className="text-[10px] text-mute uppercase font-caption tracking-widest block mb-3">Accès Rapide</span>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {SUBJECT_PILLS.map((pill) => {
              const isSelected = activeSubjectFilter?.toLowerCase() === pill.toLowerCase();
              return (
                <button
                  key={pill}
                  onClick={() => {
                    setActiveSubjectFilter(isSelected ? null : pill);
                    setQuerySubject('');
                    onSearchSubmit();
                  }}
                  className={`px-4 py-1.5 rounded-full border text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-accent-orange text-canvas border-accent-orange font-bold'
                      : 'border-hairline bg-surface-deep/40 text-charcoal hover:border-hairline-strong hover:text-ink'
                  }`}
                >
                  {pill}
                </button>
              );
            })}
            {(activeSubjectFilter || querySubject || queryCity) && (
              <button
                onClick={() => { setActiveSubjectFilter(null); setQuerySubject(''); setQueryCity(''); onSearchSubmit(); }}
                className="px-3 py-1.5 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-xs font-semibold hover:bg-accent-red-glow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-canvas to-transparent" />
    </section>
  );
}