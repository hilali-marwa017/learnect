import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection(props) {
  var isDark = props.isDark;
  var querySubject = props.querySubject;
  var setQuerySubject = props.setQuerySubject;
  var queryCity = props.queryCity;
  var setQueryCity = props.setQueryCity;
  var activePill = props.activePill;
  var setActivePill = props.setActivePill;

  var [showSubjectDrop, setShowSubjectDrop] = useState(false);
  var [showCityDrop, setShowCityDrop] = useState(false);
  var [subjectsList, setSubjectsList] = useState([]);
  var [citiesList, setCitiesList] = useState([]);
  var [loading, setLoading] = useState(true);

  var ink, charcoal, mute, bgCard, bdr, orange;

  if (isDark) {
    ink = '#fcfdff';
    charcoal = 'rgba(252, 253, 255, 0.7)';
    mute = '#a1a4a5';
    bgCard = '#0a0a0c';
    bdr = 'rgba(255, 255, 255, 0.14)';
    orange = '#e04f00';
  } else {
    ink = '#07090d';
    charcoal = '#4a5568';
    mute = '#718096';
    bgCard = '#ffffff';
    bdr = 'rgba(0, 0, 0, 0.12)';
    orange = '#e04f00';
  }

  function getIcon(categorie) {
    var style = { width: 14, height: 14, color: orange, flexShrink: 0 };
    if (!categorie) return React.createElement(BookOpen, { style: style });
    var cat = categorie.toLowerCase();
    if (cat === 'sciences') return React.createElement(Calculator, { style: style });
    if (cat === 'langues') return React.createElement(Languages, { style: style });
    if (cat === 'économie') return React.createElement(TrendingUp, { style: style });
    if (cat === 'droit') return React.createElement(Scale, { style: style });
    return React.createElement(BookOpen, { style: style });
  }

  useEffect(function() {
    async function fetchSubjects() {
      try {
        var response = await api.get('/matieres');
        var subjects = [];
        for (var i = 0; i < response.data.length; i++) {
          var item = response.data[i];
          var nom = item.nom || item.name || '';
          var categorie = item.categorie || 'Général';
          if (nom !== '') {
            subjects.push({ nom: nom, categorie: categorie });
          }
        }
        setSubjectsList(subjects);
      } catch(error) {
        console.error('Erreur:', error);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(function() {
    async function fetchCities() {
      try {
        var response = await api.get('/villes');
        var cities = [];
        for (var i = 0; i < response.data.length; i++) {
          var item = response.data[i];
          var city = item.nom || item.name || item.ville || '';
          if (city !== '') {
            cities.push(city);
          }
        }
        setCitiesList(cities);
        setLoading(false);
      } catch(error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  function filteredSubjects() {
    var result = [];
    for (var i = 0; i < subjectsList.length; i++) {
      var s = subjectsList[i];
      if (!querySubject) {
        result.push(s);
      } else {
        if (s.nom.toLowerCase().indexOf(querySubject.toLowerCase()) !== -1) {
          result.push(s);
        }
      }
    }
    var sliced = [];
    for (var j = 0; j < result.length && j < 7; j++) {
      sliced.push(result[j]);
    }
    return sliced;
  }

  function filteredCities() {
    var result = [];
    for (var i = 0; i < citiesList.length; i++) {
      var c = citiesList[i];
      if (!queryCity) {
        result.push(c);
      } else {
        if (c.toLowerCase().indexOf(queryCity.toLowerCase()) !== -1) {
          result.push(c);
        }
      }
    }
    var sliced = [];
    for (var j = 0; j < result.length && j < 6; j++) {
      sliced.push(result[j]);
    }
    return sliced;
  }

  function handleSearchScroll() {
    setTimeout(function() {
      var section = document.getElementById('tutors-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  function handleSubjectSelect(subject) {
    setQuerySubject(subject);
    setShowSubjectDrop(false);
    handleSearchScroll();
  }

  function handleCitySelect(city) {
    setQueryCity(city);
    setShowCityDrop(false);
    handleSearchScroll();
  }

  return React.createElement('section', { style: { padding: '5rem 2rem', textAlign: 'center' } },
    React.createElement('span', { style: { fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange, display: 'block', marginBottom: '0.5rem' } }, 'SOUTIEN SCOLAIRE D\'EXCEPTION AU MAROC'),
    React.createElement('h1', { style: { fontFamily: "'EB Garamond', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, color: ink, lineHeight: 1.1, maxWidth: 700, margin: '0 auto 1rem' } }, 'Trouvez le professeur parfait'),
    React.createElement('p', { style: { fontSize: '0.95rem', color: charcoal, maxWidth: 550, margin: '0 auto 2rem', lineHeight: 1.6 } }, 'Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.'),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'row', alignItems: 'stretch', background: bgCard, border: '1px solid ' + bdr, borderRadius: 16, padding: 4, maxWidth: 800, margin: '0 auto', gap: 4 } },
      React.createElement('div', { style: { flex: 1, position: 'relative', minWidth: 0 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'transparent', borderRadius: 12, height: '100%' } },
          React.createElement(Search, { size: 18, color: mute, style: { flexShrink: 0 } }),
          React.createElement('input', { value: querySubject, onChange: function(e) { setQuerySubject(e.target.value); setActivePill(null); }, onFocus: function() { setShowSubjectDrop(true); }, onBlur: function() { setTimeout(function() { setShowSubjectDrop(false); }, 200); }, placeholder: loading ? 'Chargement...' : 'Quelle matière ?', style: { flex: 1, background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%', minWidth: 0 } })
        ),
        showSubjectDrop && !loading && filteredSubjects().length > 0 && React.createElement('div', { style: { position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: bgCard, border: '1px solid ' + bdr, borderRadius: 12, zIndex: 60, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: 300, overflowY: 'auto', overflowX: 'hidden' } },
          filteredSubjects().map(function(s) {
            return React.createElement('div', { key: s.nom, onMouseDown: function() { handleSubjectSelect(s.nom); }, style: { padding: '12px 16px', fontSize: '0.8rem', color: ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.15s' }, onMouseEnter: function(e) { e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5'; }, onMouseLeave: function(e) { e.currentTarget.style.background = 'transparent'; } },
              getIcon(s.categorie),
              React.createElement('span', { style: { flex: 1, textAlign: 'left' } }, s.nom)
            );
          })
        )
      ),
      React.createElement('div', { style: { width: 1, background: bdr, margin: '8px 0' } }),
      React.createElement('div', { style: { flex: 1, position: 'relative', minWidth: 0 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'transparent', borderRadius: 12, height: '100%' } },
          React.createElement(MapPin, { size: 18, color: mute, style: { flexShrink: 0 } }),
          React.createElement('input', { value: queryCity, onChange: function(e) { setQueryCity(e.target.value); }, onFocus: function() { setShowCityDrop(true); }, onBlur: function() { setTimeout(function() { setShowCityDrop(false); }, 200); }, placeholder: loading ? 'Chargement...' : 'Ville', style: { flex: 1, background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%', minWidth: 0 } })
        ),
        showCityDrop && !loading && filteredCities().length > 0 && React.createElement('div', { style: { position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: bgCard, border: '1px solid ' + bdr, borderRadius: 12, zIndex: 60, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: 300, overflowY: 'auto', overflowX: 'hidden' } },
          filteredCities().map(function(c) {
            return React.createElement('div', { key: c, onMouseDown: function() { handleCitySelect(c); }, style: { padding: '12px 16px', fontSize: '0.8rem', color: ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.15s' }, onMouseEnter: function(e) { e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f5f5f5'; }, onMouseLeave: function(e) { e.currentTarget.style.background = 'transparent'; } },
              React.createElement(MapPin, { size: 14, color: orange, style: { flexShrink: 0 } }),
              React.createElement('span', { style: { flex: 1, textAlign: 'left' } }, c)
            );
          })
        )
      ),
      React.createElement('button', { onClick: handleSearchScroll, style: { background: orange, color: '#fff', border: 'none', borderRadius: 12, padding: '0 28px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }, onMouseEnter: function(e) { e.currentTarget.style.opacity = '0.9'; }, onMouseLeave: function(e) { e.currentTarget.style.opacity = '1'; } },
        React.createElement(Search, { size: 16 }),
        'Rechercher'
      )
    ),
    !loading && subjectsList.length > 0 && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: '2rem' } },
      subjectsList.slice(0, 8).map(function(pill) {
        var isActive = activePill === pill.nom;
        return React.createElement('button', { key: pill.nom, onClick: function() {
          if (isActive) {
            setActivePill(null);
            setQuerySubject('');
          } else {
            setActivePill(pill.nom);
            setQuerySubject(pill.nom);
          }
          handleSearchScroll();
        }, style: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 100, border: '1px solid ' + (isActive ? orange : bdr), background: isActive ? orange : 'transparent', color: isActive ? '#fff' : charcoal, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' } },
          getIcon(pill.categorie),
          React.createElement('span', {}, pill.nom)
        );
      })
    )
  );
}