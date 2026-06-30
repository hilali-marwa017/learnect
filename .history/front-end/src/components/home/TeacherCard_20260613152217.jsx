import { Link } from 'react-router-dom';

function TeacherCard({ tutor, onSelect, isFavorite, onToggleFavorite }) {
  const badgeText = tutor.isFirstFree ? '1er cours offert' : (tutor.isAmbassador ? 'Ambassadeur' : null);
  const badgeBg = tutor.isFirstFree ? 'bg-accent-green text-canvas' : 'bg-accent-blue text-canvas';
  
  const user = tutor.user || {};
  const note = tutor.noteMoyenne || 0;
  const nbAvis = tutor.avis ? tutor.avis.length : 0;
  const premiereMatiere = tutor.matieres && tutor.matieres.length > 0 ? tutor.matieres[0].nom : 'Professeur';
  const tarif = tutor.tarifHeure || 0;
  const ville = user.ville || 'Maroc';
  const nomComplet = (user.prenom || '') + ' ' + (user.nom || '');

  function renderStars() {
    const stars = [];
    const roundedNote = Math.round(note);
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedNote) {
        stars.push(<i key={i} className="bi bi-star-fill text-accent-yellow text-xs"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-mute text-xs"></i>);
      }
    }
    return stars;
  }

  return (
    <div onClick={() => onSelect(tutor)} className="bg-surface-card border border-hairline-strong rounded-xl overflow-hidden hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col group h-full shadow-sm">
      <div className="aspect-[4/3] bg-surface-deep relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-accent-orange/20 to-accent-blue/20 flex items-center justify-center">
          <i className="bi bi-person-circle text-6xl text-white/50"></i>
        </div>
        {badgeText && (
          <div className={`absolute top-4 left-4 ${badgeBg} px-2.5 py-1 rounded text-xs font-bold tracking-wide shadow-lg`}>
            {badgeText}
          </div>
        )}
        <button onClick={(e) => onToggleFavorite(e, tutor.utilisateur_id)} className="absolute top-4 right-4 bg-canvas/40 hover:bg-canvas/80 backdrop-blur-md text-ink p-2 rounded-full border border-hairline transition-all duration-200 cursor-pointer z-10">
          <i className={`bi ${isFavorite ? 'bi-heart-fill text-accent-red' : 'bi-heart text-ink'} h-4.5 w-4.5`}></i>
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-heading-md text-lg text-ink font-semibold group-hover:text-accent-orange transition-colors">{nomComplet || 'Professeur'}</h3>
              <p className="text-charcoal text-xs flex items-center gap-1 mt-0.5">
                <i className="bi bi-geo-alt h-3 w-3 text-accent-blue"></i>
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

          <p className="text-charcoal text-sm mb-6 italic line-clamp-2 pl-3 border-l-2 border-divider-soft font-light leading-relaxed">
            "{tutor.description_profil || 'Cours particuliers de qualité'}"
          </p>
        </div>

        <div className="pt-4 border-t border-hairline flex justify-between items-center bg-transparent">
          <div className="flex flex-col">
            <span className="text-ash text-[10px] uppercase tracking-wider font-caption">TARIF DIRECT</span>
            <span className="text-ink font-bold text-lg">
              {tarif} MAD <span className="text-charcoal text-xs font-normal">/h</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            <span className="px-2 py-0.5 bg-surface-elevated rounded border border-divider-soft text-[10px] font-caption text-charcoal font-semibold">
              {premiereMatiere}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherCard;