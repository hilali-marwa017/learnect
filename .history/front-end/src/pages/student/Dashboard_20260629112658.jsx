import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { BookOpen, Calendar, Clock, MessageSquare, Award, Settings, Sparkles, ShieldCheck } from 'lucide-react';

export function StudentNavigationActive({ activeTab, isDark }) {
  const bg = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#d1d5db' : '#374151';
  const muted = isDark ? '#6b7280' : '#9ca3af';

  const [msgCount, setMsgCount] = useState(0);
  const [offresCount, setOffresCount] = useState(0);

  useEffect(() => {
    api.get('/messages/non-lus')
      .then(res => setMsgCount(res.data?.non_lus || 0))
      .catch(() => setMsgCount(0));
  }, []);

  useEffect(() => {
    api.get('/demandes/mes-demandes')
      .then(res => {
        const demandes = res.data || [];
        const count = demandes.reduce((acc, d) => acc + (d.offres || []).filter(o => o.statut === 'en_attente').length, 0);
        setOffresCount(count);
      })
      .catch(() => setOffresCount(0));
  }, []);

  const links = [
    { label: 'Tableau de bord',    path: '/student',              icon: BookOpen,    id: 'dashboard' },
    { label: 'Réservations',       path: '/student/reservations', icon: Calendar,    id: 'reservations' },
    { label: 'Messagerie',         path: '/student/messages',     icon: MessageSquare, id: 'messages', badge: msgCount },
    { label: 'Offres et Packs',    path: '/student/offres',       icon: Award,       id: 'offres', badge: offresCount },
    { label: 'Mes Demandes',       path: '/student/requests',     icon: Sparkles,    id: 'requests' },
    { label: 'Profil Personnel',   path: '/student/profile',      icon: Settings,    id: 'profile' },
  ];

  return (
    <div style={{ background: bg, border: '1px solid ' + border, borderRadius: '16px', padding: '1rem', width: '220px', flexShrink: 0 }}>
      <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: muted, fontWeight: 700, fontFamily: 'monospace', padding: '0 0.75rem 0.75rem', textTransform: 'uppercase' }}>
        Menu Élève
      </div>
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

export default function StudentDashboard() {
  const { user } = useAuth();
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

  // ✅ FIX : paiement_recu ajouté
  function formatStatut(statut) {
    const statuts = {
      'confirmee':      'CONFIRMÉE',
      'en_attente':     'EN ATTENTE',
      'paiement_recu':  'PAIEMENT REÇU',
      'annulee':        'ANNULÉE',
      'terminee':       'TERMINÉE',
    };
    return statuts[statut] || statut.toUpperCase();
  }

  // ✅ FIX : paiement_recu ajouté
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

  // ✅ FIX : paiement_recu ajouté
  function getStatutBg(statut) {
    const colors = {
      'confirmee':