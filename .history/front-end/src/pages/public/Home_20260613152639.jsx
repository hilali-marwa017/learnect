import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import HeroSection from '../../components/home/HeroSection';
import StatsSection from '../../components/home/StatsSection';
import HowItWorks from '../../components/home/HowItWorks';
import TeachersSection from '../../components/home/TeachersSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import FaqSection from '../../components/home/FaqSection';
import TutorDetailModal from '../../components/TutorDetailModal';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(function() {
    api.get('/enseignants')
      .then(function(response) {
        setTutors(response.data);
        setLoading(false);
      })
      .catch(function(err) {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(function() {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');
    if (scrollTo) {
      setTimeout(function() {
        const element = document.getElementById(scrollTo);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [location.search]);

  const filteredTutors = tutors.filter(function(tutor) {
    const user = tutor.user || {};
    const matieres = tutor.matieres || [];
    const matiereNames = matieres.map(function(m) { return m.nom.toLowerCase(); });
    const matchesSubjectQuery = querySubject ? matiereNames.some(function(sub) { return sub.includes(querySubject.toLowerCase()); }) : true;
    const matchesCityQuery = queryCity ? (user.ville || '').toLowerCase().includes(queryCity.toLowerCase()) : true;
    const matchesSubjectFilter = activeSubjectFilter ? matiereNames.some(function(sub) { return sub === activeSubjectFilter.toLowerCase(); }) : true;
    return matchesSubjectQuery && matchesCityQuery && matchesSubjectFilter;
  });

  function handleToggleFavorite(e, tutorId) {
    e.stopPropagation();
    setFavorites(function(prev) {
      if (prev.includes(tutorId)) return prev.filter(function(id) { return id !== tutorId; });
      else return [...prev, tutorId];
    });
  }

  function triggerScrollSearch() {
    const element = document.getElementById('tutors-section');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setShowBecomeTutor(val) {
    if (val) navigate('/register?role=enseignant');
  }

  if (loading) {
    return <div className="pt-32 text-center"><div className="spinner-border text-accent-orange"></div></div>;
  }

  return (
    <div className="pt-4">
      <HeroSection querySubject={querySubject} setQuerySubject={setQuerySubject} queryCity={queryCity} setQueryCity={setQueryCity} activeSubjectFilter={activeSubjectFilter} setActiveSubjectFilter={setActiveSubjectFilter} onSearchSubmit={triggerScrollSearch} />
      <StatsSection />
      <HowItWorks />
      <TeachersSection filteredTutors={filteredTutors} activeSubjectFilter={activeSubjectFilter} favorites={favorites} handleToggleFavorite={handleToggleFavorite} setSelectedTutor={setSelectedTutor} querySubject={querySubject} queryCity={queryCity} setActiveSubjectFilter={setActiveSubjectFilter} setQuerySubject={setQuerySubject} setQueryCity={setQueryCity} setShowBecomeTutor={setShowBecomeTutor} />
      <FeaturesSection />
      <section className="py-24 bg-canvas border-t border-hairline-strong">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-surface-card border border-hairline-strong rounded-3xl p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
              <h2 className="font-display-lg text-4xl md:text-6xl text-ink leading-none">Vivez de votre passion, enseignez sur Learnect.</h2>
              <p className="text-charcoal text-base md:text-lg max-w-xl mx-auto leading-relaxed">Rejoignez la communauté de professeurs particuliers la plus sélective du Maroc.</p>
              <div className="pt-4">
                <button onClick={() => setShowBecomeTutor(true)} className="bg-ink text-canvas px-10 py-5 rounded-lg font-bold text-base hover:bg-ash transition-all shadow-xl cursor-pointer">
                  Devenir Super Professeur
                </button>
                <p className="mt-3 text-xs text-stone tracking-wide font-mono">Inscription gratuite • Sans engagement • Profil audité sous 24h</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FaqSection />
      {selectedTutor && <TutorDetailModal tutor={selectedTutor} onClose={() => setSelectedTutor(null)} onNewBooking={() => alert('Réservation envoyée !')} />}
    </div>
  );
}