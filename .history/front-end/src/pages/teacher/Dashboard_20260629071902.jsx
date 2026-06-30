import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  Calendar, DollarSign, Clock, Settings, Check, X,
  ShieldAlert, Star, MessageSquare, Sparkles,
  CreditCard, TrendingUp, CheckCircle2, XCircle
} from 'lucide-react';

// ============================================================
// COMPOSANT NAVIGATION ENSEIGNANT
// ============================================================
export function TeacherNavigationActive({ activeTab, isDark }) {
  const bg = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#d1d5db' : '#374151';
  const muted = isDark ? '#6b7280' : '#9ca3af';

  const [msgCount, setMsgCount] = useState(0);
  const [demandesCount, setDemandesCount] = useState(0);
  const [pendingPayCount, setPendingPayCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const msgRes = await api.get('/messages/non-lus');
        setMsgCount(msgRes.data?.non_lus || 0);

        const demRes = await api.get('/demandes');
        const demandes = demRes.data || [];

        const offRes = await api.get('/offres/mes-offres');
        const mesOffres = offRes.data || [];

        setDemandesCount(demandes.filter(d => !mesOffres.some(o => o.id_demande === d.id_demande)).length);

        const resRes = await api.get('/enseignant/reservations');
        let count = 0;
        (resRes.data || []).forEach(creneau => {
          (creneau.reservations || []).forEach(r => {
            if (r.statut === 'paiement_recu') count++;
          });
        });
        setPendingPayCount(count);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { label: 'Tableau de bord', path: '/teacher', icon: Clock, id: 'dashboard' },
    { label: 'Disponibilités', path: '/teacher/availability', icon: Calendar, id: 'availability' },
    { label: 'Demandes Étudiants', path: '/teacher/demandes', icon: Sparkles, id: 'demandes', badge: demandesCount },
    { label: 'Mes Revenus', path: '/teacher/earnings', icon: DollarSign, id: 'earnings' },
    { label: 'Messages', path: '/teacher/messages', icon: MessageSquare, id: 'messages', badge: msgCount },
    { label: 'Modifier Profil', path: '/teacher/profile', icon: Settings, id: 'profile' },
  ];

  return (
    <div style={{ background: bg, border: '1px solid ' + border, borderRadius: '16px', padding: '1rem', width: '220px', flexShrink: 0 }}>
      <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: muted, fontWeight: 700, fontFamily: 'monospace', padding: '0 0.75rem 0.75rem', textTransform: 'uppercase' }}>Menu Enseignant</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {links.map(link => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <Link key={link.id} to={link.path} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: isActive ? 700 : 500, textDecoration: 'none', background: isActive ? '#e04f00' : 'transparent', color: isActive ? '#ffffff' : text }}>
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

// ============================================================
// COMPOSANT PRINCIPAL - TEACHER DASHBOARD (NOIR & DORÉ)
// ============================================================
export default function TeacherDashboard() {
  const { user } = useAuth();
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';

  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('reservations');
  const [actionLoading, setActionLoading] = useState(null);

  // Charger toutes les données
  async function fetchAll() {
    try {
      const dashRes = await api.get('/enseignant/dashboard');
      setStats(dashRes.data.stats);

      const resRes = await api.get('/enseignant/reservations');
      const all = [];
      (resRes.data || []).forEach(creneau => {
        (creneau.reservations || []).forEach(r => {
          all.push({ ...r, creneau });
        });
      });
      all.sort((a, b) => {
        const order = { paiement_recu: 0, en_attente: 1, confirmee: 2, terminee: 3, annulee: 4 };
        return (order[a.statut] ?? 9) - (order[b.statut] ?? 9);
      });
      setReservations(all);

      const paiRes = await api.get('/paiements/enseignant/revenus');
      const pais = (paiRes.data?.paiements || []).filter(p => parseFloat(p.montantTotal) > 0);
      setPaiements(pais);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  // Accepter réservation
  async function handleAccepter(id) {
    if (!window.confirm('Accepter cette réservation ?')) return;
    setActionLoading(id + '_accepter');
    try {
      await api.put('/reservations/' + id + '/accepter');
      setReservations(prev => prev.map(r => r.id_reservation === id ? { ...r, statut: 'confirmee' } : r));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur.');
    }
    setActionLoading(null);
  }

  // Refuser réservation
  async function handleRefuser(id) {
    if (!window.confirm('Refuser cette réservation ? Le paiement de l\'étudiant sera remboursé.')) return;
    setActionLoading(id + '_refuser');
    try {
      await api.put('/reservations/' + id + '/refuser');
      setReservations(prev => prev.map(r => r.id_reservation === id ? { ...r, statut: 'annulee' } : r));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur.');
    }
    setActionLoading(null);
  }

  // ✅ Badge statut réservation - Couleurs noir & doré
  function statutBadge(statut) {
    if (statut === 'paiement_recu') return { 
      bg: 'rgba(179,157,219,0.12)', 
      border: 'rgba(179,157,219,0.25)', 
      color: '#b39ddb', 
      label: 'PAIEMENT REÇU' 
    };
    if (statut === 'en_attente') return { 
      bg: 'rgba(212,168,76,0.12)', 
      border: 'rgba(212,168,76,0.25)', 
      color: '#d4a84c', 
      label: 'EN ATTENTE' 
    };
    if (statut === 'confirmee') return { 
      bg: 'rgba(76,175,80,0.12)', 
      border: 'rgba(76,175,80,0.25)', 
      color: '#4caf50', 
      label: 'CONFIRMÉ' 
    };
    if (statut === 'annulee') return { 
      bg: 'rgba(229,115,115,0.12)', 
      border: 'rgba(229,115,115,0.25)', 
      color: '#e57373', 
      label: 'ANNULÉ' 
    };
    if (statut === 'terminee') return { 
      bg: 'rgba(100,181,246,0.12)', 
      border: 'rgba(100,181,246,0.25)', 
      color: '#64b5f6', 
      label: 'TERMINÉ' 
    };
    return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: '#9ca3af', label: statut };
  }

  // Badge statut paiement
  function paiementBadge(statut) {
    if (statut === 'paye') return { bg: 'rgba(76,175,80,0.12)', color: '#4caf50', label: 'PAYÉ' };
    if (statut === 'en_attente') return { bg: 'rgba(212,168,76,0.12)', color: '#d4a84c', label: 'EN ATTENTE' };
    if (statut === 'rembourse') return { bg: 'rgba(229,115,115,0.12)', color: '#e57373', label: 'REMBOURSÉ' };
    return { bg: 'rgba(255,255,255,0.05)', color: '#9ca3af', label: statut };
  }

  const pendingPaiement = reservations.filter(r => r.statut === 'paiement_recu');
  const paiementsPayes = paiements.filter(p => p.statut === 'paye');
  const totalRevenu = paiementsPayes.reduce((sum, p) => sum + parseFloat(p.montantEnseignant || 0), 0);

  // Style des onglets - Noir & Doré
  const tabStyle = (active) => ({
    padding: '8px 18px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '0.72rem',
    fontWeight: 700,
    fontFamily: 'monospace',
    cursor: 'pointer',
    background: active ? '#c9a84c' : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
    color: active ? '#1a1a1a' : muted,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    position: 'relative',
  });

  // Carte métrique - Noir & Doré
  function metricCard(icon, iconBg, iconColor, label, value) {
    return (
      <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '150px' }}>
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

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Header - Noir & Doré */}
        <div style={{ background: bgSurf, border: '1px solid ' + border, borderRadius: '24px', padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.65rem', color: '#c9a84c', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PROF PLATFORM</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Espace Professeur : {user?.prenom} {user?.nom}</h1>
            <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Gérez vos réservations et validez les paiements reçus.</p>
          </div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', padding: '6px 16px', fontSize: '0.7rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={12} /> COMPTE VÉRIFIÉ
            </div>
            {pendingPaiement.length > 0 && (
              <div style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '999px', padding: '6px 16px', fontSize: '0.7rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={12} /> {pendingPaiement.length} paiement{pendingPaiement.length > 1 ? 's' : ''} à valider
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="dashboard" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Métriques - Noir & Doré */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {metricCard(c => <TrendingUp size={20} color={c} />, 'rgba(201,168,76,0.1)', '#c9a84c', 'Revenus total', totalRevenu.toFixed(2) + ' DH')}
              {metricCard(c => <CreditCard size={20} color={c} />, 'rgba(201,168,76,0.1)', '#c9a84c', 'À valider', pendingPaiement.length)}
              {metricCard(c => <Star size={20} color={c} fill={c} />, 'rgba(201,168,76,0.1)', '#c9a84c', 'Note du profil', (stats?.note_moyenne ?? 0) + ' / 5')}
            </div>

            {/* Alerte paiements en attente - Noir & Doré */}
            {pendingPaiement.length > 0 && (
              <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CreditCard size={20} color="#c9a84c" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: text, marginBottom: '2px' }}>
                    {pendingPaiement.length} paiement{pendingPaiement.length > 1 ? 's' : ''} en attente de votre validation
                  </div>
                  <div style={{ fontSize: '0.72rem', color: muted }}>Acceptez ou refusez les réservations payées par vos étudiants.</div>
                </div>
              </div>
            )}

            {/* Onglets - Noir & Doré */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button style={tabStyle(activeSection === 'reservations')} onClick={() => setActiveSection('reservations')}>
                <Calendar size={13} /> Réservations
                {pendingPaiement.length > 0 && (
                  <span style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '999px', fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', marginLeft: '2px' }}>
                    {pendingPaiement.length}
                  </span>
                )}
              </button>
              <button style={tabStyle(activeSection === 'paiements')} onClick={() => setActiveSection('paiements')}>
                <CreditCard size={13} /> Paiements reçus ({paiementsPayes.length})
              </button>
            </div>

            {/* Section Réservations */}
            {activeSection === 'reservations' && (
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 1.25rem', paddingBottom: '1rem', borderBottom: '1px solid ' + borderSub }}>Réservations</h3>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: muted }}>Chargement...</div>
                ) : reservations.filter(r => r.statut !== 'annulee').length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2.5rem', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: '1px solid ' + borderSub, borderRadius: '16px' }}>
                    <Clock size={28} color="#c9a84c" />
                    <p style={{ fontSize: '0.8rem', color: muted, fontWeight: 600, margin: 0 }}>Aucune réservation active.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {reservations.filter(r => r.statut !== 'annulee').map((r, i, arr) => {
                      const s = statutBadge(r.statut);
                      const montantNum = parseFloat(r.montant);
                      const isLoading = actionLoading?.startsWith(r.id_reservation);
                      return (
                        <div key={r.id_reservation} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem', borderRadius: '12px', flexWrap: 'wrap', borderBottom: i < arr.length - 1 ? '1px solid ' + borderSub : 'none', background: r.statut === 'paiement_recu' ? (isDark ? 'rgba(179,157,219,0.06)' : 'rgba(179,157,219,0.02)') : 'transparent' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64b5f6', background: 'rgba(100,181,246,0.12)', border: '1px solid rgba(100,181,246,0.25)', borderRadius: '6px', padding: '2px 8px', fontFamily: 'monospace', textTransform: 'uppercase', width: 'fit-content' }}>
                              {r.creneau?.jour} — {r.creneau?.heureDebut?.slice(0, 5)} à {r.creneau?.heureFin?.slice(0, 5)}
                            </span>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: text }}>
                              {r.etudiant?.user?.prenom || r.etudiant?.prenom || 'Étudiant'} {r.etudiant?.user?.nom || r.etudiant?.nom || ''}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: muted, fontFamily: 'monospace' }}>
                              Le {r.date} —{' '}
                              <span style={{ color: !montantNum ? '#c9a84c' : text, fontWeight: 700 }}>
                                {!montantNum ? '1er cours GRATUIT' : montantNum.toFixed(2) + ' DH'}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.65rem', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontFamily: 'monospace', background: s.bg, border: '1px solid ' + s.border, color: s.color }}>
                              {s.label}
                            </span>
                            {r.statut === 'paiement_recu' && (
                              <>
                                <button onClick={() => handleAccepter(r.id_reservation)} disabled={!!isLoading} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(76,175,80,0.3)', background: 'rgba(76,175,80,0.1)', color: '#4caf50', fontSize: '0.72rem', fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}>
                                  <CheckCircle2 size={13} /> {actionLoading === r.id_reservation + '_accepter' ? 'En cours...' : 'Accepter'}
                                </button>
                                <button onClick={() => handleRefuser(r.id_reservation)} disabled={!!isLoading} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(229,115,115,0.3)', background: 'rgba(229,115,115,0.1)', color: '#e57373', fontSize: '0.72rem', fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}>
                                  <XCircle size={13} /> {actionLoading === r.id_reservation + '_refuser' ? 'En cours...' : 'Refuser'}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Section Paiements */}
            {activeSection === 'paiements' && (
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid ' + borderSub }}>
                  <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Paiements reçus (simulation carte uniquement)</h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#c9a84c' }}>Total net : {totalRevenu.toFixed(2)} DH</div>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: muted }}>Chargement...</div>
                ) : paiements.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2.5rem', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: '1px solid ' + borderSub, borderRadius: '16px' }}>
                    <DollarSign size={28} color="#c9a84c" />
                    <p style={{ fontSize: '0.8rem', color: muted, fontWeight: 600, margin: 0 }}>Aucun paiement reçu pour l'instant.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {paiements.map((p, i) => {
                      const pb = paiementBadge(p.statut);
                      return (
                        <div key={p.id_paiement} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem', flexWrap: 'wrap', borderBottom: i < paiements.length - 1 ? '1px solid ' + borderSub : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <CreditCard size={18} color="#c9a84c" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: text }}>
                                {parseFloat(p.montantEnseignant || 0).toFixed(2)} DH
                                <span style={{ fontSize: '0.65rem', color: muted, fontWeight: 400, marginLeft: '8px' }}>
                                  total {parseFloat(p.montantTotal || 0).toFixed(2)} DH — commission {parseFloat(p.comission || 0).toFixed(2)} DH
                                </span>
                              </div>
                              <div style={{ fontSize: '0.68rem', color: muted }}>Carte bancaire (simulation) — {new Date(p.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.65rem', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontFamily: 'monospace', background: pb.bg, color: pb.color }}>{pb.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Consigne */}
            <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <ShieldAlert size={18} color="#c9a84c" style={{ flexShrink: 0, marginTop: '2px' }} />
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