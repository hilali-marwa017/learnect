export default function TeacherCard({ tutor, onSelect, isFavorite, onToggleFavorite }) {
  var user = tutor.user || {};
  var matieres = tutor.matieres || [];
  var premiereMatiere = matieres.length > 0 ? matieres[0].nom : 'Professeur';
  var note = tutor.noteMoyenne || 0;
  var nbAvis = tutor.avis ? tutor.avis.length : 0;
  var tarif = tutor.tarifHeure || 0;
  var ville = user.ville || 'Maroc';
  var nomComplet = (user.prenom || '') + ' ' + (user.nom || '');
  var isFirstFree = true;
  var badgeText = isFirstFree ? '1er cours offert' : null;
  var badgeBg = isFirstFree ? 'bg-accent-green text-canvas' : 'bg-accent-blue text-canvas';

  function renderStars() {
    var stars = [];
    var roundedNote = Math.round(note);
    for (var i = 1; i <= 5; i++) {
      if (i <= roundedNote) {
        stars.push(<svg key={i} className="h-3.5 w-3.5 fill-accent-yellow text-accent-yellow" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
      } else {
        stars.push(<svg key={i} className="h-3.5 w-3.5 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>);
      }
    }
    return stars;
  }

  return (
    <div onClick={function() { onSelect(tutor); }} className="bg-surface-card border border-hairline-strong rounded-xl overflow-hidden hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col group h-full shadow-sm">
      <div className="aspect-[4/3] bg-surface-deep relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-accent-orange/20 to-accent-blue/20 flex items-center justify-center">
          <svg className="h-16 w-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        {badgeText && (<div className={`absolute top-4 left-4 ${badgeBg} px-2.5 py-1 rounded text-xs font-bold tracking-wide shadow-lg`}>{badgeText}</div>)}
        <button onClick={function(e) { onToggleFavorite(e, tutor.utilisateur_id); }} className="absolute top-4 right-4 bg-canvas/40 hover:bg-canvas/80 backdrop-blur-md text-ink p-2 rounded-full border border-hairline transition-all duration-200 cursor-pointer z-10">
          <svg className={`h-4.5 w-4.5 ${isFavorite ? 'text-accent-red fill-accent-red' : 'text-ink'}`} fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-heading-md text-lg text-ink font-semibold group-hover:text-accent-orange transition-colors">{nomComplet || 'Professeur'}</h3>
              <p className="text-charcoal text-xs flex items-center gap-1 mt-0.5">
                <svg className="h-3 w-3 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{ville} • <span className="font-medium text-ash">{premiereMatiere}</span></span>
              </p>
            </div>
            <div className="flex items-center gap-1 bg-surface-elevated px-2 py-0.5 rounded border border-divider-soft">
              {renderStars()}
              <span className="font-bold text-xs">{note.toFixed(1)}</span>
              {nbAvis > 0 && <span className="text-[10px] text-mute">({nbAvis})</span>}
            </div>
          </div>

          <p className="text-ash text-xs font-body-sm line-clamp-1 mb-3 text-ellipsis font-mono">{tutor.titre || 'Professeur particulier'}</p>

          <p className="text-charcoal text-sm mb-6 italic line-clamp-2 pl-3 border-l-2 border-divider-soft font-light leading-relaxed">"{tutor.description_profil || 'Cours particuliers de qualité'}"</p>
        </div>

        <div className="pt-4 border-t border-hairline flex justify-between items-center bg-transparent">
          <div className="flex flex-col">
            <span className="text-ash text-[10px] uppercase tracking-wider font-caption">TARIF DIRECT</span>
            <span className="text-ink font-bold text-lg">{tarif} MAD <span className="text-charcoal text-xs font-normal">/h</span></span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            <span className="px-2 py-0.5 bg-surface-elevated rounded border border-divider-soft text-[10px] font-caption text-charcoal font-semibold">{premiereMatiere}</span>
          </div>
        </div>
      </div>
    </div>
  );
}