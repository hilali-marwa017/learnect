import React, { useState, useEffect } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TeacherCard from './TeacherCard';
import api from '../../api/axios';

export default function TeachersSection({ querySubject, queryCity, activeSubjectFilter, setActiveSubjectFilter, setQuerySubject, setQueryCity }) {
  const navigate = useNavigate();
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('learnect_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // GET /api/enseignants — route publique avec filtres backend
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (queryCity) params.ville = queryCity;

    api.get('/enseignants', { params })
      .then(res => setEnseignants(res.data))
      .catch(() => setEnseignants([]))
      .finally(() => setLoading(false));
  }, [queryCity, activeSubjectFilter]);

  // Filtre local sur nom matière
  const filtered = enseignants.filter((e) => {
    const matieres = e.matieres || [];
    if (activeSubjectFilter) {
      return matieres.some(m =>
        m.nom.toLowerCase().includes(activeSubjectFilter.toLowerCase()) ||
        m.categorie?.toLowerCase().includes(activeSubjectFilter.toLowerCase())
      );
    }
    if (querySubject) {
      return matieres.some(m => m.nom.toLowerCase().includes(querySubject.toLowerCase()));
    }
    return true;
  });

  const handleToggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('learnect_favorites', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="tutors-section" className="py-24 bg-surface-deep/40 border-y border-hairline-strong">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent-blue font-bold font-caption mb-2 block">SÉLECTION HEBDOMADAIRE</span>
            <h2 className="font-display-lg text-4xl md:text-5xl text-ink">
              {activeSubjectFilter ? `Les profs de : ${activeSubjectFilter}` : 'Les profs de la semaine'}
            </h2>
            <p className="text-charcoal text-sm mt-2 max-w-xl">
              Enseignants vérifiés et certifiés disponibles partout au Maroc — cours à domicile ou en ligne.
            </p>
          </div>

          <div className="p-3 bg-surface-card rounded-lg border border-hairline shrink-0 flex items-center gap-4 text-xs font-mono shadow-sm">
            <div>
              <span className="text-[10px] text-ash uppercase font-caption block">Professeurs trouvés</span>
              <p className="font-bold text-ink">{loading ? '...' : `${filtered.length} correspondances`}</p>
            </div>
            {favorites.length > 0 && (
              <>
                <div className="w-px h-6 bg-hairline-strong" />
                <span className="text-accent-red font-semibold">♥ {favorites.length} Favoris</span>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 text-accent-orange animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((e) => (
              <TeacherCard
                key={e.utilisateur_id}
                enseignant={e}
                isFavorite={favorites.includes(e.utilisateur_id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-card rounded-xl border border-hairline-strong max-w-2xl mx-auto p-8 space-y-6 relative overflow-hidden">
            <div className="absolute -inset-10 bg-accent-orange-glow/10 rounded-full blur-3xl pointer-events-none" />
            <ShieldAlert className="h-12 w-12 text-accent-orange mx-auto animate-bounce" />
            <div className="relative z-10">
              <h3 className="font-heading-md text-xl text-ink font-bold">Aucun tuteur trouvé</h3>
              <p className="text-charcoal text-sm mt-2">
                Aucun professeur ne correspond à{' '}
                <span className="font-semibold text-ink">"{querySubject || activeSubjectFilter || 'Tout'}"</span>
                {queryCity && <> dans <span className="font-semibold text-ink">"{queryCity}"</span></>}.
              </p>
            </div>
            <div className="flex justify-center gap-4 relative z-10">
              <button
                onClick={() => { setQuerySubject(''); setQueryCity(''); setActiveSubjectFilter(null); }}
                className="bg-ink text-canvas hover:bg-ash px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Tout réinitialiser
              </button>
              <button
                onClick={() => navigate('/register')}
                className="border border-hairline bg-surface-card hover:bg-surface-elevated text-ink px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Devenir tuteur
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}