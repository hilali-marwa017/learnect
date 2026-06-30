import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../../components/home/HeroSection.jsx'
import StatsSection from '../../components/home/StatsSection.jsx'
import HowItWorks from '../../components/home/HowItWorks.jsx'
import FeaturesSection from '../../components/home/FeaturesSection.jsx'
import TeachersSection from '../../components/home/TeachersSection.jsx'
import FaqSection from '../../components/home/FaqSection.jsx'
import api from '../../api/axios.js'
import { Sparkles } from 'lucide-react'

// Fallback tutors si le backend est vide ou pas encore connecté
const FALLBACK_TUTORS = [
  {
    id: 'fallback-1',
    name: 'Yassine B.',
    role: 'Professeur agrégé de Mathématiques (CPGE / Terminale)',
    city: 'Casablanca',
    rating: 4.9,
    bio: 'Passionné par la transmission du savoir, j\'accompagne les élèves vers l\'excellence avec une méthode rigoureuse et bienveillante.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    rate: 200,
    subjects: ['Mathématiques', 'Physique', 'CPGE'],
    isFirstFree: true,
    isAmbassador: false,
    isVerified: true,
  },
  {
    id: 'fallback-2',
    name: 'Nika K.',
    role: 'Enseignante d\'Anglais certifiée IELTS / TOEFL',
    city: 'Rabat',
    rating: 4.8,
    bio: 'Native speaker et formatrice certifiée, j\'aide chaque étudiant à atteindre son objectif linguistique rapidement.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=400',
    rate: 180,
    subjects: ['Anglais', 'IELTS', 'TOEFL'],
    isFirstFree: true,
    isAmbassador: true,
    isVerified: true,
  },
  {
    id: 'fallback-3',
    name: 'Mehdi A.',
    role: 'Ingénieur et Formateur en Développement Web & Code',
    city: 'Casablanca',
    rating: 4.9,
    bio: 'Développeur full-stack avec 8 ans d\'expérience, je transforme les débutants en développeurs compétents en un temps record.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    rate: 250,
    subjects: ['Code', 'Python', 'Web Dev'],
    isFirstFree: true,
    isAmbassador: false,
    isVerified: true,
  },
  {
    id: 'fallback-4',
    name: 'Sofia T.',
    role: 'Professeure de Français Langue Étrangère (FLE)',
    city: 'Marrakech',
    rating: 4.7,
    bio: 'Diplômée en lettres modernes, j\'aide les élèves à maîtriser la langue française avec fluidité et confiance.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
    rate: 150,
    subjects: ['Français', 'Littérature', 'FLE'],
    isFirstFree: true,
    isAmbassador: false,
    isVerified: true,
  },
  {
    id: 'fallback-5',
    name: 'Dr. Amine L.',
    role: 'Docteur en Physique-Chimie — Prépa & Université',
    city: 'Fès',
    rating: 5.0,
    bio: 'Ancien élève de grande école, je propose un accompagnement scientifique de haut niveau pour les classes préparatoires.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    rate: 300,
    subjects: ['Physique', 'Chimie', 'SVT'],
    isFirstFree: false,
    isAmbassador: true,
    isVerified: true,
  },
  {
    id: 'fallback-6',
    name: 'Noura S.',
    role: 'Professeure d\'Arabe et d\'Éducation Islamique',
    city: 'Casablanca',
    rating: 4.9,
    bio: 'Enseignante diplômée avec 10 ans d\'expérience, je maîtrise parfaitement la pédagogie adaptée à chaque niveau scolaire.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    rate: 165,
    subjects: ['Arabe', 'Éducation Islamique'],
    isFirstFree: true,
    isAmbassador: false,
    isVerified: true,
  },
]

function mapEnseignantToTutor(e) {
  return {
    id: String(e.utilisateur_id),
    name: `${e.user?.prenom || ''} ${e.user?.nom || ''}`.trim(),
    role: e.titre || 'Professeur de Soutien Scolaire',
    city: e.user?.ville || 'Maroc',
    rating: parseFloat(e.noteMoyenne) || 5.0,
    bio: e.description_profil || 'Enseignant certifié disponible pour cours particuliers.',
    avatar: e.user?.photo
      ? `http://localhost:8000/storage/${e.user.photo}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent((e.user?.prenom || 'P') + '+' + (e.user?.nom || 'N'))}&background=e04f00&color=fff&size=400`,
    rate: parseFloat(e.tarifHeure) || 150,
    subjects: e.matieres?.map(m => m.nom) || ['Soutien Scolaire'],
    isFirstFree: true,
    isAmbassador: false,
    isVerified: Boolean(e.estVerifie),
    education: e.diplome || '',
    experience: [
      e.cours_enligne ? 'En ligne' : '',
      e.cours_domicile ? 'Domicile' : '',
      e.cours_deplacement ? 'Déplacement' : '',
    ].filter(Boolean).join(', '),
    verifiedDegrees: [e.diplome || 'Diplôme vérifié'],
    responseTime: '< 30 minutes',
    langues: e.langues || 'Français, Arabe',
  }
}

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
        const mapped = res.data.map(mapEnseignantToTutor)
        // Si le backend retourne des données, les utiliser, sinon fallback
        setTutors(mapped.length > 0 ? mapped : FALLBACK_TUTORS)
      } catch (e) {
        console.warn('Backend non disponible, utilisation des données de démonstration.')
        setTutors(FALLBACK_TUTORS)
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
        ? t.subjects.some(s => s.toLowerCase().includes(querySubject.toLowerCase())) ||
          t.role.toLowerCase().includes(querySubject.toLowerCase())
        : true
    const matchCity = queryCity
      ? t.city.toLowerCase().includes(queryCity.toLowerCase())
      : true
    return matchSubject && matchCity
  })

  const handleToggleFavorite = (e, tutorId) => {
    e.stopPropagation()
    setFavorites(prev =>
      prev.includes(tutorId) ? prev.filter(id => id !== tutorId) : [...prev, tutorId]
    )
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
      {/* HERO */}
      <HeroSection
        querySubject={querySubject}
        setQuerySubject={setQuerySubject}
        queryCity={queryCity}
        setQueryCity={setQueryCity}
        activeSubjectFilter={activeSubjectFilter}
        setActiveSubjectFilter={setActiveSubjectFilter}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* STATS */}
      <StatsSection />

      {/* TUTORS */}
      <TeachersSection
        filteredTutors={loading ? [] : filteredTutors}
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

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* FEATURES */}
      <FeaturesSection />

      {/* CTA DEVENIR TUTEUR */}
      <CtaBecomeTutor onNavigate={() => navigate('/register')} />

      {/* FAQ */}
      <FaqSection />
    </div>
  )
}

function CtaBecomeTutor({ onNavigate }) {
  return (
    <section className="py-24 bg-ink relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent-orange/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent-blue/10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10 space-y-8">
        <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-orange font-bold block">
          REJOIGNEZ NOTRE RÉSEAU D'ÉLITE
        </span>

        <h2 className="font-display-lg text-4xl md:text-5xl text-canvas leading-[1.1] tracking-tight">
          Vivez de votre passion,<br />enseignez sur Learnect.
        </h2>

        <p className="text-canvas/60 text-sm leading-relaxed max-w-xl mx-auto">
          Rejoignez plus de 450 professeurs certifiés qui transmettent leur savoir sur la plateforme la plus innovante du Maroc. Définissez vos tarifs et gérez votre emploi du temps en toute liberté.
        </p>

        <button
          onClick={onNavigate}
          className="inline-flex items-center gap-2 bg-accent-orange hover:bg-accent-orange/90 text-canvas font-bold px-8 py-4 rounded-xl text-sm transition-all transform active:scale-95 cursor-pointer shadow-lg"
        >
          <Sparkles className="h-5 w-5" />
          <span>Devenir Tuteur Partenaire</span>
        </button>
      </div>
    </section>
  )
}