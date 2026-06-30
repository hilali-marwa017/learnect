import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, BookOpen, Calculator, Languages, TrendingUp, Scale } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({
  isDark,
  querySubject,
  setQuerySubject,
  queryCity,
  setQueryCity,
  activePill,
  setActivePill,
  onSearch
}) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const ink = isDark ? '#fcfdff' : '#07090d';
  const charcoal = isDark ? 'rgba(252, 253, 255, 0.7)' : '#4a5568';
  const mute = isDark ? '#a1a4a5' : '#718096';
  const stone = isDark ? '#464a4d' : '#a0aec0';
  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';
  const orange = '#e04f00';

  const getIcon = (categorie) => {
    const style = { width: 14, height: 14, color: orange };
    if (!categorie) return <BookOpen style={style} />;
    const cat = categorie.toLowerCase();
    if (cat === 'sciences') return <Calculator style={style} />;
    if (cat === 'langues') return <Languages style={style} />;
    if (cat === 'économie') return <TrendingUp style={style} />;
    if (cat === 'droit') return <Scale style={style} />;
    return <BookOpen style={style} />;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [subjectsRes, citiesRes] = await Promise.all([
          api.get('/matieres'),
          api.get('/villes')
        ]);
        
        let subjects = [];
        if (Array.isArray(subjectsRes.data)) {
          subjects = subjectsRes.data.map(item => ({
            nom: item.nom || item.name || item.libelle || '',
            categorie: item.categorie || 'Général'
          })).filter(s => s.nom);
        }
        setSubjectsList(subjects);

        let cities = [];
        if (Array.isArray(citiesRes.data)) {
          cities = citiesRes.data.map(item => item.nom || item.name || item.ville || '')
            .filter(c => c);
        }
        setCitiesList(cities);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredSubjects = subjectsList
    .filter(s => !querySubject || s.nom.toLowerCase().includes(querySubject.toLowerCase()))
    .slice(0, 7);

  const filteredCities = citiesList
    .filter(c => !queryCity || c.toLowerCase().includes(queryCity.toLowerCase()))
    .slice(0, 6);

  const handleSearchScroll = () => {
    onSearch();
    setTimeout(() => {
      document.getElementById('tutors-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
      <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange, display: 'block', marginBottom: '0.5rem' }}>
        SOUTIEN SCOLAIRE D'EXCEPTION AU MAROC
      </span>

      <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: ink, lineHeight: 1.05, maxWidth: 620, margin: '0 auto 1rem' }}>
        Trouvez le professeur parfait
      </h1>

      <p style={{ fontSize: '0.95rem', color: charcoal, maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.6 }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
        Premier cours offert par nos tuteurs.
      </p>

      {/* Search bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', background: bgCard, border: `1px solid ${bdr}`, borderRadius: 16, padding: 8, maxWidth: 750, margin: '0 auto', gap: 8 }}>
        
        {/* Subject */}
        <div style={{ flex: 2, position: 'relative', minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
            <Search size={18} color={stone} />
            <input
              value={querySubject}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder={loading ? "Chargement..." : "Quelle matière ?"}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem' }}
            />
            {querySubject && <X size={16} color={stone} style={{ cursor: 'pointer' }} onClick={() => setQuerySubject('')} />}
          </div>
          {showSubjectDrop && filteredSubjects.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, background: bgCard, border: `1px solid ${bdr}`, borderRadius: 12, zIndex: 60, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              {filteredSubjects.map(s => (
                <div
                  key={s.nom}
                  onMouseDown={() => { setQuerySubject(s.nom); setShowSubjectDrop(false); handleSearchScroll(); }}
                  style={{ padding: '10px 16px', fontSize: '0.8rem', color: ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f7f7f7'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {getIcon(s.categorie)}
                  <span style={{ flex: 1 }}>{s.nom}</span>
                  <span style={{ fontSize: '9px', color: mute }}>{s.categorie}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 1, background: bdr }} />

        {/* City */}
        <div style={{ flex: 1, position: 'relative', minWidth: 180 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
            <MapPin size={18} color={stone} />
            <input
              value={queryCity}
              onChange={(e) => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder={loading ? "Chargement..." : "Ville"}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem' }}
            />
            {queryCity && <X size={16} color={stone} style={{ cursor: 'pointer' }} onClick={() => setQueryCity('')} />}
          </div>
          {showCityDrop && filteredCities.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, background: bgCard, border: `1px solid ${bdr}`, borderRadius: 12, zIndex: 60, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              {filteredCities.map(c => (
                <div
                  key={c}
                  onMouseDown={() => { setQueryCity(c); setShowCityDrop(false); handleSearchScroll(); }}
                  style={{ padding: '10px 16px', fontSize: '0.8rem', color: ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f7f7f7'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MapPin size={14} color={orange} />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSearchScroll}
          style={{ background: ink, color: bgCard, border: 'none', borderRadius: 12, padding: '0 28px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Search size={16} />
          Rechercher
        </button>
      </div>

      {/* Pills */}
      {subjectsList.slice(0, 7).map(pill => (
        <button
          key={pill.nom}
          onClick={() => { setActivePill(activePill === pill.nom ? null : pill.nom); setQuerySubject(pill.nom); handleSearchScroll(); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 18px', margin: '8px 4px', borderRadius: 100, border: `1px solid ${activePill === pill.nom ? orange : bdr}`, background: activePill === pill.nom ? orange : 'transparent', color: activePill === pill.nom ? '#fff' : charcoal, fontSize: '0.7rem', cursor: 'pointer' }}
        >
          {getIcon(pill.categorie)}
          <span>{pill.nom}</span>
        </button>
      ))}
    </section>
  );
}