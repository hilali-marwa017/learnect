import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios.js'
import { Calendar, DollarSign, Star, MessageSquare, Clock } from 'lucide-react'

export default function TeacherDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/teacher/dashboard')
        setData(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-accent-orange border-t-transparent rounded-full"></div></div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-accent-red">{error}</div>

  const stats = data?.stats || {}

  return (
    <div className="min-h-screen bg-canvas py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-black text-ink mb-8">Tableau de bord Enseignant</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-card border border-hairline-strong rounded-xl p-6">
            <Star className="h-6 w-6 text-accent-yellow mb-2" />
            <p className="text-mute text-xs font-bold uppercase">Note moyenne</p>
            <p className="text-3xl font-black text-ink mt-1">{(stats.note_moyenne || 0).toFixed(1)}</p>
          </div>
          <div className="bg-surface-card border border-hairline-strong rounded-xl p-6">
            <MessageSquare className="h-6 w-6 text-accent-blue mb-2" />
            <p className="text-mute text-xs font-bold uppercase">Avis</p>
            <p className="text-3xl font-black text-ink mt-1">{stats.total_avis || 0}</p>
          </div>
          <div className="bg-surface-card border border-hairline-strong rounded-xl p-6">
            <Clock className="h-6 w-6 text-accent-green mb-2" />
            <p className="text-mute text-xs font-bold uppercase">Créneaux dispos</p>
            <p className="text-3xl font-black text-ink mt-1">{stats.creneaux_dispos || 0}</p>
          </div>
          <div className="bg-surface-card border border-hairline-strong rounded-xl p-6">
            <Calendar className="h-6 w-6 text-accent-orange mb-2" />
            <p className="text-mute text-xs font-bold uppercase">Offres en attente</p>
            <p className="text-3xl font-black text-ink mt-1">{stats.offres_en_attente || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/enseignant/disponibilites" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <Clock className="h-6 w-6 text-accent-orange mb-3" />
            <h3 className="font-bold text-ink">Mes Disponibilités</h3>
            <p className="text-sm text-charcoal mt-1">Gérez vos créneaux horaires</p>
          </Link>
          <Link to="/enseignant/revenus" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <DollarSign className="h-6 w-6 text-accent-green mb-3" />
            <h3 className="font-bold text-ink">Mes Revenus</h3>
            <p className="text-sm text-charcoal mt-1">Consultez vos paiements</p>
          </Link>
          <Link to="/enseignant/profil" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <Star className="h-6 w-6 text-accent-blue mb-3" />
            <h3 className="font-bold text-ink">Mon Profil</h3>
            <p className="text-sm text-charcoal mt-1">Complétez votre annonce</p>
          </Link>
        </div>
      </div>
    </div>
  )
}