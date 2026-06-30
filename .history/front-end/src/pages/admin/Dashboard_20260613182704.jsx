import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios.js'
import { Users, BookOpen, DollarSign, AlertTriangle, GraduationCap, MessageSquare } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats')
        setStats(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-accent-orange border-t-transparent rounded-full"></div></div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-accent-red">{error}</div>

  const statCards = [
    { label: 'Étudiants', value: stats?.total_etudiants || 0, icon: Users, color: 'text-accent-blue' },
    { label: 'Enseignants', value: stats?.total_enseignants || 0, icon: GraduationCap, color: 'text-accent-green' },
    { label: 'Réservations', value: stats?.total_reservations || 0, icon: BookOpen, color: 'text-accent-orange' },
    { label: 'Avis', value: stats?.total_avis || 0, icon: MessageSquare, color: 'text-accent-yellow' },
    { label: 'Revenus', value: `${stats?.revenus_total || 0} MAD`, icon: DollarSign, color: 'text-accent-green' },
  ]

  return (
    <div className="min-h-screen bg-canvas py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-black text-ink mb-8">Tableau de bord Admin</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-surface-card border border-hairline-strong rounded-xl p-6">
                <Icon className={`h-6 w-6 ${stat.color} mb-2`} />
                <p className="text-mute text-xs font-bold uppercase">{stat.label}</p>
                <p className="text-2xl font-black text-ink mt-1">{stat.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/utilisateurs" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <Users className="h-6 w-6 text-accent-blue mb-3" />
            <h3 className="font-bold text-ink">Utilisateurs</h3>
            <p className="text-sm text-charcoal mt-1">Gérez les comptes</p>
          </Link>
          <Link to="/admin/enseignants" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <GraduationCap className="h-6 w-6 text-accent-green mb-3" />
            <h3 className="font-bold text-ink">Enseignants</h3>
            <p className="text-sm text-charcoal mt-1">Validation des profils</p>
          </Link>
          <Link to="/admin/signalements" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <AlertTriangle className="h-6 w-6 text-accent-red mb-3" />
            <h3 className="font-bold text-ink">Signalements</h3>
            <p className="text-sm text-charcoal mt-1">Modération des avis</p>
          </Link>
          <Link to="/admin/paiements" className="bg-surface-card border border-hairline-strong rounded-xl p-6 hover:border-accent-orange transition-colors">
            <DollarSign className="h-6 w-6 text-accent-yellow mb-3" />
            <h3 className="font-bold text-ink">Paiements</h3>
            <p className="text-sm text-charcoal mt-1">Statistiques financières</p>
          </Link>
        </div>
      </div>
    </div>
  )
}