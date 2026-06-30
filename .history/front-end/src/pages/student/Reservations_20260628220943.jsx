import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { StudentNavigationActive } from './Dashboard';
import { Calendar, Trash2, Check, MessageCircle, Phone, Star, CheckCheck } from 'lucide-react';
import api from '../../api/axios';
import PaymentSimulationModal from '../../components/PaymentSimulationModal';

function AvisForm({ id_reservation, id_enseignant, isDark, text, muted, border, forceShow = false }) {
  const [note, setNote]                 = useState(0);
  const [hover, setHover]               = useState(0);
  const [commentaire, setCommentaire]   = useState('');
  const [sending, setSending]           = useState(false);
  const [done, setDone]                 = useState(false);
  const [err, setErr]                   = useState('');
  const [dejaNote, setDejaNote]         = useState(false);
  const [avisExistant, setAvisExistant] = useState(null);
  const [checking, setChecking]         = useState(!forceShow);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => {
    if (forceShow) {
      setChecking(false);
      return;
    }
    async function checkAvis() {
      try {
        const res = await api.get('/enseignants/' + id_enseignant + '/peut-noter');
        const peutNoter  = !!res.data?.peut_noter;
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
      setDejaNote(false);
      setAvisExistant(null);
      setDone(false);
      setNote(0);
      setCommentaire('');
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
      if (msg.toLowerCase().includes('deja')) {
        setDejaNote(true);
      } else {
        setErr(msg);
      }
    } finally { setSending(false); }
  }

  if (checking) return (
    <div style={{ marginTop: '12px', padding: '10px 14px', fontSize: '0.72rem', color: muted }}>
      Verification...
    </div>
  );

  if (dejaNote && !done) return (
    <div style={{ marginTop: '12px', padding: '12px 14px', background: isDark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={13} fill="#16a34a" color="#16a34a" />
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
              Vous avez deja laisse un avis pour ce cours.
            </span>
          </div>
          {avisExistant && (
            <>
              <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} fill={i <= avisExistant.note ? '#f59e0b' : 'transparent'} color={i <= avisExistant.note ? '#f59e0b' : '#d1d5db'} />
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: muted, margin: '4px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{avisExistant.commentaire}"
              </p>
            </>
          )}
        </div>
        {avisExistant && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '7px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.65rem', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}
          >
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
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
              Avis publie avec succes !
            </span>
          </div>
          <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={14} fill={i <= note ? '#f59e0b' : 'transparent'} color={i <= note ? '#f59e0b' : '#d1d5db'} />
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: muted, margin: '4px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{commentaire}"
          </p>
        </div>
        {avisExistant && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '7px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.65rem', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}
          >
            <Trash2 size={11} /> {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: '12px', padding: '12px 14px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb', border: '1px solid ' + border, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '0.6rem', color: muted, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Laisser un avis
      </div>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1,2,3,4,5].map(i => (
          <button key={i} onClick={() => setNote(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
            <Star size={20} fill={(hover || note) >= i ? '#f59e0b' : 'transparent'} color={(hover || note) >= i ? '#f59e0b' : '#d1d5db'} />
          </button>
        ))}
      </div>
      <textarea
        value={commentaire}
        onChange={e => setCommentaire(e.target.value)}
        placeholder="Decrivez votre experience avec ce professeur..."
        rows={2}
        style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + border, color: text, borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}
      />
      {err && <p style={{ fontSize: '0.7rem', color: '#dc2626', margin: 0, fontWeight: 700 }}>{err}</p>}
      <button
        onClick={handleSubmit}
        disabled={sending}
        style={{ alignSelf: 'flex-end', padding: '7px 16px', borderRadius: '8px', background: sending ? (isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb') : '#e04f00', color: sending ? muted : '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 800, cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}
      >
        {sending ? 'Envoi...' : 'Publier'}
      </button>
    </div>
  );
}

export default function StudentReservations() {
  const navigate  = useNavigate();
  const context   = useOutletContext?.() || {};
  const isDark    = context?.isDark || false;

  const bg     = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#9ca3af' : '#6b7280';

  const [reservations, setReservations]     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [confirmedInfo, setConfirmedInfo]   = useState(null);
  const [paymentTarget, setPaymentTarget]   = useState(null);
  const [terminingId, setTerminingId]       = useState(null);
  const [justTermineIds, setJustTermineIds] = useState(new Set());

  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await api.get('/reservations');
        setReservations(res.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchReservations();
  }, []);

  async function handleCancel(id) {
    if (!window.confirm('Voulez-vous vraiment annuler cette reservation ?')) return;
    try {
      await api.delete('/reservations/' + id);
      setReservations(prev => prev.filter(r => r.id_reservation !== id));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  }

  async function handleTerminer(id) {
    if (!window.confirm('Confirmer la fin de ce cours ?')) return;
    setTerminingId(id);
    try {
      await api.put('/reservations/' + id + '/terminer');
      setReservations(prev =>
        prev.map(r => r.id_reservation === id ? { ...r, statut: 'terminee' } : r)
      );
      setJustTermineIds(prev => new Set([...prev, id]));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la cloture du cours.');
    } finally { setTerminingId(null); }
  }

  function openPaiement(r) {
    setPaymentTarget({
      id_reservation: r.id_reservation,
      montant: r.montant,
      methode: r.montant === 0 || r.montant === '0.00' ? 'cash' : 'simulation',
    });
  }

  async function handlePaiementConfirme() {
    const id = paymentTarget.id_reservation;
    try {
      const res = await api.put('/reservations/' + id + '/paiement');
      setReservations(prev =>
        prev.map(r => r.id_reservation === id ? { ...r, statut: 'confirmee' } : r)
      );
      setConfirmedInfo({
        id_reservation: id,
        whatsapp: res.data.whatsapp,
        methode: res.data.methode,
        montant: res.data.montant,
      });
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
    finally { setPaymentTarget(null); }
  }

  function handleContacter(reservation) {
    navigate('/student/messages', { state: { reservationId: reservation.id_reservation } });
  }

  function getStatutStyle(statut) {
    if (statut === 'confirmee')  return { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   color: '#16a34a', label: 'CONFIRME'   };
    if (statut === 'en_attente') return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', color: '#d97706', label: 'EN ATTENTE' };
    if (statut === 'annulee')    return { bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.15)', color: '#dc2626', label: 'ANNULE'     };
    if (statut === 'terminee')   return { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)',color: '#2563eb', label: 'TERMINE'    };
    return { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)', color: '#6b7280', label: statut };
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: '1px solid ' + border, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Mes Reservations de Cours</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Suivez l'historique complet et visualisez l'etat de vos reservations.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <StudentNavigationActive activeTab="reservations" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {confirmedInfo && (() => {
              const whatsappNum = confirmedInfo.whatsapp ? confirmedInfo.whatsapp.replace(/[^0-9]/g, '') : '';
              return (
                <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: '#16a34a', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>✓ RESERVATION CONFIRMEE</div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: text, margin: '0 0 4px' }}>Felicitations ! Votre cours est confirme.</p>
                    <p style={{ fontSize: '0.75rem', color: muted, margin: 0 }}>
                      {confirmedInfo.methode === 'cash'
                        ? 'Payez ' + confirmedInfo.montant + ' en especes lors du cours.'
                        : 'Paiement par carte de ' + confirmedInfo.montant + ' confirme.'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {whatsappNum && (
                      <a href={'https://wa.me/' + whatsappNum} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: '#25d366', color: '#fff', fontSize: '0.75rem', fontWeight: 800, textDecoration: 'none', fontFamily: 'monospace' }}>
                        <Phone size={14} /> WhatsApp Prof
                      </a>
                    )}
                    <button
                      onClick={() => navigate('/student/messages', { state: { reservationId: confirmedInfo.id_reservation } })}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.25)', color: '#e04f00', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace' }}>
                      <MessageCircle size={14} /> Contacter le prof
                    </button>
                    <button onClick={() => setConfirmedInfo(null)} style={{ padding: '9px 12px', borderRadius: '10px', background: 'transparent', border: '1px solid ' + border, color: muted, fontSize: '0.75rem', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              );
            })()}

            <div style={{ background: bgSurf, border: '1px solid ' + border, borderRadius: '12px', padding: '1rem 1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, fontFamily: 'monospace' }}>
                1ere heure de diagnostic toujours gratuite
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
            ) : reservations.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: bgCard, border: '1px solid ' + border, borderRadius: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={24} color="#e04f00" />
                </div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: text, fontFamily: 'monospace', textTransform: 'uppercase', margin: 0 }}>Aucune reservation active</h3>
                <p style={{ fontSize: '0.78rem', color: muted, margin: 0 }}>Decouvrez nos tuteurs certifies et reservez votre premier cours diagnostic gratuit.</p>
                <Link to="/teachers" style={{ background: isDark ? '#ffffff' : '#111827', color: isDark ? '#111827' : '#ffffff', padding: '10px 20px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none', fontFamily: 'monospace' }}>
                  Decouvrir les professeurs
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reservations.map(r => {
                  const statut          = getStatutStyle(r.statut);
                  const isJustConfirmed = confirmedInfo?.id_reservation === r.id_reservation;
                  const idEnseignant    = r.creneau?.enseignant?.utilisateur_id || r.creneau?.id_enseignant;
                  const isTermining     = terminingId === r.id_reservation;
                  const isJustTermine   = justTermineIds.has(r.id_reservation);

                  return (
                    <div
                      key={r.id_reservation}
                      style={{ background: bgCard, border: '1px solid ' + (isJustConfirmed ? 'rgba(34,197,94,0.3)' : border), borderRadius: '16px', padding: '1.25rem 1.5rem', transition: 'border 0.3s' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: text }}>
                            {r.creneau?.enseignant?.user?.prenom} {r.creneau?.enseignant?.user?.nom}
                          </div>
                          <div style={{ fontSize: