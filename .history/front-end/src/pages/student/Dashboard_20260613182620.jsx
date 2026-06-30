import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios.js'
import { BookOpen, Calendar, MessageSquare, Star, TrendingUp } from 'lucide-react'

export default function StudentDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard')
        setStats(res.data)
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

  const statCards = [
    { label: 'Réservations', value: stats?.stats?.total_reservations || 0, icon: Calendar, color: 'text-accent-blue' },
    { label: 'Demandes', value: stats?.stats?.total_demandes || 0, icon: BookOpen, color: 'text-accent-green' },
    { label: 'Avis', value: stats?.stats?.total_avis || 0, icon: Star, color: 'text-accent-yellow' },
  ]

  return (
    <div className="min-h-screen bg-canvas py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-black text-ink mb-8">Tableau de bord Étudiant</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-surface-card border border-hairline-strong rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-mute text-xs font-bold uppercase">{stat.label}</p>
                    <p className="text-3xl font-black text-ink mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/etudiant/reservations" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <Calendar className="h-6 w-6 text-accent-orange mb-3" />
            <h3 className="font-bold text-ink">Mes Réservations</h3>
            <p className="text-sm text-charcoal mt-1">Gérez vos cours réservés</p>
          </Link>
          <Link to="/etudiant/demandes" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <BookOpen className="h-6 w-6 text-accent-green mb-3" />
            <h3 className="font-bold text-ink">Mes Demandes</h3>
            <p className="text-sm text-charcoal mt-1">Publiez et gérez vos demandes</p>
          </Link>
          <Link to="/etudiant/messages" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <MessageSquare className="h-6 w-6 text-accent-blue mb-3" />
            <h3 className="font-bold text-ink">Messages</h3>
            <p className="text-sm text-charcoal mt-1">Discutez avec vos professeurs</p>
          </Link>
          <Link to="/etudiant/profil" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <TrendingUp className="h-6 w-6 text-accent-yellow mb-3" />
            <h3 className="font-bold text-ink">Mon Profil</h3>
            <p className="text-sm text-charcoal mt-1">Modifiez vos informations</p>
          </Link>
        </div>
      </div>
    </div>
  )
}