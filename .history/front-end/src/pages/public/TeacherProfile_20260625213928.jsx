import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  Star, MapPin, ArrowLeft, Calendar, CheckCircle,
  Clock, Video, Home, Gift, X
} from 'lucide-react';

export default function TeacherProfile() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [enseignant,   setEnseignant]   = useState(null);
  const [creneaux,     setCreneaux]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selected,     setSelected]     = useState(null);   // id_creneau
  const [date,         setDate]         = useState('');
  const [methode,      setMethode]      = useState('cash');
  const [booking,      setBooking]      = useState(false);
  const [bookingDone,  setBookingDone]  = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');

  const isDark = false;
  const bg      = isDark ? '#0a0a0c' : '#f8f9fc';
  const bgCard  = isDark ? '#1a1a1c' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderS = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#9ca3af' : '#6b7280';

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ URLs correctes selon api.php
        const [ensRes, crRes] = await Promise.all([
          api.get(`/enseignants/${id}`),
          api.get(`/enseignants/${id}/creneaux`),   // était /creneaux/${id} → 405
        ]);
        setEnseignant(ensRes.data);
        setCreneaux((crRes.data || []).filter(c => c.estDisponible));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleReserver() {
    if (!selected || !date) { setErrorMsg('Veuillez choisir un créneau et une date.'); return; }
    if (!user)  { navigate('/login'); return; }
    if (user.role !== 'etudiant') { setErrorMsg('Seuls les étudiants peuvent réserver.'); return; }

    setBooking(true); setErrorMsg('');
    try {
      await api.post('/reservations', { id_creneau: selected, date, methode });
      setBookingDone(true);
    } catch (e) {
      setErrorMsg(e.response?.data?.message || 'Erreur lors de la réservation.');
    } finally {
      setBooking(false);
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, fontFamily: 'monospace', fontSize: '0.8rem' }}>
      Chargement...
    </div>
  );

  if (!enseignant) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, fontFamily: 'monospace', fontSize: '0.8rem' }}>
      Professeur introuvable.
    </div>
  );

  const avatarUrl = enseignant.user?.photo
    ? `http://localhost:8000/storage/${enseignant.user.photo}`
    : `https://ui-avatars.com/api/?name=${enseignant.user?.prenom}+${enseignant.user?.nom}&background=e04f00&color=fff&size=128`;

  const jours = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: muted, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginBottom: '2rem', padding: 0 }}
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }}>

          {/* ── Colonne gauche ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Carte identité */}
            <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <img
                src={avatarUrl}
                alt={enseignant.user?.prenom}
                style={{ width: '96px', height: '96px', borderRadius: '16px', objectFit: 'cover', border: `1px solid ${border}`, flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: text, margin: 0, letterSpacing: '-0.02em' }}>
                    {enseignant.user?.prenom} {enseignant.user?.nom}
                  </h1>
                  {enseignant.estVerifie && (
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, fontFamily: 'monospace', color: '#16a34a', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', padding: '2px 8px' }}>
                      ✓ VÉRIFIÉ
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#e04f00', fontWeight: 700, margin: '0 0 10px' }}>
                  {enseignant.titre}
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#e04f00" /> {enseignant.user?.ville || 'Maroc'}
                  </span>
                  {enseignant.noteMoyenne > 0 && (
                    <span style={{ fontSize: '0.72rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" /> {enseignant.noteMoyenne}/5
                    </span>
                  )}
                  {enseignant.isFirstFree && (
                    <span style={{ fontSize: '0.65rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <Gift size={12} /> 1er cours offert
                    </span>
                  )}
                </div>

                {/* Matières */}
                {enseignant.matieres?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                    {enseignant.matieres.map(m => (
                      <span key={m.id_matiere} style={{ fontSize: '0.68rem', fontWeight: 700, color: text, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${borderS}`, borderRadius: '6px', padding: '3px 10px' }}>
                        {m.nom}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* À propos */}
            {enseignant.description_profil && (
              <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.75rem' }}>
                <h3 style={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: muted, margin: '0 0 1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${borderS}` }}>
                  À propos
                </h3>
                <p style={{ fontSize: '0.85rem', color: text, lineHeight: 1.7, margin: 0 }}>
                  {enseignant.description_profil}
                </p>
              </div>
            )}

            {/* Méthode pédagogique */}
            {enseignant.description_cours && (
              <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.75rem' }}>
                <h3 style={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: muted, margin: '0 0 1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${borderS}` }}>
                  Méthode Pédagogique
                </h3>
                <p style={{ fontSize: '0.85rem', color: text, lineHeight: 1.7, margin: 0 }}>
                  {enseignant.description_cours}
                </p>
              </div>
            )}

            {/* Avis */}
            {enseignant.avis?.length > 0 && (
              <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.75rem' }}>
                <h3 style={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: muted, margin: '0 0 1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${borderS}` }}>
                  Avis des étudiants ({enseignant.avis.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {enseignant.avis.map(a => (
                    <div key={a.id_avis} style={{ padding: '1rem', background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb', border: `1px solid ${borderS}`, borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} fill={i < a.note ? '#f59e0b' : 'transparent'} color={i < a.note ? '#f59e0b' : '#d1d5db'} />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: muted, fontFamily: 'monospace' }}>
                          {a.etudiant?.prenom} {a.etudiant?.nom}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: muted, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{a.commentaire}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Colonne droite — Réservation ── */}
          <div style={{ position: 'sticky', top: '5.5rem' }}>
            <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.75rem' }}>

              {/* Tarif */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: `1px solid ${borderS}` }}>
                <div>
                  <div style={{ fontSize: '0.55rem', color: muted, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    TARIF HORAIRE
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: text, lineHeight: 1 }}>
                    <span style={{ color: '#e04f00' }}>{enseignant.tarifHeure}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: muted }}> MAD/h</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, fontFamily: 'monospace', color: '#16a34a', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '4px 10px' }}>
                  1ER COURS OFFERT
                </span>
              </div>

              {/* Succès réservation */}
              {bookingDone ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '14px' }}>
                  <CheckCircle size={36} color="#16a34a" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '0.85rem', fontWeight: 800, color: text, margin: '0 0 6px' }}>Réservation créée !</p>
                  <p style={{ fontSize: '0.72rem', color: muted, margin: '0 0 1rem' }}>
                    Accédez à vos réservations pour confirmer le paiement.
                  </p>
                  <button
                    onClick={() => navigate('/student/reservations')}
                    style={{ width: '100%', background: '#111827', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace' }}
                  >
                    MES RÉSERVATIONS
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {/* Erreur */}
                  {errorMsg && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700 }}>
                      <X size={14} /> {errorMsg}
                    </div>
                  )}

                  {/* Créneaux */}
                  <div>
                    <div style={{ fontSize: '0.6rem', color: muted, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                      Choisir un créneau
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                      {creneaux.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: muted, fontSize: '0.75rem', fontFamily: 'monospace', background: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb', borderRadius: '10px', border: `1px solid ${borderS}` }}>
                          Aucun créneau disponible
                        </div>
                      ) : (
                        creneaux.map(c => (
                          <button
                            key={c.id_creneau}
                            onClick={() => setSelected(c.id_creneau)}
                            style={{
                              padding: '12px 14px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer',
                              border: selected === c.id_creneau ? '1px solid #e04f00' : `1px solid ${border}`,
                              background: selected === c.id_creneau ? 'rgba(224,79,0,0.08)' : (isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb'),
                              display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s',
                            }}
                          >
                            <Clock size={14} color={selected === c.id_creneau ? '#e04f00' : muted} style={{ flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: text, textTransform: 'capitalize' }}>
                                {c.jour}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: muted, fontFamily: 'monospace' }}>
                                {c.heureDebut?.slice(0,5)} → {c.heureFin?.slice(0,5)}
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <div style={{ fontSize: '0.6rem', color: muted, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                      Date souhaitée
                    </div>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', border: `1px solid ${border}`, color: text, borderRadius: '10px', padding: '11px 14px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Mode paiement */}
                  <div>
                    <div style={{ fontSize: '0.6rem', color: muted, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                      Mode de paiement
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[{ val: 'cash', label: '💵 Cash' }, { val: 'simulation', label: '💳 Simulation' }].map(m => (
                        <button
                          key={m.val}
                          onClick={() => setMethode(m.val)}
                          style={{ padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, border: methode === m.val ? '1px solid #e04f00' : `1px solid ${border}`, background: methode === m.val ? 'rgba(224,79,0,0.08)' : 'transparent', color: methode === m.val ? '#e04f00' : muted, transition: 'all 0.15s' }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bouton réserver */}
                  {user?.role === 'etudiant' ? (
                    <button
                      onClick={handleReserver}
                      disabled={booking || !selected || !date}
                      style={{ width: '100%', background: (booking || !selected || !date) ? (isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb') : '#e04f00', color: (booking || !selected || !date) ? muted : '#ffffff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '0.8rem', fontWeight: 800, cursor: (booking || !selected || !date) ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <Calendar size={16} />
                      {booking ? 'RÉSERVATION EN COURS...' : 'RÉSERVER CE COURS'}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      style={{ width: '100%', background: '#111827', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em' }}
                    >
                      SE CONNECTER POUR RÉSERVER
                    </button>
                  )}

                  {!user && (
                    <p style={{ textAlign: 'center', fontSize: '0.7rem', color: muted, margin: 0 }}>
                      Vous devez être{' '}
                      <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#e04f00', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.7rem' }}>
                        connecté
                      </button>
                      {' '}pour réserver.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 380px'"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: 'sticky'"] {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}