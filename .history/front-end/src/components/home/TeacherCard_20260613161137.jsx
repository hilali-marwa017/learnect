function TeacherCard({ tutor, onSelect, isFavorite, onToggleFavorite }) {
  var user = tutor.user || {};
  var matieres = tutor.matieres || [];
  var premiereMatiere = matieres.length > 0 ? matieres[0].nom : 'Professeur';
  var note = tutor.noteMoyenne || 0;
  var nbAvis = tutor.avis ? tutor.avis.length : 0;
  var tarif = tutor.tarifHeure || 0;
  var ville = user.ville || 'Maroc';
  var nomComplet = (user.prenom || '') + ' ' + (user.nom || '');
  var isFirstFree = true;

  function renderStars() {
    var stars = [];
    var roundedNote = Math.round(note);
    for (var i = 1; i <= 5; i++) {
      if (i <= roundedNote) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  }

  return (
    <div onClick={function() { onSelect(tutor); }} className="bg-white border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all">
      <div className="relative h-40 bg-gradient-to-r from-orange-400 to-blue-400 flex items-center justify-center">
        <svg className="h-20 w-20 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        {isFirstFree && (<div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">1er cours offert</div>)}
        <button onClick={function(e) { onToggleFavorite(e, tutor.utilisateur_id); }} className="absolute top-2 right-2 bg-white/80 p-1 rounded-full">
          <svg className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{nomComplet}</h3>
        <p className="text-gray-500 text-sm">{ville} • {premiereMatiere}</p>
        <div className="flex items-center gap-1 my-1">
          {renderStars()}
          <span className="text-xs text-gray-500">({nbAvis} avis)</span>
        </div>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{tutor.description_profil || 'Cours particuliers de qualité'}</p>
        <div className="mt-3 pt-3 border-t flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-ink">{tarif} MAD</span>
            <span className="text-gray-500 text-sm">/h</span>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{premiereMatiere}</span>
        </div>
      </div>
    </div>
  );
}

export default TeacherCard;