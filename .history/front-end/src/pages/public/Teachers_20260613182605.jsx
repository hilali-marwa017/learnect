import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios.js'
import TeacherCard from '../../components/home/TeacherCard.jsx'

export default function Teachers() {
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get('/enseignants')
        setTutors(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }
    fetchTeachers()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-accent-orange border-t-transparent rounded-full"></div></div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-accent-red">{error}</div>

  return (
    <div className="min-h-screen bg-canvas py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-black text-ink mb-8">Tous nos professeurs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <TeacherCard
              key={tutor.utilisateur_id}
              tutor={tutor}
              onSelect={() => navigate(`/teachers/${tutor.utilisateur_id}`)}
              isFavorite={false}
              onToggleFavorite={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  )
}