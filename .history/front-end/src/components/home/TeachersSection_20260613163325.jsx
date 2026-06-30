import TeacherCard from './TeacherCard';

export default function TeachersSection({ filteredTutors, activeSubjectFilter, favorites, handleToggleFavorite, setSelectedTutor, querySubject, queryCity, setActiveSubjectFilter, setQuerySubject, setQueryCity, setShowBecomeTutor }) {
  
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
            <svg className="h-12 w-12 text-accent-orange mx-auto animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div className="space-y-2">
              <h3 className="font-heading-md text-xl text-ink font-bold leading-normal">Aucun tuteur trouvé</h3>
              <p className="text-charcoal text-sm max-w-md mx-auto leading-relaxed">Nous n'avons pas trouvé de professeur correspondant à "{querySubject || activeSubjectFilter || 'Tout'}" dans "{queryCity || 'Tout'}"</p>
            </div>
            <div className="flex justify-center gap-4 pt-2">
              <button onClick={function() { setQuerySubject(''); setQueryCity(''); setActiveSubjectFilter(null); }} className="bg-ink text-canvas hover:bg-ash px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer">Tout réinitialiser</button>
              <button onClick={function() { setShowBecomeTutor(true); }} className="border border-hairline bg-surface-card hover:bg-surface-elevated text-ink px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer">Devenir tuteur pour cette matière</button>
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
            <h2 className="font-display-lg text-4xl md:text-5xl text-ink">{activeSubjectFilter ? 'Les profs de : ' + activeSubjectFilter : 'Les profs de la semaine'}</h2>
            <p className="text-charcoal text-sm mt-2 max-w-xl">Nos meilleurs professeurs accrédités disponibles partout au Maroc.</p>
          </div>

          <div className="p-3 bg-surface-card rounded-lg border border-hairline shrink-0 flex items-center gap-4 text-xs font-mono shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] text-ash uppercase font-caption block">Professeurs trouvés</span>
              <p className="font-bold text-ink">{filteredTutors.length} correspondances</p>
            </div>
            {favorites.length > 0 && (
              <>
                <div className="w-px h-6 bg-hairline-strong" />
                <button onClick={function() { setQuerySubject(''); setQueryCity(''); setActiveSubjectFilter(null); }} className="flex items-center gap-1.5 text-accent-red font-semibold hover:opacity-80 transition-opacity cursor-pointer">
                  <svg className="h-3.5 w-3.5 fill-accent-red text-accent-red" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  <span>{favorites.length} Favoris</span>
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