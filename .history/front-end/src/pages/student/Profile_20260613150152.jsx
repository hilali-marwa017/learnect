import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { StudentNavigationActive } from './Dashboard'
import api from '../../api/axios'
import { Save, User, Phone, GraduationCap, CheckCircle } from 'lucide-react'

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Salé', 'Mohammedia', 'Nador']
const LEVELS = ['Primaire', 'Collège', 'Lycée', 'Baccalauréat', 'CPGE', 'Université', 'Formation Professionnelle']

export default function StudentProfile() {
  const { user } = useAuth()
  const [prenom, setPrenom] = useState(user?.prenom || '')
  const [nom, setNom] = useState(user?.nom || '')
  const [telephone, setTelephone] = useState(user?.telephone || '')
  const [ville, setVille] = useState(user?.ville || 'Casablanca')
  const [niveau, setNiveau] = useState('')
  const [budget, setBudget] = useState(150)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/etudiant/profil')
        const e = res.data
        setNiveau(e.niveau || '')
        setBudget(e.budget || 150)
      } catch (e) { console.error(e) }
    }
    fetchProfile()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      await api.put('/etudiant/profil', { prenom, nom, telephone, ville, niveau, budget: Number(budget) })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PLATFORM</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Paramètres de Profil</h1>
          <p className="text-charcoal text-xs">Mettez à jour vos coordonnées personnelles.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <StudentNavigationActive activeTab="profile" />
          <div className="flex-grow bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-black text-ink border-b border-divider-soft pb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-accent-orange" /><span>Coordonnées Privées</span>
            </h2>
            {success && <div className="p-3.5 bg-accent-green/10 border border-accent-green/20 rounded-xl text-accent-green text-xs font-bold flex items-center gap-2"><CheckCircle className="h-4 w-4" />Modifications enregistrées avec succès.</div>}
            {errorMsg && <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-xs font-bold">{errorMsg}</div>}
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">Prénom</label>
                  <input required type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)}
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">Nom de famille</label>
                  <input required type="text" value={nom} onChange={(e) => setNom(e.target.value)}
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">Téléphone mobile</label>
                  <div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-mute shrink-0" />
                    <input required type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="06 XX XX XX XX"
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg pl-9 p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" /></div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">Ville</label>
                  <select value={ville} onChange={(e) => setVille(e.target.value)}
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange cursor-pointer">
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">Niveau scolaire</label>
                  <div className="relative"><GraduationCap className="absolute left-3 top-3 h-4 w-4 text-mute shrink-0" />
                    <select value={niveau} onChange={(e) => setNiveau(e.target.value)}
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg pl-9 p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange cursor-pointer">
                      {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select></div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">Budget max (MAD/h)</label>
                  <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} min={40} max={1000}
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>
              </div>
              <div className="pt-4 border-t border-hairline flex justify-end">
                <button type="submit" disabled={loading}
                  className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-8 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer font-mono disabled:opacity-60">
                  <Save className="h-4 w-4" /><span>{loading ? 'SAUVEGARDE...' : 'SAUVEGARDER MON PROFIL'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}