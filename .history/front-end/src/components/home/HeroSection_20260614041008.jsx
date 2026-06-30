import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const orange = '#e04f00';

  function getIcon(category) {
    const style = { width: 14, height: 14, color: orange };
    if (category === 'Sciences') return <Calculator style={style} />;
    if (category === 'Langues') return <Languages style={style} />;
    if (category === 'Économie') return <TrendingUp style={style} />;
    if (category === 'Droit') return <Scale style={style} />;
    return <BookOpen style={style} />;
  }

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await api.get('/matieres');
        const subjects = response.data.map(item => ({
          name: item.nom || item.name || '',
          category: item.categorie || 'Général'
        })).filter(item => item.name);
        setSubjectsList(subjects);
      } catch(error) {
        setSubjectsList([
          { name: 'Mathématiques', category: 'Sciences' },
          { name: 'Physique-Chimie', category: 'Sciences' },
          { name: 'SVT', category: 'Sciences' },
          { name: 'Français', category: 'Langues' },
          { name: 'Anglais', category: 'Langues' },
        ]);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await api.get('/villes');
        const cities = response.data.map(item => item.nom || item.name || item.ville || '').filter(city => city);
        setCitiesList(cities);
      } catch(error) {
        setCitiesList(['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès']);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  function getFilteredSubjects() {
    if (!querySubject) return subjectsList.slice(0, 8);
    return subjectsList.filter(s => s.name.toLowerCase().includes(querySubject.toLowerCase())).slice(0, 8);
  }

  function getFilteredCities() {
    if (!queryCity) return citiesList.slice(0, 8);
    return citiesList.filter(c => c.toLowerCase().includes(queryCity.toLowerCase())).slice(0, 8);
  }

  function scrollToTeachers() {
    setTimeout(() => {
      const section = document.getElementById('tutors-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function onSelectSubject(subjectName) {
    setQuerySubject(subjectName);
    setShowSubjectDrop(false);
    scrollToTeachers();
  }

  function onSelectCity(cityName) {
    setQueryCity(cityName);
    setShowCityDrop(false);
    scrollToTeachers();
  }

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
    scrollToTeachers();
  }

  const hasActiveFilter = activePill || querySubject || queryCity;
  const bgColor = isDark ? 'bg-black' : 'bg-[#f8f9fc]';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const searchBg = isDark ? 'bg-[#111111]' : 'bg-white';
  const borderColor = isDark ? 'border-white/10' : 'border-gray-200';
  const iconColor = isDark ? 'text-gray-400' : 'text-gray-400';
  const inputColor = isDark ? 'text-white' : 'text-gray-900';
  const dropBg = isDark ? 'bg-[#111111]' : 'bg-white';
  const dropHover = isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-gray-100';
  const pillBorder = isDark ? 'border-white/15' : 'border-gray-200';
  const pillText = isDark ? 'text-gray-300' : 'text-gray-600';
  const searchBtnBg = isDark ? 'bg-white' : 'bg-gray-900';
  const searchBtnText = isDark ? 'text-gray-900' : 'text-white';
  const separator = isDark ? 'bg-white/10' : 'bg-gray-200';

  return (
    <section className={`${bgColor} py-16 px-8 text-center`}>
      {/* Titre */}
      <div className="max-w-3xl mx-auto mb-6">
        <h1 className="font-['EB_Garamond',serif] text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-3">
          <span className="block">La réussite commence</span>
          <span className="block text-[#e04f00]">avec le bon professeur</span>
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-4">
          +450 professeurs certifiés • Cours à domicile ou en ligne • Premier cours offert
        </p>
      </div>

      {/* Barre de recherche */}
      <div className={`flex items-center ${searchBg} border ${borderColor} rounded-full p-1.5 max-w-3xl mx-auto shadow-lg`}>
        
        {/* Input Matière */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-3 px-5 py-4">
            <Search size={20} className={iconColor} />
            <input
              value={querySubject}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder="Ex: Mathématiques, Anglais, Piano..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white text-base"
            />
          </div>
          {showSubjectDrop && !loading && getFilteredSubjects().length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 ${dropBg} border ${borderColor} rounded-2xl z-50 max-h-80 overflow-y-auto shadow-xl`}>
              {getFilteredSubjects().map((subject, index) => (
                <div key={index} onMouseDown={() => onSelectSubject(subject.name)} className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer text-gray-900 dark:text-white text-sm ${dropHover}`}>
                  {getIcon(subject.category)} <span>{subject.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Séparateur */}
        <div className={`w-px h-8 ${separator}`} />

        {/* Input Ville */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-3 px-5 py-4">
            <MapPin size={20} className={iconColor} />
            <input
              value={queryCity}
              onChange={(e) => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder="Où ? Casablanca, Rabat, En ligne..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white text-base"
            />
          </div>
          {showCityDrop && !loading && getFilteredCities().length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 ${dropBg} border ${borderColor} rounded-2xl z-50 max-h-80 overflow-y-auto shadow-xl`}>
              {getFilteredCities().map((city, index) => (
                <div key={index} onMouseDown={() => onSelectCity(city)} className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer text-gray-900 dark:text-white text-sm ${dropHover}`}>
                  <MapPin size={16} color={orange} /> <span>{city}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bouton Rechercher */}
        <button onClick={scrollToTeachers} className={`${searchBtnBg} ${searchBtnText} rounded-full px-8 py-3.5 font-semibold text-sm cursor-pointer flex items-center gap-2 ml-1`}>
          <Search size={18} /> Rechercher
        </button>
      </div>

      {/* Pills */}
      {!loading && subjectsList.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2.5 mt-8">
          {subjectsList.slice(0, 8).map((pill, index) => {
            const isActive = activePill === pill.name;
            return (
              <button key={index} onClick={() => {
                if (isActive) { setActivePill(null); setQuerySubject(''); }
                else { setActivePill(pill.name); setQuerySubject(pill.name); }
                scrollToTeachers();
              }} className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm cursor-pointer transition-all ${isActive ? 'bg-[#e04f00] text-white border border-[#e04f00]' : `bg-transparent border ${pillBorder} ${pillText} hover:border-[#e04f00]`}`}>
                {getIcon(pill.category)} <span>{pill.name}</span>
              </button>
            );
          })}
          
          {hasActiveFilter && (
            <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm cursor-pointer border border-red-500/30 bg-red-500/10 text-red-500">
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}