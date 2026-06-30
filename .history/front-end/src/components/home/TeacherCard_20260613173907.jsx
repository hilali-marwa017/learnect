import React from 'react';
import { Star, Heart, MapPin, Wifi, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCard({ enseignant, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();
  const user = enseignant.user || {};
  const matieres = enseignant.matieres || [];

  const photoUrl = user.photo
    ? `http://localhost:8000/storage/${user.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent((user.prenom || '') + '+' + (user.nom || ''))}&background=random&size=300&color=fff`;

  const premierCours = !enseignant.noteMoyenne || enseignant.noteMoyenne === 0;

  return (
    <div
      onClick={() => navigate(`/teacher/${enseignant.utilisateur_id}`)}
      className="bg-surface-card border border-hairline-strong rounded-xl overflow-hidden hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col group h-full shadow-sm"
    >
      {/* Photo */}
      <div className="aspect-[4/3] bg-surface-deep relative overflow-hidden">
        <img
          alt={`${user.prenom} ${user.nom}`}
          src={photoUrl}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />

        {premierCours && (
          <div className="absolute top-4 left-4 bg-accent-green text-canvas px-2.5 py-1 rounded text-xs font-bold tracking-wide shadow-lg">
            1er cours offert
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(e, enseignant.utilisateur_id); }}
          className="absolute top-4 right-4 bg-canvas/40 hover:bg-canvas/80 backdrop-blur-md p-2 rounded-full border border-hairline transition-all cursor-pointer"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'text-accent-red fill-accent-red' : 'text-ink'}`} />
        </button>

        {/* Badges modalités */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {enseignant.cours_enligne && (
            <span className="bg-canvas/80 backdrop-blur-sm text-accent-blue text-[10px] font-bold px-2 py-0.5 rounded-full border border-accent-blue/20 flex items-center gap-1">
              <Wifi className="h-2.5 w-2.5" />En ligne
            </span>
          )}
          {enseignant.cours_domicile && (
            <span className="bg-canvas/80 backdrop-blur-sm text-accent-green text-[10px] font-bold px-2 py-0.5 rounded-full border border-accent-green/20 flex items-center gap-1">
              <Home className="h-2.5 w-2.5" />Domicile
            </span>
          )}
        </div>
      </div>

      {/* Infos */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-heading-md text-lg text-ink font-semibold group-hover:text-accent-orange transition-colors">
                {user.prenom} {user.nom}
              </h3>
              <p className="text-charcoal text-xs flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-accent-blue" />
                {user.ville}
                {matieres[0] && <> • <span className="font-medium text-ash">{matieres[0].nom}</span></>}
              </p>
            </div>
            {enseignant.noteMoyenne > 0 && (
              <div className="flex items-center gap-1 bg-surface-elevated px-2 py-0.5 rounded border border-divider-soft">
                <Star className="h-3.5 w-3.5 fill-accent-yellow text-accent-yellow" />
                <span className="font-bold text-xs text-ink">{parseFloat(enseignant.noteMoyenne).toFixed(1)}</span>
              </div>
            )}
          </div>

          {enseignant.titre && (
            <p className="text-ash text-xs line-clamp-1 mb-3 font-mono">{enseignant.titre}</p>
          )}

          {enseignant.description_profil && (
            <p className="text-charcoal text-sm mb-4 italic line-clamp-2 pl-3 border-l-2 border-divider-soft font-light leading-relaxed">
              "{enseignant.description_profil}"
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-hairline flex justify-between items-center">
          <div>
            <span className="text-ash text-[10px] uppercase tracking-wider font-caption block">TARIF DIRECT</span>
            <span className="text-ink font-bold text-lg">
              {enseignant.tarifHeure} MAD <span className="text-charcoal text-xs font-normal">/h</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {matieres.slice(0, 3).map((m) => (
              <span key={m.id_matiere} className="px-2 py-0.5 bg-surface-elevated rounded border border-divider-soft text-[10px] font-caption text-charcoal font-semibold">
                {m.nom}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}