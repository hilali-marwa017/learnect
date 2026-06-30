import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Calculator, Languages, TrendingUp, Scale, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

export default function HeroSection({ isDark, querySubject, setQuerySubject, queryCity, setQueryCity, activePill, setActivePill }) {
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? '#000000' : '#f8f9fc';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const searchBg = isDark ? '#111111' : '#ffffff';
  const searchBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const iconColor = isDark ? '#a1a4a5' : '#9ca3af';
  const inputColor = isDark ? '#ffffff' : '#111827';
  const dropBg = isDark ? '#111111' : '#ffffff';
  const dropHover = isDark ? '#1a1a1a' : '#f9fafb';
  const pillBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
  const pillText = isDark ? '#d1d5db' : '#4b5563';
  const searchBtnBg = isDark ? '#ffffff' : '#111827';
  const searchBtnText = isDark ? '#111827' : '#ffffff';
  const orange = '#e04f00';
  const separator = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  function getIcon(cat) {
    var s = { width: 14, height: 14, color: orange };
    if (cat === 'Sciences') return React.createElement(Calculator, { style: s });
    if (cat === 'Langues') return React.createElement(Languages, { style: s });
    if (cat === 'Économie') return React.createElement(TrendingUp, { style: s });
    if (cat === 'Droit') return React.createElement(Scale, { style: s });
    return React.createElement(BookOpen, { style: s });
  }

  useEffect(function() {
    async function loadSubjects() {
      try {
        var res = await api.get('/matieres');
        var data = [];
        for (var i = 0; i < res.data.length; i++) {
          var item = res.data[i];
          var name = item.nom || item.name || '';
          var cat = item.categorie || 'Général';
          if (name !== '') {
            data.push({ name: name, category: cat });
          }
        }
        setSubjectsList(data);
      } catch(err) {
        var fallback = [
          { name: 'Mathématiques', category: 'Sciences' },
          { name: 'Physique', category: 'Sciences' },
          { name: 'Chimie', category: 'Sciences' },
          { name: 'Français', category: 'Langues' },
          { name: 'Anglais', category: 'Langues' },
          { name: 'Arabe', category: 'Langues' },
        ];
        setSubjectsList(fallback);
      }
    }
    loadSubjects();
  }, []);

  useEffect(function() {
    async function loadCities() {
      try {
        var res = await api.get('/villes');
        var data = [];
        for (var i = 0; i < res.data.length; i++) {
          var item = res.data[i];
          var city = item.nom || item.name || item.ville || '';
          if (city !== '') {
            data.push(city);
          }
        }
        setCitiesList(data);
      } catch(err) {
        var fallback = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda'];
        setCitiesList(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadCities();
  }, []);

  function getFilteredSubjects() {
    var result = [];
    var max = 8;
    for (var i = 0; i < subjectsList.length; i++) {
      var s = subjectsList[i];
      if (!querySubject) {
        if (result.length < max) result.push(s);
      } else {
        if (s.name.toLowerCase().indexOf(querySubject.toLowerCase()) !== -1) {
          if (result.length < max) result.push(s);
        }
      }
    }
    return result;
  }

  function getFilteredCities() {
    var result = [];
    var max = 8;
    for (var i = 0; i < citiesList.length; i++) {
      var c = citiesList[i];
      if (!queryCity) {
        if (result.length < max) result.push(c);
      } else {
        if (c.toLowerCase().indexOf(queryCity.toLowerCase()) !== -1) {
          if (result.length < max) result.push(c);
        }
      }
    }
    return result;
  }

  function scrollToTeachers() {
    setTimeout(function() {
      var section = document.getElementById('tutors-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }

  function onSelectSubject(subjectName) {
    setQuerySubject(subjectName);
    setShowSubjectDrop(false);
  }

  function onSelectCity(cityName) {
    setQueryCity(cityName);
    setShowCityDrop(false);
  }

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
  }

  return React.createElement('section', { style: { background: bg, padding: '2rem 2rem 3rem', textAlign: 'center' } },
    React.createElement('h1', { style: { fontFamily: '"EB Garamond", Georgia, serif', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 700, color: textColor, lineHeight: 1.08, letterSpacing: '-0.02em', maxWidth: 720, margin: '0 auto 0.5rem' } }, 'Trouvez le professeur parfait'),
    React.createElement('p', { style: { fontSize: '0.95rem', color: textMuted, maxWidth: 550, margin: '0 auto 1.5rem', lineHeight: 1.6 } }, 'Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.'),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', background: searchBg, border: '1px solid ' + searchBorder, borderRadius: 60, padding: '4px', maxWidth: 750, margin: '0 auto', boxShadow: isDark ? '0 0 0 1px rgba(255,255,255,0.04)' : '0 2px 12px rgba(0,0,0,0.06)' } },
      React.createElement('div', { style: { flex: 1, position: 'relative' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' } },
          React.createElement(Search, { size: 18, color: iconColor }),
          React.createElement('input', { value: querySubject, onChange: function(e) { setQuerySubject(e.target.value); setActivePill(null); }, onFocus: function() { setShowSubjectDrop(true); }, onBlur: function() { setTimeout(function() { setShowSubjectDrop(false); }, 180); }, placeholder: 'Essayer "Maths"', style: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: inputColor, fontSize: '0.9rem', fontFamily: 'inherit' } })
        ),
        showSubjectDrop && getFilteredSubjects().length > 0 && React.createElement('div', { style: { position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: dropBg, border: '1px solid ' + searchBorder, borderRadius: 16, zIndex: 200, boxShadow: '0 8px 28px rgba(0,0,0,0.14)', maxHeight: 280, overflowY: 'auto' } },
          getFilteredSubjects().map(function(subject) {
            return React.createElement('div', { key: subject.name, onMouseDown: function() { onSelectSubject(subject.name); }, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', color: inputColor, fontSize: '0.85rem', transition: 'background 0.1s' }, onMouseEnter: function(e) { e.currentTarget.style.background = dropHover; }, onMouseLeave: function(e) { e.currentTarget.style.background = 'transparent'; } },
              getIcon(subject.category),
              React.createElement('span', {}, subject.name)
            );
          })
        )
      ),
      React.createElement('div', { style: { width: 1, height: 32, background: separator } }),
      React.createElement('div', { style: { flex: 1, position: 'relative' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' } },
          React.createElement(MapPin, { size: 18, color: iconColor }),
          React.createElement('input', { value: queryCity, onChange: function(e) { setQueryCity(e.target.value); }, onFocus: function() { setShowCityDrop(true); }, onBlur: function() { setTimeout(function() { setShowCityDrop(false); }, 180); }, placeholder: 'Adresse ou ville', style: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: inputColor, fontSize: '0.9rem', fontFamily: 'inherit' } })
        ),
        showCityDrop && getFilteredCities().length > 0 && React.createElement('div', { style: { position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: dropBg, border: '1px solid ' + searchBorder, borderRadius: 16, zIndex: 200, boxShadow: '0 8px 28px rgba(0,0,0,0.14)', maxHeight: 280, overflowY: 'auto' } },
          getFilteredCities().map(function(city) {
            return React.createElement('div', { key: city, onMouseDown: function() { onSelectCity(city); }, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', color: inputColor, fontSize: '0.85rem', transition: 'background 0.1s' }, onMouseEnter: function(e) { e.currentTarget.style.background = dropHover; }, onMouseLeave: function(e) { e.currentTarget.style.background = 'transparent'; } },
              React.createElement(MapPin, { size: 14, color: orange }),
              React.createElement('span', {}, city)
            );
          })
        )
      ),
      React.createElement('button', { onClick: scrollToTeachers, style: { background: searchBtnBg, color: searchBtnText, border: 'none', borderRadius: 40, padding: '10px 28px', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, marginRight: '4px', transition: 'opacity 0.15s' }, onMouseEnter: function(e) { e.currentTarget.style.opacity = '0.85'; }, onMouseLeave: function(e) { e.currentTarget.style.opacity = '1'; } },
        React.createElement(Search, { size: 16 }),
        'Rechercher'
      )
    ),
    !loading && subjectsList.length > 0 && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: '1.5rem' } },
      subjectsList.slice(0, 8).map(function(pill) {
        var isActive = activePill === pill.name;
        return React.createElement('button', { key: pill.name, onClick: function() { if (isActive) { setActivePill(null); setQuerySubject(''); } else { setActivePill(pill.name); setQuerySubject(pill.name); } scrollToTeachers(); }, style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 999, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: isActive ? 600 : 500, border: isActive ? '1px solid ' + orange : '1px solid ' + pillBorder, background: isActive ? orange : 'transparent', color: isActive ? '#ffffff' : pillText, transition: 'all 0.15s' } },
          getIcon(pill.category),
          React.createElement('span', {}, pill.name)
        );
      }),
      (activePill || querySubject || queryCity) && React.createElement('button', { onClick: handleReset, style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, border: '1px solid rgba(218,31,31,0.3)', background: 'rgba(218,31,31,0.08)', color: '#dc2626', transition: 'all 0.15s' } },
        React.createElement(RefreshCw, { size: 12 }),
        'Réinitialiser'
      )
    )
  );
}