import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from '../../components/home/TeacherCard';
import TutorDetailModal from '../../components/TutorDetailModal';

export default function Teachers() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);

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

  const filteredTutors = tutors.filter(function(tutor) {
    const user = tutor.user || {};
    const matieres = tutor.matieres || [];
    const matiereNames = matieres.map(function(m) { return m.nom.toLowerCase(); });
    
    const matchesSubjectQuery = querySubject ? matiereNames.some(function(sub) { return sub.includes(querySubject.toLowerCase()); }) : true;
    const matchesCityQuery = queryCity ? (user.ville || '').toLowerCase().includes(queryCity.toLowerCase()) : true;
    const matchesSubjectFilter = activeSubjectFilter ? matiereNames.some(function(sub) { return sub === activeSubjectFilter.toLowerCase(); }) : true;
    
    return matchesSubjectQuery && matchesCityQuery && matchesSubjectFilter;
  });

  const SUBJECT_PILLS = ['Maths', 'Anglais', 'Arabe', 'Physique', 'Français', 'SVT', 'Code'];

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
              <i className="bi bi-search h-4.5 w-4.5 text-mute"></i>
              <input type="text" value={querySubject} onChange={function(e) { setQuerySubject(e.target.value); setActiveSubjectFilter(null); }} className="w-full bg-transparent border-none text-ink py-2 text-xs outline-none pl-2.5" placeholder="Matière (Maths, Python, SVT...)" />
            </div>
            <div className="flex-1 relative flex items-center bg-surface-deep/40 rounded-lg border border-hairline px-3.5 py-1">
              <i className="bi bi-geo-alt h-4.5 w-4.5 text-mute"></i>
              <input type="text" value={queryCity} onChange={function(e) { setQueryCity(e.target.value); }} className="w-full bg-transparent border-none text-ink py-2 text-xs outline-none pl-2.5" placeholder="Ville (Casablanca, Rabat...)" />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <i className="bi bi-sliders2 h-4.5 w-4.5 text-mute"></i>
            <span className="text-xs text-mute font-semibold uppercase tracking-wider">{filteredTutors.length} trouvés</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUBJECT_PILLS.map(function(pill) {
            const isSelected = activeSubjectFilter === pill;
            return (
              <button key={pill} onClick={function() { setActiveSubjectFilter(isSelected ? null : pill); setQuerySubject(''); }} className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${isSelected ? 'bg-accent-blue text-canvas' : 'bg-surface-card border border-hairline text-mute hover:border-hairline-strong hover:text-ink'}`}>
                {pill}
              </button>
            );
          })}
          {(activeSubjectFilter || querySubject || queryCity) && (
            <button onClick={function() { setActiveSubjectFilter(null); setQuerySubject(''); setQueryCity(''); }} className="px-3 py-1 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-xs font-bold transition-all flex items-center gap-1 hover:bg-accent-red hover:text-white">
              <i className="bi bi-arrow-repeat h-3 w-3"></i>
              <span>Effacer</span>
            </button>
          )}
        </div>

        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutors.map(function(t) {
              return (
                <div key={t.utilisateur_id