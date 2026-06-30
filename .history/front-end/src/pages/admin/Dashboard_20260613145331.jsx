import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Users, ShieldCheck, GraduationCap, AlertCircle, LogOut, CheckCircle } from 'lucide-react';

export function AdminNavigationActive({ activeTab }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { label: "Vue d'ensemble", path: '/admin', icon: Users, id: 'dashboard' },
    { label: 'Gérer Utilisateurs', path: '/admin/users', icon: GraduationCap, id: 'users' },
    { label: 'Tuteurs Validés', path: '/admin/validated', icon: ShieldCheck, id: 'validated' },
    { label: 'Signalements', path: '/admin/signalements', icon: AlertCircle, id: 'signalements' },
  ];

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-4 space-y-2 shrink-0 md:w-64">
      <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-mute font-bold font-mono">Menu Administration</div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <Link key={link.id} to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive ? 'bg-accent-orange text-canvas font-bold' : 'text-charcoal hover:bg-surface-deep/40 hover:text-ink'}`}>
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <button onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-accent-red hover:bg-accent-red/10 cursor-pointer text-left border-none mt-4">
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>Fermer Administration</span>
        </button>
      </nav>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_etudiants: 0, total_enseignants: 0, total_reservations: 0, total_avis: 0, revenus_total: 0 });
  const [enseignantsEnAttente, setEnseignantsEnAttente] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, attentesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/enseignants-en-attente'),
      ]);
      setStats(statsRes.data);
      setEnseignantsEnAttente(attentesRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleValider = async (utilisateur_id) => {
    try {
      await api.post(`/admin/enseignants/${utilisateur_id}/valider`);
      setEnseignantsEnAttente((prev) => prev.filter((e) => e.utilisateur_id !== utilisateur_id));
      alert('Enseignant validé avec succès !');
    } catch (e) {
      alert('Erreur lors de la validation.');
    }
  };

  const handleRefuser = async (utilisateur_id) => {
    const raison = window.prompt('Raison du refus :');
    if (!raison) return;
    try {
      await api.post(`/admin/enseignants/${utilisateur_id}/refuser`, { raison });
      setEnseignantsEnAttente((prev) => prev.filter((e) => e.utilisateur_id !== utilisateur_id));
      alert('Enseignant refusé.');
    } catch (e) {
      alert('Erreur lors du refus.');
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">

        <div className="border-b border-hairline-strong pb-6 space-y-1 flex justify-between items-end flex-wrap gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">ADMIN PANEL</span>
            <h1 className="text-3xl font-black text-ink tracking-tight">Console de Supervision</h1>
            <p className="text-charcoal text-xs">Pilotez la qualité et gérez les dossiers de Learnect.ma</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <AdminNavigationActive activeTab="dashboard" />

          <div className="flex-grow space-y-8">

            {loading ? (
              <p className="text-xs text-mute text-center py-16 animate-pulse font-mono">Chargement...</p>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {[
                    { label: 'ÉTUDIANTS', value: stats.total_etudiants },
                    { label: 'ENSEIGNANTS', value: stats.total_enseignants },
                    { label: 'RÉSERVATIONS', value: stats.total_reservations },
                    { label: 'AVIS', value: stats.total_avis },
                    { label: 'REVENUS (MAD)', value: stats.revenus_total },
                  ].map((s) => (
                    <div key={s.label} className="bg-surface-card border border-hairline-strong p-5 rounded-xl space-y-1">
                      <span className="text-[9px] font-mono font-bold text-mute uppercase block">{s.label}</span>
                      <p className="text-2xl font-black text-ink">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Enseignants en attente */}
                <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-6">
                  <h3 className="font-heading-md text-sm font-bold uppercase tracking-wider text-ink font-mono border-b border-divider-soft pb-3">
                    Candidatures en attente ({enseignantsEnAttente.length})
                  </h3>

                  {enseignantsEnAttente.length > 0 ? (
                    <div className="space-y-4">
                      {enseignantsEnAttente.map((e) => (
                        <div key={e.utilisateur_id}
                          className="p-5 bg-surface-deep/30 border border-hairline rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="flex gap-4 items-start">
                            {e.user?.photo && <img src={e.user.photo} alt="" className="h-12 w-12 rounded-xl object-cover border border-hairline shrink-0" />}
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm text-ink">{e.user?.prenom} {e.user?.nom}</h4>
                              <p className="text-xs text-mute font-semibold">{e.user?.ville} • {e.user?.email}</p>
                              <div className="flex flex-wrap gap-2 pt-1">
                                {e.documents?.map((doc, idx) => (
                                  <span key={idx} className="bg-surface-card border border-hairline text-mute text-[9px] font-bold font-mono px-2 py-0.5 rounded">
                                    📎 {doc.type}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <button onClick={() => handleRefuser(e.utilisateur_id)}
                              className="p-2 px-3.5 border border-accent-red/20 bg-accent-red/10 hover:bg-accent-red text-accent-red hover:text-white rounded-lg transition-colors text-xs font-bold cursor-pointer font-mono uppercase">
                              Refuser
                            </button>
                            <button onClick={() => handleValider(e.utilisateur_id)}
                              className="p-2 px-4 bg-accent-orange text-canvas hover:bg-ink text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-mono">
                              <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                              <span>VALIDER</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-surface-deep/25 rounded-xl space-y-1 text-xs">
                      <p className="text-3xl">☕</p>
                      <p className="text-mute font-bold font-mono">Aucune candidature en attente.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}