import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Calendar, DollarSign, Clock, Settings, Check, X, ShieldAlert, Star, MessageSquare } from 'lucide-react';

export function TeacherNavigationActive({ activeTab, isDark }) {
  const bg = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#d1d5db' : '#374151';
  const muted = isDark ? '#6b7280' : '#9ca3af';

  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    api.get('/enseignant/reservations')
      .then(res => {
        let total = 0;
        (res.data || []).forEach(c => {
          (c.reservations || []).forEach(r => {
            if (r.statut === 'confirmee') total++;
          });
        });
        setMsgCount(total);
      })
      .catch(() => {});
  }, []);

  const links = [
    { label: 'Tableau de bord',path:'/teacher', icon: Clock,id: 'dashboard'},
    { label: 'Disponibilites',path:'/teacher/availability', icon: Calendar,id: 'availability'},
    { label: 'Mes Revenus',path:'/teacher/earnings', icon: DollarSign,    id:'earnings'    },
    { label: 'Messages',path:'/teacher/messages', icon: MessageSquare, id: 'messages',   badge: msgCount },
    { label: 'Modifier Profil',path:'/teacher/profile', icon: Settings,      id: 'profile'     },
  ];

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '16px', padding: '1rem', width: '220px', flexShrink: 0 }}>
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
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const borderSub = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const dashRes = await api.get('/enseignant/dashboard');
        setStats(dashRes.data.stats);
        const resRes = await api.get('/enseignant/reservations');
        const all = [];
        (resRes.data || []).forEach(creneau => {
          (creneau.reservations || []).forEach(r => all.push({ ...r, creneau }));
        });
        setReservations(all);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  async function handleAction(id, action) {
    try {
      if (action === 'annuler') await api.delete('/reservations/' + id);
      setReservations(prev => prev.map(r => r.id_reservation === id ? { ...r, statut: 'annulee' } : r));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  }

  const pending = reservations.filter(r => r.statut === 'en_attente');

  const metricCard = (icon, iconBg, iconColor, label, value) => (
    <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon(iconColor)}
      </div>
      <div>
        <div style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: text }}>{loading ? '...' : value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ background: bgSurf, border: `1px solid ${border}`, borderRadius: '24px', padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(224,79,0,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PROF PLATFORM</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Espace Professeur : {user?.prenom} {user?.nom}</h1>
            <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Administrez vos demandes d'heures de soutien scolaire et validez vos cours.</p>
          </div>
          <div style={{ position: 'relative', zIndex: 1, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', padding: '6px 16px', fontSize: '0.7rem', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={12} /> COMPTE VERIFIE
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="dashboard" isDark={isDark} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {metricCard(c => <DollarSign size={20} color={c} />, 'rgba(34,197,94,0.1)', '#16a34a', 'Offres en attente', stats?.offres_en_attente ?? 0)}
              {metricCard(c => <Clock size={20} color={c} />, 'rgba(59,130,246,0.1)', '#2563eb', 'Creneaux dispos', `${stats?.creneaux_dispos ?? 0} creneaux`)}
              {metricCard(c => <Star size={20} color={c} fill={c} />, 'rgba(251,191,36,0.1)', '#d97706', 'Note du profil', `${stats?.note_moyenne ?? 0} / 5`)}
            </div>
            <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: text, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 1.25rem', paddingBottom: '1rem', borderBottom: `1px solid ${borderSub}` }}>
                Reservations en attente de paiement etudiant
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
              ) : pending.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {pending.map((r, i) => (
                    <div key={r.id_reservation} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem', borderRadius: '12px', flexWrap: 'wrap', borderBottom: i < pending.length - 1 ? `1px solid ${borderSub}` : 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '6px', padding: '2px 8px', fontFamily: 'monospace', textTransform: 'uppercase', width: 'fit-content' }}>
                          {r.creneau?.jour} — {r.creneau?.heureDebut?.slice(0,5)} a {r.creneau?.heureFin?.slice(0,5)}
                        </span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: text }}>
                          {r.etudiant?.user?.prenom || r.etudiant?.prenom} {r.etudiant?.user?.nom || r.etudiant?.nom}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: muted, fontFamily: 'monospace' }}>
                          Le {r.date} — <span style={{ color: r.montant == 0 ? '#16a34a' : text, fontWeight: 700 }}>{r.montant == 0 ? '1er cours GRATUIT' : r.montant + ' DH'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.65rem', color: '#d97706', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '6px 12px', fontFamily: 'monospace', fontWeight: 700 }}>
                          En attente paiement
                        </span>
                        <button onClick={() => handleAction(r.id_reservation, 'annuler')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#dc2626', cursor: 'pointer' }}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2.5rem', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${borderSub}`, borderRadius: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={22} color="#e04f00" />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: muted, fontWeight: 600, margin: 0 }}>Aucune reservation en attente actuellement.</p>
                </div>
              )}
            </div>
            <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <ShieldAlert size={18} color="#e04f00" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: text, marginBottom: '4px' }}>Consigne concernant la premiere heure de cours</div>
                <p style={{ fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.6 }}>Le premier entretien avec l'eleve est toujours offert sur Learnect. Determinez ensemble ses objectifs et mettez en place un programme sur-mesure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}