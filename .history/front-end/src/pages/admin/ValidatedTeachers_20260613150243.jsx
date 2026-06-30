import React, { useState, useEffect } from 'react'
import { AdminNavigationActive } from './Dashboard'
import api from '../../api/axios'
import { CheckCircle, Search, Star } from 'lucide-react'

export default function AdminValidatedTeachers() {
  const [enseignants, setEnseignants] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchEnseignants = async () => {
    try {
      const res = await api.get('/admin/users', { params: { role: 'enseignant', statut: 'actif' } })
      setEnseignants(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchEnseignants() }, [])

  const handleBloquer = async (id) => {
    try {
      await api.put(`/admin/users/${id}/bloquer`)
      fetchEnseignants()
      alert('Enseignant bloqué.')
    } catch (e) { alert('Erreur.') }
  }

  const filtered = enseignants.filter((u) =>
    (u.nom + ' ' + u.prenom + ' ' + u.email).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">ADMIN PANEL</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Tuteurs Validés & Certifiés</h1>
          <p className="text-charcoal text-xs">Enseignants avec dossier approuvé et compte actif.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <AdminNavigationActive activeTab="validated" />
          <div className="flex-grow space-y-6">
            <div className="bg-surface-card border border-hairline-strong rounded-xl p-4 flex items-center gap-3">
              <Search className="h-4.5 w-4.5 text-mute" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filtrer par nom, email..."
                className="w-full bg-transparent border-none text-xs text-ink outline-none placeholder:text-stone/60" />
            </div>
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-divider-soft pb-2 text-[10px] font-mono text-mute uppercase font-bold">
                <span>ENSEIGNANTS ACTIFS ({filtered.length})</span>
                <span className="text-accent-green">✓ Tous certifiés</span>
              </div>
              {loading ? (
                <p className="text-xs text-mute text-center py-8 animate-pulse font-mono">Chargement...</p>
              ) : filtered.length > 0 ? (
                <div className="divide-y divide-hairline">
                  {filtered.map((u) => (
                    <div key={u.utilisateur_id} className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex gap-4 items-center flex-col sm:flex-row">
                        {u.photo ? (
                          <img src={u.photo.startsWith('http') ? u.photo : `http://localhost:8000/storage/${u.photo}`} alt="" className="h-10 w-10 rounded-full object-cover border border-hairline-strong shrink-0" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-accent-orange/20 flex items-center justify-center text-accent-orange font-bold shrink-0">{u.prenom?.[0]}</div>
                        )}
                        <div className="space-y-0.5 text-center sm:text-left">
                          <h4 className="font-bold text-xs text-ink flex items-center justify-center sm:justify-start gap-1">
                            <span>{u.prenom} {u.nom}</span>
                            <CheckCircle className="h-3.5 w-3.5 text-accent-green" />
                          </h4>
                          <p className="text-[10px] text-mute font-mono">{u.ville} • {u.email}</p>
                        </div>
                      </div>
                      <button onClick={() => handleBloquer(u.utilisateur_id)}
                        className="p-1 px-3 border border-accent-red/20 bg-accent-red/10 hover:bg-accent-red text-accent-red hover:text-white transition-all rounded text-[10px] font-bold font-mono cursor-pointer">
                        Bloquer
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-surface-deep/20 rounded-xl">
                  <p className="text-xs text-mute font-mono font-bold">Aucun enseignant validé trouvé.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}