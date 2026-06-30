import React, { useState, useEffect } from 'react'
import api from '../../api/axios.js'
import { Users, Lock, Unlock, Trash2, Search } from 'lucide-react'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterRole, setFilterRole] = useState('')
  const [filterStatut, setFilterStatut] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [filterRole, filterStatut])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterRole) params.role = filterRole
      if (filterStatut) params.statut = filterStatut
      const res = await api.get('/admin/users', { params })
      setUsers(res.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleBloquer = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/bloquer`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const handleDebloquer = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/debloquer`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await api.delete(`/admin/users/${userId}`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-accent-orange border-t-transparent rounded-full"></div></div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-accent-red">{error}</div>

  return (
    <div className="min-h-screen bg-canvas py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-black text-ink mb-8">Gestion des Utilisateurs</h1>
        
        <div className="flex gap-4 mb-6">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 bg-surface-card border border-hairline rounded-lg text-sm">
            <option value="">Tous les rôles</option>
            <option value="etudiant">Étudiant</option>
            <option value="enseignant">Enseignant</option>
            <option value="admin">Admin</option>
          </select>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-2 bg-surface-card border border-hairline rounded-lg text-sm">
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="bloque">Bloqué</option>
            <option value="en_attente">En attente</option>
          </select>
        </div>

        <div className="bg-surface-card border border-hairline-strong rounded-xl overflow-hidden">
          <table className="w-full