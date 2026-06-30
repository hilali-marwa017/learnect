import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { StudentNavigationActive } from './Dashboard';
import { Calendar, Trash2, Check, Clock, X } from 'lucide-react';
import api from '../../api/axios';

export default function StudentReservations() {
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  const bg       = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard   = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf   = isDark ? '#1a1a1c' : '#f8f9fc';
  const border   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub= isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text     = isDark ? '#ffffff' : '#111827';
  const muted    = isDark ? '#9ca3af' : '#6b7280';

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);

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
      await api.delete(`/reservations/${id}`);
      setReservations(prev => prev.filter(r => r.id_reservation !== id));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  }

  async function handleConfirm(id) {
    try {
      const res = await api.put(`/reservations/${id}/paiement`);
      setReservations(prev => prev.map(r => r.id_reservation === id ? { ...r, statut: 'confirmee' } : r));
      alert(res.data?.message || 'Reservation confirmee !');
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  }

  const getStatutStyle = (statut) => {
    if (statut === 'confirmee')  return { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   color: '#16a34a', label: 'CONFIRME' };
    if (statut === 'en_attente') return { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  color: '#d97706', label: 'EN ATTENTE' };
    if (statut === 'annulee')    return { bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.15)',  color: '#dc2626', label: 'ANNULEE' };
    if (statut === 'terminee')   return { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', color: '#2563eb', label: 'TERMINEE' };
    return { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)', color: '#6b7280', label: statut };
  };

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Mes Reservations de Cours</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Suivez l'historique complet et visualisez l'etat de vos reservations.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <StudentNavigationActive activeTab="reservations" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div style={{ background: bgSurf, border: `1px solid ${border}`, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: muted, fontFamily: 'monospace', fontWeight: 700 }}>
                LISTE CHRONOLOGIQUE ({reservations.length} SEANCES)
              </span>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, fontFamily: 'monospace' }}>
                1ere heure de diagnostic toujours gratuite
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
            ) : reservations.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: bgCard, border: `1px solid ${border}`, borderRadius: '20px' }}>
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
                  const statut = getStatutStyle(r.statut);
                  return (
                    <div key={r.id_reservation} style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: text }}>
                          {r.creneau?.enseignant?.user?.prenom} {r.creneau?.enseignant?.user?.nom}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: muted, fontFamily: 'monospace' }}>
                          {r.creneau?.jour} — {r.creneau?.heureDebut?.slice(0,5)} a {r.creneau?.heureFin?.slice(0,5)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: muted }}>
                          Le {r.date} — <span style={{ color: '#16a34a', fontWeight: 700 }}>{r.montant === 0 ? '1er cours GRATUIT' : `${r.montant} DH`}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.62rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, fontFamily: 'monospace', background: statut.bg, border: `1px solid ${statut.border}`, color: statut.color }}>
                          {statut.label}
                        </span>

                        {r.statut === 'en_attente' && (
                          <button onClick={() => handleConfirm(r.id_reservation)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                            <Check size={13} /> Confirmer
                          </button>
                        )}

                        {(r.statut === 'en_attente' || r.statut === 'confirmee') && (
                          <button onClick={() => handleCancel(r.id_reservation)} style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', cursor: 'pointer' }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}