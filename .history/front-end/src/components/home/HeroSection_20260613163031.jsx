import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function HeroSection({ querySubject, setQuerySubject, queryCity, setQueryCity, activeSubjectFilter, setActiveSubjectFilter, onSearchSubmit }) {
  var [isSubjectFocused, setIsSubjectFocused] = useState(false);
  var [isCityFocused, setIsCityFocused] = useState(false);
  var [matieres, setMatieres] = useState([]);
  var [villes, setVilles] = useState([]);
  var [suggestionsMatieres, setSuggestionsMatieres] = useState([]);
  var [suggestionsVilles, setSuggestionsVilles] = useState([]);

  useEffect(function() {
    api.get('/matieres')
      .then(function(response) {
        setMatieres(response.data);
      })
      .catch(function(err) {
        console.error(err);
      });

    api.get('/villes')
      .then(function(response) {
        setVilles(response.data);
      })
      .catch(function(err) {
        console.error(err);
      });
  }, []);

  useEffect(function() {
    if (querySubject.length > 0) {
      var filtered = matieres.filter(function(m) {
        return m.nom.toLowerCase().includes(querySubject.toLowerCase());
      });
      setSuggestionsMatieres(filtered.slice(0, 10));
    } else {
      setSuggestionsMatieres(matieres.slice(0, 7));
    }
  }, [querySubject, matieres]);

  useEffect(function() {
    if (queryCity.length > 0) {
      var filtered = villes.filter(function(v) {
        return v.nom.toLowerCase().includes(queryCity.toLowerCase());
      });
      setSuggestionsVilles(filtered.slice(0, 10));
    } else {
      setSuggestionsVilles(villes.slice(0, 6));
    }
  }, [queryCity, villes]);

  var SUBJECT_PILLS = ['Maths', 'Anglais', 'Arabe', 'Physique', 'Français', 'SVT', 'Code'];

  return (
    <section className="relative pt-32 pb-24 atmospheric-glow-orange overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-8 space-y-8 animate-in fade-in duration-500">
        
        <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-orange font-bold animate-pulse">Soutien Scolaire d'Exception au Maroc</span>

        <h1 className="font-display-xxl text-5xl md:text-7xl lg:text-8xl text-ink leading-[1.05] tracking-tight max-w-4xl mx-auto">Trouvez le professeur parfait</h1>

        <p className="font-subtitle text-lg md:text-xl text-charcoal max-w-2xl mx-auto leading-relaxed">Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.</p>

        <div className="relative max-w-3xl mx-auto bg-surface-card border border-hairline-strong p-3 flex flex-col md:flex-row items-center gap-3 rounded-xl shadow-2xl">
          
          <div className="flex-1 flex items-center gap-3 px-3 w-full relative">
            <svg className="h-5 w-5 text-charcoal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" value={querySubject} onFocus={function() { setIsSubjectFocused(true); }} onBlur={function() { setTimeout(function() { setIsSubjectFocused(false); }, 200); }} onChange={function(e) { setQuerySubject(e.target.value); setActiveSubjectFilter(null); }} className="bg-transparent border-none text-ink placeholder:text-stone w-full py-2.5 text-sm outline-none" placeholder="Quelle matière ? (Ex: Maths, Code, Français...)" />
            {querySubject && <button onClick={function() { setQuerySubject(''); }} className="text-stone hover:text-ink text-xs px-1">✕</button>}

            {isSubjectFocused && suggestionsMatieres.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-mute border-b border-hairline bg-surface-deep/40">{querySubject ? 'Matières associées' : 'Matières populaires'}</div>
                {suggestionsMatieres.map(function(matiere) {
                  return (
                    <button key={matiere.id_matiere} type="button" onClick={function() { setQuerySubject(matiere.nom); setActiveSubjectFilter(null); setIsSubjectFocused(false); onSearchSubmit(); }} className="w-full text-left px-4 py-2.5 text-xs text-ink hover:bg-accent-orange-glow hover:text-accent-orange font-semibold transition-colors flex items-center gap-2 cursor-pointer">
                      <svg className="h-3 w-3 text-accent-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      <span>{matiere.nom}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-hairline-strong hidden md:block" />

          <div className="flex-1 flex items-center gap-3 px-3 w-full relative">
            <svg className="h-5 w-5 text-charcoal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <input type="text" value={queryCity} onFocus={function() { setIsCityFocused(true); }} onBlur={function() { setTimeout(function() { setIsCityFocused(false); }, 200); }} onChange={function(e) { setQueryCity(e.target.value); }} className="bg-transparent border-none text-ink placeholder:text-stone w-full py-2.5 text-sm outline-none" placeholder="À Casablanca, Rabat, Marrakech..." />
            {queryCity && <button onClick={function() { setQueryCity(''); }} className="text-stone hover:text-ink text-xs px-1">✕</button>}

            {isCityFocused && suggestionsVilles.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-mute border-b border-hairline bg-surface-deep/40">{queryCity ? 'Villes correspondantes' : 'Villes principales'}</div>
                <button type="button" onClick={function() { setQueryCity('En ligne'); setIsCityFocused(false); onSearchSubmit(); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-accent-orange hover:bg-accent-orange-glow transition-colors cursor-pointer">En ligne</button>
                {suggestionsVilles.map(function(ville) {
                  return (
                    <button key={ville.id_ville} type="button" onClick={function() { setQueryCity(ville.nom); setIsCityFocused(false); onSearchSubmit(); }} className="w-full text-left px-4 py-2.5 text-xs text-charcoal hover:bg-accent-orange-glow hover:text-accent-orange transition-colors flex items-center justify-between cursor-pointer">
                      <span>{ville.nom}</span>
                      <span className="text-[10px] text-mute">Maroc</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button onClick={onSearchSubmit} className="w-full md:w-auto bg-ink text-canvas px-8 py-3.5 rounded-lg font-button-md font-bold hover:bg-ash transition-all transform active:scale-95 cursor-pointer shrink-0">Rechercher</button>
        </div>

        <div className="pt-2">
          <span className="text-[10px] text-mute uppercase font-caption tracking-widest block mb-3">Accès Rapide</span>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {SUBJECT_PILLS.map(function(pill) {
              var isSelected = activeSubjectFilter === pill;
              return (
                <button key={pill} onClick={function() { if (isSelected) { setActiveSubjectFilter(null); } else { setActiveSubjectFilter(pill); setQuerySubject(''); } onSearchSubmit(); }} className={`px-4 py-1.5 rounded-full border text-xs font-medium tracking-wide transition-all cursor-pointer ${isSelected ? 'bg-accent-orange text-canvas border-accent-orange font-bold scale-102' : 'border-hairline bg-surface-deep/40 text-charcoal hover:border-hairline-strong hover:text-ink'}`}>
                  {pill}
                </button>
              );
            })}
            {(activeSubjectFilter || querySubject || queryCity) && (
              <button onClick={function() { setActiveSubjectFilter(null); setQuerySubject(''); setQueryCity(''); onSearchSubmit(); }} className="px-3 py-1.5 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-xs font-semibold hover:bg-accent-red-glow hover:text-ink transition-all flex items-center gap-1.5 cursor-pointer">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-canvas to-transparent" />
    </section>
  );
}