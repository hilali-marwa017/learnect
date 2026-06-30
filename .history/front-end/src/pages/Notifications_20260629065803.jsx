import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, MessageSquare, CreditCard, Star, Calendar, Tag, BookOpen, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import api from '../api/axios';

const ICONS = { message: MessageSquare, paiement: CreditCard, avis: Star, reservation: Calendar, offre: Tag, cours: BookOpen };
const COLORS = { message: '#3b82f6', paiement: '#10b981', avis: '#f59e0b', reservation: '#e04f00', offre: '#8b5cf6', cours: '#06b6d4' };

const getIcon = t => { const I = ICONS[t] || Bell; return <I size={16} />; };
const getColor = t => COLORS[t] || '#6b7280';

export default function Notifications() {
  const navigate = useNavigate();
  const ctx = useOutletContext();
  const dark = ctx?.isDark || false;
  const bg = dark ? '#0a0a0c' : '#ffffff', bgCard = dark ? '#1a1a1c' : '#ffffff', border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', text = dark ? '#ffffff' : '#111827', muted = dark ? '#9ca3af' : '#6b7280';
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { api.get('/notifications').then(r => setNotifs(r.data || [])).catch(console.error).finally(() => setLoading(false)); }, []);

  const markRead = async id => { try { await api.put('/notifications/' + id + '/read'); setNotifs(p => p.map(n => n.id_notification === id ? { ...n, est_lue: true } : n)); } catch (e) { console.error(e); } };
  const markAllRead = async () => { try { await api.put('/notifications/read-all'); setNotifs(p => p.map(n => ({ ...n, est_lue: true }))); } catch (e) { console.error(e); } };
  const del = async id => { try { await api.delete('/notifications/' + id); setNotifs(p => p.filter(n => n.id_notification !== id)); } catch (e) { console.error(e); } };

  // ✅ Extraire l'ID de réservation du contenu de la notification
  const extractReservationId = (contenu) => {
    const match = contenu.match(/réservation du (\d{4}-\d{2}-\d{2})/);
    if (match) {
      // Chercher dans les notifications stockées
      return null; // On utilisera l'ID stocké dans la notification si disponible
    }
    return null;
  };

  // ✅ Accepter une réservation depuis la notification
  const handleAccepter = async (notification) => {
    // Extraire l'ID de réservation du contenu ou utiliser un champ personnalisé
    // Si tu as ajouté un champ id_reservation dans la table notifications
    const reservationId = notification.id_reservation;
    if (!reservationId) {
      alert('Impossible de trouver la réservation associée.');
      return;
    }
    
    setActionLoading(notification.id_notification + '_accepter');
    try {
      await api.put('/reservations/' + reservationId + '/accepter');
      // Marquer la notification comme lue
      await api.put('/notifications/' + notification.id_notification + '/read');
      setNotifs(p => p.map(n => 
        n.id_notification === notification.id_notification ? { ...n, est_lue: true } : n
      ));
      alert('✅ Réservation acceptée avec succès !');
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de l\'acceptation.');
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Refuser une réservation depuis la notification
  const handleRefuser = async (notification) => {
    const reservationId = notification.id_reservation;
    if (!reservationId) {
      alert('Impossible de trouver la réservation associée.');
      return;
    }
    
    if (!window.confirm('Refuser cette réservation ? Le paiement de l\'étudiant sera remboursé.')) return;
    
    setActionLoading(notification.id_notification + '_refuser');
    try {
      await api.put('/reservations/' + reservationId + '/refuser');
      await api.put('/notifications/' + notification.id_notification + '/read');
      setNotifs(p => p.map(n => 
        n.id_notification === notification.id_notification ? { ...n, est_lue: true } : n
      ));
      alert('✅ Réservation refusée. Remboursement initié.');
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors du refus.');
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Vérifier si c'est une notification de paiement en attente
  const isPaiementNotification = (n) => {
    return n.type === 'paiement' && 
           n.contenu.includes('Veuillez accepter ou refuser la réservation');
  };

  const unread = notifs.filter(n => !n.est_lue).length;

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: text, cursor: 'pointer', padding: '8px 4px', fontSize: '0.85rem', fontWeight: 600, width: 'fit-content' }}><ArrowLeft size={20} /> Retour</button>
        <div style={{ borderBottom: '1px solid ' + border, paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: 0, letterSpacing: '-0.02em' }}>Notifications</h1>
            {unread > 0 && <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.25)', color: '#e04f00', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace' }}><CheckCheck size={14} /> Tout marquer comme lu</button>}
          </div>
        </div>
        {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: muted }}>Chargement...</div> : notifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: bgCard, border: '1px solid ' + border, borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={24} color="#e04f00" /></div>
            <p style={{ fontSize: '0.85rem', color: muted, margin: 0 }}>Aucune notification pour le moment</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifs.map(n => {
              const c = getColor(n.type);
              const isPaiement = isPaiementNotification(n);
              const isLoading = actionLoading === n.id_notification + '_accepter' || actionLoading === n.id_notification + '_refuser';
              
              return (
                <div key={n.id_notification} style={{ 
                  background: n.est_lue ? bgCard : (dark ? 'rgba(224,79,0,0.04)' : 'rgba(224,79,0,0.03)'), 
                  border: '1px solid ' + (n.est_lue ? border : 'rgba(224,79,0,0.15)'), 
                  borderRadius: '14px', 
                  padding: '1rem 1.25rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: c + '15', border: '1px solid ' + c + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: c }}>{getIcon(n.type)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.82rem', color: text, fontWeight: n.est_lue ? 400 : 700, margin: '0 0 4px', lineHeight: 1.5 }}>{n.contenu}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.62rem', color: c, fontWeight: 700, fontFamily: 'monospace', background: c + '15', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{n.type}</span>
                        <span style={{ fontSize: '0.65rem', color: muted }}>{new Date(n.created_at).toLocaleString('fr-FR')}</span>
                        {!n.est_lue && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#e04f00', display: 'inline-block' }} />}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      {!n.est_lue && <button onClick={() => markRead(n.id_notification)} style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#16a34a', cursor: 'pointer' }}><Check size={13} /></button>}
                      <button onClick={() => del(n.id_notification)} style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={13} /></button>
                    </div>
                  </div>

                  {/* ✅ BOUTONS ACCEPTER / REFUSER - UNIQUEMENT pour paiement_recu */}
                  {isPaiement && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid ' + border }}>
                      <button
                        onClick={() => handleRefuser(n)}
                        disabled={!!isLoading}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.08)', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}
                      >
                        <XCircle size={13} />
                        {actionLoading === n.id_notification + '_refuser' ? 'En cours...' : 'Refuser'}
                      </button>
                      <button
                        onClick={() => handleAccepter(n)}
                        disabled={!!isLoading}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.1)', color: '#16a34a', fontSize: '0.72rem', fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}
                      >
                        <CheckCircle2 size={13} />
                        {actionLoading === n.id_notification + '_accepter' ? 'En cours...' : 'Accepter'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}