import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColor = isDark ? '#000' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const borderColor = isDark ? '#333' : '#ddd';
  const inputBg = isDark ? '#111' : '#fff';
  const orange = '#e04f00';

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await api.get('/matieres');
        const subjects = [];
        for (let i = 0; i < res.data.length; i++) {
          const item = res.data[i];
          const name = item.nom || item.name;
          if (name) {
            subjects.push({ name: name });
          }
        }
        setSubjectsList(subjects);
      } catch(err) {
        setSubjectsList([
          { name: 'Mathématiques' },
          { name: 'Physique-Chimie' },
          { name: 'SVT' },
          { name: 'Français' },
          { name: 'Anglais' },
        ]);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await api.get('/villes');
        const cities = [];
        for (let i = 0; i < res.data.length; i++) {
          const city = res.data[i].nom || res.data[i].name || res.data[i].ville;
          if (city) {
            cities.push(city);
          }
        }
        setCitiesList(cities);
      } catch(err) {
        setCitiesList(['Casablanca', 'Rabat', 'Marrakech', 'Tanger']);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  function getFilteredSubjects() {
    const result = [];
    for (let i = 0; i < subjectsList.length; i++) {
      const s = subjectsList[i];
      if (!querySubject || s.name.toLowerCase().indexOf(querySubject.toLowerCase()) !== -1) {
        if (result.length < 7) result.push(s);
      }
    }
    return result;
  }

  function getFilteredCities() {
    const result = [];
    for (let i = 0; i < citiesList.length; i++) {
      const c = citiesList[i];
      if (!queryCity || c.toLowerCase().indexOf(queryCity.toLowerCase()) !== -1) {
        if (result.length < 7) result.push(c);
      }
    }
    return result;
  }

  function scrollToTeachers() {
    setTimeout(() => {
      const section = document.getElementById('tutors-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  return (
    <section style={{ background: bgColor, padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: textColor, fontSize: '2rem', marginBottom: '1rem' }}>Trouvez le professeur parfait</h1>
      
      <div style={{ display: 'flex', gap: '0.5rem', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={querySubject}
            onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null); }}
            onFocus={() => setShowSubjectDrop(true)}
            onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
            placeholder="Essayer Maths"
            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${borderColor}`, background: inputBg, color: textColor, borderRadius: 8 }}
          />
          {showSubjectDrop && getFilteredSubjects().length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: inputBg, border: `1px solid ${borderColor}`, borderRadius: 8, zIndex: 10 }}>
              {getFilteredSubjects().map((s, i) => (
                <div key={i} onMouseDown={() => { setQuerySubject(s.name); setShowSubjectDrop(false); }} style={{ padding: '0.5rem', cursor: 'pointer' }}>
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={queryCity}
            onChange={(e) => setQueryCity(e.target.value)}
            onFocus={() => setShowCityDrop(true)}
            onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
            placeholder="Ville"
            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${borderColor}`, background: inputBg, color: textColor, borderRadius: 8 }}
          />
          {showCityDrop && getFilteredCities().length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: inputBg, border: `1px solid ${borderColor}`, borderRadius: 8, zIndex: 10 }}>
              {getFilteredCities().map((c, i) => (
                <div key={i} onMouseDown={() => { setQueryCity(c); setShowCityDrop(false); }} style={{ padding: '0.5rem', cursor: 'pointer' }}>
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={scrollToTeachers} style={{ background: orange, color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, cursor: 'pointer' }}>
          Rechercher
        </button>
      </div>

      {!loading && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          {subjectsList.slice(0, 6).map((pill, i) => (
            <button key={i} onClick={() => {
              setActivePill(pill.name);
              setQuerySubject(pill.name);
              scrollToTeachers();
            }} style={{ padding: '0.3rem 0.8rem', border: `1px solid ${borderColor}`, background: 'transparent', borderRadius: 20, cursor: 'pointer' }}>
              {pill.name}
            </button>
          ))}
          {(activePill || querySubject || queryCity) && (
            <button onClick={() => { setQuerySubject(''); setQueryCity(''); setActivePill(null); }} style={{ padding: '0.3rem 0.8rem', border: '1px solid red', background: 'transparent', borderRadius: 20, cursor: 'pointer', color: 'red' }}>
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}