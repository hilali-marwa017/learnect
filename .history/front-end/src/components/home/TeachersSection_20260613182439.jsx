import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios.js'
import TeacherCard from './TeacherCard.jsx'
import { ShieldAlert, RefreshCw } from 'lucide-react'

export default function TeachersSection({ searchFilters }) {
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })
  const navigate = useNavigate()

  // REAL API CALL - ONLY from your Laravel backend
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = {}
        if (searchFilters?.city) {
          params.ville = searchFilters.city
        }
        // Your backend supports: ville, tarif_max, cours_enligne, cours_domicile, note_min
        const res = await api.get('/enseignants', { params })
        setTutors(res.data)
      } catch (err) {
        console.error('Failed to fetch teachers from backend:', err)
        setError(err.response?.data?.message || 'Erreur de connexion au serveur')
        setTutors([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [searchFilters])

  const handleToggleFavorite = (e, tutorId) => {
    e.stopPropagation()
    const newFavorites = favorites.includes(tutorId)
      ? favorites.filter(id => id !== tutorId)
      : [...favorites, tutorId]
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const handleSelect = (tutor) => {
    navigate(`/teachers/${tutor.utilisateur_id}`)
  }

  const activeSubjectFilter = searchFilters?.subject || null
  const querySubject = searchFilters?.subject || ''
  const queryCity = searchFilters?.city || ''

  if (loading) {
    return (
      <section id="tutors-section" className="py-24 bg-surface-deep/40 border-y border-hairline-strong">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface-deep rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-surface-deep rounded-xl"></div>)}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="tutors-section" className="py-24 bg-surface-deep/40 border-y border-hairline-strong">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red px-6 py-4 rounded-xl">
            <p className="font-semibold">Erreur: {error}</p>
            <p className="text-sm mt-1">Vérifiez que votre backend Laravel est démarré sur http://localhost:8000</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="tutors-section" className="py-24 bg-surface-deep/40 border-y border-hairline-strong relative">
      <div className="max-w-7xl mx-auto px-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent-blue font-bold mb-2 block">SÉLECTION HEBDOMADAIRE</span>
            <h2 className="text-4xl md:text-5xl text-ink font-black">
              {activeSubjectFilter ? `Les profs de : ${activeSubjectFilter}` : 'Les profs de la semaine'}
            </h2>
            <p className="text-charcoal text-sm mt-2 max-w-xl">Nos meilleurs ambassadeurs accrédités disponibles à Casablanca, Rabat et partout au Maroc pour des cours à domicile ou en ligne.</p>
          </div>
          <div className="p-3 bg-surface-card rounded-lg border border-hairline shrink-0 flex items-center gap-4 text-xs font-mono shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] text-ash uppercase font-bold block">Professeurs trouvés</span>
              <p className="font-bold text-ink">{tutors.length} correspondances</p>
            </div>
            {favorites.length > 0 && (
              <>
                <div className="w-px h-6 bg-hairline-strong" />
                <button className="flex items-center gap-1.5 text-accent-red font-semibold hover:opacity-80 transition-opacity cursor-pointer font-sans">
                  <span>♥ {favorites.length} Favoris</span>
                </button>
              </>
            )}
          </div>
        </div>

        {tutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.map((tutor) => (
              <div key={tutor.utilisateur_id} className="animate-fade-in">
                <TeacherCard
                  tutor={tutor}
                  onSelect={handleSelect}
                  isFavorite={favorites.includes(tutor.utilisateur_id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-card rounded-xl border border-hairline-strong max-w-2xl mx-auto space-y-6 p-8 relative overflow-hidden group">
            <div className="absolute -inset-10 bg-accent-orange-glow/10 rounded-full blur-3xl pointer-events-none" />
            <ShieldAlert className="h-12 w-12 text-accent-orange mx-auto animate-bounce" />
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl text-ink font-bold leading-normal">Aucun tuteur trouvé</h3>
              <p className="text-charcoal text-sm max-w-md mx-auto leading-relaxed">
                Aucun professeur disponible pour <span className="text-ink font-semibold">"{querySubject || activeSubjectFilter || 'Tout'}"</span> dans la ville de <span className="text-ink font-semibold">"{queryCity || 'Tout'}"</span>.
              </p>
            </div>
            <div className="flex justify-center gap-4 pt-2 relative z-10">
              <button onClick={() => window.location.reload()}
                className="bg-ink text-canvas hover:bg-ash px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Actualiser
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}