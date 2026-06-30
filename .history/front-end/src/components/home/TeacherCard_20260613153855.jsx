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
          <svg className="h-16 w-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14