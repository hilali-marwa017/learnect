import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from './TeacherCard';

function TeachersSection({ filteredTutors, activeSubjectFilter, favorites, handleToggleFavorite, setSelectedTutor, querySubject, queryCity, setActiveSubjectFilter, setQuerySubject, setQueryCity, setShowBecomeTutor }) {
  
  if (filteredTutors.length === 0) {
    return (
      <section id="tutors-section" className="py-24 bg-surface-deep/40 border-y border-hairline-strong relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent-blue font-bold font-caption mb-2 block">SÉLECTION HEBDOMADAIRE</span>
              <h2 className="font-display-lg text-4xl md:text-5xl text-ink">Aucun professeur trouvé</h2>
              <p className="text-charcoal text-sm mt-2 max-w-xl">Nous n'avons pas trouvé de professeur correspondant à vos critères.</p>
            </div>
          </div>
          <div className="text-center py-16 bg-surface-card rounded-xl border border-hairline-strong max-w-2xl mx-auto space-y-6 p-8">
            <i className="bi bi-exclamation-triangle h-12 w-12 text-accent-orange mx-auto animate-bounce block"></i>
            <div className="space-y-2">
              <h3 className="font-heading-md text-xl text-ink font-bold">Aucun tuteur trouvé</h3>
              <p className="text-charcoal text-sm max-w-md mx-auto">Nous n'avons pas trouvé de professeur correspondant à "{querySubject || activeSubjectFilter || 'Tout'}" dans "{queryCity || 'Tout'}"</p>
            </div>
            <div className="flex justify-center gap-4 pt-2">
              <button onClick={() => { setQuerySubject(''); setQueryCity(''); setActiveSubjectFilter(null); }} className="bg-ink text-canvas hover:bg-ash px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer">
                Tout réinitialiser
              </button>
              <button onClick={() => setShowBecomeTutor(true)} className="border border-hairline bg-surface-card hover:bg-surface-elevated text-ink px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer">
                Devenir tuteur pour cette matière
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tutors-section" className="py-24 bg-surface-deep/40 border-y border-hairline-strong relative">
      <div className="max-w-7xl mx-auto px-6 animate-in fade-in duration-300">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent-blue font-bold font-caption mb-2 block">SÉLECTION HEBDOMADAIRE</span>
            <h2 className="font-display-lg text-4xl md:text-5xl text-ink">
              {activeSubjectFilter ? `Les profs de : ${activeSubjectFilter}` : 'Les profs de la semaine'}
            </h2>
            <p className="text-charcoal text-sm mt-2 max-w-xl">Nos meilleurs ambassadeurs accrédités disponibles à Casablanca, Rabat et partout au Maroc.</p>
          </div>

          <div className="p-3 bg-surface-card rounded-lg border border-hairline shrink-0 flex items-center gap-4 text-xs font-mono shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] text-ash uppercase font-caption block">Professeurs trouvés</span>
              <p className="font-bold text-ink">{filteredTutors.length} correspondances</p>
            </div>
            {favorites.length > 0 && (
              <>
                <div className="w-px h-6 bg-hairline-strong" />
                <button onClick={() => { setQuerySubject(''); setQueryCity(''); setActiveSubjectFilter(null); }} className="flex items-center gap-1.5 text-accent-red font-semibold hover:opacity-80 transition-opacity cursor-pointer">
                  <i className="bi bi-heart-fill"></i> {favorites.length} Favoris
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutors.map(function(t) {
            return (
              <div key={t.utilisateur_id} className="animate-in fade-in slide-in-from-bottom duration-350">
                <TeacherCard tutor={t} onSelect={setSelectedTutor} isFavorite={favorites.includes(t.utilisateur_id)} onToggleFavorite={handleToggleFavorite} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TeachersSection;