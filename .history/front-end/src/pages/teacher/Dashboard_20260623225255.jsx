import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  Calendar, DollarSign, Award, BookOpen,
  Clock, Settings, LogOut, Check, X, ShieldAlert, Star
} from 'lucide-react';

export function TeacherNavigationActive({ activeTab }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { label: 'Tableau de bord', path: '/teacher/dashboard', icon: BookOpen, id: 'dashboard' },
    { label: 'Disponibilités', path: '/teacher/availability', icon: Calendar, id: 'availability' },
    { label: 'Mes Revenus', path: '/teacher/earnings', icon: DollarSign, id: 'earnings' },
    { label: 'Modifier Profil', path: '/teacher/profile', icon: Settings, id: 'profile' },
  ];

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-4 space-y-2 shrink-0 md:w-64">
      <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-mute font-bold font-mono">
        Menu Enseignant
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <Link
              key={link.id}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-accent-orange text-canvas font-bold'
                  : 'text-charcoal hover:bg-surface-deep/40 hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 cursor-pointer text-left border-none mt-4 bg-transparent"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Quitter la session</span>
        </button>
      </nav>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
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
        resRes.data.forEach(creneau => {
          (creneau.reservations || []).forEach(r => {
            all.push({ ...r, creneau });
          });
        });
        setReservations(all);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleAction(id, action) {
    try {
      if (action === 'confirmer') {
        await api.post(`/reservations/${id}/confirmer-paiement`);
      } else {
        await api.delete(`/reservations/${id}`);
      }
      setReservations(prev =>
        prev.map(r => r.id_reservation === id
          ? { ...r, statut: action === 'confirmer' ? 'confirmee' : 'annulee' }
          : r
        )
      );
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur.');
    }
  }

  const pending = reservations.filter(r => r.statut === 'en_attente');

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">

        {/* Bannière */}
        <div className="bg-surface-card border border-hairline-strong p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-orange/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PROF PLATFORM</span>
            <h1 className="text-3xl font-black text-ink tracking-tight">Espace Professeur : {user?.prenom} {user?.nom}</h1>
            <p className="text-charcoal text-xs">Administrez vos demandes d'heures de soutien scolaire et validez vos cours à domicile ou à distance.</p>
          </div>
          <span className="relative z-10 shrink-0 font-mono text-xs font-bold text-accent-green bg-accent-green/5 border border-accent-green/10 px-3.5 py-1.5 rounded-full uppercase">● STATUS : COMPTE VÉRIFIÉ</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <TeacherNavigationActive activeTab="dashboard" />

          <div className="flex-grow space-y-8">

            {/* Métriques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-green-glow border border-accent-green/15 rounded-lg text-accent-green shrink-0">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-mute uppercase font-bold block font-mono">OFFRES EN ATTENTE</span>
                  <p className="text-xl font-bold text-ink">{loading ? '...' : stats?.offres_en_attente ?? 0}</p>
                </div>
              </div>

              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-blue-glow border border-accent-blue/15 rounded-lg text-accent-blue shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-mute uppercase font-bold block font-mono">CRÉNEAUX DISPOS</span>
                  <p className="text-xl font-bold text-ink">{loading ? '...' : `${stats?.creneaux_dispos ?? 0} créneaux`}</p>
                </div>
              </div>

              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-yellow/10 border border-accent-yellow/20 rounded-lg text-accent-yellow shrink-0">
                  <Star className="h-5 w-5 fill-accent-yellow" />
                </div>
                <div>
                  <span className="text-[10px] text-mute uppercase font-bold block font-mono">NOTE DU PROFIL</span>
                  <p className="text-xl font-bold text-ink">{loading ? '...' : `${stats?.note_moyenne ?? 0} / 5`}</p>
                </div>
              </div>
            </div>

            {/* Tableau réservations */}
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink font-mono border-b border-divider-soft pb-3">
                Demandes de réservation en attente d'approbation
              </h3>

              {loading ? (
                <div className="text-center py-10 text-mute text-xs font-mono">Chargement...</div>
              ) : pending.length > 0 ? (
                <div className="divide-y divide-hairline">
                  {pending.map((r) => (
                    <div key={r.id_reservation} className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left hover:bg-surface-deep/10 px-4 rounded-xl transition-colors">
                      <div className="space-y-1 flex-grow">
                        <span className="text-[9px] font-mono font-bold uppercase text-accent-blue bg-accent-blue/5 border border-accent-blue/15 px-2 py-0.5 rounded">
                          {r.creneau?.jour} — {r.creneau?.heureDebut?.slice(0,5)} à {r.creneau?.heureFin?.slice(0,5)}
                        </span>
                        <h4 className="text-sm font-black text-ink pt-1">{r.etudiant?.prenom} {r.etudiant?.nom}</h4>
                        <p className="text-xs text-mute font-mono">
                          Le {r.date} — {r.montant} DH
                          {r.montant === 0 && <span className="ml-2 text-accent-green font-bold">1er cours offert</span>}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => handleAction(r.id_reservation, 'confirmer')}
                          className="p-2 border border-accent-green/20 bg-accent-green/10 hover:bg-accent-green text-accent-green hover:text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                        >
                          <Check className="h-4 w-4" /><span>Approuver</span>
                        </button>
                        <button
                          onClick={() => handleAction(r.id_reservation, 'annuler')}
                          className="p-2 border border-accent-red/20 bg-accent-red/10 hover:bg-accent-red text-accent-red hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-surface-deep/20 border border-hairline-strong/30 rounded-xl space-y-4 max-w-md mx-auto">
                  <div className="flex justify-center">
                    <div className="p-3 bg-accent-orange/10 border border-accent-orange/15 rounded-full text-accent-orange">
                      <Clock className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-xs text-mute font-semibold">Aucun créneau de soutien scolaire réservé actuellement.</p>
                </div>
              )}
            </div>

            {/* Consigne */}
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 flex items-start gap-4">
              <ShieldAlert className="h-5 w-5 text-accent-orange shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-ink">Consigne d'assiduité importante concernant la première heure de cours</h4>
                <p className="text-xs text-mute leading-relaxed font-semibold">Le premier entretien avec l'élève est toujours offert sur Learnect. Déterminez ensemble ses objectifs, évaluez ses points faibles et mettez en