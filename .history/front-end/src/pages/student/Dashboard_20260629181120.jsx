import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Gift, 
  ClipboardList,
  BookOpen, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

// ============================================================
// COMPOSANT NAVIGATION ÉLÈVE (EXPORTÉ)
// ============================================================
export function StudentNavigationActive({ activeTab, isDark }) {
  const bg = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#d1d5db' : '#374151';
  const muted = isDark ? '#6b7280' : '#9ca3af';

  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const msgRes = await api.get('/messages/non-lus');
        setMsgCount(msgRes.data?.non_lus || 0);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { label: 'Tableau de bord', path: '/student', icon: LayoutDashboard, id: 'dashboard' },
    { label: 'Réservations', path: '/student/reservations', icon: Calendar, id: 'reservations' },
    { label: 'Messagerie', path: '/student/messages', icon: MessageSquare, id: 'messages', badge: msgCount },
    { label: 'Offres et Packs', path: '/student/offres', icon: Gift, id: 'offres' },
    { label: 'Mes Demandes', path: '/student/requests', icon: ClipboardList, id: 'requests' },
  ];

  return (
    <div style={{ 
      background: bg, 
      border: '1px solid ' + border, 
      borderRadius: '16px', 
      padding: '1rem', 
      width: '220px', 
      flexShrink: 0 
    }}>
      <div style={{ 
        fontSize: '0.6rem', 
        letterSpacing: '0.12em', 
        color: muted, 
        fontWeight: 700, 
        fontFamily: 'monospace', 
        padding: '0 0.75rem 0.75rem', 
        textTransform: 'uppercase' 
      }}>
        Menu Élève
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {links.map(link => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <Link 
              key={link.id} 
              to={link.path} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '10px 12px', 
                borderRadius: '10px', 
                fontSize: '0.82rem', 
                fontWeight: isActive ? 700 : 500, 
                textDecoration: 'none', 
                background: isActive ? '#e04f00' : 'transparent', 
                color: isActive ? '#ffffff' : text,
                transition: 'all 0.15s'
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{link.label}</span>
              {link.badge > 0 && (
                <span style={{ 
                  minWidth: '18px', 
                  height: '18px', 
                  background: isActive ? 'rgba(255,255,255,0.3)' : '#e04f00', 
                  color: '#fff', 
                  borderRadius: '999px', 
                  fontSize: '0.6rem', 
                  fontWeight: 800, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '0 4px' 
                }}>
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
// COMPOSANT PRINCIPAL - STUDENT DASHBOARD (DEFAULT EXPORT)
// ============================================================
export default function StudentDashboard() {
  const { user } = useAuth();
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  const bg        = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard    = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf    = isDark ? '#1a1a1c' : '#f8f9fc';
  const border    = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text      = isDark ? '#ffffff' : '#111827';
  const muted     = isDark ? '#9ca3af' : '#6b7280';

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/reservations');
        if (res.status === 200) setReservations(res.data || []);
      } catch (e) {
        console.error('erreur chargement reservations:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pending   = reservations.filter(r => r.statut === 'en_attente').length;
  const confirmed = reservations.filter(r => r.statut === 'confirmee').length;

  function formatStatut(statut) {
    const statuts = {
      'confirmee':     'CONFIRMÉE',
      'en_attente':    'EN ATTENTE',
      'paiement_recu': 'PAIEMENT REÇU',
      'annulee':       'ANNULÉE',
      'terminee':      'TERMINÉE',
    };
    return statuts[statut] || statut.toUpperCase();
  }

  function getStatutColor(statut) {
    const colors = {
      'confirmee':     '#16a34a',
      'en_attente':    '#d97706',
      'paiement_recu': '#a855f7',
      'annulee':       '#dc2626',
      'terminee':      '#2563eb',
    };
    return colors[statut] || '#6b7280';
  }

  function getStatutBg(statut) {
    const colors = {
      'confirmee':     'rgba(34,197,94,0.1)',
      'en_attente':    'rgba(245,158,11,0.1)',
      'paiement_recu': 'rgba(168,85,247,0.1)',
      'annulee':       'rgba(220,38,38,0.1)',
      'terminee':      'rgba(37,99,235,0.1)',
    };
    return colors[statut] || 'rgba(107,114,128,0.1)';
  }

  function metricCard(icon, iconBg, iconColor, label, value) {
    return (
      <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon(iconColor)}
        </div>
        <div>
          <div style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: text }}>{loading ? '...' : value}</div>
        </div>
      </div>
    );
  }

  function renderReservationItem(reservation, index) {
    const statutFormatted = formatStatut(reservation.statut);
    const statutColor     = getStatutColor(reservation.statut);
    const statutBg        = getStatutBg(reservation.statut);
    return (
      <div key={reservation.id_reservation} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem', borderRadius: '12px', flexWrap: 'wrap', borderBottom: index < 2 ? '1px solid ' + borderSub : 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: text }}>
            {reservation.creneau?.enseignant?.user?.prenom} {reservation.creneau?.enseignant?.user?.nom}
          </div>
          <div style={{ fontSize: '0.72rem', color: muted, fontFamily: 'monospace' }}>
            {reservation.creneau?.jour} — {reservation.creneau?.heureDebut?.slice(0,5)} à {reservation.creneau?.heureFin?.slice(0,5)} — Le {reservation.date}
          </div>
        </div>
        <span style={{ fontSize: '0.65rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, fontFamily: 'monospace', background: statutBg, color: statutColor }}>
          {statutFormatted}
        </span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ background: bgSurf, border: '1px solid ' + border, borderRadius: '24px', padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(224,79,0,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PLATFORM</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Bonjour, {user?.prenom} {user?.nom}</h1>
            <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Bienvenue dans votre espace d'étude.</p>
          </div>
          <Link to="/teachers" style={{ position: 'relative', zIndex: 1, background: isDark ? '#ffffff' : '#111827', color: isDark ? '#111827' : '#ffffff', borderRadius: '10px', padding: '10px 20px', fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none', fontFamily: 'monospace', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            TROUVER UN PROF
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <StudentNavigationActive activeTab="dashboard" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {metricCard(c => <Calendar size={20} color={c} />,    'rgba(224,79,0,0.1)',   '#e04f00', 'Total réservations', reservations.length)}
              {metricCard(c => <Clock size={20} color={c} />,       'rgba(245,158,11,0.1)', '#d97706', 'En attente',         pending)}
              {metricCard(c => <ShieldCheck size={20} color={c} />, 'rgba(34,197,94,0.1)',  '#16a34a', 'Confirmées',         confirmed)}
            </div>

            <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid ' + borderSub }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: text, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Dernières Réservations</h3>
                <Link to="/student/reservations" style={{ fontSize: '0.72rem', color: '#e04f00', fontWeight: 700, textDecoration: 'none' }}>
                  Voir toutes ({reservations.length})
                </Link>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
              ) : reservations.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2.5rem', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: '1px solid ' + borderSub, borderRadius: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={22} color="#e04f00" />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: muted, fontWeight: 600, margin: 0 }}>Aucune réservation active pour le moment.</p>
                  <Link to="/teachers" style={{ background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', color: '#e04f00', padding: '8px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                    Découvrir les professeurs
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {reservations.slice(0, 3).map((r, i) => renderReservationItem(r, i))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#2563eb', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>ACCOMPAGNEMENT</div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: text, margin: '0 0 8px' }}>Garantie 1ère heure offerte</h4>
                <p style={{ fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.6 }}>Votre premier cours avec chaque professeur est gratuit pour tester la compatibilité pédagogique.</p>
              </div>
              <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#16a34a', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>QUALITÉ CERTIFIÉE</div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: text, margin: '0 0 8px' }}>Conseil Learnect</h4>
                <p style={{ fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.6 }}>Préparez vos bilans scolaires à l'avance pour maximiser l'efficacité du cours.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}