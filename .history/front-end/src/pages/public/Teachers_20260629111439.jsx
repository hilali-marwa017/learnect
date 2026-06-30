import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import TeacherCard from '../../components/home/TeacherCard';
import { Search, MapPin, SlidersHorizontal, RefreshCw } from 'lucide-react';

function buildAvatarUrl(photo, prenom, nom) {
  if (!photo) return `https://ui-avatars.com/api/?name=${prenom}+${nom}&background=e04f00&color=fff&size=128`;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return `http://localhost:8000/storage/${photo}`;
}

export default function Teachers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const context = useOutletContext?.() || {};
  const isDark = context?.isDark || false;

  const bg     = isDark ? '#0a0a0c' : '#f8f9fc';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text   = isDark ? '#ffffff' : '#07090d';
  const muted  = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? '#1a1a1c' : '#ffffff';

  const [tutors,       setTutors]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [queryCity,    setQueryCity]    = useState('');
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [tarifMax,     setTarifMax]     = useState('');
  const [villes,       setVilles]       = useState([]);

  useEffect(() => {
    api.get('/villes')
      .then(res => setVilles(res.data.map(v => v.nom || v.name || v).filter(Boolean)))
      .catch(() => setVilles(['Casablanca','Rabat','Marrakech','Tanger','Agadir','Fès','Meknès','Oujda']));
  }, []);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (queryCity && queryCity !== 'Webcam') params.ville = queryCity;
      if (tarifMax) params.tarif_max = tarifMax;
      const res = await api.get('/enseignants', { params });
      
      // ✅ PASSER LES DONNEES DIRECTEMENT SANS TRANSFORMATION
      setTutors(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTutors(); }, [queryCity, tarifMax]);

  const filtered = tutors.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    const nomComplet = `${t.user?.prenom || ''} ${t.user?.nom || ''}`.toLowerCase();
    const matieres = t.matieres?.map(m => m.nom.toLowerCase()).join(' ') || '';
    return nomComplet.includes(q) || matieres.includes(q) || (t.titre || '').toLowerCase().includes(q);
  });

  const filteredCities = villes.filter(v =>
    !queryCity || v.toLowerCase().includes(queryCity.toLowerCase())
  ).slice(0, 8);

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.6rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            LEARNECT PLATFORM
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>
            Annuaire des Professeurs
          </h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>
            Trouvez le tuteur certifié qui correspond à vos besoins.
          </p>
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 2, minWidth: '200px' }}>
            <Search size={15} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou matière..."
              style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px', background: inputBg, border: `1px solid ${border}`, borderRadius: '10px', color: text, fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
            <MapPin size={15} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={queryCity}
              onChange={e => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder="Ville ou Webcam"
              style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px', background: inputBg, border: `1px solid ${border}`, borderRadius: '10px', color: text, fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
            />
            {showCityDrop && filteredCities.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: inputBg, border: `1px solid ${border}`, borderRadius: '10px', zIndex: 200, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {filteredCities.map((c, i) => (
                  <div key={i} onMouseDown={() => { setQueryCity(c); setShowCityDrop(false); }}
                    style={{ padding: '9px 14px', cursor: 'pointer', fontSize: '0.8rem', color: text, display: 'flex', alignItems: 'center', gap: '8px' }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <MapPin size={12} color="#e04f00" /> {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative', minWidth: '140px' }}>
            <SlidersHorizontal size={15} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="number"
              value={tarifMax}
              onChange={e => setTarifMax(e.target.value)}
              placeholder="Tous les tarifs"
              style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px', background: inputBg, border: `1px solid ${border}`, borderRadius: '10px', color: text, fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {(search || queryCity || tarifMax) && (
            <button onClick={() => { setSearch(''); setQueryCity(''); setTarifMax(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: `1px solid ${border}`, background: 'transparent', color: muted, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.65rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          {filtered.length} PROFESSEUR{filtered.length > 1 ? 'S' : ''} TROUVÉ{filtered.length > 1 ? 'S' : ''}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: muted }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: muted, fontSize: '0.85rem' }}>Aucun professeur trouvé.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(t => <TeacherCard key={t.utilisateur_id} teacher={t} user={user} />)}
          </div>
        )}
      </div>
    </div>
  );
}