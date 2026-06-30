import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios.js'
import TeacherCard from '../../components/home/TeacherCard.jsx'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan']

export default function Teachers() {
  const navigate = useNavigate()
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ville, setVille] = useState('')
  const [tarifMax, setTarifMax] = useState('')
  const [noteMin, setNoteMin] = useState('')
  const [favorites, setFavorites] = useState([])

  const fetchTutors = async () => {
    setLoading(true)
    try {
      const params = {}
      if (ville) params.ville = ville
      if (tarifMax) params.tarif_max = tarifMax
      if (noteMin) params.note_min = noteMin
      const res = await api.get('/enseignants', { params })
      const mapped = res.data.map((e) => ({
        id: String(e.utilisateur_id),
        name: `${e.user?.prenom || ''} ${e.user?.nom || ''}`.trim(),
        role: e.titre || 'Professeur de Soutien Scolaire',
        city: e.user?.ville || 'Maroc',
        rating: parseFloat(e.noteMoyenne) || 5.0,
        bio: e.description_profil || 'Enseignant certifié disponible pour cours particuliers.',
        avatar: e.user?.photo ? `http://localhost:8000/storage/${e.user.photo}` : `https://ui-avatars.com/api/?name=${e.user?.prenom}+${e.user?.nom}&background=random`,
        rate: e.tarifHeure || 150,
        subjects: e.matieres?.map(m => m.nom) || ['Soutien Scolaire'],
        isFirstFree: true,
        isAmbassador: false,
        isVerified: e.estVerifie,
      }))
      setTutors(mapped)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTutors() }, [ville, tarifMax, noteMin])

  const filtered = tutors.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  const handleToggleFavorite = (e, id) => {
    e.stopPropagation()
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PLATFORM</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Annuaire des Professeurs</h1>
          <p className="text-charcoal text-xs">Trouvez le tuteur certifié qui correspond à vos besoins.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-surface-card border border-hairline-strong rounded-xl p-4 flex items-center gap-3">
            <Search className="h-4 w-4 text-mute" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom ou matière..."
              className="bg-transparent border-none text-xs text-ink outline-none w-full placeholder:text-stone/60" />
          </div>
          <select value={ville} onChange={(e) => setVille(e.target.value)}
            className="bg-surface-card border border-hairline-strong text-ink rounded-xl px-4 py-3 text-xs outline-none cursor-pointer">
            <option value="">Toutes les villes</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={tarifMax} onChange={(e) => setTarifMax(e.target.value)}
            className="bg-surface-card border border-hairline-strong text-ink rounded-xl px-4 py-3 text-xs outline-none cursor-pointer">
            <option value="">Tous les tarifs</option>
            <option value="100">Max 100 MAD/h</option>
            <option value="150">Max 150 MAD/h</option>
            <option value="200">Max 200 MAD/h</option>
            <option value="300">Max 300 MAD/h</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-mute font-mono animate-pulse">Chargement des professeurs...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(t => (
              <TeacherCard key={t.id} tutor={t} onSelect={() => navigate(`/teachers/${t.id}`)}
                isFavorite={favorites.includes(t.id)} onToggleFavorite={handleToggleFavorite} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-card border border-hairline rounded-xl max-w-md mx-auto space-y-4 p-8">
            <p className="text-3xl">🔍</p>
            <p className="text-charcoal text-xs font-mono">Aucun professeur trouvé avec ces critères.</p>
          </div>
        )}
      </div>
    </div>
  )
}