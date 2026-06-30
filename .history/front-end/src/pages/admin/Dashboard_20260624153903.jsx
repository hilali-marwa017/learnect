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
            x: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: isDark ? '#a1a4a5' : '#718096', font: { size: 11 } }, border: { display: false } },
            y: { grid: { display: false }, ticks: { color: isDark ? '#fcfdff' : '#07090d', font: { size: 12 } }, border: { display: false } }
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
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-[rgba(224,79,0,0.2)] border-t-[#e04f00] rounded-full animate-spin mx-auto mb-3" />
        <div className="text-[#e04f00] text-sm font-semibold">Chargement...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-black pt-5">
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-60 flex-shrink-0 lg:sticky lg:top-[90px] lg:self-start">
          <div className="bg-white dark:bg-[#0a0a0c] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <div className="text-[0.6rem] text-[#e04f00] font-extrabold tracking-[0.15em] uppercase mb-1.5">ADMIN PANEL</div>
              <div className="font-extrabold text-[#07090d] dark:text-[#fcfdff] text-sm">Console Admin</div>
              <div className="text-[0.7rem] text-[#718096] dark:text-[#a1a4a5] mt-0.5">{user?.prenom} {user?.nom}</div>
            </div>
            <nav className="p-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-none cursor-pointer text-sm font-medium transition-all duration-150 mb-0.5 text-left ${
                      isActive 
                        ? 'bg-[#e04f00] text-white font-bold' 
                        : 'bg-transparent text-[#718096] dark:text-[#a1a4a5] hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.03)]'
                    }`}
                  >
                    <Icon size={15} className="flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.count > 0 && (
                      <span className={`text-[0.6rem] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-[rgba(255,255,255,0.25)] text-white' 
                          : 'bg-[rgba(224,79,0,0.1)] text-[#e04f00]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'stats' ? (
            <div className="flex flex-col gap-5">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Total élèves', value: stats.totalEtudiants, color: '#3b82f6' },
                  { label: 'Total tuteurs', value: stats.totalEnseignants, color: '#e04f00' },
                  { label: 'Réservations', value: stats.totalReservations, color: '#10b981' },
                  { label: 'Commissions', value: `${stats.revenusTotal} DH`, color: '#8b5cf6' },
                  { label: 'Avis rédigés', value: stats.totalAvis, color: '#f59e0b' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white dark:bg-[#0a0a0c] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-xl p-4">
                    <div className="text-[0.6rem] text-[#718096] dark:text-[#a1a4a5] uppercase tracking-[0.1em] font-extrabold mb-2">{kpi.label}</div>
                    <div className="text-[1.8rem] font-extrabold" style={{ color: kpi.color }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-[#0a0a0c] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                  <div className="text-sm font-extrabold text-[#07090d] dark:text-[#fcfdff] mb-1">Répartition des utilisateurs</div>
                  <div className="text-[0.7rem] text-[#718096] dark:text-[#a1a4a5] mb-4">Élèves vs Tuteurs</div>
                  <div className="flex gap-4 mb-4">
                    <span className="text-[0.7rem] text-[#718096] dark:text-[#a1a4a5] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#e04f00] rounded-sm inline-block" /> Élèves ({stats.totalEtudiants})
                    </span>
                    <span className="text-[0.7rem] text-[#718096] dark:text-[#a1a4a5] flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-sm inline-block ${isDark ? 'bg-[#334155]' : 'bg-[#1e293b]'}`} /> Tuteurs ({stats.totalEnseignants})
                    </span>
                  </div>
                  <div className="h-52 flex justify-center"><canvas ref={donutRef} /></div>
                </div>
                <div className="bg-white dark:bg-[#0a0a0c] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                  <div className="text-sm font-extrabold text-[#07090d] dark:text-[#fcfdff] mb-1">Activité de la plateforme</div>
                  <div className="text-[0.7rem] text-[#718096] dark:text-[#a1a4a5] mb-4">Vue d'ensemble par catégorie</div>
                  <div className="h-52"><canvas ref={barRef} /></div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-[#0a0a0c] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                  <div className="text-sm font-extrabold text-[#07090d] dark:text-[#fcfdff] mb-4">Informations générales</div>
                  {[
                    { label: 'Total avis', value: stats.totalAvis },
                    { label: 'Commission totale', value: `${stats.revenusTotal} DH` },
                    { label: 'Tuteurs en attente', value: enseignantsAttente.length },
                    { label: 'Signalements actifs', value: signalements.filter(s => s.statut !== 'traite').length },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between py-2.5 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]">
                      <span className="text-[0.78rem] text-[#718096] dark:text-[#a1a4a5]">{row.label}</span>
                      <span className="text-sm font-extrabold text-[#07090d] dark:text-[#fcfdff]">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-br from-[#e04f00] to-[#c43d00] rounded-xl p-5">
                  <div className="text-sm font-extrabold text-white mb-1">Modèle financier</div>
                  <div className="text-[0.7rem] text-[rgba(255,255,255,0.75)] mb-6">Répartition des revenus par cours</div>
                  <div className="flex justify-around items-center mb-6">
                    <div className="text-center">
                      <div className="text-[2.5rem] font-extrabold text-white">10%</div>
                      <div className="text-[0.65rem] text-[rgba(255,255,255,0.75)]">Commission Learnect</div>
                    </div>
                    <div className="w-px h-10 bg-[rgba(255,255,255,0.3)]" />
                    <div className="text-center">
                      <div className="text-[2.5rem] font-extrabold text-white">90%</div>
                      <div className="text-[0.65rem] text-[rgba(255,255,255,0.75)]">Revenus tuteur</div>
                    </div>
                  </div>
                  <div className="bg-[rgba(0,0,0,0.15)] rounded-xl px-3 py-2.5 text-[0.72rem] text-[rgba(255,255,255,0.9)]">
                    Commission prélevée automatiquement à chaque paiement confirmé.
                  </div>
                </div>
              </div>
            </div>
          ) : renderContent()}
        </main>
      </div>
    </div>
  );
}