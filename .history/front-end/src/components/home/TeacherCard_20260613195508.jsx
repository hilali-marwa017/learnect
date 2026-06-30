import React from 'react'
import { Star, Heart, MapPin } from 'lucide-react'

export default function TeacherCard({ tutor, onSelect, isFavorite, onToggleFavorite }) {
  const badgeText = tutor.isFirstFree ? '1er cours offert' : tutor.isAmbassador ? 'Ambassadrice' : null
  const badgeBg = tutor.isFirstFree ? 'bg-accent-green text-canvas' : 'bg-accent-blue text-canvas'

  return (
    <div onClick={() => onSelect(tutor)}
      className="bg-surface-card border border-hairline-strong rounded-xl overflow-hidden hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col group h-full shadow-sm">
      <div className="aspect-[4/3] bg-surface-deep relative overflow-hidden">
        <img alt={tutor.name} src={tutor.avatar}
          className="w-full h-full object-cover grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          referrerPolicy="no-referrer" />
        {badgeText && (
          <div className={`absolute top-4 left-4 ${badgeBg} px-2.5 py-1 rounded text-xs font-bold tracking-wide shadow-lg`}>{badgeText}</div>
        )}
        <button onClick={(e) => onToggleFavorite(e, tutor.id)}
          className="absolute top-4 right-4 bg-canvas/40 hover:bg-canvas/80 backdrop-blur-md text-ink p-2 rounded-full border border-hairline transition-all duration-200 cursor-pointer">
          <Heart className={`h-4 w-4 ${isFavorite ? 'text-accent-red fill-accent-red animate-pulse' : 'text-ink'}`} />
        </button>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-heading-md text-lg text-ink font-semibold group-hover:text-accent-orange transition-colors">{tutor.name}</h3>
              <p className="text-charcoal text-xs flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-accent-blue" />
                <span>{tutor.city} • <span className="font-medium text-ash">{tutor.subjects?.[0]}</span></span>
              </p>
            </div>
            <div className="flex items-center gap-1 bg-surface-elevated px-2 py-0.5 rounded border border-divider-soft text-accent-yellow">
              <Star className="h-3.5 w-3.5 fill-accent-yellow" />
              <span className="font-bold text-xs">{(tutor.rating || 0).toFixed(1)}</span>
            </div>
          </div>
          <p className="text-ash text-xs line-clamp-1 mb-3 font-mono">{tutor.role}</p>
          <p className="text-charcoal text-sm mb-6 italic line-clamp-2 pl-3 border-l-2 border-divider-soft font-light leading-relaxed">"{tutor.bio}"</p>
        </div>
        <div className="pt-4 border-t border-hairline flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-ash text-[10px] uppercase tracking-wider font-caption">TARIF DIRECT</span>
            <span className="text-ink font-bold text-lg">{tutor.rate} MAD <span className="text-charcoal text-xs font-normal">/h</span></span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {tutor.subjects?.slice(0, 3).map((subject, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-surface-elevated rounded border border-divider-soft text-[10px] font-caption text-charcoal font-semibold">{subject}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}