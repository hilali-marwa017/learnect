import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { MapPin, Star, Phone, MessageCircle, Calendar, Check, X, Clock, Flag, Navigation, Home as HomeIcon, Video } from 'lucide-react';
import PaymentSimulationModal from '../../components/PaymentSimulationModal';

export default function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const context = useOutletContext?.() || {};
  const isDark = context?.isDark || false;

  const bg      = isDark ? '#0a0a0c' : '#f8f9fc';
  const bgCard  = isDark ? '#1a1a1c' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderS = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';

  const [enseignant, setEnseignant]   = useState(null);
  const [creneaux, setCreneaux]       = useState([]);
  const [avis, setAvis]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [selectedDate, setSelectedDate]       = useState('');
  const [methode, setMethode]         = useState('simulation');
  const [reserving, setReserving]     = useState(false);
  const [reservedInfo, setReservedInfo] = useState(null);
  const [error, setError]             = useState('');

  // ✅ NOUVEAU : etat pour le formulaire d'avis
  const [peutNoter, setPeutNoter]     = useState(false);
  const [idReservationAvis, setIdReservationAvis] = useState(null);
  const [showAvisForm, setShowAvisForm] = useState(false);
  const [note, setNote]               = useState(0);
  const [hoverNote, setHoverNote]     = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [sendingAvis, setSendingAvis] = useState(false);
  const [avisError, setAvisError]     = useState('');
  const [avisSuccess, setAvisSuccess] = useState(false);

  // ✅ NOUVEAU : modal de paiement
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

        // ✅ verifier si l'etudiant connecte peut laisser un avis
        if (user?.role === 'etudiant') {
          try {
            const peutRes = await api.get('/enseignants/' + id + '/peut-noter');
            setPeutNoter(!!peutRes.data?.peut_noter);
            setIdReservationAvis(peutRes.data?.id_reservation || null);
          } catch (e) { setPeutNoter(false); }
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchAll();
  }, [id, user]);

  async function refreshAvis() {
    try {
      const res = await api.get('/enseignants/' + id + '/avis');
      setAvis(res.data || []);
    } catch (e) {}
  }

  async function handleEnvoyerAvis() {
    if (note === 0) { setAvisError('Veuillez choisir une note.'); return; }
    if (commentaire.trim().length < 10) { setAvisError('Commentaire trop court (min 10 caracteres).'); return; }
    setSendingAvis(true); setAvisError('');
    try {
      await api.post('/avis', {
        note,
        commentaire,
        id_enseignant: id,
        id_reservation: idReservationAvis,
      });
      setAvisSuccess(true);
      setPeutNoter(false);
      setShowAvisForm(false);
      setNote(0);
      setCommentaire('');
      await refreshAvis();
      setTimeout(() => setAvisSuccess(false), 3000);
    } catch (e) {
      setAvisError(e.response?.data?.message || "Erreur lors de l'envoi de l'avis.");
    } finally {
      setSendingAvis(false);
    }
  }

  async function handleSignaler() {
    if (!user) { navigate('/login'); return; }
    const motif = window.prompt("Pourquoi voulez-vous signaler ce professeur ? (minimum 10 caracteres)");
    if (!motif || motif.trim().length < 10) return;
    if (avis.length === 0) { alert("Aucun avis disponible a signaler pour ce professeur."); return; }
    try {
      await api.post('/signalements', { motif, id_avis: avis[0].id_avis });
      alert('Signalement envoye, notre equipe va verifier.');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du signalement.');
    }
  }

  function handleReserverClick() {
    if (!user) { navigate('/login'); return; }
    if (!selectedCreneau) { setError('Veuillez choisir un creneau.'); return; }
    if (!selectedDate) { setError('Veuillez choisir une date.'); return; }
    setError('');
    setShowPaymentModal(true);
  }

  async function handlePaymentConfirmed() {
    setReserving(true);
    try {
      const res = await api.post('/reservations', { id_creneau: selectedCreneau, date: selectedDate, methode });
      setReservedInfo({ methode, reservation: res.data.reservation });
      setShowPaymentModal(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de la reservation.');
      setShowPaymentModal(false);
    } finally {
      setReserving(false);
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', border: '4px solid #e04f00', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!enseignant) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: muted }}>Professeur introuvable.</p>
    </div>
  );

  let photoSrc = 'https://ui-avatars.com/api/?background=e04f00&color=fff&name=' + (enseignant.user?.prenom || 'P');
  if (enseignant.user?.photo) {
    if (enseignant.user.photo.startsWith('http://') || enseignant.user.photo.startsWith('https://')) {
      photoSrc = enseignant.user.photo;
    } else {
      photoSrc = 'http://localhost:8000/storage/' + enseignant.user.photo;
    }
  }

  const disponibles = creneaux.filter(c => c.estDisponible);
  const montantEstime = enseignant.tarifHeure || 0;

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

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
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(enseignant.noteMoyenne) ? '#f59e0b' : 'transparent'} color={s <= Math.round(enseignant.noteMoyenne) ? '#f59e0b' : '#d1d5db'} />
                ))}
                <span style={{ fontSize: '0.8rem', color: muted }}>{enseignant.noteMoyenne} / 5 ({avis.length} avis)</span>
              </div>
            )}
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: text }}>{enseignant.tarifHeure} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: muted }}>MAD/h</span></div>
          </div>

          {/* ✅ Boutons : Laisser un avis + Signaler */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
            {user?.role === 'etudiant' && peutNoter && (
              <button onClick={() => setShowAvisForm(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #f59e0b', background: showAvisForm ? '#f59e0b' : 'rgba(245,158,11,0.08)', color: showAvisForm ? '#fff' : '#d97706', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                <Star size={14} fill={showAvisForm ? '#fff' : 'none'} /> {showAvisForm ? 'Fermer' : 'Laisser un avis'}
              </button>
            )}
            <button onClick={handleSignaler} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
              <Flag size={14} /> Signaler
            </button>
          </div>
        </div>

        {/* ✅ NOUVEAU : Formulaire d'avis fonctionnel (sans erreur id_reservation) */}
        {showAvisForm && (
          <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: text, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={16} color="#f59e0b" /> Laisser un avis
            </h3>

            {avisError && (
              <div style={{ padding: '10px 14px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                {avisError}
              </div>
            )}

            <label style={{ fontSize: '0.7rem', color: muted, fontWeight: 700, display: 'block', marginBottom: '8px' }}>Note *</label>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setNote(i)} onMouseEnter={() => setHoverNote(i)} onMouseLeave={() => setHoverNote(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                  <Star size={26} fill={(hoverNote || note) >= i ? '#f59e0b' : 'transparent'} color={(hoverNote || note) >= i ? '#f59e0b' : '#d1d5db'} />
                </button>
              ))}
              <span style={{ alignSelf: 'center', marginLeft: '8px', fontSize: '0.8rem', color: muted, fontWeight: 700 }}>{note}/5</span>
            </div>

            <label style={{ fontSize: '0.7rem', color: muted, fontWeight: 700, display: 'block', marginBottom: '8px' }}>Commentaire *</label>
            <textarea value={commentaire} onChange={e => setCommentaire(e.target.value.slice(0, 500))} rows={3} placeholder="Decrivez votre experience avec ce professeur..." style={{ width: '100%', background: inputBg, border: '1px solid ' + border, color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: '6px' }} />
            <div style={{ fontSize: '0.65rem', color: muted, textAlign: 'right', marginBottom: '1rem' }}>{commentaire.length}/500 caracteres</div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setShowAvisForm(false)} style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid ' + border, background: 'transparent', color: muted, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                Annuler
              </button>
              <button onClick={handleEnvoyerAvis} disabled={sendingAvis} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: sendingAvis ? '#e5e7eb' : '#e04f00', color: sendingAvis ? muted : '#fff', fontSize: '0.78rem', fontWeight: 800, cursor: sendingAvis ? 'not-allowed' : 'pointer' }}>
                <Star size={13} /> {sendingAvis ? 'Envoi...' : "Envoyer l'avis"}
              </button>
            </div>
          </div>
        )}

        {avisSuccess && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '14px', padding: '1rem 1.25rem', color: '#16a34a', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} /> Merci ! Votre avis a ete publie avec succes.
          </div>
        )}

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
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= a.note ? '#f59e0b' : 'transparent'} color={s <= a.note ? '#f59e0b' : '#d1d5db'} />)}
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
                              {c.jour} {c.heureDebut?.slice(0,5)}-{c.heureFin?.slice(0,5)}
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
                          Carte bancaire
                        </button>
                        <button onClick={() => setMethode('cash')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid ' + (methode === 'cash' ? '#e04f00' : border), background: methode === 'cash' ? 'rgba(224,79,0,0.08)' : inputBg, color: methode === 'cash' ? '#e04f00' : text, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                          Especes
                        </button>
                      </div>
                    </div>

                    <button onClick={handleReserverClick} disabled={reserving} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: reserving ? '#e5e7eb' : '#e04f00', color: reserving ? muted : '#fff', border: 'none', fontWeight: 800, fontSize: '0.78rem', cursor: reserving ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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
                {/* ✅ CORRIGE : les 3 modes d'enseignement s'affichent maintenant */}
                {enseignant.cours_enligne && (
                  <div style={{ fontSize: '0.78rem', color: muted, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Video size={14} color="#16a34a" /> Cours en ligne (Webcam)
                  </div>
                )}
                {enseignant.cours_domicile && (
                  <div style={{ fontSize: '0.78rem', color: muted, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HomeIcon size={14} color="#16a34a" /> Cours a domicile
                  </div>
                )}
                {enseignant.cours_deplacement && (
                  <div style={{ fontSize: '0.78rem', color: muted, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Navigation size={14} color="#16a34a" /> Cours en deplacement
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

      <PaymentSimulationModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirmed={handlePaymentConfirmed}
        montant={montantEstime}
        methode={methode}
        isDark={isDark}
      />

      <style>{`@media (max-width: 900px) { div[style*="1fr 380px"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}