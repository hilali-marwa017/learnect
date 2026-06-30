import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from '../../components/home/TeacherCard';
import TutorDetailModal from '../../components/TutorDetailModal';

export default function Teachers() {
  var [tutors, setTutors] = useState([]);
  var [loading, setLoading] = useState(true);
  var [favorites, setFavorites] = useState([]);
  var [querySubject, setQuerySubject] = useState('');
  var [queryCity, setQueryCity] = useState('');
  var [activeSubjectFilter, setActiveSubjectFilter] = useState(null);
  var [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(function() {
    api.get('/enseignants')
      .then(function(response) {
        setTutors(response.data);
        setLoading(false);
      })
      .catch(function(err) {
        console.error(err);
        setLoading(false);
      });
  }, []);

  var filteredTutors = tutors.filter(function(tutor) {
    var user = tutor.user || {};
    var matieres = tutor.matieres || [];
    var matiereNames = matieres.map(function(m) { return m.nom.toLowerCase(); });
    var matchesSubjectQuery = querySubject ? matiereNames.some(function(sub) { return sub.includes(querySubject.toLowerCase()); }) : true;
    var matchesCityQuery = queryCity ? (user.ville || '').toLowerCase().includes(queryCity.toLowerCase()) : true;
    var matchesSubjectFilter = activeSubjectFilter ? matiereNames.some(function(sub) { return sub === activeSubjectFilter.toLowerCase(); }) : true;
    return matchesSubjectQuery && matchesCityQuery && matchesSubjectFilter;
  });

  var SUBJECT_PILLS = ['Maths', 'Anglais', 'Arabe', 'Physique', 'Français', 'SVT', 'Code'];

  function handleToggleFavorite(e, tutorId) {
    e.stopPropagation();
    setFavorites(function(prev) {
      if (prev.includes(tutorId)) {
        return prev.filter(function(id) { return id !== tutorId; });
      } else {
        return [...prev, tutorId];
      }
    });
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-canvas flex items-center justify-center">
        <div className="spinner-border text-accent-orange" role="status"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-blue font-bold">ANNUAIRE DES TUTEURS CERTIFIÉS</span>
          <h1 className="font-display-lg text-4xl text-ink leading-tight">Les meilleurs professeurs particuliers au Maroc</h1>
          <p className="text-charcoal text-sm max-w-2xl leading-relaxed">Trouvez rapidement l'expert idéal selon la matière, le budget horaire ou la ville pour cours individuels à domicile ou à distance.</p>
        </div>

        <div className="bg-surface-card border border-hairline-strong rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1 relative flex items-center bg-surface-deep/40 rounded-lg border border-hairline px-3.5 py-1">
              <svg className="h-4.5 w-4.5 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" value={querySubject} onChange={function(e) { setQuerySubject(e.target.value); setActiveSubjectFilter(null); }} className="w-full bg-transparent border-none text-ink py-2 text-xs outline-none pl-2.5" placeholder="Matière (Maths, Python, SVT...)" />
            </div>
            <div className="flex-1 relative flex items-center bg-surface-deep/40 rounded-lg border border-hairline px-3.5 py-1">
              <svg className="h-4.5 w-4.5 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <input type="text" value={queryCity} onChange={function(e) { setQueryCity(e.target.value); }} className="w-full bg-transparent border-none text-ink py-2 text-xs outline-none pl-2.5" placeholder="Ville (Casablanca, Rabat...)" />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <svg className="h-4.5 w-4.5 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="text-xs text-mute font-semibold uppercase tracking-wider">{filteredTutors.length} trouvés</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUBJECT_PILLS.map(function(pill) {
            var isSelected = activeSubjectFilter === pill;
            return (
              <button key={pill} onClick={function() { setActiveSubjectFilter(isSelected ? null : pill); setQuerySubject(''); }} className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${isSelected ? 'bg-accent-blue text-canvas' : 'bg-surface-card border border-hairline text-mute hover:border-hairline-strong hover:text-ink'}`}>
                {pill}
              </button>
            );
          })}
          {(activeSubjectFilter || querySubject || queryCity) && (
            <button onClick={function() { setActiveSubjectFilter(null); setQuerySubject(''); setQueryCity(''); }} className="px-3 py-1 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-xs font-bold transition-all flex items-center gap-1 hover:bg-accent-red hover:text-white">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span>Effacer</span>
            </button>
          )}
        </div>

        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutors.map(function(t) {
              return (
                <div key={t.utilisateur_id}>
                  <TeacherCard tutor={t} onSelect={setSelectedTutor} isFavorite={favorites.includes(t.utilisateur_id)} onToggleFavorite={handleToggleFavorite} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-card border border-hairline rounded-xl max-w-xl mx-auto space-y-4 p-8">
            <svg className="h-12 w-12 text-mute mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <h3 className="font-bold text-lg text-ink">Aucun prof trouvé</h3>
            <p className="text-charcoal text-xs leading-relaxed max-w-md mx-auto">Vos critères de recherche n'ont donné aucun résultat actuellement.</p>
            <button onClick={function() { setQuerySubject(''); setQueryCity(''); setActiveSubjectFilter(null); }} className="bg-ink text-canvas hover:bg-ash p-2.5 px-6 rounded-lg text-xs font-bold transition-all">Réinitialiser les filtres</button>
          </div>
        )}
      </div>

      {selectedTutor && (
        <TutorDetailModal tutor={selectedTutor} onClose={function() { setSelectedTutor(null); }} onNewBooking={function() { alert('Réservation envoyée !'); }} />
      )}
    </div>
  );
}