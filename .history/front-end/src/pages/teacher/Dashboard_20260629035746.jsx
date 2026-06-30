import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  Calendar, DollarSign, Clock, Settings, Check, X,
  ShieldAlert, Star, MessageSquare, Sparkles, Bell,
  CreditCard, Banknote, TrendingUp
} from 'lucide-react';

export function TeacherNavigationActive({ activeTab, isDark }) {
  const bg     = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text   = isDark ? '#d1d5db' : '#374151';
  const muted  = isDark ? '#6b7280' : '#9ca3af';

  const [msgCount, setMsgCount]           = useState(0);
  const [demandesCount, setDemandesCount] = useState(0);
  const [notifCount, setNotifCount]       = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [msgRes, notifRes, demRes, offRes] = await Promise.all([
          api.get('/messages/non-lus'),
          api.get('/notifications/unread'),
          api.get('/demandes/disponibles'),
          api.get('/offres/mes-offres'),
        ]);
        setMsgCount(msgRes.data?.non_lus || 0);
        setNotifCount(notifRes.data?.count || 0);
        const demandes  = demRes.data || [];
        const mesOffres = offRes.data || [];
        const count = demandes.filter(d => !mesOffres.some(o => o.id_demande === d.id_demande)).length;
        setDemandesCount(count);
      } catch (e) {}
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // refresh toutes les 30s
    return () => clearInterval(interval);
  }, []);

  const links = [
    { label: 'Tableau de bord',    path: '/teacher',              icon: Clock,         id: 'dashboard'    },
    { label: 'Disponibilites',     path: '/teacher/availability', icon: Calendar,      id: 'availability' },
    { label: 'Demandes Etudiants', path: '/teacher/demandes',     icon: Sparkles,      id: 'demandes',    badge: demandesCount },
    { label: 'Mes Revenus',        path: '/teacher/earnings',     icon: DollarSign,    id: 'earnings'     },
    { label: 'Messages',           path: '/teacher/messages',     icon: MessageSquare, id: 'messages',    badge: msgCount },
    { label: 'Notifications',      path: '/teacher/notifications',icon: Bell,          id: 'notifications',badge: notifCount },
    { label: 'Modifier Profil',    path: '/teacher/profile',      icon: Settings,      id: 'profile'      },
  ];

  return (
    <div style={{ background: bg, border: '1px solid ' + border, borderRadius: '16px', padding: '1rem', width: '220px', flexShrink: 0 }}>
      <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: muted, fontWeight: 700, fontFamily: 'monospace', padding: '0 0.75rem 0.75rem', textTransform: 'uppercase' }}>Menu Enseignant</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {links.map(link => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <Link key={link.id} to={link.path} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: isActive ? 700 : 500, textDecoration: 'none', transition: 'all 0.15s', background: isActive ? '#e04f00' : 'transparent', color: isActive ? '#ffffff' : text }}>
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{link.label}</span>
              {link.badge > 0 && (
                <span style={{ minWidth: '18px', height: '18px', background: isActive ? 'rgba(255,255,255,0.3)' : '#e04f00', color: '#fff', borderRadius: '999px', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const context  = useOutletContext();
  const isDark   = context?.isDark || false;

  const bg        = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard    = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf    = isDark ? '#1a1a1c' : '#f8f9fc';
  const border    = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text      = isDark ? '#ffffff' : '#111827';
  const muted     = isDark ? '#9ca3af' : '#6b7280';

  const [stats, setStats]               = useState(null);
  const [reservations, setReservations] = useState([]);
  const [paiements, setPaiements]       = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeSection, setActiveSection] = useState('reservations'); // 'reservations' | 'paiements' | 'notifications'

  async function fetchAll() {
    try {
      const [dashRes, resRes, paiRes, notifRes] = await Promise.all([
        api.get('/enseignant/dashboard'),
        api.get('/enseignant/reservations'),
        api.get('/paiements/enseignant/revenus'),
        api.get('/notifications'),
      ]);

      setStats(dashRes.data.stats);

      const all = [];
      (resRes.data || []).forEach(creneau => {
        (creneau.reservations || []).forEach(r => {
          all.push({ ...r, creneau });
        });
      });
      // Trier : en_attente et confirmee en premier
      all.sort((a, b) => {
        const order = { en_attente: 0, confirmee: 1, terminee: 2, annulee: 3 };
        return (order[a.statut] ?? 9) - (order[b.statut] ?? 9);
      });
      setReservations(all);

      setPaiements(paiRes.data?.paiements || []);

      // Filtrer notifs de type paiement pour le teacher
      setNotifications((notifRes.data || []).filter(n => n.type === 'paiement' || n.type === 'reservation'));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000); // poll toutes les 30s
    return () => clearInterval(interval);
  }, []);

  async function handleAnnuler(id) {
    if (!window.confirm('Annuler cette reservation ?')) return;
    try {
      await api.delete('/reservations/' + id);
      setReservations(prev => prev.map(r => r.id_reservation === id ? { ...r, statut: 'annulee' } : r));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  }

  async function markNotifRead(id) {
    try {
      await api.put('/notifications/' + id + '/read');
      setNotifications(prev => prev.map(n => n.id_notification === id ? { ...n, est_lue: true } : n));
    } catch (e) {}
  }

  async function markAllRead() {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, est_lue: true })));
    } catch (e) {}
  }

  function statutBadge(statut) {
    if (statut === 'en_attente') return { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  color: '#d97706', label: 'EN ATTENTE' };
    if (statut === 'confirmee')  return { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   color: '#16a34a', label: 'CONFIRME' };
    if (statut === 'annulee')    return { bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.15)',  color: '#dc2626', label: 'ANNULE' };
    if (statut === 'terminee')   return { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', color: '#2563eb', label: 'TERMINE' };
    return { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)', color: '#6b7280', label: statut };
  }

  function paiementStatutBadge(statut) {
    if (statut === 'paye')       return { bg: 'rgba(34,197,94,0.1)',   color: '#16a34a', label: 'PAYÉ' };
    if (statut === 'en_attente') return { bg: 'rgba(245,158,11,0.1)',  color: '#d97706', label: 'EN ATTENTE' };
    if (statut === 'rembourse')  return { bg: 'rgba(220,38,38,0.08)', color: '#dc2626', label: 'REMBOURSÉ' };
    return { bg: 'rgba(107,114,128,0.1)', color: '#6b7280', label: statut };
  }

  const pending   = reservations.filter(r => r.statut === 'en_attente');
  const confirmed = reservations.filter(r => r.statut === 'confirmee');
  const allVisible = [...pending, ...confirmed];

  const paiementsPayes = paiements.filter(p => p.statut === 'paye');
  const totalRevenu = paiementsPayes.reduce((sum, p) => sum + parseFloat(p.montantEnseignant || 0), 0);
  const unreadNotifs = notifications.filter(n => !n.est_lue).length;

  function metricCard(icon, iconBg, iconColor, label, value) {
    return (
      <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '160px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon(iconColor)}
        </div>
        <div>
          <div style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: text }}>{loading ? '...' : value}</div>
        </div>
      </div>
    );
  }

  const tabStyle = (active) => ({
    padding: '8px 18px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '0.72rem',
    fontWeight: 700,
    fontFamily: 'monospace',
    cursor: 'pointer',
    background: active ? '#e04f00' : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
    color: active ? '#fff' : muted,
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  });

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Header */}
        <div style={{ background: bgSurf, border: '1px solid ' + border, borderRadius: '24px', padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(224,79,0,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PROF PLATFORM</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Espace Professeur : {user?.prenom} {user?.nom}</h1>
            <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Administrez vos demandes et suivez vos paiements reçus.</p>
          </div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', padding: '6px 16px', fontSize: '0.7rem', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={12} /> COMPTE VERIFIE
            </div>
            {unreadNotifs > 0 && (
              <div style={{ background: 'rgba(224,79,0,0.1)', border: '1px solid rgba(224,79,0,0.3)', borderRadius: '999px', padding: '6px 16px', fontSize: '0.7rem', fontWeight: 700, color: '#e04f00', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bell size={12} /> {unreadNotifs} nouvelle{unreadNotifs > 1 ? 's' : ''} notification{unreadNotifs > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="dashboard" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Métriques */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {metricCard(c => <TrendingUp size={20} color={c} />, 'rgba(34,197,94,0.1)', '#16a34a', 'Revenus total', totalRevenu.toFixed(2) + ' DH')}
              {metricCard(c => <Clock size={20} color={c} />, 'rgba(59,130,246,0.1)', '#2563eb', 'Cours en attente', pending.length)}
              {metricCard(c => <Star size={20} color={c} fill={c} />, 'rgba(251,191,36,0.1)', '#d97706', 'Note du profil', (stats?.note_moyenne ?? 0) + ' / 5')}
            </div>

            {/* Onglets */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button style={tabStyle(activeSection === 'reservations')} onClick={() => setActiveSection('reservations')}>
                <Calendar size={13} /> Réservations ({allVisible.length})
              </button>
              <button style={tabStyle(activeSection === 'paiements')} onClick={() => setActiveSection('paiements')}>
                <CreditCard size={13} /> Paiements reçus ({paiementsPayes.length})
              </button>
              <button style={tabStyle(activeSection === 'notifications')} onClick={() => setActiveSection('notifications')}>
                <Bell size={13} /> Notifications {unreadNotifs > 0 && `(${unreadNotifs})`}
              </button>
            </div>

            {/* ── SECTION RÉSERVATIONS ── */}
            {activeSection === 'reservations' && (
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: text, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 1.25rem', paddingBottom: '1rem', borderBottom: '1px solid ' + borderSub }}>
                  Réservations actives
                </h3>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
                ) : allVisible.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {allVisible.map((r, i) => {
                      const s = statutBadge(r.statut);
                      const montantNum = parseFloat(r.montant);
                      return (
                        <div key={r.id_reservation} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem', borderRadius: '12px', flexWrap: 'wrap', borderBottom: i < allVisible.length - 1 ? '1px solid ' + borderSub : 'none' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '6px', padding: '2px 8px', fontFamily: 'monospace', textTransform: 'uppercase', width: 'fit-content' }}>
                              {r.creneau?.jour} — {r.creneau?.heureDebut?.slice(0,5)} à {r.creneau?.heureFin?.slice(0,5)}
                            </span>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: text }}>
                              {r.etudiant?.user?.prenom || r.etudiant?.prenom || 'Etudiant'} {r.etudiant?.user?.nom || r.etudiant?.nom || ''}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: muted, fontFamily: 'monospace' }}>
                              Le {r.date} —{' '}
                              <span style={{ color: !montantNum ? '#16a34a' : text, fontWeight: 700 }}>
                                {!montantNum ? '1er cours GRATUIT' : r.montant + ' DH'}
                              </span>
                            </div>
                            {/* Badge paiement reçu */}
                            {r.statut === 'confirmee' && r.paiement?.statut === 'paye' && (
                              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#16a34a', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', padding: '2px 8px', fontFamily: 'monospace', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {r.paiement?.methode === 'cash' ? <Banknote size={11} /> : <CreditCard size={11} />}
                                {r.paiement?.methode === 'cash' ? 'Paiement espèces à recevoir' : 'Paiement carte reçu — ' + parseFloat(r.paiement?.montantEnseignant || 0).toFixed(2) + ' DH'}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
                            <span style={{ fontSize: '0.65rem', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontFamily: 'monospace', background: s.bg, border: '1px solid ' + s.border, color: s.color }}>
                              {s.label}
                            </span>
                            {(r.statut === 'en_attente' || r.statut === 'confirmee') && (
                              <button onClick={() => handleAnnuler(r.id_reservation)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#dc2626', cursor: 'pointer' }}>
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2.5rem', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: '1px solid ' + borderSub, borderRadius: '16px' }}>
                    <Clock size={28} color="#e04f00" />
                    <p style={{ fontSize: '0.8rem', color: muted, fontWeight: 600, margin: 0 }}>Aucune réservation active.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── SECTION PAIEMENTS ── */}
            {activeSection === 'paiements' && (
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid ' + borderSub }}>
                  <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: text, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                    Paiements reçus
                  </h3>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a' }}>
                    Total : {totalRevenu.toFixed(2)} DH
                  </div>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
                ) : paiements.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {paiements.map((p, i) => {
                      const ps = paiementStatutBadge(p.statut);
                      return (
                        <div key={p.id_paiement} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem', borderRadius: '12px', flexWrap: 'wrap', borderBottom: i < paiements.length - 1 ? '1px solid ' + borderSub : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: p.methode === 'cash' ? 'rgba(34,197,94,0.1)' : 'rgba(224,79,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {p.methode === 'cash'
                                ? <Banknote size={18} color="#16a34a" />
                                : <CreditCard size={18} color="#e04f00" />}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: text }}>
                                {parseFloat(p.montantEnseignant || 0).toFixed(2)} DH
                                <span style={{ fontSize: '0.65rem', color: muted, fontWeight: 500, marginLeft: '6px' }}>
                                  (total : {parseFloat(p.montantTotal || 0).toFixed(2)} DH — commission : {parseFloat(p.comission || 0).toFixed(2)} DH)
                                </span>
                              </div>
                              <div style={{ fontSize: '0.7rem', color: muted, fontFamily: 'monospace' }}>
                                {p.methode === 'cash' ? 'Espèces — à percevoir lors du cours' : 'Carte bancaire (simulation)'}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: muted }}>
                                {new Date(p.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.65rem', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontFamily: 'monospace', background: ps.bg, color: ps.color }}>
                            {ps.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2.5rem', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: '1px solid ' + borderSub, borderRadius: '16px' }}>
                    <DollarSign size={28} color="#e04f00" />
                    <p style={{ fontSize: '0.8rem', color: muted, fontWeight: 600, margin: 0 }}>Aucun paiement reçu pour l'instant.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── SECTION NOTIFICATIONS ── */}
            {activeSection === 'notifications' && (
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid ' + borderSub }}>
                  <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: text, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                    Notifications
                  </h3>
                  {unreadNotifs > 0 && (
                    <button onClick={markAllRead}
                      style={{ fontSize: '0.65rem', fontWeight: 700, color: '#e04f00', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', fontFamily: 'monospace' }}>
                      Tout marquer comme lu
                    </button>
                  )}
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
                ) : notifications.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {notifications.map((n, i) => (
                      <div key={n.id_notification}
                        onClick={() => !n.est_lue && markNotifRead(n.id_notification)}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', borderRadius: '12px', cursor: !n.est_lue ? 'pointer' : 'default', background: !n.est_lue ? (isDark ? 'rgba(224,79,0,0.06)' : 'rgba(224,79,0,0.04)') : 'transparent', border: !n.est_lue ? '1px solid rgba(224,79,0,0.15)' : '1px solid transparent', transition: 'all 0.15s', marginBottom: i < notifications.length - 1 ? '4px' : 0 }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: n.type === 'paiement' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {n.type === 'paiement' ? <DollarSign size={16} color="#16a34a" /> : <Bell size={16} color="#2563eb" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.78rem', color: text, margin: '0 0 4px', fontWeight: n.est_lue ? 500 : 700, lineHeight: 1.5 }}>{n.contenu}</p>
                          <p style={{ fontSize: '0.65rem', color: muted, margin: 0 }}>
                            {new Date(n.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!n.est_lue && (
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e04f00', flexShrink: 0, marginTop: '6px' }} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2.5rem', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: '1px solid ' + borderSub, borderRadius: '16px' }}>
                    <Bell size={28} color="#e04f00" />
                    <p style={{ fontSize: '0.8rem', color: muted, fontWeight: 600, margin: 0 }}>Aucune notification.</p>
                  </div>
                )}
              </div>
            )}

            {/* Consigne */}
            <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <ShieldAlert size={18} color="#e04f00" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: text, marginBottom: '4px' }}>Consigne concernant la première heure de cours</div>
                <p style={{ fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.6 }}>Le premier entretien avec l'élève est toujours offert sur Learnect. Déterminez ensemble ses objectifs et mettez en place un programme sur-mesure.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}