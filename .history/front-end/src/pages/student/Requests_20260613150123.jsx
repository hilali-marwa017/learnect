import React, { useState, useEffect } from 'react'
import { StudentNavigationActive } from './Dashboard'
import api from '../../api/axios'
import { Sparkles, Plus, Trash2 } from 'lucide-react'

export default function StudentRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [matiere, setMatiere] = useState('')
  const [niveau, setNiveau] = useState('Lycée')
  const [budgetMin, setBudgetMin] = useState(100)
  const [budgetMax, setBudgetMax] = useState(200)
  const [villeReq, setVilleReq] = useState('Casablanca')
  const [errorMsg, setErrorMsg] = useState('')

  const fetchRequests = async () => {
    try {
      const res = await api.get('/demandes/mes-demandes')
      setRequests(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchRequests() }, [])

  const handlePost = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (!matiere.trim()) { setErrorMsg('Veuillez indiquer une matière.'); return }
    try {
      await api.post('/demandes', { matiere, niveau, budgetMin, budgetMax, ville: villeReq })
      setShowForm(false)
      setMatiere('')
      fetchRequests()
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de la publication.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette demande ?')) return
    try {
      await api.delete(`/demandes/${id}`)
      setRequests(requests.filter((r) => r.id_demande !== id))
    } catch (e) { alert('Erreur lors de la suppression.') }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PLATFORM</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Mes Demandes de Soutien</h1>
          <p className="text-charcoal text-xs">Publiez vos besoins pour recevoir des propositions de tuteurs qualifiés.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <StudentNavigationActive activeTab="requests" />
          <div className="flex-grow space-y-8">
            <div className="flex justify-between items-center bg-surface-card border border-hairline-strong p-4 rounded-xl shadow-sm">
              <span className="text-xs text-charcoal font-semibold">{requests.filter((r) => r.statut === 'active').length} demandes actives</span>
              <button onClick={() => setShowForm(!showForm)}
                className="bg-ink hover:bg-accent-orange text-canvas hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer font-mono">
                <Plus className="h-4 w-4 shrink-0" /><span>RÉDIGER UNE DEMANDE</span>
              </button>
            </div>

            {showForm && (
              <form onSubmit={handlePost} className="bg-surface-card border border-hairline-strong p-6 rounded-2xl space-y-4 animate-in slide-in-from-top duration-300">
                <h3 className="text-sm font-extrabold text-ink font-mono uppercase tracking-wider">Formuler mon besoin</h3>
                {errorMsg && <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-xs font-bold">{errorMsg}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-mute uppercase font-caption font-bold block">MATIÈRE</label>
                    <input required type="text" value={matiere} onChange={(e) => setMatiere(e.target.value)} placeholder="Ex: Mathématiques"
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-mute uppercase font-caption font-bold block">NIVEAU</label>
                    <input type="text" value={niveau} onChange={(e) => setNiveau(e.target.value)} placeholder="Ex: 2ème Bac"
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-mute uppercase font-caption font-bold block">BUDGET MIN (MAD/h)</label>
                    <input type="number" value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} min={0}
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-mute uppercase font-caption font-bold block">BUDGET MAX (MAD/h)</label>
                    <input type="number" value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} min={0}
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">VILLE</label>
                  <input type="text" value={villeReq} onChange={(e) => setVilleReq(e.target.value)}
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="border border-hairline text-charcoal bg-transparent hover:bg-surface-deep/40 px-4 py-2 rounded-lg text-xs font-semibold">Annuler</button>
                  <button type="submit" className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-5 py-2 rounded-lg text-xs font-bold font-mono">Publier la demande</button>
                </div>
              </form>
            )}

            {loading ? (
              <p className="text-xs text-mute text-center py-8 animate-pulse font-mono">Chargement...</p>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id_demande} className="bg-surface-card border border-hairline-strong rounded-xl p-6 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
                      <div>
                        <span className="text-[9px] font-bold font-mono text-accent-orange bg-accent-orange-glow border border-accent-orange/15 px-2 py-0.5 rounded uppercase">{req.niveau}</span>
                        <h3 className="font-heading-md text-base text-ink font-bold mt-2">{req.matiere}</h3>
                        <p className="text-[10px] text-mute">{req.ville}</p>
                      </div>
                      <div className="flex gap-2 items-center shrink-0">
                        <span className={`font-bold px-2.5 py-1 rounded text-[10px] font-mono ${req.statut === 'active' ? 'bg-accent-blue/10 border border-accent-blue/20 text-accent-blue' : 'bg-accent-green/10 border border-accent-green/20 text-accent-green'}`}>
                          {req.statut.toUpperCase()}
                        </span>
                        <button onClick={() => handleDelete(req.id_demande)} className="p-1.5 rounded-lg text-mute hover:text-accent-red hover:bg-accent-red/10 cursor-pointer" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>