import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgSection = isDark ? 'bg-black' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgCard = isDark ? 'bg-gray-900' : 'bg-white';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const iconColor = isDark ? 'text-gray-500' : 'text-gray-400';

  function getIcon(cat) {
    const style = { width: 14, height: 14, color: '#e04f00' };
    if (cat === 'Sciences') return <Calculator style={style} />;
    if (cat === 'Langues') return <Languages style={style} />;
    if (cat === 'Économie') return <TrendingUp style={style} />;
    if (cat === 'Droit') return <Scale style={style} />;
    return <BookOpen style={style} />;
  }

  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await api.get('/matieres');
        const data = res.data.map(item => ({ name: item.nom || item.name || '', cat: item.categorie || 'Général' })).filter(i => i.name);
        setSubjectsList(data);
      } catch (err) { console.error(err); }
    }
    loadSubjects();
  }, []);

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await api.get('/villes');
        const data = res.data.map(item => item.nom || item.name || item.ville || '').filter(c => c);
        setCitiesList(data);
        setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    }
    loadCities();
  }, []);

  const filteredSubjects = () => {
    if (!querySubject) return subjectsList.slice(0, 8);
    return subjectsList.filter(s => s.name.toLowerCase().includes(querySubject.toLowerCase())).slice(0, 8);
  };

  const filteredCities = () => {
    if (!queryCity) return citiesList.slice(0, 8);
    return citiesList.filter(c => c.toLowerCase().includes(queryCity.toLowerCase())).slice(0, 8);
  };

  const scrollToTeachers = () => {
    setTimeout(() => document.getElementById('tutors-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <section className={`py-20 px-6 text-center ${bgSection}`}>
      <span className="text-[0.65rem] tracking-[0.2em] font-bold uppercase block mb-2 text-orange-accent">
        SOUTIEN SCOLAIRE D'EXCEPTION AU MAROC
      </span>
      <h1 className={`font-garamond text-5xl md:text-7xl font-bold ${textColor} max-w-3xl mx-auto mb-4`}>
        Trouvez le professeur parfait
      </h1>
      <p className={`text-base ${textMuted} max-w-2xl mx-auto mb-8 leading-relaxed`}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.
      </p>

      <div className={`flex items-stretch ${bgCard} border ${borderColor} rounded-2xl p-1 max-w-3xl mx-auto gap-1`}>
        <div className="flex-1 relative">
          <div className="flex items-center gap-3 px-4 py-3">
            <Search size={18} className={iconColor} />
            <input
              value={querySubject}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder={loading ? "Chargement..." : "Quelle matière ?"}
              className={`flex-1 bg-transparent border-none outline-none ${textColor} text-sm`}
            />
          </div>
          {showSubjectDrop && !loading && filteredSubjects().length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-1 ${bgCard} border ${borderColor} rounded-xl z-50 shadow-lg max-h-64 overflow-y-auto`}>
              {filteredSubjects().map(s => (
                <div key={s.name} onMouseDown={() => { setQuerySubject(s.name); setShowSubjectDrop(false); scrollToTeachers(); }} className={`px-4 py-3 cursor-pointer flex items-center gap-3 ${textColor} text-sm`}>
                  {getIcon(s.cat)} <span>{s.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`w-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'} my-2`} />

        <div className="flex-1 relative">
          <div className="flex items-center gap-3 px-4 py-3">
            <MapPin size={18} className={iconColor} />
            <input
              value={queryCity}
              onChange={(e) => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder={loading ? "Chargement..." : "Ville"}
              className={`flex-1 bg-transparent border-none outline-none ${textColor} text-sm`}
            />
          </div>
          {showCityDrop && !loading && filteredCities().length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-1 ${bgCard} border ${borderColor} rounded-xl z-50 shadow-lg max-h-64 overflow-y-auto`}>
              {filteredCities().map(c => (
                <div key={c} onMouseDown={() => { setQueryCity(c); setShowCityDrop(false); scrollToTeachers(); }} className={`px-4 py-3 cursor-pointer flex items-center gap-3 ${textColor} text-sm`}>
                  <MapPin size={14} color="#e04f00" /> <span>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={scrollToTeachers} className="bg-orange-accent text-white rounded-xl px-8 font-semibold text-sm flex items-center gap-2">
          <Search size={16} /> Rechercher
        </button>
      </div>

      {!loading && subjectsList.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {subjectsList.slice(0, 8).map(pill => {
            const isActive = activePill === pill.name;
            return (
              <button key={pill.name} onClick={() => {
                if (isActive) { setActivePill(null); setQuerySubject(''); }
                else { setActivePill(pill.name); setQuerySubject(pill.name); }
                scrollToTeachers();
              }} className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-sm cursor-pointer ${isActive ? 'bg-orange-accent text-white border border-orange-accent' : `bg-transparent border ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-600'}`}`}>
                {getIcon(pill.cat)} <span>{pill.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}