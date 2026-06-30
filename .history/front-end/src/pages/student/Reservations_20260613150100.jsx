import React, { useState, useEffect } from 'react'
import { StudentNavigationActive } from './Dashboard'
import api from '../../api/axios'
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function StudentReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations')
      setReservations(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReservations() }, [])

  const handleConfirmer = async (id) => {
    try {
      await api.post(`/reservations/${id}/confirmer-paiement`)
      fetchReservations()
      alert('Réservation confirmée !')
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la confirmation.')
    }
  }

  const handleAnnuler = async (id) => {
    if (!window.confirm('Annuler cette réservation ?')) return
    try {
      await api.delete(`/reservations/${id}`)
      fetchReservations()
    } catch (e) {
      alert('Erreur lors de l\'annulation.')
    }
  }

  const handleTerminer = async (id) => {
    try {
      await api.put(`/reservations/${id}/terminer`)
      fetchReservations()
    } catch (e) {
      alert('Erreur.')
    }
  }

  const statusStyle = (s) => {
    if (s === 'confirmee') return 'bg-accent-green/10 border-accent-green/20 text-accent-green'
    if (s === 'terminee') return 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue'
    if (s === 'annulee') return 'bg-accent-red/10 border-accent-red/20 text-accent-red'
    return 'bg-accent-yellow/10 border-accent-yellow/20 text-accent-yellow'
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PLATFORM</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Mes Réservations</h1>
          <p className="text-charcoal text-xs">Gérez vos cours réservés, confirmez les paiements et suivez votre historique.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <StudentNavigationActive activeTab="reservations" />
          <div className="flex-grow space-y-4">
            {loading ? (
              <p className="text-xs text-mute text-center py-16 animate-pulse font-mono">Chargement...</p>
            ) : reservations.length > 0 ? (
              reservations.map((r) => (
                <div key={r.id_reservation} className="bg-surface-card border border-hairline-strong rounded-2xl p-6 space-y-4 hover:border-accent-orange/20 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent-orange" />
                        <h3 className="font-bold text-sm text-ink">
                          {r.creneau?.enseignant?.user?.prenom} {r.creneau?.enseignant?.user?.nom}
                        </h3>
                      </div>
                      <p className="text-xs text-charcoal font-mono">
                        {r.date} — {r.creneau?.jour} {r.creneau?.heureDebut} → {r.creneau?.heureFin}
                      </p>
                      <p className="text-xs font-bold text-accent-orange">{r.montant} MAD</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded border text-[10px] font-bold font-mono uppercase ${statusStyle(r.statut)}`}>{r.statut}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline">
                    {r.statut === 'en_attente' && (
                      <>
                        <button onClick={() => handleConfirmer(r.id_reservation)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs font-bold rounded-lg hover:bg-accent-green hover:text-white transition-all cursor-pointer">
                          <CheckCircle className="h-3.5 w-3.5" /><span>Confirmer paiement</span>
                        </button>
                        <button onClick={() => handleAnnuler(r.id_reservation)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-bold rounded-lg hover:bg-accent-red hover:text-white transition-all cursor-pointer">
                          <XCircle className="h-3.5 w-3.5" /><span>Annuler</span>
                        </button>
                      </>
                    )}
                    {r.statut === 'confirmee' && (
                      <button onClick={() => handleTerminer(r.id_reservation)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold rounded-lg hover:bg-accent-blue hover:text-white transition-all cursor-pointer">
                        <Clock className="h-3.5 w-3.5" /><span>Marquer comme terminé</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-surface-card border border-hairline rounded-xl max-w-md mx-auto space-y-4 p-8">
                <p className="text-3xl">📅</p>
                <h3 className="font-bold text-lg text-ink">Aucune réservation</h3>
                <p className="text-charcoal text-xs">Vous n'avez pas encore réservé de cours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}