import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { StudentNavigationActive } from './Dashboard';
import { Calendar, Trash2, Check, MessageCircle, Phone, Star, CheckCheck, Clock } from 'lucide-react';
import api from '../../api/axios';
import PaymentSimulationModal from '../../components/PaymentSimulationModal';

function AvisForm({ id_reservation, id_enseignant, isDark, text, muted, border, forceShow = false }) {
  const [note, setNote] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const [dejaNote, setDejaNote] = useState(false);
  const [avisExistant, setAvisExistant] = useState(null);
  const [checking, setChecking] = useState(!forceShow);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (forceShow) { setChecking(false); return; }
    async function checkAvis() {
      try {
        const res = await api.get('/enseignants/' + id_enseignant + '/peut-noter');
        const peutNoter = !!res.data?.peut_noter;
        const idResNoter = res.data?.id_reservation;
        if (!peutNoter) {
          setDejaNote(true);
          try {
            const avisRes = await api.get('/enseignants/' + id_enseignant + '/avis');
            const avis = (avisRes.data || []).find(a => a.id_reservation === id_reservation);
            if (avis) setAvisExistant(avis);
          } catch (e) {}
        } else if (idResNoter !== id_reservation) {
          setDejaNote(true);
          try {
            const avisRes = await api.get('/enseignants/' + id_enseignant + '/avis');
            const avis = (avisRes.data || []).find(a => a.id_reservation === id_reservation);
            if (avis) setAvisExistant(avis);
          } catch (e) {}
        }
      } catch (e) {}
      finally { setChecking(false); }
    }
    checkAvis();
  }, [id_reservation, id_enseignant, forceShow]);

  async function handleDelete() {
    if (!avisExistant) return;
    if (!window.confirm('Supprimer votre avis ?')) return;
    setDeleting(true);
    try {
      await api.delete('/avis/' + avisExistant.id_avis);
      setDejaNote(false); setAvisExistant(null); setDone(false); setNote(0); setCommentaire('');
    } catch (e) {
      setErr(e.response?.data?.message || 'Erreur lors de la suppression.');
    } finally { setDeleting(false); }
  }

  async function handleSubmit() {
    if (note === 0) { setErr('Veuillez choisir une note.'); return; }
    if (commentaire.length < 10) { setErr('Commentaire trop court (min 10 caracteres).'); return; }
    setSending(true); setErr('');
    try {
      const res = await api.post('/avis', { note, commentaire, id_enseignant, id_reservation });
      setDone(true);
      setAvisExistant(res.data.avis || null);
      setDejaNote(true);
    } catch (e) {
      const msg = e.response?.data?.message || 'Erreur lors de la publication.';
      if (msg.toLowerCase().includes('deja')) { setDejaNote(true); }
      else { setErr(msg); }
    } finally { setSending(false); }
  }

  if (checking) return (
    <div style={{ marginTop: '12px', padding: '10px 14px', fontSize: '0.72rem', color: muted }}>Vérification...</div>
  );

  if (dejaNote && !done) return (
    <div style={{ marginTop: '12px', padding: '12px 14px', background: isDark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={13} fill="#16a34a" color="#16a34a" />
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>Vous avez déjà laissé un avis pour ce cours.</span>
          </div>
          {avisExistant && (
            <>
              <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= avisExistant.note ? '#f59e0b' : 'transparent'} color={i <= avisExistant.note ? '#f59e0b' : '#d1d5db'} />)}
              </div>
              <p style={{ fontSize: '0.75rem', color: muted, margin: '4px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>"{avisExistant.commentaire}"</p>
            </>
          )}
        </div>
        {avisExistant && (
          <button onClick={handleDelete} disabled={deleting}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '7px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.65rem', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}>
            <Trash2 size={11} /> {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
        )}
      </div>
      {err && <p style={{ fontSize: '0.7rem', color: '#dc2626', margin: '8px 0 0', fontWeight: 700 }}>{err}</p>}
    </div>
  );

  if (done) return (
    <div style={{ marginTop: '12px', padding: '12px 14px', background: isDark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={13} fill="#16a34a" color="#16a34a" />
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>Avis publié avec succès !</span>
          </div>
          <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= note ? '#f59e0b' : 'transparent'} color={i <= note ? '#f59e0b' : '#d1d5db'} />)}
          </div>
          <p style={{ fontSize: '0.75rem', color: muted, margin: '4px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>"{commentaire}"</p>
        </div>
        {avisExistant && (
          <button onClick={handleDelete} disabled={deleting}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '7px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.65rem', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}>
            <Trash2 size={11} /> {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: '12px', padding: '12px 14px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb', border: '1px solid ' + border, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '0.6rem', color: muted, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Laisser un avis</div>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1,2,3,4,5].map(i => (
          <button key={i} onClick={() => setNote(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
            <Star size={20} fill={(hover || note) >= i ? '#f59e0b' : 'transparent'} color={(hover || note) >= i ? '#f59e0b' : '#d1d5db'} />
          </button>
        ))}
      </div>
      <textarea
        value={commentaire}
        onChange={e => setCommentaire(e.target.value)}
        placeholder="Décrivez votre expérience avec ce professeur..."
        rows={2}
        style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + border, color: text, borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}
      />
      {err && <p style={{ fontSize: '0.7rem', color: '#dc2626', margin: 0, fontWeight: 700 }}>{err}</p>}
      <button onClick={handleSubmit} disabled={sending}
        style={{ alignSelf: 'flex-end', padding: '7px 16px', borderRadius: '8px', background: sending ? (isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb') : '#e04f00', color: sending ? muted : '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 800, cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}>
        {sending ? 'Envoi...' : 'Publier'}
      </button>
    </div>
  );
}

export default function StudentReservations() {
  const navigate = useNavigate();
  const context = useOutletContext?.() || {};
  const isDark = context?.isDark || false;

  const bg     = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#9ca3af' : '#6b7280';

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [terminingId, setTerminingId] = useState(null);
  const [justTermineIds, setJustTermineIds] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await api.get('/reservations');
        const sorted = (res.data || []).sort((a, b) => {
          const dateA = new Date(a.created_at || a.date);
          const dateB = new Date(b.created_at || b.date);
          return dateB - dateA;
        });
        setReservations(sorted);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchReservations();
  }, []);

  async function handleCancel(id) {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) return;
    try {
      await api.delete('/reservations/' + id);
      setReservations(prev => prev.filter(r => r.id_reservation !== id));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  }

  function peutTerminer(reservation) {
    if (!reservation) return false;
    if (reservation.statut === 'terminee') return false;
    if (reservation.statut !== 'confirmee') return false;
    const heureFin = reservation.creneau?.heureFin;
    if (!heureFin) return false;
    const [heures, minutes] = heureFin.split(':');
    const maintenant = new Date();
    const heureActuelle = maintenant.getHours() * 60 + maintenant.getMinutes();
    const heureFinMinutes = parseInt(heures) * 60 + parseInt(minutes);
    return heureActuelle >= heureFinMinutes;
  }

  function getHeureFinMessage(reservation) {
    const heureFin = reservation.creneau?.heureFin;
    const dateRes  = reservation.date;
    if (!heureFin || !dateRes) return '';
    const dateObj = new Date(dateRes);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatted = dateObj.toLocaleDateString('fr-FR', options);
    return `Disponible à partir du ${dateFormatted} à ${heureFin.slice(0,5)}`;
  }

  async function handleTerminer(id) {
    const reservation = reservations.find(r => r.id_reservation === id);
    if (!peutTerminer(reservation)) {
      alert("Ce cours ne peut pas encore être terminé. Attendez l'heure de fin de la séance.");
      return;
    }
    if (!window.confirm('Confirmer la fin de ce cours ?')) return;
    setTerminingId(id);
    try {
      await api.put('/reservations/' + id + '/terminer');
      setReservations(prev => prev.map(r => r.id_reservation === id ? { ...r, statut: 'terminee' } : r));
      setJustTermineIds(prev => new Set([...prev, id]));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la clôture du cours.');
    } finally { setTerminingId(null); }
  }

  function openPaiement(r) {
    if (isProcessing) return;
    setPaymentTarget({
      id_reservation: r.id_reservation,
      montant: parseFloat(r.montant) || 0,
      methode: 'simulation',
    });
  }

  // ✅ CORRIGÉ : avec isProcessing pour éviter doubles appels
  async function handlePaiementConfirme() {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const id = paymentTarget.id_reservation;
    try {
      await api.put('/reservations/' + id + '/paiement');
      setReservations(prev => prev.map(r =>
        r.id_reservation === id ? { ...r, statut: 'paiement_recu' } : r
      ));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur.');
    } finally {
      setPaymentTarget(null);
      setIsProcessing(false);
    }
  }

  function handleContacter(reservation) {
    navigate('/student/messages', { 
      state: { 
        reservationId: reservation.id_reservation,
        enseignantId: reservation.creneau?.id_enseignant 
      } 
    });
  }

  function getStatutStyle(statut) {
    if (statut === 'confirmee')     return { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   color: '#16a34a', label: 'CONFIRMÉE' };
    if (statut === 'en_attente')    return { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  color: '#d97706', label: 'EN ATTENTE' };
    if (statut === 'paiement_recu') return { bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.2)',  color: '#a855f7', label: 'PAIEMENT REÇU' };
    if (statut === 'annulee')       return { bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.15)',  color: '#dc2626', label: 'ANNULÉE' };
    if (statut === 'terminee')      return { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', color: '#2563eb', label: 'TERMINÉE' };
    return { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)', color: '#6b7280', label: statut };
  }

  function getJourFrancais(jour) {
    if (!jour) return '';
    return jour.charAt(0).toUpperCase() + jour.slice(1);
  }

  function getWhatsapp(r) {
    return r.creneau?.enseignant?.user?.telephone || r.creneau?.enseignant?.telephone || null;
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: '1px solid ' + border, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Mes Réservations de Cours</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Suivez l'historique complet et visualisez l'état de vos réservations.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <StudentNavigationActive activeTab="reservations" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div style={{ background: bgSurf, border: '1px solid ' + border, borderRadius: '12px', padding: '1rem 1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, fontFamily: 'monospace' }}>
                1ère heure de diagnostic toujours gratuite
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
            ) : reservations.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: bgCard, border: '1px solid ' + border, borderRadius: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={24} color="#e04f00" />
                </div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: text, fontFamily: 'monospace', textTransform: 'uppercase', margin: 0 }}>Aucune réservation active</h3>
                <p style={{ fontSize: '0.78rem', color: muted, margin: 0 }}>Découvrez nos tuteurs certifiés et réservez votre premier cours diagnostic gratuit.</p>
                <Link to="/teachers" style={{ background: isDark ? '#ffffff' : '#111827', color: isDark ? '#111827' : '#ffffff', padding: '10px 20px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none', fontFamily: 'monospace' }}>
                  Découvrir les professeurs
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reservations.map(r => {
                  const statut        = getStatutStyle(r.statut);
                  const idEnseignant  = r.creneau?.enseignant?.utilisateur_id || r.creneau?.id_enseignant;
                  const isTermining   = terminingId === r.id_reservation;
                  const isJustTermine = justTermineIds.has(r.id_reservation);
                  const canTerminer   = peutTerminer(r);
                  const heureFinMsg   = getHeureFinMessage(r);
                  const jourFrancais  = getJourFrancais(r.creneau?.jour);
                  const montantNum    = parseFloat(r.montant);
                  const isGratuit     = !montantNum || montantNum === 0;
                  const whatsapp      = getWhatsapp(r);
                  const whatsappNum   = whatsapp ? whatsapp.replace(/[^0-9]/g, '') : null;

                  return (
                    <div key={r.id_reservation}
                      style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.25rem 1.5rem' }}>

                      {/* ===== LIGNE PRINCIPALE ===== */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: text }}>
                            {r.creneau?.enseignant?.user?.prenom} {r.creneau?.enseignant?.user?.nom}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: muted, fontFamily: 'monospace' }}>
                            {jourFrancais} — {r.creneau?.heureDebut?.slice(0,5)} à {r.creneau?.heureFin?.slice(0,5)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: muted }}>
                            Le {r.date} —{' '}
                            <span style={{ color: '#16a34a', fontWeight: 700 }}>
                              {isGratuit ? '1er cours GRATUIT' : r.montant + ' DH'}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flexShrink: 0 }}>

                          {/* BADGE STATUT */}
                          <span style={{ fontSize: '0.62rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, fontFamily: 'monospace', background: statut.bg, border: '1px solid ' + statut.border, color: statut.color }}>
                            {statut.label}
                          </span>

                          {/* ===== EN_ATTENTE : bouton payer ===== */}
                          {r.statut === 'en_attente' && (
                            <button onClick={() => openPaiement(r)} disabled={isProcessing}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700, cursor: isProcessing ? 'not-allowed' : 'pointer' }}>
                              <Check size={13} /> Confirmer le paiement
                            </button>
                          )}

                          {/* ===== CONFIRMEE : WhatsApp + Contacter + Terminer ===== */}
                          {r.statut === 'confirmee' && whatsappNum && (
                            <a href={'https://wa.me/' + whatsappNum} target="_blank" rel="noopener noreferrer"
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(37,211,102,0.3)', background: 'rgba(37,211,102,0.08)', color: '#25d366', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                              <Phone size={13} /> {whatsapp}
                            </a>
                          )}

                          {r.statut === 'confirmee' && (
                            <button onClick={() => handleContacter(r)}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(224,79,0,0.3)', background: 'rgba(224,79,0,0.08)', color: '#e04f00', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                              <MessageCircle size={13} /> Contacter
                            </button>
                          )}

                          {r.statut === 'confirmee' && canTerminer && (
                            <button onClick={() => handleTerminer(r.id_reservation)} disabled={isTermining}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.3)', background: isTermining ? (isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9') : 'rgba(59,130,246,0.08)', color: isTermining ? muted : '#2563eb', fontSize: '0.72rem', fontWeight: 700, cursor: isTermining ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}>
                              <CheckCheck size={13} /> {isTermining ? 'En cours...' : 'Terminer le cours'}
                            </button>
                          )}

                          {r.statut === 'confirmee' && !canTerminer && (
                            <span style={{ fontSize: '0.65rem', color: '#d97706', fontStyle: 'italic', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> {heureFinMsg}
                            </span>
                          )}

                          {/* Bouton annuler */}
                          {(r.statut === 'en_attente' || r.statut === 'confirmee' || r.statut === 'paiement_recu') && (
                            <button onClick={() => handleCancel(r.id_reservation)}
                              style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', cursor: 'pointer' }}>
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* ===== MESSAGE PAIEMENT_RECU ===== */}
                      {r.statut === 'paiement_recu' && (
                        <div style={{ 
                          marginTop: '14px', 
                          padding: '16px 20px', 
                          background: isDark ? 'rgba(168,85,247,0.08)' : 'rgba(168,85,247,0.05)', 
                          border: '1px solid rgba(168,85,247,0.25)', 
                          borderRadius: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: '#a855f7'
                          }}>
                            <Check size={18} color="#a855f7" />
                            RÉSERVATION & PAIEMENT CONFIRMÉS
                          </div>
                          <div style={{ 
                            fontSize: '0.78rem', 
                            color: muted, 
                            lineHeight: 1.6,
                            paddingLeft: '28px'
                          }}>
                            Votre réservation est en attente de confirmation du professeur.
                            Le professeur va accepter ou refuser votre demande. La messagerie sera activée après confirmation.
                          </div>
                        </div>
                      )}

                      {/* ===== AVIS FORM SI TERMINEE ===== */}
                      {r.statut === 'terminee' && idEnseignant && (
                        <AvisForm
                          id_reservation={r.id_reservation}
                          id_enseignant={idEnseignant}
                          isDark={isDark}
                          text={text}
                          muted={muted}
                          border={border}
                          forceShow={isJustTermine}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ UN SEUL MODAL AVEC onClose NETTOYÉ */}
      <PaymentSimulationModal
        open={!!paymentTarget && !isProcessing}
        onClose={() => {
          setPaymentTarget(null);
          setIsProcessing(false);
        }}
        onConfirmed={handlePaiementConfirme}
        montant={paymentTarget?.montant || 0}
        methode={paymentTarget?.methode || 'simulation'}
        isDark={isDark}
      />
    </div>
  );
}