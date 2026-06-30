import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import TeacherCard from '../../components/home/TeacherCard';
import { Search, MapPin, SlidersHorizontal, RefreshCw, Wifi } from 'lucide-react';

function buildAvatarUrl(photo, prenom, nom) {
  if (!photo) return `https://ui-avatars.com/api/?name=${prenom}+${nom}&background=e04f00&color=fff&size=128`;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return `http://localhost:8000/storage/${photo}`;
}

export default function Teachers() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const bg      = '#f8f9fc';
  const bgCard  = '#ffffff';
  const border  = 'rgba(0,0,0,0.08)';
  const borderS = 'rgba(0,0,0,0.05)';
  const text    = '#07090d';
  const muted   = '#6b7280';

  const [tutors,        setTutors]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [queryCity,     setQueryCity]     = useState('');
  const [showCityDrop,  setShowCityDrop]  = useState(false);
  const [tarifMax,      setTarifMax]      = useState('');
  const [villes,        setVilles]        = useState([]);

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
      setTutors(res.data.map(e => ({
        id:          String(e.utilisateur_id),
        name:        `${e.user?.prenom || ''} ${e.user?.nom || ''}`.trim(),
        role:        e.titre || 'Professeur de Soutien Scolaire',
        city:        e.user?.ville || 'Maroc',
        rating:      parseFloat(e.noteMoyenne) || 0,
        avatar:      buildAvatarUrl(e.user?.photo, e.user?.prenom, e.user?.nom),
        rate:        e.tarifHeure || 150,
        subjects:    e.matieres?.map(m => m.nom) || [],
        // ✅ CORRIGE : les 3 modes independamment au lieu d'une chaine incomplete
        cours_domicile:    !!e.cours_domicile,
        cours_enligne:     !!e.cours_enligne,
        cours_deplacement: !!e.cours_deplacement,
        isFirstFree: true,
        isVerified:  !!e.estVerifie,
      })));
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
    return t.name.toLowerCase().includes(q) || t.subjects.some(s => s.toLowerCase().includes(q)) || t.role.toLowerCase().includes(q);
  });

  const hasFilter = search || queryCity || tarifMax;

  function handleReset() { setSearch(''); setQueryCity(''); setTarifMax(''); }

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

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>

          <div style={{ flex: 2, minWidth: '200px', background: bgCard, border: `1px solid ${border}`, borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={16} color={muted} style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou matière..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: text, fontSize: '0.82rem', width: '100%' }}
            />
          </div>

          <div style={{ position: 'relative', minWidth: '180px', flex: 1 }}>
            <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} color={muted} style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={queryCity}
                onChange={e => setQueryCity(e.target.value)}
                onFocus={() => setShowCityDrop(true)}
                onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
                placeholder="Ville ou Webcam"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: text, fontSize: '0.82rem', width: '100%' }}
              />
              {queryCity && (
                <button onClick={() => setQueryCity('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, padding: 0, display: 'flex' }}>
                  <RefreshCw size={12} />
                </button>
              )}
            </div>
            {showCityDrop && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: bgCard, border: `1px solid ${border}`, borderRadius: '12px', zIndex: 200, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <div
                  onMouseDown={() => { setQueryCity('Webcam'); setShowCityDrop(false); }}
                  style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: text, fontSize: '0.82rem', borderBottom: `1px solid ${borderS}` }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Wifi size={14} color="#e04f00" /> Webcam
                </div>
                {filteredCities.map((v, i) => (
                  <div
                    key={i}
                    onMouseDown={() => { setQueryCity(v); setShowCityDrop(false); }}
                    style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: text, fontSize: '0.82rem' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <MapPin size={14} color="#e04f00" /> {v}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative', minWidth: '160px' }}>
            <SlidersHorizontal size={14} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select
              value={tarifMax}
              onChange={e => setTarifMax(e.target.value)}
              style={{ width: '100%', background: bgCard, border: `1px solid ${border}`, color: tarifMax ? text : muted, borderRadius: '12px', padding: '12px 12px 12px 34px', fontSize: '0.82rem', outline: 'none', cursor: 'pointer', appearance: 'none' }}
            >
              <option value="">Tous les tarifs</option>
              <option value="100">Max 100 MAD/h</option>
              <option value="150">Max 150 MAD/h</option>
              <option value="200">Max 200 MAD/h</option>
              <option value="300">Max 300 MAD/h</option>
            </select>
          </div>

          {hasFilter && (
            <button
              onClick={handleReset}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
        </div>

        {!loading && (
          <div style={{ fontSize: '0.7rem', color: muted, fontFamily: 'monospace', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '0.06em' }}>
            {filtered.length} PROFESSEUR{filtered.length > 1 ? 'S' : ''} TROUVÉ{filtered.length > 1 ? 'S' : ''}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: muted, fontSize: '0.82rem', fontFamily: 'monospace' }}>
            Chargement des professeurs...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: bgCard, border: `1px solid ${border}`, borderRadius: '20px' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 1rem' }}>🔍</p>
            <p style={{ fontSize: '0.82rem', color: muted, fontFamily: 'monospace', margin: '0 0 1rem' }}>
              Aucun professeur trouvé avec ces critères.
            </p>
            <button
              onClick={handleReset}
              style={{ padding: '10px 24px', background: '#e04f00', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace' }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {filtered.map(t => (
              <TeacherCard key={t.id} teacher={t} user={user} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 992px) { div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 576px) { div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}