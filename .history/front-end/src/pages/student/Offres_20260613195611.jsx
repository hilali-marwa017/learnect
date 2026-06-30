import React, { useState, useEffect } from 'react'
import { StudentNavigationActive } from './Dashboard'
import api from '../../api/axios'
import { Tag, CheckCircle, XCircle } from 'lucide-react'

export default function StudentOffres() {
  const [demandes, setDemandes] = useState([])
  const [offresParDemande, setOffresParDemande] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/demandes/mes-demandes')
        setDemandes(res.data)
        for (const d of res.data) {
          try {
            const offRes = await api.get(`/offres/demande/${d.id_demande}`)
            setOffresParDemande(prev => ({ ...prev, [d.id_demande]: offRes.data }))
          } catch (e) {}
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const handleAccepter = async (idOffre) => {
    try {
      await api.put(`/offres/${idOffre}/accepter`)
      alert('Offre acceptée !')
    } catch (e) { alert('Erreur.') }
  }

  const handleRefuser = async (idOffre) => {
    try {
      await api.put(`/offres/${idOffre}/refuser`)
      alert('Offre refusée.')
    } catch (e) { alert('Erreur.') }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PLATFORM</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Offres Reçues</h1>
          <p className="text-charcoal text-xs">Consultez et gérez les offres des enseignants sur vos demandes de soutien.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <StudentNavigationActive activeTab="offres" />
          <div className="flex-grow space-y-6">
            {loading ? (
              <p className="text-xs text-mute text-center py-16 animate-pulse font-mono">Chargement...</p>
            ) : demandes.length > 0 ? demandes.map(d => (
              <div key={d.id_demande} className="bg-surface-card border border-hairline-strong rounded-2xl p-6 space-y-4">
                <div className="border-b border-divider-soft pb-3">
                  <h3 className="font-bold text-sm text-ink">{d.matiere} — {d.niveau}</h3>
                  <p className="text-[10px] text-mute font-mono">Budget : {d.budgetMin} – {d.budgetMax} MAD/h • {d.ville}</p>
                </div>
                {offresParDemande[d.id_demande]?.length > 0 ? (
                  <div className="space-y-3">
                    {offresParDemande[d.id_demande].map(o => (
                      <div key={o.id_offre} className="p-4 bg-surface-deep/30 border border-hairline rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="space-y-1">
                          <p className="font-bold text-xs text-ink flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5 text-accent-orange" />
                            {o.enseignant?.user?.prenom} {o.enseignant?.user?.nom}
                          </p>
                          <p className="text-[10px] text-mute font-mono">{o.prix} MAD/h</p>
                          <p className="text-xs text-charcoal italic">"{o.message}"</p>
                        </div>
                        {o.statut === 'en_attente' && (
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => handleAccepter(o.id_offre)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs font-bold rounded-lg hover:bg-accent-green hover:text-white transition-all cursor-pointer">
                              <CheckCircle className="h-3.5 w-3.5" /><span>Accepter</span>
                            </button>
                            <button onClick={() => handleRefuser(o.id_offre)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-bold rounded-lg hover:bg-accent-red hover:text-white transition-all cursor-pointer">
                              <XCircle className="h-3.5 w-3.5" /><span>Refuser</span>
                            </button>
                          </div>
                        )}
                        {o.statut !== 'en_attente' && (
                          <span className={`text-[10px] font-bold uppercase font-mono px-2 py-1 rounded border ${o.statut === 'acceptee' ? 'bg-accent-green/10 text-accent-green border-accent-green/20' : 'bg-accent-red/10 text-accent-red border-accent-red/20'}`}>
                            {o.statut}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-mute font-mono text-center py-4">Aucune offre reçue pour cette demande.</p>
                )}
              </div>
            )) : (
              <div className="text-center py-16 bg-surface-card border border-hairline rounded-xl max-w-md mx-auto space-y-4 p-8">
                <p className="text-3xl">📭</p>
                <p className="text-charcoal text-xs">Publiez une demande pour recevoir des offres de tuteurs.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}