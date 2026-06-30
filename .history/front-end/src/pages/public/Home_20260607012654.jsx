// src/pages/public/Home.jsx
import { useState, useEffect } from 'react';
import HeroSection from '../../components/home/HeroSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import HowItWorks from '../../components/home/HowItWorks';
import StatsSection from '../../components/home/StatsSection';
import TeachersSection from '../../components/home/TeachersSection';
import FaqSection from '../../components/home/FaqSection';
import HomeMap from '../../components/home/HomeMap';
import api from '../../api/axios';

function Home() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enseignants')
      .then(res => {
        setEnseignants(res.data.slice(0, 30));
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroSection />
      <StatsSection />
      
      {/* Section Carte */}
      <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
        <div className="container">
          <div className="text-center mb-4">
            <div style={{
              color: '#0d6efd', fontSize: '0.72rem',
              fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', marginBottom: 6,
            }}>
              TROUVEZ UN PROF PRES DE CHEZ VOUS
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.8rem', fontWeight: 800,
              color: '#0F172A', letterSpacing: '-0.5px',
            }}>
              Nos enseignants sur la carte
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: 6 }}>
              Cliquez sur un marqueur pour découvrir le profil d'un enseignant
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <HomeMap enseignants={enseignants} />
          )}
        </div>
      </section>

      <HowItWorks />
      <FeaturesSection />
      <TeachersSection />
      <FaqSection />
    </>
  );
}

export default Home;