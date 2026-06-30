import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale, RefreshCw, Wifi } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  function getIcon(category) {
    const style = { width: 14, height: 14, color: '#e04f00' };
    if (category === 'Sciences') return <Calculator style={style} />;
    if (category === 'Langues') return <Languages style={style} />;
    if (category === 'Économie') return <TrendingUp style={style} />;
    if (category === 'Droit') return <Scale style={style} />;
    return <BookOpen style={style} />;
  }

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await api.get('/matieres');
        setSubjectsList(res.data.map(item => ({ name: item.nom || '', category: item.categorie || 'Général' })).filter(item => item.name));
      } catch(e) {
        setSubjectsList([{ name: 'Mathématiques', category: 'Sciences' }]);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await api.get('/villes');
        setCitiesList(res.data.map(item => item.nom || item.name || item.ville || '').filter(c => c));
      } catch(e) {
        setCitiesList(['Casablanca', 'Rabat', 'Marrakech', 'Tanger']);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  function getFilteredSubjects(){
    if (!querySubject) return subjectsList.slice(0, 8);// if user doesm't write anything show the first 8 subjects
    return subjectsList.filter(s => s.name.toLowerCase().includes(querySubject.toLowerCase())).slice(0, 8); // 8 result of subjects only!!
  }

  function getFilteredCities(){
    if (!queryCity) return citiesList.slice(0, 8);
    return citiesList.filter(c => c.toLowerCase().includes(queryCity.toLowerCase())).slice(0, 8);
  }

  function scrollToTeachers(){
    setTimeout(() => document.getElementById('tutors-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  function onSelectSubject(name) { setQuerySubject(name); setShowSubjectDrop(false); }
  function onSelectCity(name) { setQueryCity(name); setShowCityDrop(false); }
  function handleReset() { setQuerySubject(''); setQueryCity(''); setActivePill(null); scrollToTeachers(); }

  const hasFilter = activePill || querySubject || queryCity;

  return (
    <section style={{ background: isDark ? '#000000' : '#f8f9fc', padding: '4rem 2rem', textAlign: 'center' }}>
      
      {/* Titre */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontFamily: "'EB Garamond', serif", 
          fontSize: 'clamp(3rem, 8vw, 5rem)', 
          fontWeight: 700, 
          color: isDark ? '#ffffff' : '#07090d', 
          lineHeight: 1.1,
          marginBottom: '0.5rem'
        }}>
          Trouvez le professeur
        </h1>
        <h2 style={{ 
          fontFamily: "'EB Garamond', serif", 
          fontSize: 'clamp(1.8rem, 5vw, 3rem)', 
          fontWeight: 600, 
          color: '#e04f00', 
          lineHeight: 1.2
        }}>
          qui vous correspond
        </h2>
      </div>

      {/* Barre de recherche */}
      <div style={{ display: 'flex', alignItems: 'center', background: isDark ? '#1a1a1c' : '#ffffff', borderRadius: '50px', padding: '4px', maxWidth: '850px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        
        {/* Input Matière */}
        <div style={{ flex: 1, position: 'relative', background: isDark ? '#1a1a1c' : '#ffffff', borderRadius: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' }}>
            <Search size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
            <input
              value={querySubject}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder="Essayer &quot;Maths&quot;"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: isDark ? '#ffffff' : '#07090d', fontSize: '0.95rem' }}
            />
          </div>
          {showSubjectDrop && !loading && getFilteredSubjects().length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: isDark ? '#1a1a1c' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`, borderRadius: '16px', zIndex: 200, maxHeight: '300px', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              {getFilteredSubjects().map((s, i) => (
                <div key={i} onMouseDown={() => onSelectSubject(s.name)} style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: isDark ? '#ffffff' : '#07090d' }} onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getIcon(s.category)} <span>{s.name}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: 'monospace' }}>{s.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Ville */}
        <div style={{ flex: 1, position: 'relative', background: isDark ? '#1a1a1c' : '#ffffff', borderRadius: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' }}>
            <MapPin size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
            <input
              value={queryCity}
              onChange={(e) => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder="Ville ou Webcam"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: isDark ? '#ffffff' : '#07090d', fontSize: '0.95rem' }}
            />
          </div>
          {showCityDrop && !loading && getFilteredCities().length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: isDark ? '#1a1a1c' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`, borderRadius: '16px', zIndex: 200, maxHeight: '300px', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              <div onMouseDown={() => onSelectCity('Webcam')} style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', color: isDark ? '#ffffff' : '#07090d', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}` }} onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <Wifi size={16} color="#e04f00" /> <span>Webcam</span>
              </div>
              {getFilteredCities().map((c, i) => (
                <div key={i} onMouseDown={() => onSelectCity(c)} style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', color: isDark ? '#ffffff' : '#07090d' }} onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <MapPin size={16} color="#e04f00" /> <span>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bouton Rechercher */}
        <button onClick={scrollToTeachers} style={{ background: '#e04f00', color: '#fff', border: 'none', borderRadius: '50px', padding: '14px 32px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginRight: '4px' }}>
          <Search size={18} /> Rechercher
        </button>
      </div>

      {/* Pills */}
      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '2rem' }}>
          {subjectsList.slice(0, 8).map((pill, i) => {
            const isActive = activePill === pill.name;
            const pillBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
            const pillColor = isDark ? '#d1d5db' : '#4b5563';
            return (
              <button key={i} onClick={() => { if (isActive) { setActivePill(null); setQuerySubject(''); } else { setActivePill(pill.name); setQuerySubject(pill.name); } scrollToTeachers(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '999px', fontSize: '0.85rem', cursor: 'pointer', border: `1px solid ${isActive ? '#e04f00' : pillBorder}`, background: isActive ? '#e04f00' : 'transparent', color: isActive ? '#fff' : pillColor }}>
                {getIcon(pill.category)} <span>{pill.name}</span>
              </button>
            );
          })}
          {hasFilter && (
            <button onClick={handleReset} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '999px', fontSize: '0.85rem', cursor: 'pointer', border: '1px solid rgba(218,31,31,0.3)', background: 'rgba(218,31,31,0.08)', color: '#dc2626' }}>
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}