import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { MapPin, Star, Phone, MessageCircle, Calendar, Check, X, Clock, Flag, AlertTriangle, Send } from 'lucide-react';

export default function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const context = useOutletContext?.() || {};
  const isDark = context?.isDark || false;

  const bg = isDark ? '#0a0a0c' : '#f8f9fc';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderS = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';

  const [enseignant, setEnseignant] = useState(null);
  const [creneaux, setCreneaux] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [methode, setMethode] = useState('simulation');
  const [reserving, setReserving] = useState(false);
  const [reservedInfo, setReservedInfo] = useState(null);
  const [error, setError] = useState('');

  // Signalement (modal)
  const [showSignalement, setShowSignalement] = useState(false);
  const [motifSignalement, setMotifSignalement] = useState('');
  const [signalementLoading, setSignalementLoading] = useState(false);
  const [signalementSuccess, setSignalementSuccess] = useState(false);

  // Avis - pas de modal, affiché directement dans la page
  const [showAvisForm, setShowAvisForm] = useState(false);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [avisLoading, setAvisLoading] = useState(false);
  const [avisSuccess, setAvisSuccess] = useState(false);
  const [avisError, setAvisError] = useState('');

  useEffect(() => {
    async function fetchAll() {
      try {
        const [profRes, creneauxRes, avisRes] = await Promise.all([
          api.get('/enseignants/' + id),
          api.get('/enseignants/' + id + '/creneaux'),
          api.get('/enseignants/' + id + '/avis'),
        ]);
        setEnseignant(profRes.data);
        setCreneaux(creneauxRes.data || []);
        setAvis(avisRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  async function handleReserver() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedCreneau) {
      setError('Veuillez choisir un creneau.');
      return;
    }
    if (!selectedDate) {
      setError('Veuillez choisir une date.');
      return;
    }
    setReserving(true);
    setError('');
    try {
      const res = await api.post('/reservations', {
        id_creneau: selectedCreneau,
        date: selectedDate,
        methode: methode
      });
      setReservedInfo({ methode: methode, reservation: res.data.reservation });
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de la reservation.');
    } finally {
      setReserving(false);
    }
  }

  async function handleSignalement(e) {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!motifSignalement.trim()) {
      setError('Veuillez decrire le motif du signalement.');
      return;
    }

    setSignalementLoading(true);
    setError('');
    try {
      await api.post('/signalements', {
        id_cible: id,
        type_cible: 'enseignant',
        motif: motifSignalement
      });
      setSignalementSuccess(true);
      setTimeout(() => {
        setShowSignalement(false);
        setSignalementSuccess(false);
        setMotifSignalement('');
      }, 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors du signalement.');
    } finally {
      setSignalementLoading(false);
    }
  }

  // ✅ Fonction pour laisser un avis - affiché directement dans la page
  async function handleAvis(e) {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentaire.trim()) {
      setAvisError('Veuillez ecrire un commentaire.');
      return;
    }
    if (note < 1 || note > 5) {
      setAvisError('Note invalide.');
      return;
    }

    setAvisLoading(true);
    setAvisError('');
    try {
      await api.post('/avis', {
        id_enseignant: id,
        note: note,
        commentaire: commentaire
      });
      setAvisSuccess(true);
      const res = await api.get('/enseignants/' + id + '/avis');
      setAvis(res.data || []);
      setTimeout(() => {
        setShowAvisForm(false);
        setAvisSuccess(false);
        setCommentaire('');
        setNote(5);
      }, 2000);
    } catch (e) {
      setAvisError(e.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis.');
    } finally {
      setAvisLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '4px solid #e04f00', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!enseignant) {
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: muted }}>Professeur introuvable.</p>
      </div>
    );
  }

  let photoSrc = 'https://ui-avatars.com/api/?background=e04f00&color=fff&name=' + (enseignant.user?.prenom || 'P');
  if (enseignant.user?.photo) {
    if (enseignant.user.photo.startsWith('http://') || enseignant.user.photo.startsWith('https://')) {
      photoSrc = enseignant.user.photo;
    } else {
      photoSrc = 'http://localhost:8000/storage/' + enseignant.user.photo;
    }
  }

  const disponibles = creneaux.filter(c => c.estDisponible);
  const aDejaAvis = avis.some(a => a.id_etudiant === user?.id);

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Carte Profil */}
        <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '3px solid rgba(224,79,0,0.3)' }}>
            <img src={photoSrc} alt={enseignant.user?.prenom} onError={e => { e.target.src = 'https://ui-avatars.com/api/?background=e04f00&color=fff&name=P'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: text, margin: 0 }}>{enseignant.user?.prenom} {enseignant.user?.nom}</h1>
              {enseignant.estVerifie && (
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563eb', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '6px', padding: '2px 8px', fontFamily: 'monospace' }}>VERIFIE</span>
              )}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#e04f00', fontWeight: 600, margin: '0 0 8px' }}>{enseignant.titre}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <MapPin size={14} color={muted} />
              <span style={{ fontSize: '0.8rem', color: muted }}>{enseignant.user?.ville || 'Maroc'}</span>
            </div>
            {enseignant.noteMoyenne > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(enseignant.noteMoyenne) ? '#f59e0b' : 'transparent'} color={s <= Math.round(enseignant.noteMoyenne) ? '#f59e0b' : '#d1d5db'} />
                ))}
                <span style={{ fontSize: '0.8rem', color: muted }}>{enseignant.noteMoyenne} / 5 ({avis.length} avis)</span>
              </div>
            )}
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: text }}>{enseignant.tarifHeure} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: muted }}>MAD/h</span></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            {user?.role === 'etudiant' && !aDejaAvis && (
              <button
                onClick={() => setShowAvisForm(!showAvisForm)}
                style={{
                  background: 'rgba(224,79,0,0.08)',
                  border: '1px solid rgba(224,79,0,0.2)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: '#e04f00',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Star size={14} /> {showAvisForm ? 'Fermer le formulaire' : 'Laisser un avis'}
              </button>
            )}
            <button
              onClick={() => setShowSignalement(true)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#ef4444',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Flag size={14} /> Signaler
            </button>
          </div>
        </div>

        {/* ✅ Formulaire d'avis - DIRECTEMENT DANS LA PAGE (pas en modal) */}
        {showAvisForm && (
          <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <Star size={24} color="#f59e0b" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: text, margin: 0 }}>Laisser un avis</h3>
            </div>

            {avisSuccess ? (
              <div style={{
                padding: '1rem',
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: '10px',
                color: '#16a34a',
                textAlign: 'center'
              }}>
                Avis envoyé avec succès ! Merci pour votre retour.
              </div>
            ) : (
              <form onSubmit={handleAvis}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: muted, display: 'block', marginBottom: '6px' }}>
                    Note *
                  </label>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNote(s)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Star
                          size={28}
                          fill={s <= note ? '#f59e0b' : 'transparent'}
                          color={s <= note ? '#f59e0b' : '#d1d5db'}
                        />
                      </button>
                    ))}
                    <span style={{ fontSize: '0.85rem', color: muted, marginLeft: '8px', fontWeight: 700 }}>
                      {note}/5
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: muted, display: 'block', marginBottom: '6px' }}>
                    Commentaire *
                  </label>
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Partagez votre experience avec ce professeur..."
                    rows={4}
                    maxLength={500}
                    style={{
                      width: '100%',
                      background: inputBg,
                      border: '1px solid ' + border,
                      borderRadius: '10px',
                      padding: '12px',
                      color: text,
                      fontSize: '0.85rem',
                      resize: 'vertical',
                      outline: 'none',
                      boxSizing: 'border-box',
                      maxHeight: '150px',
                      minHeight: '80px',
                      fontFamily: 'inherit'
                    }}
                    required
                  />
                  <div style={{ fontSize: '0.65rem', color: muted, textAlign: 'right', marginTop: '4px' }}>
                    {commentaire.length}/500 caractères
                  </div>
                </div>

                {avisError && (
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '8px',
                    color: '#dc2626',
                    fontSize: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    {avisError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAvisForm(false);
                      setCommentaire('');
                      setNote(5);
                      setAvisError('');
                    }}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      background: 'transparent',
                      border: '1px solid ' + border,
                      color: text,
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.82rem'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={avisLoading}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '10px',
                      background: '#e04f00',
                      border: 'none',
                      color: '#fff',
                      cursor: avisLoading ? 'not-allowed' : 'pointer',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      opacity: avisLoading ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Send size={16} /> {avisLoading ? 'Envoi...' : "Envoyer l'avis"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Modal Signalement - reste en modal */}
        {showSignalement && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              background: bgCard,
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid ' + border,
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <AlertTriangle size={24} color="#ef4444" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: text, margin: 0 }}>Signaler ce professeur</h3>
              </div>

              {signalementSuccess ? (
                <div style={{
                  padding: '1rem',
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: '10px',
                  color: '#16a34a',
                  textAlign: 'center'
                }}>
                  Signalement envoyé avec succès !
                </div>
              ) : (
                <form onSubmit={handleSignalement}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 700, color: muted, display: 'block', marginBottom: '6px' }}>
                      Motif du signalement *
                    </label>
                    <textarea
                      value={motifSignalement}
                      onChange={e => setMotifSignalement(e.target.value)}
                      placeholder="Decrivez le probleme (comportement, fraude, etc.)"
                      rows={4}
                      maxLength={500}
                      style={{
                        width: '100%',
                        background: inputBg,
                        border: '1px solid ' + border,
                        borderRadius: '10px',
                        padding: '12px',
                        color: text,
                        fontSize: '0.85rem',
                        resize: 'vertical',
                        outline: 'none',
                        boxSizing: 'border-box',
                        maxHeight: '200px',
                        minHeight: '100px'
                      }}
                      required
                    />
                    <div style={{ fontSize: '0.65rem', color: muted, textAlign: 'right', marginTop: '4px' }}>
                      {motifSignalement.length}/500 caractères
                    </div>
                  </div>

                  {error && (
                    <div style={{
                      padding: '8px 12px',
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: '8px',
                      color: '#dc2626',
                      fontSize: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSignalement(false);
                        setMotifSignalement('');
                        setError('');
                      }}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        background: 'transparent',
                        border: '1px solid ' + border,
                        color: text,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.82rem'
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={signalementLoading}
                      style={{
                        padding: '10px 24px',
                        borderRadius: '10px',
                        background: '#ef4444',
                        border: 'none',
                        color: '#fff',
                        cursor: signalementLoading ? 'not-allowed' : 'pointer',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        opacity: signalementLoading ? 0.7 : 1
                      }}
                    >
                      {signalementLoading ? 'Envoi...' : 'Envoyer le signalement'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Reste du contenu - Description, Avis, Réservation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {enseignant.description_profil && (
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: text, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1rem' }}>A propos du professeur</h3>
                <p style={{ fontSize: '0.85rem', color: muted, lineHeight: 1.7, margin: 0 }}>{enseignant.description_profil}</p>
              </div>
            )}
            {enseignant.description_cours && (
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: text, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1rem' }}>Methode d'enseignement</h3>
                <p style={{ fontSize: '0.85rem', color: muted, lineHeight: 1.7, margin: 0 }}>{enseignant.description_cours}</p>
              </div>
            )}
            {avis.length > 0 && (
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: text, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1rem' }}>Avis des etudiants ({avis.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {avis.slice(0, 4).map((a, i) => (
                    <div key={a.id_avis || i} style={{ paddingBottom: '1rem', borderBottom: i < avis.length - 1 ? '1px solid ' + borderS : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{a.etudiant?.prenom?.charAt(0)}</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: text }}>{a.etudiant?.prenom} {a.etudiant?.nom}</div>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= a.note ? '#f59e0b' : 'transparent'} color={s <= a.note ? '#f59e0b' : '#d1d5db'} />)}
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: muted, margin: 0, lineHeight: 1.6 }}>{a.commentaire}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reservedInfo ? (
              <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#16a34a', fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>RESERVATION CREEE</div>
                <p style={{ fontSize: '0.85rem', color: text, fontWeight: 700, margin: '0 0 1rem' }}>Votre reservation est en attente de confirmation de paiement.</p>
                <button onClick={() => navigate('/student/reservations')} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#e04f00', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', marginBottom: '8px', fontFamily: 'monospace' }}>
                  MES RESERVATIONS
                </button>
                <button onClick={() => navigate('/student/messages')} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'transparent', color: text, border: '1px solid ' + border, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'monospace' }}>
                  CONTACTER LE PROFESSEUR
                </button>
              </div>
            ) : (
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: text, margin: '0 0 1rem', paddingBottom: '0.75rem', borderBottom: '1px solid ' + borderS }}>
                  Reserver un cours
                </h3>

                {error && (
                  <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <X size={13} /> {error}
                  </div>
                )}

                {user?.role === 'etudiant' || !user ? (
                  <>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Choisir un creneau</label>
                      {disponibles.length === 0 ? (
                        <p style={{ fontSize: '0.78rem', color: muted, fontStyle: 'italic' }}>Aucun creneau disponible.</p>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {disponibles.map(c => (
                            <button key={c.id_creneau} onClick={() => setSelectedCreneau(c.id_creneau)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid ' + (selectedCreneau === c.id_creneau ? '#e04f00' : border), background: selectedCreneau === c.id_creneau ? '#e04f00' : inputBg, color: selectedCreneau === c.id_creneau ? '#fff' : text, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'monospace' }}>
                              {c.jour} {c.heureDebut?.slice(0, 5)}-{c.heureFin?.slice(0, 5)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Date du cours</label>
                      <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} style={{ width: '100%', background: inputBg, border: '1px solid ' + border, color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Mode de paiement</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setMethode('simulation')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid ' + (methode === 'simulation' ? '#e04f00' : border), background: methode === 'simulation' ? 'rgba(224,79,0,0.08)' : inputBg, color: methode === 'simulation' ? '#e04f00' : text, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                          Paiement simule
                        </button>
                        <button onClick={() => setMethode('cash')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid ' + (methode === 'cash' ? '#e04f00' : border), background: methode === 'cash' ? 'rgba(224,79,0,0.08)' : inputBg, color: methode === 'cash' ? '#e04f00' : text, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                          Especes
                        </button>
                      </div>
                    </div>

                    <button onClick={handleReserver} disabled={reserving} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: reserving ? '#e5e7eb' : '#e04f00', color: reserving ? muted : '#fff', border: 'none', fontWeight: 800, fontSize: '0.78rem', cursor: reserving ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Calendar size={16} /> {reserving ? 'RESERVATION...' : 'RESERVER CE COURS'}
                    </button>

                    {!user && (
                      <p style={{ fontSize: '0.72rem', color: muted, textAlign: 'center', marginTop: '8px' }}>
                        Vous serez redirige vers la connexion
                      </p>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: muted, textAlign: 'center', padding: '1rem 0' }}>
                    Seuls les etudiants peuvent reserver.
                  </p>
                )}
              </div>
            )}

            <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: text, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.75rem' }}>Infos pratiques</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {enseignant.cours_enligne && (
                  <div style={{ fontSize: '0.78rem', color: muted, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={14} color="#16a34a" /> Cours en ligne (Webcam)
                  </div>
                )}
                {enseignant.cours_domicile && (
                  <div style={{ fontSize: '0.78rem', color: muted, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={14} color="#16a34a" /> Cours a domicile
                  </div>
                )}
                {enseignant.langues && (
                  <div style={{ fontSize: '0.78rem', color: muted, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} color={muted} /> Langues : {enseignant.langues}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { div[style*="1fr 380px"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}