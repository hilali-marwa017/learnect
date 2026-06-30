import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const orange = '#e04f00';

  function getIcon(categorie) {
    const iconStyle = { width: 14, height: 14, color: orange };
    if (categorie === 'Sciences') return <Calculator style={iconStyle} />;
    if (categorie === 'Langues') return <Languages style={iconStyle} />;
    if (categorie === 'Économie') return <TrendingUp style={iconStyle} />;
    if (categorie === 'Droit') return <Scale style={iconStyle} />;
    return <BookOpen style={iconStyle} />;
  }

  useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await api.get('/matieres');
        const subjects = response.data.map(item => ({
          name: item.nom || item.name || '',
          category: item.categorie || 'Général'
        })).filter(item => item.name);
        setSubjectsList(subjects);
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
    loadSubjects();
  }, []);

  useEffect(() => {
    async function loadCities() {
      try {
        const response = await api.get('/villes');
        const cities = response.data.map(item => item.nom || item.name || item.ville || '').filter(city => city);
        setCitiesList(cities);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    }
    loadCities();
  }, []);

  const getFilteredSubjects = () => {
    if (!querySubject) return subjectsList.slice(0, 8);
    return subjectsList.filter(s => s.name.toLowerCase().includes(querySubject.toLowerCase())).slice(0, 8);
  };

  const getFilteredCities = () => {
    if (!queryCity) return citiesList.slice(0, 8);
    return citiesList.filter(c => c.toLowerCase().includes(queryCity.toLowerCase())).slice(0, 8);
  };

  const scrollToTeachers = () => {
    setTimeout(() => {
      const section = document.getElementById('tutors-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const onSelectSubject = (subjectName) => {
    setQuerySubject(subjectName);
    setShowSubjectDrop(false);
    scrollToTeachers();
  };

  const onSelectCity = (cityName) => {
    setQueryCity(cityName);
    setShowCityDrop(false);
    scrollToTeachers();
  };

  return (
    <section className="py-20 px-8 text-center">
      <span className="text-[0.65rem] tracking-[0.2em] font-bold uppercase block mb-2" style={{ color: orange }}>
        SOUTIEN SCOLAIRE D'EXCEPTION AU MAROC
      </span>

      <h1 className="font-['EB_Garamond',serif] text-5xl md:text-7xl font-bold text-ink max-w-3xl mx-auto mb-4">
        Trouvez le professeur parfait
      </h1>

      <p className="text-base text-charcoal max-w-2xl mx-auto mb-8 leading-relaxed">
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
        Premier cours offert par nos tuteurs.
      </p>

      {/* Barre de recherche */}
      <div className="flex items-stretch bg-surface-card border border-hairline rounded-2xl p-1 max-w-3xl mx-auto gap-1">
        
        {/* Champ matière */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-3 px-4 py-3">
            <Search size={18} className="text-icon" />
            <input
              value={querySubject}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder={loading ? "Chargement..." : "Quelle matière ?"}
              className="flex-1 bg-transparent border-none outline-none text-ink text-sm"
            />
          </div>
          
          {showSubjectDrop && !loading && getFilteredSubjects().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface-card border border-hairline rounded-xl z-50 shadow-lg max-h-64 overflow-y-auto">
              {getFilteredSubjects().map((subject) => (
                <div
                  key={subject.name}
                  onMouseDown={() => onSelectSubject(subject.name)}
                  className="px-4 py-3 cursor-pointer flex items-center gap-3 text-ink text-sm hover:bg-surface-hover"
                >
                  {getIcon(subject.category)}
                  <span>{subject.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-px bg-hairline my-2" />

        {/* Champ ville */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-3 px-4 py-3">
            <MapPin size={18} className="text-icon" />
            <input
              value={queryCity}
              onChange={(e) => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder={loading ? "Chargement..." : "Ville"}
              className="flex-1 bg-transparent border-none outline-none text-ink text-sm"
            />
          </div>
          
          {showCityDrop && !loading && getFilteredCities().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface-card border border-hairline rounded-xl z-50 shadow-lg max-h-64 overflow-y-auto">
              {getFilteredCities().map((city) => (
                <div
                  key={city}
                  onMouseDown={() => onSelectCity(city)}
                  className="px-4 py-3 cursor-pointer flex items-center gap-3 text-ink text-sm hover:bg-surface-hover"
                >
                  <MapPin size={14} style={{ color: orange }} />
                  <span>{city}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={scrollToTeachers}
          className="bg-accent-orange text-white border-none rounded-xl px-8 font-semibold text-sm cursor-pointer flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Search size={16} />
          Rechercher
        </button>
      </div>

      {/* Pills */}
      {!loading && subjectsList.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {subjectsList.slice(0, 8).map((pill) => {
            const isActive = activePill === pill.name;
            return (
              <button
                key={pill.name}
                onClick={() => {
                  if (isActive) {
                    setActivePill(null);
                    setQuerySubject('');
                  } else {
                    setActivePill(pill.name);
                    setQuerySubject(pill.name);
                  }
                  scrollToTeachers();
                }}
                className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-sm transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-accent-orange text-white border-accent-orange' 
                    : 'bg-transparent border border-hairline text-charcoal hover:border-accent-orange'
                }`}
              >
                {getIcon(pill.category)}
                <span>{pill.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}