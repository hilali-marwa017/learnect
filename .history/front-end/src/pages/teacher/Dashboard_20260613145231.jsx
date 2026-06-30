import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Calendar, Star, DollarSign, Clock, LogOut, Settings, BarChart2, BookOpen } from 'lucide-react';

export function TeacherNavigationActive({ activeTab }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { label: 'Tableau de bord', path: '/teacher', icon: BarChart2, id: 'dashboard' },
    { label: 'Disponibilités', path: '/teacher/availability', icon: Calendar, id: 'availability' },
    { label: 'Gains & Paiements', path: '/teacher/earnings', icon: DollarSign, id: 'earnings' },
    { label: 'Mon Profil', path: '/teacher/profile', icon: Settings, id: 'profile' },
  ];

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-4 space-y-2 shrink-0 md:w-64">
      <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-mute font-bold font-mono">Menu Professeur</div>
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
          <span>Fermer ma session</span>
        </button>
      </nav>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_avis: 0, note_moyenne: 0, creneaux_dispos: 0, offres_en_attente: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/enseignant/dashboard');
        setStats(res.data.stats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-hairline-strong pb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">ESPACE PROFESSEUR</span>
            <h1 className="text-3xl font-black text-ink tracking-tight">
              Bonjour, {user?.prenom || 'Professeur'} 👋
            </h1>
            <p className="text-charcoal text-xs">Gérez vos créneaux, réservations et revenus depuis votre espace privé.</p>
          </div>
          <Link to="/teacher/availability"
            className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wide transition-all self-stretch md:self-auto text-center cursor-pointer">
            GÉRER MES DISPONIBILITÉS
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <TeacherNavigationActive activeTab="dashboard" />

          <div className="flex-1 space-y-8">
            {loading ? (
              <p className="text-xs text-mute text-center py-16 font-mono animate-pulse">Chargement du tableau de bord...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-accent-yellow/10 border border-accent-yellow/20 rounded-lg text-accent-yellow"><Star className="h-5 w-5" /></div>
                    <div>
                      <span className="text-[10px] text-mute uppercase font-bold font-mono block">NOTE MOYENNE</span>
                      <p className="text-xl font-bold text-ink">{stats.note_moyenne} / 5</p>
                    </div>
                  </div>
                  <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-accent-blue-glow border border-accent-blue/15 rounded-lg text-accent-blue"><BookOpen className="h-5 w-5" /></div>
                    <div>
                      <span className="text-[10px] text-mute uppercase font-bold font-mono block">AVIS REÇUS</span>
                      <p className="text-xl font-bold text-ink">{stats.total_avis}</p>
                    </div>
                  </div>
                  <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-accent-green-glow border border-accent-green/15 rounded-lg text-accent-green"><Clock className="h-5 w-5" /></div>
                    <div>
                      <span className="text-[10px] text-mute uppercase font-bold font-mono block">CRÉNEAUX DISPOS</span>
                      <p className="text-xl font-bold text-ink">{stats.creneaux_dispos}</p>
                    </div>
                  </div>
                  <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-accent-orange-glow border border-accent-orange/15 rounded-lg text-accent-orange"><Calendar className="h-5 w-5" /></div>
                    <div>
                      <span className="text-[10px] text-mute uppercase font-bold font-mono block">OFFRES EN ATTENTE</span>
                      <p className="text-xl font-bold text-ink">{stats.offres_en_attente}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-4">
                  <h3 className="font-heading-md text-sm font-bold uppercase tracking-wider text-ink font-mono border-b border-divider-soft pb-3">
                    Actions rapides
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/teacher/availability"
                      className="p-4 bg-surface-deep/40 border border-hairline rounded-xl hover:border-accent-orange/30 transition-all group cursor-pointer">
                      <p className="text-xs font-bold text-ink group-hover:text-accent-orange">📅 Gérer mes créneaux</p>
                      <p className="text-[10px] text-mute mt-1">Ajoutez ou modifiez vos disponibilités</p>
                    </Link>
                    <Link to="/teacher/profile"
                      className="p-4 bg-surface-deep/40 border border-hairline rounded-xl hover:border-accent-blue/30 transition-all group cursor-pointer">
                      <p className="text-xs font-bold text-ink group-hover:text-accent-blue">✏️ Compléter mon profil</p>
                      <p className="text-[10px] text-mute mt-1">Titre, description, tarif horaire</p>
                    </Link>
                    <Link to="/teacher/earnings"
                      className="p-4 bg-surface-deep/40 border border-hairline rounded-xl hover:border-accent-green/30 transition-all group cursor-pointer">
                      <p className="text-xs font-bold text-ink group-hover:text-accent-green">💰 Voir mes revenus</p>
                      <p className="text-[10px] text-mute mt-1">Historique des paiements reçus</p>
                    </Link>
                    <Link to="/teachers"
                      className="p-4 bg-surface-deep/40 border border-hairline rounded-xl hover:border-accent-yellow/30 transition-all group cursor-pointer">
                      <p className="text-xs font-bold text-ink group-hover:text-accent-yellow">🔍 Voir mon profil public</p>
                      <p className="text-[10px] text-mute mt-1">Comment les étudiants vous voient</p>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}