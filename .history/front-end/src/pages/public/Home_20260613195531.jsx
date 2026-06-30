import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../../components/home/HeroSection.jsx'
import StatsSection from '../../components/home/StatsSection.jsx'
import HowItWorks from '../../components/home/HowItWorks.jsx'
import FeaturesSection from '../../components/home/FeaturesSection.jsx'
import TeachersSection from '../../components/home/TeachersSection.jsx'
import FaqSection from '../../components/home/FaqSection.jsx'
import api from '../../api/axios.js'

export default function Home() {
  const navigate = useNavigate()
  const [querySubject, setQuerySubject] = useState('')
  const [queryCity, setQueryCity] = useState('')
  const [activeSubjectFilter, setActiveSubjectFilter] = useState(null)
  const [selectedTutor, setSelectedTutor] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await api.get('/enseignants')
        const mapped = res.data.map((e) => ({
          id: String(e.utilisateur_id),
          name: `${e.user?.prenom || ''} ${e.user?.nom || ''}`.trim(),
          role: e.titre || 'Professeur de Soutien Scolaire',
          city: e.user?.ville || 'Maroc',
          rating: parseFloat(e.noteMoyenne) || 5.0,
          reviewsCount: 0,
          bio: e.description_profil || 'Enseignant certifié disponible pour cours particuliers.',
          avatar: e.user?.photo ? `http://localhost:8000/storage/${e.user.photo}` : `https://ui-avatars.com/api/?name=${e.user?.prenom}+${e.user?.nom}&background=random`,
          rate: e.tarifHeure || 150,
          subjects: e.matieres?.map(m => m.nom) || ['Soutien Scolaire'],
          isFirstFree: true,
          isAmbassador: false,
          education: e.diplome || '',
          experience: `${e.cours_enligne ? 'En ligne' : ''} ${e.cours_domicile ? 'Domicile' : ''}`.trim(),
          verifiedDegrees: [e.diplome || 'Diplôme vérifié'],
          responseTime: '< 30 minutes',
          isVerified: e.estVerifie,
          langues: e.langues,
        }))
        setTutors(mapped)
      } catch (e) {
        console.error(e)
        setTutors([])
      } finally {
        setLoading(false)
      }
    }
    fetchTutors()
  }, [])

  const filteredTutors = tutors.filter((t) => {
    const matchSubject = activeSubjectFilter
      ? t.subjects.some(s => s.toLowerCase().includes(activeSubjectFilter.toLowerCase()))
      : querySubject
        ? t.subjects.some(s => s.toLowerCase().includes(querySubject.toLowerCase())) || t.role.toLowerCase().includes(querySubject.toLowerCase())
        : true
    const matchCity = queryCity ? t.city.toLowerCase().includes(queryCity.toLowerCase()) : true
    return matchSubject && matchCity
  })

  const handleToggleFavorite = (e, tutorId) => {
    e.stopPropagation()
    setFavorites(prev => prev.includes(tutorId) ? prev.filter(id => id !== tutorId) : [...prev, tutorId])
  }

  const handleSearchSubmit = () => {
    const section = document.getElementById('tutors-section')
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSelectTutor = (tutor) => {
    navigate(`/teachers/${tutor.id}`)
  }

  return (
    <div>
      <HeroSection
        querySubject={querySubject}
        setQuerySubject={setQuerySubject}
        queryCity={queryCity}
        setQueryCity={setQueryCity}
        activeSubjectFilter={activeSubjectFilter}
        setActiveSubjectFilter={setActiveSubjectFilter}
        onSearchSubmit={handleSearchSubmit}
      />
      <StatsSection />
      <TeachersSection
        filteredTutors={filteredTutors}
        activeSubjectFilter={activeSubjectFilter}
        favorites={favorites}
        handleToggleFavorite={handleToggleFavorite}
        setSelectedTutor={handleSelectTutor}
        querySubject={querySubject}
        queryCity={queryCity}
        setActiveSubjectFilter={setActiveSubjectFilter}
        setQuerySubject={setQuerySubject}
        setQueryCity={setQueryCity}
        setShowBecomeTutor={() => navigate('/register')}
      />
      <HowItWorks />
      <FeaturesSection />
      <FaqSection />
    </div>
  )
}