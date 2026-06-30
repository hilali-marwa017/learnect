import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Chart, registerables } from 'chart.js';
import { LayoutDashboard, Users, ShieldCheck, AlertCircle, DollarSign, Clock, BookOpen } from 'lucide-react';
import api from '../../api/axios';
import { VerificationsTab, UsersTab } from './ManageUsers';
import { SignalementsTab } from './Signalements';
import { ReservationsTab, PaiementsTab, DemandesTab } from './ValidatedTeachers';

Chart.register(...registerables);

function useDarkMode() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const isDark = useDarkMode();

  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ totalEtudiants: 0, totalEnseignants: 0, totalReservations: 0, totalAvis: 0, revenusTotal: 0 });
  const [enseignantsAttente, setEnseignantsAttente] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  const donutRef = useRef(null);
  const barRef = useRef(null);
  const donutInstance = useRef(null);
  const barInstance = useRef(null);

  const bg = isDark ? '#000000' : '#f8f9fc';
  const card = isDark ? '#0a0a0c' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#fcfdff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const [statsRes, usersRes, attenteRes, sigRes, demandesRes, resRes, paiRes] = await Promise.allSettled([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/enseignants/attente'),
      api.get('/admin/signalements'),
      api.get('/admin/demandes'),
      api.get('/admin/reservations'),
      api.get('/admin/paiements'),
    ]);
    if (statsRes.status === 'fulfilled') {
      const d = statsRes.value.data;
      setStats({ totalEtudiants: d.total_etudiants||0, totalEnseignants: d.total_enseignants||0, totalReservations: d.total_reservations||0, totalAvis: d.total_avis||0, revenusTotal: d.revenus_total||0 });
    }
    if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value.data)) setUsers(usersRes.value.data);
    if (attenteRes.status === 'fulfilled' && Array.isArray(attenteRes.value.data)) setEnseignantsAttente(attenteRes.value.data);
    if (sigRes.status === 'fulfilled' && Array.isArray(sigRes.value.data)) setSignalements(sigRes.value.data);
    if (demandesRes.status === 'fulfilled' && Array.isArray(demandesRes.value.data)) setDemandes(demandesRes.value.data);
    if (resRes.status === 'fulfilled' && Array.isArray(resRes.value.data)) setReservations(resRes.value.data);
    if (paiRes.status === 'fulfilled' && Array.isArray(paiRes.value.data)) setPaiements(paiRes.value.data);
    setLoading(false);
  }

  useEffect(() => {
    if (activeTab !== 'stats') return;
    if (donutInstance.current) { donutInstance.current.destroy(); donutInstance.current = null; }
    if (barInstance.current) { barInstance.current.destroy(); barInstance.current = null; }

    if (donutRef.current) {
      donutInstance.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: { labels: ['Élèves', 'Tuteurs'], datasets: [{ data: [stats.totalEtudiants, stats.totalEnseignants], backgroundColor: ['#e04f00', isDark ? '#334155' : '#1e293b'], borderWidth: 0, hoverOffset: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, animation: false, cutout: '68%', plugins: { legend: { display: false } } }
      });
    }

    if (barRef.current) {
      barInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: ['Réservations', 'Demandes', 'Paiements', 'Signalements', 'En attente'],
          datasets: [{ data: [stats.totalReservations, demandes.length, paiements.length, signalements.length, enseignantsAttente.length], backgroundColor: ['#e04f00', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'], borderRadius: 6, borderSkipped: false, barThickness: 22 }]
        },
        options: {
          indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: muted, font: { size: 11 } }, border: { display: false } },
            y: { grid: { display: false }, ticks: { color: textColor, font: { size: 12 } }, border: { display: false } }
          }
        }
      });
    }
  }, [activeTab, stats, demandes, paiements, signalements, enseignantsAttente, isDark]);

  const navItems = [
    { id: 'stats', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'teachers', label: 'Vérifications', icon: ShieldCheck, count: enseignantsAttente.length },
    { id: 'reports', label: 'Avis Signalés', icon: AlertCircle, count: signalements.filter(s => s.statut !== 'traite').length },
    { id: 'users', label: 'Comptes Utilisateurs', icon: Users, count: users.length },
    { id: 'reservations', label: 'Réservations', icon: Clock, count: reservations.length },
    { id: 'paiements', label: 'Paiements', icon: DollarSign, count: paiements.length },
    { id: 'demandes', label: 'Demandes', icon: BookOpen, count: demandes.length },
  ];

  const renderContent = () => {
    if (activeTab === 'teachers') return <VerificationsTab enseignantsAttente={enseignantsAttente} setEnseignantsAttente={setEnseignantsAttente} />;
    if (activeTab === 'reports') return <SignalementsTab signalements={signalements} setSignalements={setSignalements} />;
    if (activeTab === 'users') return <UsersTab users={users} setUsers={setUsers} />;
    if (activeTab === 'reservations') return <ReservationsTab reservations={reservations} />;
    if (activeTab === 'paiements') return <PaiementsTab paiements={paiements} />;
    if (activeTab === 'demandes') return <DemandesTab demandes={demandes} />;
    return null;
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(224,79,0,0.2)', borderTopColor: '#e04f00', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ color: '#e04f00', fontSize: '0.85rem', fontWeight: 600 }}>Chargement...</div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '20px' }}>
      <div className="admin-layout" style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '1.5rem' }}>

        <aside className="admin-sidebar" style={{ width: '240px', flexShrink: 0, position: 'sticky', top: '90px', alignSelf: 'flex-start' }}>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '1.25rem 1rem', borderBottom: `1px solid ${border}` }}>
              <div style={{ fontSize: '0.6rem', color: '#e04f00', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>ADMIN PANEL</div>
              <div style={{ fontWeight: 800, color: textColor, fontSize: '0.95rem' }}>Console Admin</div>
              <div style={{ fontSize: '0.7rem', color: muted, marginTop: '2px' }}>{user?.prenom} {user?.nom}</div>
            </div>
            <nav style={{ padding: '0.5rem' }}>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: isActive ? '#e04f00' : 'transparent', color: isActive ? '#fff' : muted, fontSize: '0.8rem', fontWeight: isActive ? 700 : 500, marginBottom: '2px', textAlign: 'left', transition: 'all 0.15s' }}>
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.count > 0 && (
                      <span style={{ background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(224,79,0,0.1)', color: isActive ? '#fff' : '#e04f00', fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: '999px' }}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'stats' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="admin-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1rem' }}>
                {[
                  { label: 'Total élèves', value: stats.totalEtudiants, color: '#3b82f6' },
                  { label: 'Total tuteurs', value: stats.totalEnseignants, color: '#e04f00' },
                  { label: 'Réservations', value: stats.totalReservations, color: '#10b981' },
                  { label: 'Commissions', value: `${stats.revenusTotal} DH`, color: '#8b5cf6' },
                  { label: 'Avis rédigés', value: stats.totalAvis, color: '#f59e0b' },
                ].map((kpi, i) => (
                  <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: '14px', padding: '1.1rem 1rem' }}>
                    <div style={{ fontSize: '0.6rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '8px' }}>{kpi.label}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: kpi.color }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              <div className="admin-charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Répartition des utilisateurs</div>
                  <div style={{ fontSize: '0.7rem', color: muted, marginBottom: '1rem' }}>Élèves vs Tuteurs</div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', color: