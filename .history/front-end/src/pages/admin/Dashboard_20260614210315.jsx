import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Chart, registerables } from 'chart.js';
import { LayoutDashboard, Users, ShieldCheck, AlertCircle, DollarSign, Clock, BookOpen, LogOut, Sun, Moon } from 'lucide-react';
import api from '../../api/axios';

Chart.register(...registerables);

// Composant pour les styles dynamiques avec le thème
const useThemeStyles = () => {
  const { darkMode } = useTheme();
  
  return {
    orange: '#e04f00',
    bg: darkMode ? '#0f172a' : '#f8f9fc',
    card: darkMode ? '#1e293b' : '#ffffff',
    border: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    text: darkMode ? '#f1f5f9' : '#07090d',
    muted: darkMode ? '#94a3b8' : '#718096',
    sectionWrap: {
      background: darkMode ? '#1e293b' : '#ffffff',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 4px rgba(0,0,0,0.05)'
    },
    sectionLabel: {
      fontSize: '0.6rem',
      color: '#e04f00',
      fontWeight: 700,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      marginBottom: '4px'
    },
    sectionTitle: (count) => ({
      fontSize: '1.1rem',
      fontWeight: 800,
      color: darkMode ? '#f1f5f9' : '#07090d',
      marginBottom: '1.25rem'
    }),
    tableHeader: {
      textAlign: 'left',
      padding: '10px 12px',
      fontSize: '0.6rem',
      color: darkMode ? '#94a3b8' : '#718096',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`
    },
    tableRow: {
      borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`
    },
    tableCell: {
      padding: '12px',
      fontSize: '0.78rem',
      color: darkMode ? '#f1f5f9' : '#07090d'
    }
  };
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const styles = useThemeStyles();

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

  const navItems = [
    { id: 'stats', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'teachers', label: 'Vérifications', icon: ShieldCheck, count: enseignantsAttente.length },
    { id: 'reports', label: 'Avis Signalés', icon: AlertCircle, count: signalements.filter(s => s.statut !== 'traite').length },
    { id: 'users', label: 'Comptes Utilisateurs', icon: Users, count: users.length },
    { id: 'reservations', label: 'Réservations', icon: Clock, count: reservations.length },
    { id: 'paiements', label: 'Paiements', icon: DollarSign, count: paiements.length },
    { id: 'demandes', label: 'Demandes', icon: BookOpen, count: demandes.length },
  ];

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    if (activeTab !== 'stats') return;
    if (donutInstance.current) { donutInstance.current.destroy(); donutInstance.current = null; }
    if (barInstance.current) { barInstance.current.destroy(); barInstance.current = null; }

    if (donutRef.current) {
      donutInstance.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Élèves', 'Tuteurs'],
          datasets: [{ data: [stats.totalEtudiants, stats.totalEnseignants], backgroundColor: ['#e04f00', darkMode ? '#334155' : '#1e293b'], borderWidth: 0, hoverOffset: 6 }]
        },
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
            x: { grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: styles.muted, font: { size: 11 } }, border: { display: false } },
            y: { grid: { display: false }, ticks: { color: styles.text, font: { size: 12 } }, border: { display: false } }
          }
        }
      });
    }
  }, [activeTab, stats, demandes, paiements, signalements, enseignantsAttente, darkMode]);

  async function loadAll() {
    setLoading(true);
    try {
      const [s, u, e, sig, d, r, p] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/enseignants/attente'),
        api.get('/admin/signalements'),
        api.get('/admin/demandes'),
        api.get('/admin/reservations'),
        api.get('/admin/paiements'),
      ]);
      if (s.status === 'fulfilled') {
        const data = s.value.data;
        setStats({ totalEtudiants: data.total_etudiants || 0, totalEnseignants: data.total_enseignants || 0, totalReservations: data.total_reservations || 0, totalAvis: data.total_avis || 0, revenusTotal: data.revenus_total || 0 });
      }
      if (u.status === 'fulfilled' && Array.isArray(u.value.data)) setUsers(u.value.data);
      if (e.status === 'fulfilled' && Array.isArray(e.value.data)) setEnseignantsAttente(e.value.data);
      if (sig.status === 'fulfilled' && Array.isArray(sig.value.data)) setSignalements(sig.value.data);
      if (d.status === 'fulfilled' && Array.isArray(d.value.data)) setDemandes(d.value.data);
      if (r.status === 'fulfilled' && Array.isArray(r.value.data)) setReservations(r.value.data);
      if (p.status === 'fulfilled' && Array.isArray(p.value.data)) setPaiements(p.value.data);
    } finally { setLoading(false); }
  }

  function handleLogout() { logout(); navigate('/'); }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: styles.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#e04f00', fontSize: '0.9rem', fontWeight: 600 }}>Chargement...</div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'teachers') return <VerificationsTab enseignantsAttente={enseignantsAttente} setEnseignantsAttente={setEnseignantsAttente} styles={styles} />;
    if (activeTab === 'reports') return <SignalementsTab signalements={signalements} setSignalements={setSignalements} styles={styles} />;
    if (activeTab === 'users') return <UsersTab users={users} setUsers={setUsers} styles={styles} />;
    if (activeTab === 'reservations') return <ReservationsTab reservations={reservations} styles={styles} />;
    if (activeTab === 'paiements') return <PaiementsTab paiements={paiements} styles={styles} />;
    if (activeTab === 'demandes') return <DemandesTab demandes={demandes} styles={styles} />;
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: styles.bg, paddingTop: '80px' }}>
      {/* Bouton Dark Mode */}
      <button
        onClick={toggleDarkMode}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: styles.card,
          border: `1px solid ${styles.border}`,
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: styles.text,
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '1.5rem' }}>
        {/* SIDEBAR */}
        <aside style={{ width: '240px', flexShrink: 0, position: 'sticky', top: '90px', alignSelf: 'flex-start' }}>
          <div style={{ background: styles.card, border: `1px solid ${styles.border}`, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '1.25rem 1rem', borderBottom: `1px solid ${styles.border}` }}>
              <div style={{ fontSize: '0.6rem', color: '#e04f00', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>ADMIN PANEL</div>
              <div style={{ fontWeight: 800, color: styles.text, fontSize: '0.95rem' }}>Console Admin</div>
              <div style={{ fontSize: '0.7rem', color: styles.muted, marginTop: '2px' }}>{user?.prenom} {user?.nom}</div>
            </div>
            <nav style={{ padding: '0.5rem' }}>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id)} 
                    style={{ 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '10px 12px', 
                      borderRadius: '10px', 
                      border: 'none', 
                      cursor: 'pointer', 
                      background: isActive ? '#e04f00' : 'transparent', 
                      color: isActive ? '#fff' : styles.muted, 
                      fontSize: '0.8rem', 
                      fontWeight: isActive ? 700 : 500, 
                      marginBottom: '2px', 
                      textAlign: 'left', 
                      transition: 'all 0.15s' 
                    }}
                  >
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.count > 0 && (
                      <span style={{ 
                        background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(224,79,0,0.1)', 
                        color: isActive ? '#fff' : '#e04f00', 
                        fontSize: '0.6rem', 
                        fontWeight: 700, 
                        padding: '2px 6px', 
                        borderRadius: '999px' 
                      }}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
              <div style={{ height: '1px', background: styles.border, margin: '8px 0' }} />
              <button onClick={handleLogout} style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '10px 12px', 
                borderRadius: '10px', 
                border: 'none', 
                cursor: 'pointer', 
                background: 'transparent', 
                color: '#dc2626', 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                textAlign: 'left' 
              }}>
                <LogOut size={15} /> Quitter
              </button>
            </nav>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'stats' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* KPI */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1rem' }}>
                {[
                  { label: 'Total élèves', value: stats.totalEtudiants, color: '#3b82f6' },
                  { label: 'Total tuteurs', value: stats.totalEnseignants, color: '#e04f00' },
                  { label: 'Réservations', value: stats.totalReservations, color: '#10b981' },
                  { label: 'Commissions', value: `${stats.revenusTotal} DH`, color: '#8b5cf6' },
                  { label: 'Avis rédigés', value: stats.totalAvis, color: '#f59e0b' },
                ].map((kpi, i) => (
                  <div key={i} style={{ background: styles.card, border: `1px solid ${styles.border}`, borderRadius: '14px', padding: '1.1rem 1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.6rem', color: styles.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '8px' }}>{kpi.label}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: kpi.color }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={styles.sectionWrap}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: styles.text, marginBottom: '4px' }}>Répartition des utilisateurs</div>
                  <div style={{ fontSize: '0.7rem', color: styles.muted, marginBottom: '1rem' }}>Élèves vs Tuteurs</div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', color: styles.muted, display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', background: '#e04f00', borderRadius: '3px', display: 'inline-block' }} /> Élèves ({stats.totalEtudiants})</span>
                    <span style={{ fontSize: '0.7rem', color: styles.muted, display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', background: darkMode ? '#334155' : '#1e293b', borderRadius: '3px', display: 'inline-block' }} /> Tuteurs ({stats.totalEnseignants})</span>
                  </div>
                  <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}><canvas ref={donutRef} /></div>
                </div>
                <div style={styles.sectionWrap}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: styles.text, marginBottom: '4px' }}>Activité de la plateforme</div>
                  <div style={{ fontSize: '0.7rem', color: styles.muted, marginBottom: '1rem' }}>Vue d'ensemble par catégorie</div>
                  <div style={{ height: '200px' }}><canvas ref={barRef} /></div>
                </div>
              </div>

              {/* Info + Modèle financier */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={styles.sectionWrap}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: styles.text, marginBottom: '1rem' }}>Informations générales</div>
                  {[
                    { label: 'Total avis', value: stats.totalAvis },
                    { label: 'Commission totale', value: `${stats.revenusTotal} DH` },
                    { label: 'Tuteurs en attente', value: enseignantsAttente.length },
                    { label: 'Signalements actifs', value: signalements.filter(s => s.statut !== 'traite').length },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${styles.border}` }}>
                      <span style={{ fontSize: '0.78rem', color: styles.muted }}>{row.label}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: styles.text }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: `linear-gradient(135deg, #e04f00, #c43d00)`, borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Modèle financier</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255