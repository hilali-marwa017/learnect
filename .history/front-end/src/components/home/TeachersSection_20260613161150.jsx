import TeacherCard from './TeacherCard';

function TeachersSection({ filteredTutors, favorites, handleToggleFavorite, setSelectedTutor }) {
  if (filteredTutors.length === 0) {
    return (
      <div className="py-16 text-center">
        <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h3 className="text-xl font-bold text-ink mb-2">Aucun professeur trouvé</h3>
        <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider text-accent-blue font-bold">SÉLECTION HEBDOMADAIRE</span>
        <h2 className="text-3xl font-bold text-ink">Les profs de la semaine</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map(function(t) {
          return (
            <TeacherCard key={t.utilisateur_id} tutor={t} onSelect={setSelectedTutor} isFavorite={favorites.includes(t.utilisateur_id)} onToggleFavorite={handleToggleFavorite} />
          );
        })}
      </div>
    </div>
  );
}

export default TeachersSection;