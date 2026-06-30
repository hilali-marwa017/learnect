import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Calendar, MessageSquare, Award, BookOpen, Clock, Heart, LogOut, Settings, Sparkles } from 'lucide-react';

export function StudentNavigationActive({ activeTab }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { label: 'Tableau de bord', path: '/student', icon: BookOpen, id: 'dashboard' },
    { label: 'Réservations de cours', path: '/student/reservations', icon: Calendar, id: 'reservations' },
    { label: 'Messagerie', path: '/student/messages', icon: MessageSquare, id: 'messages' },
    { label: 'Offres & Packs', path: '/student/offres', icon: Award, id: 'offres' },
    { label: 'Mes Demandes', path: '/student/requests', icon: Sparkles, id: 'requests' },
    { label: 'Profil Personnel', path: '/student/profile', icon: Settings, id: 'profile' },
  ];

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-4 space-y-2 shrink-0 md:w-64">
      <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-mute font-bold font-mono">Menu Élève</div>
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

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_reservations: 0, total_demandes: 0, total_avis: 0 });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/etudiant/dashboard');
        setStats(res.data.stats);
        setReservations(res.data.etudiant?.reservations?.slice(0, 3) || []);
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
            <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PLATFORM</span>
            <h1 className="text-3xl font-black text-ink tracking-tight flex items-center gap-2">
              Bonjour, {user?.prenom || 'Élève'}
              <Sparkles className="h-7 w-7 text-accent-orange shrink-0 animate-pulse" />
            </h1>
            <p className="text-charcoal text-xs">Bienvenue dans votre espace d'étude privé.</p>
          </div>
          <Link to="/teachers"
            className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wide transition-all self-stretch md:self-auto text-center cursor-pointer">
            TROUVER UN NOUVEAU PROF
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <StudentNavigationActive activeTab="dashboard" />

          <div className="flex-1 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-orange-glow border border-accent-orange/15 rounded-lg text-accent-orange"><Calendar className="h-5 w-5" /></div>
                <div>
                  <span className="text-[10px] text-mute uppercase font-bold font-mono block">RÉSERVATIONS</span>
                  <p className="text-xl font-bold text-ink">{stats.total_reservations}</p>
                </div>
              </div>
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-blue-glow border border-accent-blue/15 rounded-lg text-accent-blue"><MessageSquare className="h-5 w-5" /></div>
                <div>
                  <span className="text-[10px] text-mute uppercase font-bold font-mono block">DEMANDES</span>
                  <p className="text-xl font-bold text-ink">{stats.total_demandes}</p>
                </div>
              </div>
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-red-glow border border-accent-red/15 rounded-lg text-accent-red"><Heart className="h-5 w-5 fill-accent-red" /></div>
                <div>
                  <span className="text-[10px] text-mute uppercase font-bold font-mono block">AVIS LAISSÉS</span>
                  <p className="text-xl font-bold text-ink">{stats.total_avis}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-divider-soft pb-3">
                <h3 className="font-heading-md text-sm font-bold uppercase tracking-wider text-ink font-mono">Dernières Réservations</h3>
                <Link to="/student/reservations" className="text-xs text-accent-orange hover:underline font-bold">Voir toutes</Link>
              </div>

              {loading ? (
                <p className="text-xs text-mute text-center py-8 font-mono animate-pulse">Chargement...</p>
              ) : reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map((r) => (
                    <div key={r.id_reservation}
                      className="p-4 bg-surface-deep/40 border border-hairline rounded-xl flex items-center justify-between gap-4 flex-col sm:flex-row text-center sm:text-left">
                      <div>
                        <p className="text-xs font-bold text-ink">
                          {r.creneau?.enseignant?.user?.prenom} {r.creneau?.enseignant?.user?.nom}
                        </p>
                        <p className="text-[10px] text-charcoal mt-0.5">Le {r.date} — {r.creneau?.jour} {r.creneau?.heureDebut}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono uppercase ${
                        r.statut === 'confirmee' ? 'bg-accent-green/10 border border-accent-green/20 text-accent-green' :
                        r.statut === 'en_attente' ? 'bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow' :
                        'bg-accent-red/10 border border-accent-red/20 text-accent-red'
                      }`}>{r.statut}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-surface-deep/20 border border-hairline-strong/30 rounded-xl space-y-4 max-w-md mx-auto">
                  <p className="text-xs text-mute font-semibold">Aucun cours programmé pour l'instant.</p>
                  <Link to="/teachers"
                    className="inline-block bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-accent-orange hover:text-white transition-all">
                    DÉCOUVRIR LES PROFESSEURS
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}