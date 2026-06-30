import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Calendar, MessageSquare, Award, BookOpen, Clock, Heart, LogOut, Settings, Sparkles } from 'lucide-react';

export function StudentNavigationActive({ activeTab }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { label: 'Tableau de bord', path: '/etudiant/dashboard', icon: BookOpen, id: 'dashboard' },
    { label: 'Réservations', path: '/etudiant/reservations', icon: Calendar, id: 'reservations' },
    { label: 'Messagerie', path: '/etudiant/messages', icon: MessageSquare, id: 'messages' },
    { label: 'Offres', path: '/etudiant/offres', icon: Award, id: 'offres' },
    { label: 'Mes Demandes', path: '/etudiant/demandes', icon: Sparkles, id: 'requests' },
    { label: 'Profil', path: '/etudiant/profil', icon: Settings, id: 'profile' },
  ];

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-4 space-y-2 shrink-0 md:w-64">
      <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-mute font-bold font-mono">Menu Élève</div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <Link key={link.id} to={link.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive ? 'bg-accent-orange text-canvas font-bold' : 'text-charcoal hover:bg-surface-deep/40 hover:text-ink'}`}>
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-accent-red hover:bg-accent-red/10 cursor-pointer text-left border-none mt-4">
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>Déconnexion</span>
        </button>
      </nav>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    api.get('/reservations')
      .then(function(response) {
        setReservations(response.data);
        setLoading(false);
      })
      .catch(function(err) {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="pt-32 text-center"><div className="spinner-border text-accent-orange"></div></div>;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-hairline-strong pb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">ESPACE ÉTUDIANT</span>
            <h1 className="text-3xl font-black text-ink tracking-tight flex items-center gap-2">Bonjour, {user?.prenom || 'Élève'} <Sparkles className="h-7 w-7 text-accent-orange shrink-0 animate-pulse" /></h1>
            <p className="text-charcoal text-xs">Bienvenue dans votre espace d'étude privé.</p>
          </div>
          <Link to="/teachers" className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wide transition-all self-stretch md:self-auto text-center cursor-pointer">TROUVER UN PROF</Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <StudentNavigationActive activeTab="dashboard" />

          <div className="flex-1 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-orange-glow border border-accent-orange/15 rounded-lg"><Calendar className="h-5 w-5 text-accent-orange" /></div>
                <div><span className="text-[10px] text-mute uppercase font-bold block">CRÉNEAUX PLANIFIÉS</span><p className="text-xl font-bold text-ink">{reservations.length} cours</p></div>
              </div>
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-blue-glow border border-accent-blue/15 rounded-lg"><Clock className="h-5 w-5 text-accent-blue" /></div>
                <div><span className="text-[10px] text-mute uppercase font-bold block">STATUT</span><p className="text-xl font-bold text-ink">En cours</p></div>
              </div>
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-red-glow border border-accent-red/15 rounded-lg"><Heart className="h-5 w-5 fill-accent-red" /></div>
                <div><span className="text-[10px] text-mute uppercase font-bold block">PROFESSEURS</span><p className="text-xl font-bold text-ink">0 favoris</p></div>
              </div>
            </div>

            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-divider-soft pb-3">
                <h3 className="font-heading-md text-sm font-bold uppercase tracking-wider text-ink font-mono">Dernières Réservations</h3>
                <Link to="/etudiant/reservations" className="text-xs text-accent-orange hover:underline font-bold">Voir tout</Link>
              </div>

              {reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.slice(0, 3).map(function(r) {
                    return (
                      <div key={r.id_reservation} className="p-4 bg-surface-deep/40 border border-hairline rounded-xl flex items-center justify-between gap-4 flex-col sm:flex-row">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-accent-orange/20 flex items-center justify-center"><i className="bi bi-person text-accent-orange"></i></div>
                          <div><p className="text-xs font-bold text-ink">Cours du {r.date}</p><p className="text-[10px] text-charcoal">{r.montant} DH</p></div>
                        </div>
                        <div><span className={`px-