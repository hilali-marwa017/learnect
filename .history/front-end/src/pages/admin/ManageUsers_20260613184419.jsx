import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import { Search } from 'lucide-react'

export default function AdminManageUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const params = {}
      if (roleFilter) params.role = roleFilter
      const res = await api.get('/admin/users', { params })
      setUsers(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [roleFilter])

  const handleBloquer = async (id) => {
    try {
      await api.put(`/admin/users/${id}/bloquer`)
      fetchUsers()
    } catch (e) { alert('Erreur.') }
  }

  const handleDebloquer = async (id) => {
    try {
      await api.put(`/admin/users/${id}/debloquer`)
      fetchUsers()
    } catch (e) { alert('Erreur.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur définitivement ?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(users.filter((u) => u.utilisateur_id !== id))
    } catch (e) { alert('Erreur lors de la suppression.') }
  }

  const filtered = users.filter((u) =>
    (u.nom + ' ' + u.prenom + ' ' + u.email).toLowerCase().includes(search.toLowerCase())
  )

  const statusStyle = (s) => {
    if (s === 'actif') return 'bg-accent-green/10 text-accent-green border-accent-green/20'
    if (s === 'bloque') return 'bg-accent-red/10 text-accent-red border-accent-red/20'
    return 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20'
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">ADMIN PANEL</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-charcoal text-xs">Gérez l'ensemble des inscrits actifs sur Learnect.ma.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <AdminNavigationActive activeTab="users" />
          <div className="flex-grow space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-surface-card border border-hairline-strong rounded-xl p-4 flex items-center gap-3">
                <Search className="h-4.5 w-4.5 text-mute" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom, email..."
                  className="w-full bg-transparent border-none text-xs text-ink outline-none placeholder:text-stone/60" />
              </div>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-surface-card border border-hairline-strong text-ink rounded-xl px-4 py-3 text-xs outline-none cursor-pointer">
                <option value="">Tous les rôles</option>
                <option value="etudiant">Étudiants</option>
                <option value="enseignant">Enseignants</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="font-heading-md text-sm font-bold uppercase tracking-wider text-ink font-mono border-b border-divider-soft pb-2">
                Utilisateurs ({filtered.length})
              </h3>
              {loading ? (
                <p className="text-xs text-mute text-center py-8 animate-pulse font-mono">Chargement...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-ink">
                    <thead>
                      <tr className="border-b border-hairline text-mute uppercase font-mono text-[9px]">
                        <th className="py-3">Utilisateur</th>
                        <th className="py-3">Rôle</th>
                        <th className="py-3">Ville</th>
                        <th className="py-3">Statut</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {filtered.map((u) => (
                        <tr key={u.utilisateur_id} className="hover:bg-surface-deep/15 transition-colors">
                          <td className="py-3">
                            <p className="font-bold">{u.prenom} {u.nom}</p>
                            <p className="text-[10px] text-mute font-mono">{u.email}</p>
                          </td>
                          <td className="py-3 capitalize font-semibold">{u.role}</td>
                          <td className="py-3">{u.ville}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono border ${statusStyle(u.statut)}`}>{u.statut}</span>
                          </td>
                          <td className="py-3 text-right flex justify-end gap-2">
                            {u.statut === 'bloque' ? (
                              <button onClick={() => handleDebloquer(u.utilisateur_id)} className="p-1 px-3 border border-accent-green/20 bg-accent-green/10 hover:bg-accent-green text-accent-green hover:text-white transition-all rounded text-[10px] font-bold font-mono cursor-pointer">Débloquer</button>
                            ) : (
                              <button onClick={() => handleBloquer(u.utilisateur_id)} className="p-1 px-3 border border-accent-red/20 bg-accent-red/10 hover:bg-accent-red text-accent-red hover:text-white transition-all rounded text-[10px] font-bold font-mono cursor-pointer">Bloquer</button>
                            )}
                            <button onClick={() => handleDelete(u.utilisateur_id)} className="p-1 px-3 border border-accent-red/30 bg-accent-red/5 hover:bg-accent-red text-accent-red hover:text-white transition-all rounded text-[10px] font-bold font-mono cursor-pointer">Supprimer</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}