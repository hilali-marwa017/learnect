import React, { useState, useEffect } from 'react'
import { AdminNavigationActive } from './Dashboard'
import api from '../../api/axios'
import { AlertTriangle, Trash2 } from 'lucide-react'

export default function AdminSignalements() {
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSignalements = async () => {
    try {
      const res = await api.get('/admin/signalements')
      setSignalements(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSignalements() }, [])

  const handleTraiter = async (id) => {
    try {
      await api.put(`/admin/signalements/${id}/traiter`)
      setSignalements(signalements.map((s) => s.id_signalement === id ? { ...s, statut: 'traite' } : s))
    } catch (e) { alert('Erreur.') }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/signalements/${id}`)
      setSignalements(signalements.filter((s) => s.id_signalement !== id))
    } catch (e) { alert('Erreur.') }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">ADMIN PANEL</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Signalements & Support</h1>
          <p className="text-charcoal text-xs">Examinez les alertes transmises par les utilisateurs.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <AdminNavigationActive activeTab="signalements" />
          <div className="flex-grow space-y-4">
            {loading ? (
              <p className="text-xs text-mute text-center py-16 animate-pulse font-mono">Chargement...</p>
            ) : signalements.length > 0 ? signalements.map((s) => (
              <div key={s.id_signalement} className="bg-surface-card border border-hairline-strong rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
                  <div className="flex gap-3 items-start">
                    <AlertTriangle className="h-5 w-5 text-accent-red shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-sm font-black text-ink">Signalement #{s.id_signalement}</h4>
                      <p className="text-xs text-mute">Par : <span className="text-ink font-bold">{s.signaleur?.prenom} {s.signaleur?.nom}</span></p>
                      <p className="text-xs text-mute">Avis #{s.id_avis}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-[10px] uppercase tracking-wide px-2.5 py-1 rounded font-mono border ${s.statut === 'en_attente' ? 'bg-accent-yellow/10 border-accent-yellow/20 text-accent-yellow' : 'bg-accent-green/10 border-accent-green/20 text-accent-green'}`}>
                      {s.statut === 'en_attente' ? 'Non résolu' : 'Traité'}
                    </span>
                    <button onClick={() => handleDelete(s.id_signalement)} className="p-1.5 rounded-lg text-mute hover:text-accent-red hover:bg-accent-red/10 cursor-pointer" title="Supprimer">
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
                <p className="text-charcoal text-xs leading-relaxed italic font-semibold pl-4 border-l-2 border-accent-red bg-surface-deep/20 py-3 rounded-r-lg">"{s.motif}"</p>
                <div className="pt-3 border-t border-hairline flex justify-between items-center text-[10px] text-mute font-mono">
                  <span>Reçu le : {new Date(s.created_at).toLocaleDateString('fr-FR')}</span>
                  {s.statut === 'en_attente' && (
                    <button onClick={() => handleTraiter(s.id_signalement)} className="text-accent-blue font-bold hover:underline cursor-pointer">Marquer comme résolu</button>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-16 bg-surface-card border border-hairline rounded-xl max-w-xl mx-auto space-y-4 p-8">
                <p className="text-3xl">✅</p>
                <p className="text-xs text-mute font-mono font-bold">Aucun signalement en attente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}