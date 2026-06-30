import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeroSection from '../../components/home/HeroSection';
import StatsSection from '../../components/home/StatsSection';
import HowItWorks from '../../components/home/HowItWorks';
import TeachersSection from '../../components/home/TeachersSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import FaqSection from '../../components/home/FaqSection';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');
    if (scrollTo) {
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [location.search]);

  const scrollToTutors = () => {
    document.getElementById('tutors-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-4">
      <HeroSection
        querySubject={querySubject}
        setQuerySubject={setQuerySubject}
        queryCity={queryCity}
        setQueryCity={setQueryCity}
        activeSubjectFilter={activeSubjectFilter}
        setActiveSubjectFilter={setActiveSubjectFilter}
        onSearchSubmit={scrollToTutors}
      />

      <StatsSection />
      <HowItWorks />

      <TeachersSection
        querySubject={querySubject}
        queryCity={queryCity}
        activeSubjectFilter={activeSubjectFilter}
        setActiveSubjectFilter={setActiveSubjectFilter}
        setQuerySubject={setQuerySubject}
        setQueryCity={setQueryCity}
      />

      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-24 bg-canvas border-t border-hairline-strong">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-surface-card border border-hairline-strong rounded-3xl p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-orange-glow/40 via-transparent to-accent-blue-glow/30 opacity-60 pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
              <h2 className="font-display-lg text-4xl md:text-6xl text-ink leading-none">
                Vivez de votre passion, enseignez sur Learnect.
              </h2>
              <p className="text-charcoal text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Rejoignez la communauté de professeurs la plus sélective du Maroc, établissez vos tarifs et gérez votre emploi du temps librement.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-ink text-canvas px-10 py-5 rounded-lg font-bold text-base hover:bg-ash transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                >
                  Devenir Super Professeur
                </button>
                <p className="mt-3 text-xs text-stone tracking-wide font-mono">
                  Inscription gratuite • Sans engagement • Profil audité sous 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </div>
  );
}