import React from 'react'
import TeacherCard from './TeacherCard'
import { ShieldAlert } from 'lucide-react'

export default function TeachersSection({
  filteredTutors, activeSubjectFilter, favorites,
  handleToggleFavorite, setSelectedTutor, querySubject,
  queryCity, setActiveSubjectFilter, setQuerySubject,
  setQueryCity, setShowBecomeTutor
}) {
  return (
    <section id="tutors-section" className="py-24 bg-surface-deep/40 border-y border-hairline-strong relative">
      <div className="max-w-7xl mx-auto px-6 animate-in fade-in duration-300">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent-blue font-bold font-caption mb-2 block">
              SÉLECTION HEBDOMADAIRE
            </span>
            <h2 className="font-display-lg text-4xl md:text-5xl text-ink">
              {activeSubjectFilter ? `Les profs de : ${activeSubjectFilter}` : 'Les profs de la semaine'}
            </h2>
            <p className="text-charcoal text-sm mt-2 max-w-xl">
              Nos meilleurs ambassadeurs accrédités disponibles à Casablanca, Rabat et partout au Maroc.
            </p>
          </div>
          <div className="p-3 bg-surface-card rounded-lg border border-hairline shrink-0 flex items-center gap-4 text-xs font-mono shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] text-ash uppercase font-caption block">Professeurs trouvés</span>
              <p className="font-bold text-ink">{filteredTutors.length} correspondances</p>
            </div>
            {favorites.length > 0 && (
              <>
                <div className="w-px h-6 bg-hairline-strong" />
                <span className="text-accent-red font-semibold text-xs">♥ {favorites.length} Favoris</span>
              </>
            )}
          </div>
        </div>

        {filteredTutors.length === 0 ? (
          (querySubject || queryCity || activeSubjectFilter) ? (
            <div className="text-center py-16 bg-surface-card rounded-xl border border-hairline-strong max-w-2xl mx-auto space-y-6 p-8 relative overflow-hidden">
              <ShieldAlert className="h-12 w-12 text-accent-orange mx-auto animate-bounce" />
              <div className="space-y-2">
                <h3 className="font-heading-md text-xl text-ink font-bold">Aucun tuteur trouvé</h3>
                <p className="text-charcoal text-sm max-w-md mx-auto leading-relaxed">
                  Aucun professeur pour{' '}
                  <span className="text-ink font-semibold">"{querySubject || activeSubjectFilter || 'Tout'}"</span>
                  {' '}dans{' '}
                  <span className="text-ink font-semibold">"{queryCity || 'Tout le Maroc'}"</span>.
                </p>
              </div>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => { setQuerySubject(''); setQueryCity(''); setActiveSubjectFilter(null) }}
                  className="bg-ink text-canvas hover:bg-ash px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer">
                  Tout réinitialiser
                </button>
                <button
                  onClick={() => setShowBecomeTutor(true)}
                  className="border border-hairline bg-surface-card hover:bg-surface-elevated text-ink px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer">
                  Devenir tuteur pour cette matière
                </button>
              </div>
            </div>
          ) : (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-surface-card border border-hairline-strong rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-surface-deep" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-surface-deep rounded w-2/3" />
                    <div className="h-3 bg-surface-deep rounded w-1/2" />
                    <div className="h-3 bg-surface-deep rounded w-full" />
                    <div className="h-3 bg-surface-deep rounded w-4/5" />
                    <div className="h-8 bg-surface-deep rounded w-1/3 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutors.map((t) => (
              <div key={t.id} className="animate-in fade-in slide-in-from-bottom duration-350">
                <TeacherCard
                  tutor={t}
                  onSelect={(selected) => setSelectedTutor(selected)}
                  isFavorite={favorites.includes(t.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}