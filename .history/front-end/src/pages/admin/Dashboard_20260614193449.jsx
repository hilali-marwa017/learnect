import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Chart, registerables } from 'chart.js';
import { Users, ShieldCheck, GraduationCap, AlertCircle, LogOut, Bell, CheckCircle, XCircle, Eye } from 'lucide-react';
import api from '../../api/axios';

Chart.register(...registerables);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalAvis: 0,
    revenusTotal: 0
  });
  const [enseignantsAttente, setEnseignantsAttente] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const donutRef = useRef(null);
  const barRef = useRef(null);
  let donutInstance = useRef(null);
  let barInstance = useRef(null);

  // Couleurs pour le thème
  const isDark = false;
  const bgColor = isDark ? '#0a0a0c' : '#f8f9fc';
  const cardBg = isDark ? '#1a1a1c' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const orange = '#e04f00';

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab !== 'stats') return;
    if (stats.totalEtudiants === 0 && stats.totalEnseignants === 0) return;

    if (donutInstance.current) { donutInstance.current.destroy(); }
    if (barInstance.current) { barInstance.current.destroy(); }

    if (donutRef.current) {
      donutInstance.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Élèves', 'Tuteurs'],
          datasets: [{
            data: [stats.totalEtudiants, stats.totalEnseignants],
            backgroundColor: ['#3b82f6', '#1e293b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: { legend: { display: false } }
        }
      });
    }

    if (barRef.current) {
      barInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: ['Réservations', 'Demandes', 'Paiements', 'Signalements', 'En attente'],
          datasets: [{
            label: 'Total',
            data: [
              stats.totalReservations,
              demandes.length,
              paiements.length,
              signalements.length,
              enseignantsAttente.length
            ],
            backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'],
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }
  }, [activeTab, stats, demandes, paiements, signalements, enseignantsAttente]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, attenteRes, signalementsRes, demandesRes, reservationsRes, paiementsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/enseignants/attente'),
        api.get('/admin/signalements'),
        api.get('/admin/demandes'),
        api.get('/admin/reservations'),
        api.get('/admin/paiements')
      ]);

      setStats({
        totalEtudiants: statsRes.data.total_etudiants || 0,
        totalEnseignants: statsRes.data.total_enseignants || 0,
        totalReservations: statsRes.data.total_reservations || 0,
        totalAvis: statsRes.data.total_avis || 0,
        revenusTotal: statsRes.data.revenus_total || 0
      });
      setUsers(usersRes.data || []);
      setEnseignantsAttente(attenteRes.data || []);
      setSignalements(signalementsRes.data || []);
      setDemandes(demandesRes.data || []);
      setReservations(reservationsRes.data || []);
      setPaiements(paiementsRes.data || []);
      
      // Notification pour les nouveaux enseignants
      if (attenteRes.data && attenteRes.data.length > 0) {
        setNotification(`${attenteRes.data.length} nouveau(x) professeur(s) en attente de vérification`);
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateTeacher = async (id) => {
    try {
      await api.put(`/admin/enseignants/${id}/valider`);
      setEnseignantsAttente(enseignantsAttente.filter(e => e.id !== id));
      alert('Professeur validé avec succès !');
    } catch (err) {
      alert('Erreur lors de la validation');
    }
  };

  const handleRefuseTeacher = async (id) => {
    try {
      await api.put(`/admin/enseignants/${id}/refuser`);
      setEnseignantsAttente(enseignantsAttente.filter(e => e.id !== id));
      alert('Professeur refusé');
    } catch (err) {
      alert('Erreur lors du refus');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'stats', label: 'Tableau de bord', icon: Users },
    { id: 'teachers', label: 'Vérifications', icon: ShieldCheck, count: enseignantsAttente.length },
    { id: 'reports', label: 'Signalements', icon: AlertCircle, count: signalements.length },
    { id: 'demandes', label: 'Demandes', icon: GraduationCap, count: demandes.length },
    { id: 'reservations', label: 'Réservations', icon: Bell, count: reservations.length },
    { id: 'paiements', label: 'Paiements', icon: Bell, count: paiements.length },
    { id: 'users', label: 'Utilisateurs', icon: Users, count: users.length }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgColor }}>
        <div style={{ width: '40px', height: '40px', border: `4px solid ${orange}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '6rem', paddingBottom: '4rem', minHeight: '100vh', background: bgColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Notification banner */}
        {notification && (
          <div style={{ background: orange, color: '#fff', padding: '12px 20px', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell size={18} />
            <span style={{ flex: 1 }}>{notification}</span>
            <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Header */}
        <div style={{ borderBottom: `1px solid ${borderColor}`, paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange }}>ADMIN PANEL</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: textColor, marginTop: '0.25rem' }}>Console de Supervision</h1>
          <p style={{ color: textMuted, fontSize: '0.8rem' }}>Pilotez la qualité pédagogique et gérez les plaintes de Learnect.ma</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: textMuted }}>Total élèves</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: textColor }}>{stats.totalEtudiants}</div>
            </div>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: textMuted }}>Total tuteurs</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: textColor }}>{stats.totalEnseignants}</div>
            </div>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: textMuted }}>Réservations</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: textColor }}>{stats.totalReservations}</div>
            </div>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: textMuted }}>Commission totale</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: textColor }}>{stats.revenusTotal} DH</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${borderColor}`, overflowX: 'auto' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: activeTab === tab.id ? orange : 'transparent',
                    color: activeTab === tab.id ? '#fff' : textMuted,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span style={{ background: activeTab === tab.id ? '#fff' : orange, color: activeTab === tab.id ? orange : '#fff', padding: '2px 6px', borderRadius: '20px', fontSize: '0.7rem' }}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: '1.5rem' }}>
              
              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Répartition utilisateurs</h3>
                    <div style={{ height: '200px' }}>
                      <canvas ref={donutRef}></canvas>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Activité plateforme</h3>
                    <div style={{ height: '200px' }}>
                      <canvas ref={barRef}></canvas>
                    </div>
                  </div>
                </div>
              )}

              {/* Vérifications Tab */}
              {activeTab === 'teachers' && (
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Enseignants en attente ({enseignantsAttente.length})</h3>
                  {enseignantsAttente.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: textMuted }}>Aucune candidature en attente</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {enseignantsAttente.map(teacher => (
                        <div key={teacher.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: `1px solid ${borderColor}`, borderRadius: '12px' }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{teacher.prenom} {teacher.nom}</div>
                            <div style={{ fontSize: '0.7rem', color: textMuted }}>{teacher.email} • {teacher.ville}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleRefuseTeacher(teacher.id)} style={{ padding: '6px 12px', background: 'transparent', border: `1px solid #dc2626`, color: '#dc2626', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem' }}>
                              <XCircle size={14} style={{ display: 'inline', marginRight: '4px' }} /> Refuser
                            </button>
                            <button onClick={() => handleValidateTeacher(teacher.id)} style={{ padding: '6px 12px', background: orange, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem' }}>
                              <CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }} /> Valider
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Signalements Tab */}
              {activeTab === 'reports' && (
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Signalements ({signalements.length})</h3>
                  {signalements.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: textMuted }}>Aucun signalement</div>
                  ) : (
                    signalements.map(s => (
                      <div key={s.id} style={{ padding: '1rem', border: `1px solid ${borderColor}`, borderRadius: '12px', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 700 }}>{s.signaleur?.prenom} {s.signaleur?.nom}</div>
                        <div style={{ fontSize: '0.7rem', color: textMuted }}>Motif: {s.raison}</div>
                        <div style={{ fontSize: '0.65rem', color: textMuted, marginTop: '0.25rem' }}>Date: {new Date(s.created_at).toLocaleDateString()}</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Demandes Tab */}
              {activeTab === 'demandes' && (
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Demandes ({demandes.length})</h3>
                  {demandes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: textMuted }}>Aucune demande</div>
                  ) : (
                    demandes.map(d => (
                      <div key={d.id} style={{ padding: '1rem', border: `1px solid ${borderColor}`, borderRadius: '12px', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 700 }}>{d.etudiant?.prenom} {d.etudiant?.nom}</div>
                        <div style={{ fontSize: '0.7rem', color: textMuted }}>{d.message?.substring(0, 100)}</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Réservations Tab */}
              {activeTab === 'reservations' && (
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Réservations ({reservations.length})</h3>
                  {reservations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: textMuted }}>Aucune réservation</div>
                  ) : (
                    reservations.map(r => (
                      <div key={r.id} style={{ padding: '1rem', border: `1px solid ${borderColor}`, borderRadius: '12px', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 700 }}>Montant: {r.montant} DH</div>
                        <div style={{ fontSize: '0.7rem', color: textMuted }}>Statut: {r.statut}</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Paiements Tab */}
              {activeTab === 'paiements' && (
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Paiements ({paiements.length})</h3>
                  {paiements.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: textMuted }}>Aucun paiement</div>
                  ) : (
                    paiements.map(p => (
                      <div key={p.id} style={{ padding: '1rem', border: `1px solid ${borderColor}`, borderRadius: '12px', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 700 }}>{p.montant} DH</div>
                        <div style={{ fontSize: '0.7rem', color: textMuted }}>Commission: {p.comission || 0} DH</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Utilisateurs Tab */}
              {activeTab === 'users' && (
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Utilisateurs ({users.length})</h3>
                  {users.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: textMuted }}>Aucun utilisateur</div>
                  ) : (
                    users.map(u => (
                      <div key={u.id} style={{ padding: '1rem', border: `1px solid ${borderColor}`, borderRadius: '12px', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 700 }}>{u.prenom} {u.nom}</div>
                        <div style={{ fontSize: '0.7rem', color: textMuted }}>{u.email} • {u.role}</div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}