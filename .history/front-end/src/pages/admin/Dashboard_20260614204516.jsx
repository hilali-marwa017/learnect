import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Chart, registerables } from 'chart.js';
import {
  LayoutDashboard, Users, ShieldCheck, AlertCircle,
  DollarSign, Clock, Star, LogOut, BookOpen,
  CheckCircle, XCircle, Trash2, ChevronRight
} from 'lucide-react';
import api from '../../api/axios';

Chart.register(...registerables);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ totalEtudiants: 0, totalEnseignants: 0, totalReservations: 0, totalAvis: 0, revenusTotal: 0 });
  const [enseignantsAttente, setEnseignantsAttente] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refusModal, setRefusModal] = useState(null);
  const [refusRaison, setRefusRaison] = useState('');

  const donutRef = useRef(null);
  const barRef = useRef(null);
  const donutInstance = useRef(null);
  const barInstance = useRef(null);

  const orange = '#e04f00';
  const dark = '#0a0a0c';

  const navItems = [
    { id: 'stats', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'teachers', label: 'Vérifications', icon: ShieldCheck, count: enseignantsAttente.length },
    { id: 'reports', label: 'Avis Signalés', icon: AlertCircle, count: signalements.length },
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
    if (donutRef.current && (stats.totalEtudiants > 0 || stats.totalEnseignants > 0)) {
      donutInstance.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Élèves', 'Tuteurs'],
          datasets: [{ data: [stats.totalEtudiants, stats.totalEnseignants], backgroundColor: [orange, '#1e293b'], borderWidth: 0, hoverOffset: 6 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: false, cutout: '68%',
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#0f172a', padding: 10, cornerRadius: 8 }
          }
        }
      });
    }
    if (barRef.current) {
      barInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: ['Réservations', 'Demandes', 'Paiements', 'Signalements', 'En attente'],
          datasets: [{
            data: [stats.totalReservations, demandes.length, paiements.length, signalements.length, enseignantsAttente.length],
            backgroundColor: [orange, '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
            borderRadius: 6, borderSkipped: false, barThickness: 22
          }]
        },
        options: {
          indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8', font: { size: 11 } }, border: { display: false } },
            y: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { size: 12 } }, border: { display: false } }
          }
        }
      });
    }
  }, [activeTab, stats, demandes, paiements, signalements, enseignantsAttente]);

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
    } finally {
      setLoading(false);
    }
  }

  async function valider(id) {
    await api.put(`/admin/enseignants/${id}/valider`);
    setEnseignantsAttente(prev => prev.filter(e => e.utilisateur_id !== id));
  }

  async function refuser(id) {
    if (!refusRaison.trim()) return;
    await api.put(`/admin/enseignants/${id}/refuser`, { raison: refusRaison });
    setEnseignantsAttente(prev => prev.filter(e => e.utilisateur_id !== id));
    setRefusModal(null);
    setRefusRaison('');
  }

  async function bloquer(userId, statut) {
    const action = statut === 'actif' ? 'bloquer' : 'debloquer';
    await api.put(`/admin/users/${userId}/${action}`);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, statut: statut === 'actif' ? 'bloque' : 'actif' } : u));
  }

  async function supprimerUser(userId) {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    await api.delete(`/admin/users/${userId}`);
    setUsers(prev => prev.filter(u => u.id !== userId));
  }

  async function traiterSignalement(id) {
    await api.put(`/admin/signalements/${id}/traiter`);
    setSignalements(prev => prev.map(s => s.id === id ? { ...s, statut: 'traite' } : s));
  }

  async function supprimerSignalement(id) {
    await api.delete(`/admin/signalements/${id}`);
    setSignalements(prev => prev.filter(s => s.id !== id));
  }

  function handleLogout() { logout(); navigate('/'); }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: orange, fontSize: '0.9rem' }}>Chargement...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0f', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '1.5rem' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: '240px', flexShrink: 0, position: 'sticky', top: '90px', alignSelf: 'flex-start' }}>
          <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>

            {/* Admin badge */}
            <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>ADMIN PANEL</div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Console Admin</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{user?.prenom} {user?.nom}</div>
            </div>

            {/* Nav */}
            <nav style={{ padding: '0.5rem' }}>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: isActive ? orange : 'transparent',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                    fontSize: '0.8rem', fontWeight: isActive ? 700 : 500,
                    marginBottom: '2px', textAlign: 'left', transition: 'all 0.15s',
                  }}>
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.count > 0 && (
                      <span style={{ background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(224,79,0,0.2)', color: isActive ? '#fff' : orange, fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: '999px' }}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />

              <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'transparent', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, textAlign: 'left' }}>
                <LogOut size={15} /> Quitter
              </button>
            </nav>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* ── TAB: STATS ── */}
          {activeTab === 'stats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Total élèves', value: stats.totalEtudiants, color: '#3b82f6' },
                  { label: 'Total tuteurs', value: stats.totalEnseignants, color: orange },
                  { label: 'Réservations', value: stats.totalReservations, color: '#10b981' },
                  { label: 'Commissions', value: `${stats.revenusTotal} DH`, color: '#8b5cf6' },
                  { label: 'Avis rédigés', value: stats.totalAvis, color: '#f59e0b' },
                ].map((kpi, i) => (
                  <div key={i} style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.1rem 1rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '6px' }}>{kpi.label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: kpi.color }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Répartition des utilisateurs</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Élèves vs Tuteurs</div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', background: orange, borderRadius: '3px', display: 'inline-block' }} /> Élèves ({stats.totalEtudiants})
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', background: '#1e293b', borderRadius: '3px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.2)' }} /> Tuteurs ({stats.totalEnseignants})
                    </span>
                  </div>
                  <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                    <canvas ref={donutRef} />
                  </div>
                </div>

                <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Activité de la plateforme</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Vue d'ensemble par catégorie</div>
                  <div style={{ height: '200px' }}>
                    <canvas ref={barRef} />
                  </div>
                </div>
              </div>

              {/* Info + Modèle financier */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Informations générales</div>
                  {[
                    { label: 'Total avis', value: stats.totalAvis },
                    { label: 'Commission totale', value: `${stats.revenusTotal} DH` },
                    { label: 'Tuteurs en attente', value: enseignantsAttente.length },
                    { label: 'Signalements actifs', value: signalements.filter(s => s.statut !== 'traite').length },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: `linear-gradient(135deg, ${orange}, #c43d00)`, borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Modèle financier</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>Répartition des revenus par cours</div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>10%</div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>Commission Learnect</div>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.3)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>90%</div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>Revenus tuteur</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)' }}>
                    Commission prélevée automatiquement à chaque paiement confirmé.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: VÉRIFICATIONS ── */}
          {activeTab === 'teachers' && (
            <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>VÉRIFICATION ACADÉMIQUE MANUELLE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Diplômes & Dossiers ({enseignantsAttente.length})</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>Examinez minutieusement les documents avant d'autoriser la mise en ligne.</div>

              {enseignantsAttente.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>✅ Aucune candidature en attente</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {enseignantsAttente.map(e => (
                    <div key={e.utilisateur_id} style={{ background: '#0d0d0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
                            {(e.user?.prenom || '?')[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{e.user?.prenom} {e.user?.nom}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{e.user?.email} • {e.user?.ville}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setRefusModal(e.utilisateur_id); setRefusRaison(''); }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                            Demander correction
                          </button>
                          <button onClick={() => valider(e.utilisateur_id)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: orange, color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle size={14} /> Approuver et Valider
                          </button>
                        </div>
                      </div>

                      {/* Documents */}
                      {e.documents && e.documents.length > 0 && (
                        <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {e.documents.map((doc, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.6rem', background: doc.type_document === 'diplome' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)', color: doc.type_document === 'diplome' ? '#3b82f6' : '#10b981', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase' }}>{doc.type_document}</span>
                              <a href={`http://localhost:8000/storage/${doc.chemin}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                                {doc.chemin?.split('/').pop()}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      {e.description_profil && (
                        <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: `3px solid ${orange}` }}>
                          "{e.description_profil}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: SIGNALEMENTS ── */}
          {activeTab === 'reports' && (
            <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>MODÉRATION</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>Avis Signalés ({signalements.length})</div>
              {signalements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>Aucun signalement</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {signalements.map(s => (
                    <div key={s.id} style={{ background: '#0d0d0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '0.62rem', background: s.statut === 'traite' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: s.statut === 'traite' ? '#10b981' : '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, marginBottom: '6px', display: 'inline-block' }}>
                            {s.statut === 'traite' ? 'Traité' : 'En attente'}
                          </span>
                          <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>{s.raison}</div>
                          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                            Par: {s.signaleur?.prenom} {s.signaleur?.nom} • {new Date(s.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {s.statut !== 'traite' && (
                            <button onClick={() => traiterSignalement(s.id)} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: orange, color: '#fff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                              Rejeter signalement
                            </button>
                          )}
                          <button onClick={() => supprimerSignalement(s.id)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: UTILISATEURS ── */}
          {activeTab === 'users' && (
            <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>ANNUAIRE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>Comptes Utilisateurs ({users.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', gap: '1rem', padding: '8px 12px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <span>UTILISATEUR</span><span>RÔLE</span><span>VILLE</span><span>STATUT</span><span style={{ textAlign: 'right' }}>ACTIONS</span>
                </div>
                {users.map(u => (
                  <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', gap: '1rem', alignItems: 'center', padding: '12px', background: '#0d0d0f', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.82rem' }}>{u.prenom} {u.nom}</div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{u.email}</div>
                    </div>
                    <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: u.role === 'admin' ? `rgba(224,79,0,0.15)` : u.role === 'enseignant' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)', color: u.role === 'admin' ? orange : u.role === 'enseignant' ? '#3b82f6' : '#10b981', display: 'inline-block' }}>
                      {u.role === 'admin' ? 'Admin' : u.role === 'enseignant' ? 'Tuteur' : 'Étudiant'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{u.ville || '—'}</span>
                    <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: u.statut === 'actif' ? 'rgba(16,185,129,0.15)' : u.statut === 'en_attente' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: u.statut === 'actif' ? '#10b981' : u.statut === 'en_attente' ? '#f59e0b' : '#ef4444', display: 'inline-block' }}>
                      {u.statut === 'actif' ? 'ACTIF' : u.statut === 'en_attente' ? 'EN_ATTENTE' : 'BLOQUÉ'}
                    </span>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {u.role !== 'admin' && (
                        <button onClick={() => bloquer(u.id, u.statut)} style={{ padding: '5px 10px', borderRadius: '7px', border: `1px solid ${u.statut === 'actif' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, background: u.statut === 'actif' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', color: u.statut === 'actif' ? '#ef4444' : '#10b981', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>
                          {u.statut === 'actif' ? 'Bloquer' : 'Débloquer'}
                        </button>
                      )}
                      <button onClick={() => supprimerUser(u.id)} style={{ padding: '5px 7px', borderRadius: '7px', border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: RÉSERVATIONS ── */}
          {activeTab === 'reservations' && (
            <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>SUIVI</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>Réservations ({reservations.length})</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Étudiant', 'Enseignant', 'Montant', 'Statut', 'Date'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Aucune réservation</td></tr>
                    ) : reservations.map(r => (
                      <tr key={r.id_reservation} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px', fontSize: '0.78rem', color: '#fff', fontWeight: 600 }}>{r.etudiant?.prenom} {r.etudiant?.nom}</td>
                        <td style={{ padding: '12px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{r.creneau?.enseignant?.user?.prenom} {r.creneau?.enseignant?.user?.nom}</td>
                        <td style={{ padding: '12px', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>{r.montant} DH</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: r.statut === 'confirmee' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: r.statut === 'confirmee' ? '#10b981' : '#f59e0b' }}>
                            {r.statut}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB: PAIEMENTS ── */}
          {activeTab === 'paiements' && (
            <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>FINANCES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>Paiements ({paiements.length})</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Montant', 'Commission (10%)', 'Statut', 'Date'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paiements.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Aucun paiement</td></tr>
                    ) : paiements.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px', fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>{p.montant} DH</td>
                        <td style={{ padding: '12px', fontSize: '0.78rem', color: orange, fontWeight: 600 }}>{p.comission || 0} DH</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: p.statut === 'paye' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: p.statut === 'paye' ? '#10b981' : '#f59e0b' }}>
                            {p.statut === 'paye' ? 'Payé' : 'En attente'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB: DEMANDES ── */}
          {activeTab === 'demandes' && (
            <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>DEMANDES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>Demandes étudiants ({demandes.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {demandes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>Aucune demande</div>
                ) : demandes.map(d => (
                  <div key={d.id} style={{ background: '#0d0d0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.82rem' }}>{d.etudiant?.prenom} {d.etudiant?.nom}</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{d.etudiant?.email}</div>
                        <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.55)', marginTop: '6px', maxWidth: '500px' }}>{d.message?.substring(0, 100)}...</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: d.statut === 'traite' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: d.statut === 'traite' ? '#10b981' : '#f59e0b' }}>
                          {d.statut === 'traite' ? 'Traité' : 'En attente'}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MODAL REFUS ── */}
      {refusModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}>
          <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem', width: '100%', maxWidth: '460px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <XCircle size={20} color="#ef4444" />
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Motif du rejet du document</div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Précisez à l'enseignant pourquoi sa validation a été refusée.</div>
            <textarea
              value={refusRaison}
              onChange={e => setRefusRaison(e.target.value)}
              placeholder="Le justificatif du diplôme n'est pas lisible ou non agréé au Maroc."
              rows={4}
              style={{ width: '100%', background: '#0d0d0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: '#fff', fontSize: '0.8rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setRefusModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                Annuler
              </button>
              <button onClick={() => refuser(refusModal)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                Confirmer le Rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}