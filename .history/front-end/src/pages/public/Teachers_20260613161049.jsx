import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function Teachers() {
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
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-accent-blue font-bold">ANNUAIRE DES TUTEURS CERTIFIÉS</span>
          <h1 className="text-4xl font-bold text-ink">Les meilleurs professeurs particuliers au Maroc</h1>
          <p className="text-charcoal text-sm">Trouvez rapidement l'expert idéal selon la matière.</p>
        </div>

        <div className="bg-surface-card border rounded-xl p-4 flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Matière (Maths, Python...)" value={querySubject} onChange={function(e) { setQuerySubject(e.target.value); setActiveSubjectFilter(null); }} className="flex-1 bg-surface-deep/30 border rounded-lg p-2 text-sm" />
          <input type="text" placeholder="Ville (Casablanca, Rabat...)" value={queryCity} onChange={function(e) { setQueryCity(e.target.value); }} className="flex-1 bg-surface-deep/30 border rounded-lg p-2 text-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-mute">{tutors.length} professeurs</span>
          </div>
        </div>

        {tutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.map(function(t) {
              var user = t.user || {};
              var nomComplet = (user.prenom || '') + ' ' + (user.nom || '');
              var matieres = t.matieres || [];
              var premiereMatiere = matieres.length > 0 ? matieres[0].nom : 'Professeur';
              var tarif = t.tarifHeure || 0;
              var note = t.noteMoyenne || 0;
              
              return (
                <div key={t.utilisateur_id} onClick={function() { setSelectedTutor(t); }} className="bg-surface-card border rounded-xl overflow-hidden cursor-pointer p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-accent-orange/20 flex items-center justify-center">
                      <svg className="h-8 w-8 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-ink">{nomComplet || 'Professeur'}</h3>
                      <p className="text-charcoal text-xs">{user.ville} • {premiereMatiere}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-accent-yellow">★</span>
                        <span className="text-xs font-bold">{note.toFixed(1)}</span>
                      </div>
                      <p className="text-ink font-bold mt-2">{tarif} MAD <span className="text-charcoal text-xs font-normal">/h</span></p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-charcoal">Aucun professeur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teachers;