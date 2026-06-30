import React, { useState, useEffect } from 'react'
import { Search, MapPin, Sparkles, RefreshCw } from 'lucide-react'
import api from '../../api/axios.js'

export default function HeroSection({ onSearch }) {
  const [querySubject, setQuerySubject] = useState('')
  const [queryCity, setQueryCity] = useState('')
  const [isSubjectFocused, setIsSubjectFocused] = useState(false)
  const [isCityFocused, setIsCityFocused] = useState(false)
  const [matieres, setMatieres] = useState([])
  const [villes, setVilles] = useState([])
  const [activePill, setActivePill] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const SUBJECT_PILLS = ['Maths', 'Anglais', 'Arabe', 'Physique-Chimie', 'Français', 'SVT', 'Code']

  const mapAbbrevToSubject = (pill) => {
    switch (pill) {
      case 'Maths': return 'Mathématiques'
      case 'Physique-Chimie': return 'Physique'
      default: return pill
    }
  }

  // REAL API CALLS - ONLY from your Laravel backend
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const res = await api.get('/matieres')
        setMatieres(res.data)
        setApiError(null)
      } catch (err) {
        console.error('Failed to fetch matieres from backend:', err)
        setApiError('Erreur de connexion au serveur')
      }
    }

    const fetchVilles = async () => {
      try {
        const res = await api.get('/villes')
        setVilles(res.data)
        setApiError(null)
      } catch (err) {
        console.error('Failed to fetch villes from backend:', err)
        setApiError('Erreur de connexion au serveur')
      }
    }

    fetchMatieres()
    fetchVilles()
  }, [])

  const getFilteredSubjects = () => {
    if (!querySubject) return matieres.slice(0, 7)
    return matieres.filter((m) => m.nom.toLowerCase().includes(querySubject.toLowerCase()))
  }

  const getFilteredCities = () => {
    if (!queryCity) return villes.slice(0, 6)
    return villes.filter((c) => c.toLowerCase().includes(queryCity.toLowerCase()))
  }

  const handleSearch = () => {
    setLoading(true)
    onSearch({ subject: activePill || querySubject, city: queryCity })
    setTimeout(() => setLoading(false), 500)
  }

  const handlePillClick = (pill) => {
    const subject = mapAbbrevToSubject(pill)
    if (activePill === subject) {
      setActivePill(null)
      setQuerySubject('')
    } else {
      setActivePill(subject)
      setQuerySubject('')
    }
    onSearch({ subject: activePill === subject ? null : subject, city: queryCity })
  }

  const handleReset = () => {
    setQuerySubject('')
    setQueryCity('')
    setActivePill(null)
    onSearch({ subject: null, city: null })
  }

  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-canvas">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-8 space-y-8">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent-orange animate-pulse block">
          Soutien Scolaire d'Exception au Maroc
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-ink leading-[1.05] tracking-tight max-w-4xl mx-auto font-black">
          Trouvez le professeur parfait
        </h1>
        <p className="text-lg md:text-xl text-charcoal max-w-2xl mx-auto leading-relaxed">
          Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.
        </p>

        {/* Error message if API fails */}
        {apiError && (
          <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm px-4 py-2 rounded-lg">
            {apiError} - Vérifiez que votre backend Laravel est démarré sur http://localhost:8000
          </div>
        )}

        <div className="relative max-w-3xl mx-auto bg-surface-card border border-hairline-strong p-3 flex flex-col md:flex-row items-center gap-3 rounded-xl shadow-2xl">
          {/* Subject search */}
          <div className="flex-1 flex items-center gap-3 px-3 w-full relative">
            <Search className="h-5 w-5 text-charcoal shrink-0" />
            <input
              type="text"
              value={querySubject}
              onFocus={() => setIsSubjectFocused(true)}
              onBlur={() => setTimeout(() => setIsSubjectFocused(false), 200)}
              onChange={(e) => { setQuerySubject(e.target.value); setActivePill(null) }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-transparent border-none text-ink placeholder:text-stone w-full py-2.5 text-sm outline-none"
              placeholder="Quelle matière ? (Ex: Maths, Code, Français...)"
            />
            {querySubject && (
              <button onClick={() => setQuerySubject('')} className="text-stone hover:text-ink text-xs px-1">✕</button>
            )}

            {isSubjectFocused && matieres.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-mute border-b border-hairline bg-surface-deep/40">
                  {querySubject ? 'Matières associées' : 'Matières populaires'}
                </div>
                {getFilteredSubjects().map((matiere) => (
                  <button
                    key={matiere.id_matiere}
                    type="button"
                    onClick={() => {
                      setQuerySubject(matiere.nom)
                      setIsSubjectFocused(false)
                      onSearch({ subject: matiere.nom, city: queryCity })
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-ink hover:bg-accent-orange-glow hover:text-accent-orange font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-accent-orange shrink-0" />
                    <span>{matiere.nom}</span>
                    <span className="text-mute ml-auto text-[10px]">{matiere.categorie}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-hairline-strong hidden md:block" />

          {/* City search */}
          <div className="flex-1 flex items-center gap-3 px-3 w-full relative">
            <MapPin className="h-5 w-5 text-charcoal shrink-0" />
            <input
              type="text"
              value={queryCity}
              onFocus={() => setIsCityFocused(true)}
              onBlur={() => setTimeout(() => setIsCityFocused(false), 200)}
              onChange={(e) => setQueryCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-transparent border-none text-ink placeholder:text-stone w-full py-2.5 text-sm outline-none"
              placeholder="À Casablanca, Rabat, Marrakech..."
            />
            {queryCity && (
              <button onClick={() => setQueryCity('')} className="text-stone hover:text-ink text-xs px-1">✕</button>
            )}

            {isCityFocused && villes.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-mute border-b border-hairline bg-surface-deep/40">
                  {queryCity ? 'Villes correspondantes' : 'Villes principales'}
                </div>
                {getFilteredCities().map((city, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQueryCity(city)
                      setIsCityFocused(false)
                      onSearch({ subject: activePill || querySubject, city })
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-ink hover:bg-accent-orange-glow hover:text-accent-orange font-semibold transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <MapPin className="h-3 w-3 text-accent-orange shrink-0" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full md:w-auto bg-ink text-canvas px-8 py-3.5 rounded-lg font-bold hover:bg-ash transition-all transform active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
          >
            {loading ? '...' : 'Rechercher'}
          </button>
        </div>

        {/* Rapid Pill quick selectors */}
        <div className="pt-2">
          <span className="text-[10px] text-mute uppercase font-bold tracking-widest block mb-3">Accès Rapide</span>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {SUBJECT_PILLS.map((pill) => {
              const associatedSubject = mapAbbrevToSubject(pill)
              const isSelected = activePill === associatedSubject
              return (
                <button
                  key={pill}
                  onClick={() => handlePillClick(pill)}
                  className={`px-4 py-1.5 rounded-full border text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-accent-orange text-canvas border-accent-orange font-bold scale-105'
                      : 'border-hairline bg-surface-deep/40 text-charcoal hover:border-hairline-strong hover:text-ink'
                  }`}
                >
                  {pill}
                </button>
              )
            })}
            {(activePill || querySubject || queryCity) && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-xs font-semibold hover:bg-accent-red-glow hover:text-ink transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-canvas to-transparent" />
    </section>
  )
}