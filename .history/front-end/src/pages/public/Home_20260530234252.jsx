import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import HeroSection from '../../components/home/HeroSection'
import FeaturesSection from '../../components/home/FeaturesSection'
import HowItWorks from '../../components/home/HowItWorks'
import TeachersSection from '../../components/home/TeachersSection'
import FaqSection from '../../components/home/FaqSection'
import api from '../../api/axios'

export default function Home() {
  const [enseignants, setEnseignants] = useState([])
  const [utilisateurs, setUtilisateurs] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const res = await api.get('/enseignants')
        const liste = res.data

        // Extraire les objets user imbriqués
        const listeUtilisateurs = liste
          .filter((e) => e.user)
          .map((e) => e.user)

        setEnseignants(liste)
        setUtilisateurs(listeUtilisateurs)
      } catch (erreur) {
        console.error('Erreur chargement enseignants :', erreur)
      } finally {
        setChargement(false)
      }
    }

    chargerDonnees()
  }, [])

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        {!chargement && (
          <TeachersSection
            enseignants={enseignants}
            utilisateurs={utilisateurs}
          />
        )}
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}