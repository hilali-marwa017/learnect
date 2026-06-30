import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import api from '../../api/axios';
import HeroSection from '../../components/home/HeroSection';
import StatsSection from '../../components/home/StatsSection';
import HowItWorks from '../../components/home/HowItWorks';
import FeaturesSection from '../../components/home/FeaturesSection';
import FaqSection from '../../components/home/FaqSection';
import TeachersSection from '../../components/home/TeachersSection';
import Footer from '../../components/Footer';

function mapEnseignant(e) {
  return {
    id: String(e.utilisateur_id),
    name: ((e.user?.prenom || '') + ' ' + (e.user?.nom || '')).trim(),
    role: e.titre || 'Professeur de Soutien Scolaire',
    city: e.user?.ville || 'Maroc',
    rating: parseFloat(e.noteMoyenne) || 0,
    bio: e.description_profil || '',
    avatar: e.user?.photo
      ? `http://localhost:8000/storage/${e.user.photo}`
      : 'https://ui-avatars.com/api/?background=e04f00&color=fff&size=200',
    rate: parseFloat(e.tarifHeure) || 0,
    subjects: (e.matieres || []).map(function(m) { return m.nom; }),
    domicile: Boolean(e.cours_domicile),
    enligne: Boolean(e.cours_enligne),
  };
}

export default function Home() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [querySubject, setQuerySubject] = useState('');
  const [queryCity, setQueryCity] = useState('');
  const [activePill, setActivePill] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(function() {
    async function fetchTutors() {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/enseignants');
        setTutors(response.data.map(mapEnseignant));
      } catch (err) {
        console.error('Erreur fetch tutors:', err);
        setError('Impossible de charger les professeurs.');
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter(function(t) {
    const subjectMatch = activePill
      ? t.subjects.some(function(s) { 
          return s.toLowerCase().includes(activePill.toLowerCase()); 
        })
      : querySubject
        ? t.subjects.some(function(s) { 
            return s.toLowerCase().includes(querySubject.toLowerCase()); 
          }) || t.role.toLowerCase().includes(querySubject.toLowerCase())
        : true;
    
    const cityMatch = queryCity
      ? t.city.toLowerCase().includes(queryCity.toLowerCase())
      : true;
    
    return subjectMatch && cityMatch;
  });

  function handleSearch() {}

  function handleReset() {
    setQuerySubject('');
    setQueryCity('');
    setActivePill(null);
  }

  function handleToggleFavorite(e, id) {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(function(x) { return x !== id; }));
    } else {
      setFavorites([...favorites, id]);
    }
  }

  function toggleTheme() {
    setIsDark(!isDark);
    document.body.classList.toggle('dark', !isDark);
  }

  const bg = isDark ? '#000000' : '#f8f9fc';
  const ink = isDark ? '#fcfdff' : '#07090d';
  const bgSurf = isDark ? '#101012' : '#f1f3f5';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';
  const orange = '#e04f00';

  return (
    <div style={{ background: bg, fontFamily: "'Hanken Grotesk', sans-serif", minHeight: '100vh' }}>
      
      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 99,
        background: bg,
        borderBottom: `1px solid ${bdr}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        height: 70
      }}>
        <div style={{ fontWeight: 800, fontSize: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }} onClick={function() { navigate('/'); }}>
          <span style={{ color: orange }}>Learn</span>ect.ma
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
          <span style={{ cursor: 'pointer', color: '#718096' }} onClick={function() { document.getElementById('tutors-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Trouver un Prof</span>
          <span style={{ cursor: 'pointer', color: '#718096' }} onClick={function() { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>Comment ça marche</span>
          <span style={{ cursor: 'pointer', color: '#718096' }} onClick={function() { document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Qualité certifiée</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ background: bgSurf, border: `1px solid ${bdr}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            {isDark ? 'Clair' : 'Sombre'}
          </button>
          <button onClick={function() { navigate('/login'); }} style={{ background: 'none', border: `1px solid ${bdr}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem' }}>Connexion</button>
          <button onClick={function() { navigate('/register'); }} style={{ background: ink, color: bg, border: 'none', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>Devenir Tuteur</button>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection
        isDark={isDark}
        querySubject={querySubject}
        setQuerySubject={setQuerySubject}
        queryCity={queryCity}
        setQueryCity={setQueryCity}
        activePill={activePill}
        setActivePill={setActivePill}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Stats Section */}
      <StatsSection isDark={isDark} />

      {/* How It Works Section */}
      <HowItWorks isDark={isDark} />

      {/* Teachers Section */}
      <TeachersSection
        isDark={isDark}
        filteredTutors={filteredTutors}
        favorites={favorites}
        handleToggleFavorite={handleToggleFavorite}
        activePill={activePill}
        loading={loading}
        error={error}
        onReset={handleReset}
        querySubject={querySubject}
        queryCity={queryCity}
      />

      {/* Features Section */}
      <FeaturesSection isDark={isDark} />

      {/* CTA Section */}
      <section style={{ background: '#111111', padding: '5rem 2rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange, display: 'block', marginBottom: '0.5rem' }}>Rejoignez Notre Réseau d'Élite</span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: '0 auto 1rem', maxWidth: 520 }}>Vivez de votre passion,<br />enseignez sur Learnect.</h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.75 }}>Rejoignez plus de 450 professeurs certifiés qui transmettent leur savoir sur la plateforme la plus innovante du Maroc.</p>
        <button onClick={function() { navigate('/register'); }} style={{ background: orange, color: '#fff', border: 'none', borderRadius: 12, padding: '13px 30px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>Devenir Tuteur Partenaire</button>
      </section>

      {/* FAQ Section */}
      <FaqSection isDark={isDark} />

      {/* Footer */}
      <Footer isDark={isDark} />
    </div>
  );
}