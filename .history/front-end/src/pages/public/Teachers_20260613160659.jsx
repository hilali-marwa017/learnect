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
              <button key={pill} onClick={function() { setActiveSubjectFilter(isSelected ? null : pill); setQuerySubject('