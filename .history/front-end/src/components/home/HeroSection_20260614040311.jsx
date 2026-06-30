import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  // États
  var showSubjectDrop, setShowSubjectDrop, showCityDrop, setShowCityDrop, subjectsList, setSubjectsList, citiesList, setCitiesList, loading, setLoading;
  showSubjectDrop = useState(false)[0];
  setShowSubjectDrop = useState(false)[1];
  showCityDrop = useState(false)[0];
  setShowCityDrop = useState(false)[1];
  subjectsList = useState([])[0];
  setSubjectsList = useState([])[1];
  citiesList = useState([])[0];
  setCitiesList = useState([])[1];
  loading = useState(true)[0];
  setLoading = useState(true)[1];

  // Couleurs selon le thème
  var bgColor, textColor, textMuted, searchBg, searchBorder, iconColor, inputColor, dropBg, dropHover, pillBorder, pillText, searchBtnBg, searchBtnText, separator;
  var orange = '#e04f00';

  if (isDark === true) {
    bgColor = '#000000';
    textColor = '#ffffff';
    textMuted = '#a1a4a5';
    searchBg = '#111111';
    searchBorder = 'rgba(255,255,255,0.1)';
    iconColor = '#a1a4a5';
    inputColor = '#ffffff';
    dropBg = '#111111';
    dropHover = '#1a1a1a';
    pillBorder = 'rgba(255,255,255,0.15)';
    pillText = '#d1d5db';
    searchBtnBg = '#ffffff';
    searchBtnText = '#111827';
    separator = 'rgba(255,255,255,0.1)';
  } else {
    bgColor = '#f8f9fc';
    textColor = '#07090d';
    textMuted = '#718096';
    searchBg = '#ffffff';
    searchBorder = 'rgba(0,0,0,0.08)';
    iconColor = '#9ca3af';
    inputColor = '#111827';
    dropBg = '#ffffff';
    dropHover = '#f9fafb';
    pillBorder = 'rgba(0,0,0,0.1)';
    pillText = '#4b5563';
    searchBtnBg = '#111827';
    searchBtnText = '#ffffff';
    separator = 'rgba(0,0,0,0.08)';
  }

  // Fonction pour l'icône
  function getIcon(category) {
    var style = { width: 14, height: 14, color: orange };
    if (category === 'Sciences') return React.createElement(Calculator, { style: style });
    if (category === 'Langues') return React.createElement(Languages, { style: style });
    if (category === 'Économie') return React.createElement(TrendingUp, { style: style });
    if (category === 'Droit') return React.createElement(Scale, { style: style });
    return React.createElement(BookOpen, { style: style });
  }

  // Charger les matières
  useEffect(function() {
    async function fetchSubjects() {
      try {
        var response = await api.get('/matieres');
        var subjects = [];
        for (var i = 0; i < response.data.length; i++) {
          var item = response.data[i];
          var name = item.nom || item.name || '';
          var category = item.categorie || 'Général';
          if (name !== '') {
            subjects.push({ name: name, category: category });
          }
        }
        setSubjectsList(subjects);
      } catch(error) {
        setSubjectsList([
          { name: 'Mathématiques', category: 'Sciences' },
          { name: 'Physique-Chimie', category: 'Sciences' },
          { name: 'SVT', category: 'Sciences' },
        ]);
      }
    }
    fetchSubjects();
  }, []);

  // Charger les villes
  useEffect(function() {
    async function fetchCities() {
      try {
        var response = await api.get('/villes');
        var cities = [];
        for (var i = 0; i < response.data.length; i++) {
          var city = response.data[i].nom || response.data[i].name || response.data[i].ville || '';
          if (city !== '') {
            cities.push(city);
          }
        }
        setCitiesList(cities);
      } catch(error) {
        setCitiesList(['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès']);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  // Filtrer les matières (méthode DAIF: boucle for + indexOf)
  function getFilteredSubjects() {
    var result = [];
    var max = 8;
    
    if (querySubject === '') {
      for (var i = 0; i < subjectsList.length && i < max; i++) {
        result.push(subjectsList[i]);
      }
    } else {
      var count = 0;
      for (var i = 0; i < subjectsList.length && count < max; i++) {
        var s = subjectsList[i];
        if (s.name.toLowerCase().indexOf(querySubject.toLowerCase()) !== -1) {
          result.push(s);
          count++;
        }
      }
    }
    return result;
  }

  // Filtrer les villes (méthode DAIF: boucle for + indexOf)
  function getFilteredCities() {
    var result = [];
    var max = 8;
    
    if (queryCity === '') {
      for (var i = 0; i < citiesList.length && i < max; i++) {
        result.push(citiesList[i]);
      }
    } else {
      var count = 0;
      for (var i = 0; i < citiesList.length && count < max; i++) {
        var c = citiesList[i];
        if (c.toLowerCase().indexOf(queryCity.toLowerCase()) !== -1) {
          result.push(c);
          count++;
        }
      }
    }
    return result;
  }

  // Scroll vers la section des professeurs
  function scrollToTeachers() {
    setTimeout(function() {
      var section = document.getElementById('tutors-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Sélection d'une matière
  function onSelectSubject(subjectName) {
    setQuerySubject(subjectName);
    setShowSubjectDrop(false);
  }

  // Sélection d'une ville
  function onSelectCity(cityName) {
    setQueryCity(cityName);
    setShowCityDrop(false);
  }

  // Réinitialiser
  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
    scrollToTeachers();
  }

  var hasActiveFilter = (activePill !== null) || (querySubject !== '') || (queryCity !== '');
  var filteredSubjects = getFilteredSubjects();
  var filteredCities = getFilteredCities();

  return (
    <section style={{ background: bgColor, padding: '4rem 2rem', textAlign: 'center' }}>
      {/* Titre */}
      <h1 style={{ fontFamily: '"EB Garamond", serif', fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', fontWeight: 700, color: textColor, maxWidth: 800, margin: '0 auto 0.5rem' }}>
        Trouvez le professeur parfait
      </h1>

      {/* Sous-titre */}
      <p style={{ fontSize: '1rem', color: textMuted, maxWidth: 600, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.
      </p>

      {/* Barre de recherche */}
      <div style={{ display: 'flex', alignItems: 'center', background: searchBg, border: '1px solid ' + searchBorder, borderRadius: 60, padding: '6px', maxWidth: 800, margin: '0 auto', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)' }}>
        
        {/* Input Matière */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
            <Search size={20} color={iconColor} />
            <input
              value={querySubject}
              onChange={function(e) { setQuerySubject(e.target.value); setActivePill(null); }}
              onFocus={function() { setShowSubjectDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowSubjectDrop(false); }, 200); }}
              placeholder="Essayer &quot;Maths&quot;"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: inputColor, fontSize: '1rem', fontFamily: 'inherit' }}
            />
          </div>
          {showSubjectDrop === true && filteredSubjects.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, background: dropBg, border: '1px solid ' + searchBorder, borderRadius: 16, zIndex: 200, maxHeight: 300, overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              {filteredSubjects.map(function(subject, index) {
                return (
                  <div key={subject.name + index} onMouseDown={function() { onSelectSubject(subject.name); }} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, color: inputColor, fontSize: '0.9rem' }} onMouseEnter={function(e) { e.currentTarget.style.background = dropHover; }} onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                    {getIcon(subject.category)} <span>{subject.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Séparateur */}
        <div style={{ width: 1, height: 40, background: separator }} />

        {/* Input Ville */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
            <MapPin size={20} color={iconColor} />
            <input
              value={queryCity}
              onChange={function(e) { setQueryCity(e.target.value); }}
              onFocus={function() { setShowCityDrop(true); }}
              onBlur={function() { setTimeout(function() { setShowCityDrop(false); }, 200); }}
              placeholder="Adresse ou ville"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: inputColor, fontSize: '1rem', fontFamily: 'inherit' }}
            />
          </div>
          {showCityDrop === true && filteredCities.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, background: dropBg, border: '1px solid ' + searchBorder, borderRadius: 16, zIndex: 200, maxHeight: 300, overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              {filteredCities.map(function(city, index) {
                return (
                  <div key={city + index} onMouseDown={function() { onSelectCity(city); }} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, color: inputColor, fontSize: '0.9rem' }} onMouseEnter={function(e) { e.currentTarget.style.background = dropHover; }} onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                    <MapPin size={16} color={orange} /> <span>{city}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bouton Rechercher */}
        <button onClick={scrollToTeachers} style={{ background: searchBtnBg, color: searchBtnText, border: 'none', borderRadius: 50, padding: '14px 32px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, marginRight: '4px' }}>
          <Search size={18} /> Rechercher
        </button>
      </div>

      {/* Pills et bouton Réinitialiser */}
      {loading === false && subjectsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: '2rem' }}>
          {subjectsList.slice(0, 8).map(function(pill, index) {
            var isActive = activePill === pill.name;
            return (
              <button key={pill.name + index} onClick={function() {
                if (isActive === true) {
                  setActivePill(null);
                  setQuerySubject('');
                } else {
                  setActivePill(pill.name);
                  setQuerySubject(pill.name);
                }
                scrollToTeachers();
              }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 999, fontSize: '0.85rem', cursor: 'pointer', border: '1px solid ' + (isActive ? orange : pillBorder), background: isActive ? orange : 'transparent', color: isActive ? '#fff' : pillText }}>
                {getIcon(pill.category)} <span>{pill.name}</span>
              </button>
            );
          })}
          
          {hasActiveFilter === true && (
            <button onClick={handleReset} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, fontSize: '0.85rem', cursor: 'pointer', border: '1px solid rgba(218,31,31,0.3)', background: 'rgba(218,31,31,0.08)', color: '#dc2626' }}>
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}