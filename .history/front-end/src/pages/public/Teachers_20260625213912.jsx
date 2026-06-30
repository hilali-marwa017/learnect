import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import TeacherCard from '../../components/home/TeacherCard';
import { Search, MapPin, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function Teachers() {
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const [tutors,    setTutors]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [ville,     setVille]     = useState('');
  const [tarifMax,  setTarifMax]  = useState('');
  const [villes,    setVilles]    = useState([]);

  const isDark = false; // ou récupère du contexte si tu as un ThemeContext

  const bg      = '#f8f9fc';
  const bgCard  = '#ffffff';
  const border  = 'rgba(0,0,0,0.08)';
  const text    = '#07090d';
  const muted   = '#6b7280';
  const inputBg = '#ffffff';

  // Charger villes depuis API
  useEffect(() => {
    api.get('/villes')
      .then(res => setVilles(res.data.map(v => v.nom || v.name || v).filter(Boolean)))
      .catch(() => setVilles(['Casablanca','Rabat','Marrakech','Tanger','Agadir','Fès']));
  }, []);

  // Charger enseignants avec filtres
  const fetchTutors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (ville)    params.ville     = ville;
      if (tarifMax) params.tarif_max = tarifMax;
      const res = await api.get('/enseignants', { params });
      const mapped = res.data.map(e => ({
        id:          String(e.utilisateur_id),
        name:        `${e.user?.prenom || ''} ${e.user?.nom || ''}`.trim(),
        role:        e.titre || 'Professeur de Soutien Scolaire',
        city:        e.user?.ville || 'Maroc',
        rating:      parseFloat(e.noteMoyenne) || 0,
        avatar:      e.user?.photo
                       ? `http://localhost:8000/storage/${e.user.photo}`
                       : `https://ui-avatars.com/api/?name=${e.user?.prenom}+${e.user?.nom}&background=e04f00&color=fff&size=128`,
        rate:        e.tarifHeure || 150,
        subjects:    e.matieres?.map(m => m.nom) || [],
        delivery:    e.type_cours || '',
        isFirstFree: true,
        isVerified:  !!e.estVerifie,
      }));
      setTutors(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTutors(); }, [ville, tarifMax]);

  // Filtre local par nom / matière
  const filtered = tutors.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.subjects.some(s => s.toLowerCase().includes(q)) ||
      t.role.toLowerCase().includes(q)
    );
  });

  function handleReset() {
    setSearch(''); setVille(''); setTarifMax('');
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* En-tête */}
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

        {/* Barre de filtres */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>

          {/* Recherche texte */}
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

          {/* Filtre ville */}
          <div style={{ position: 'relative', minWidth: '160px' }}>
            <MapPin size={14} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select
              value={ville}
              onChange={e => setVille(e.target.value)}
              style={{ width: '100%', background: bgCard, border: `1px solid ${border}`, color: ville ? text : muted, borderRadius: '12px', padding: '12px 12px 12px 34px', fontSize: '0.82rem', outline: 'none', cursor: 'pointer', appearance: 'none' }}
            >
              <option value="">Toutes les villes</option>
              {villes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {/* Filtre tarif */}
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

          {/* Reset */}
          {(search || ville || tarifMax) && (
            <button
              onClick={handleReset}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
        </div>

        {/* Compteur résultats */}
        {!loading && (
          <div style={{ fontSize: '0.72rem', color: muted, fontFamily: 'monospace', fontWeight: 700, marginBottom: '1.5rem' }}>
            {filtered.length} PROFESSEUR{filtered.length > 1 ? 'S' : ''} TROUVÉ{filtered.length > 1 ? 'S' : ''}
          </div>
        )}

        {/* Grille */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: muted, fontSize: '0.82rem', fontFamily: 'monospace' }}>
            Chargement des professeurs...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: bgCard, border: `1px solid ${border}`, borderRadius: '20px' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 1rem' }}>🔍</p>
            <p style={{ fontSize: '0.82rem', color: muted, fontFamily: 'monospace', margin: 0 }}>
              Aucun professeur trouvé avec ces critères.
            </p>
            <button onClick={handleReset} style={{ marginTop: '1rem', padding: '8px 20px', background: '#e04f00', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
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
        @media (max-width: 992px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 576px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}