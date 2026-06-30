import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios.js'
import { Star, MapPin, Calendar, Clock, ArrowLeft, Heart, MessageCircle } from 'lucide-react'

export default function TeacherProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [avis, setAvis] = useState([])
  const [creneaux, setCreneaux] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')

  // REAL API CALLS - ONLY from your backend
  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch teacher profile
        const teacherRes = await api.get(`/enseignants/${id}`)
        setTeacher(teacherRes.data)

        // Fetch avis (reviews)
        const avisRes = await api.get(`/enseignants/${id}/avis`)
        setAvis(avisRes.data)

        // Fetch creneaux (availability)
        const creneauxRes = await api.get(`/enseignants/${id}/creneaux`)
        setCreneaux(creneauxRes.data)
      } catch (err) {
        console.error('Failed to fetch teacher data:', err)
        setError(err.response?.data?.message || 'Erreur de connexion au serveur')
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-accent-orange border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-accent-red font-semibold">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-accent-blue hover:underline">
            <ArrowLeft className="inline h-4 w-4 mr-1" /> Retour
          </button>
        </div>
      </div>
    )
  }

  if (!teacher) return null

  const user = teacher.user || {}
  const matieres = teacher.matieres || []

  return (
    <div className="min-h-screen bg-canvas pb-24">
      {/* Header */}
      <div className="bg-surface-card border-b border-hairline">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-charcoal hover:text-ink mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={user.photo ? `http://localhost:8000/storage/${user.photo}` : `https://ui-avatars.com/api/?name=${user.prenom}+${user.nom}&background=ea580c&color=fff&size=128`}
              alt={`${user.prenom} ${user.nom}`}
              className="w-24 h-24 rounded-full object-cover border-2 border-hairline"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-black text-ink">{user.prenom} {user.nom}</h1>
              <p className="text-charcoal text-sm mt-1">{teacher.titre}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-charcoal">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-accent-blue" /> {user.ville}</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-accent-yellow fill-accent-yellow" /> {(teacher.noteMoyenne || 0).toFixed(1)}</span>
                <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4 text-accent-green" /> {avis.length} avis</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-ink">{teacher.tarifHeure || 0} <span className="text-sm font-normal text-charcoal">MAD/h</span></p>
              <button className="mt-2 bg-accent-orange text-canvas px-6 py-2 rounded-lg font-bold text-sm hover:bg-accent-orange/90 transition-colors">
                Réserver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6 mt-6">
        <div className="flex gap-4 border-b border-hairline mb-6">
          {['profile', 'avis', 'creneaux'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'text-accent-orange border-b-2 border-accent-orange' : 'text-charcoal hover:text-ink'}`}
            >
              {tab === 'profile' ? 'Profil' : tab === 'avis' ? 'Avis' : 'Disponibilités'}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-surface-card border border-hairline-strong rounded-xl p-6">
              <h3 className="font-bold text-ink mb-3">À propos</h3>
              <p className="text-charcoal text-sm leading-relaxed">{teacher.description_profil || 'Aucune description disponible.'}</p>
            </div>
            <div className="bg-surface-card border border-hairline-strong rounded-xl p-6">
              <h3 className="font-bold text-ink mb-3">Matières enseignées</h3>
              <div className="flex flex-wrap gap-2">
                {matieres.map((m, idx) => (
                  <span key={idx} className="px-3 py-1 bg-accent-orange-glow text-accent-orange text-xs font-bold rounded-full">
                    {m.nom}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-surface-card border border-hairline-strong rounded-xl p-6">
              <h3 className="font-bold text-ink mb-3">Informations</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-mute">Cours à domicile:</span> <span className="text-ink font-medium">{teacher.cours_domicile ? 'Oui' : 'Non'}</span></div>
                <div><span className="text-mute">Cours en ligne:</span> <span className="text-ink font-medium">{teacher.cours_enligne ? 'Oui' : 'Non'}</span></div>
                <div><span