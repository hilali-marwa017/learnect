import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Users, ShieldCheck, GraduationCap, AlertCircle, LogOut, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios.js';

function AdminNavigationActive({ ongletActif }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const liens = [
    { label: "Vue d'ensemble", path: '/admin', icon: Users, id: 'dashboard' },
    { label: 'Gérer Utilisateurs', path: '/admin/users', icon: GraduationCap, id: 'users' },
    { label: 'Tuteurs Validés', path: '/admin/validated', icon: ShieldCheck, id: 'validated' },
    { label: 'Signalements / Refus', path: '/admin/signalements', icon: AlertCircle, id: 'signalements' },
  ];

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-4 space-y-2 shrink-0 md:w-64">
      <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-mute font-bold font-mono">
        Menu Administration
      </div>
      <nav className="space-y-1">
        {liens.map(function(lien) {
          const Icon = lien.icon;
          const estActif = ongletActif === lien.id;
          return (
            <Link
              key={lien.id}
              to={lien.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                estActif
                  ? 'bg-accent-orange text-canvas font-bold'
                  : 'text-charcoal hover:bg-surface-deep/40 hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{lien.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-accent-red hover:bg-accent-red/10 cursor-pointer text-left border-none mt-4"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Fermer Administration</span>
        </button>
      </nav>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [enseignantsEnAttente, setEnseignantsEnAttente] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(function() {
    async function chargerDonnees() {
      setChargement(true);
      try {
        const [reponseStats, reponseAttente] = await Promise.allSettled([
          api.get('/admin/stats'),
          api.get('/admin/enseignants/attente'),
        ]);

        if (reponseStats.status === 'fulfilled') {
          setStats(reponseStats.value.data);
        }
        if (reponseAttente.status === 'fulfilled') {
          setEnseignantsEnAttente(reponseAttente.value.data);
        }
      } catch (err) {
        setErreur('Erreur lors du chargement des données.');
      } finally {
        setChargement(false);
      }
    }

    chargerDonnees();
  }, []);

  async function handleValider(idEnseignant) {
    try {
      await api.put(`/admin/enseignants/${idEnseignant}/valider`);
      setEnseignantsEnAttente(enseignantsEnAttente.filter(function(e) {
        return e.id !== idEnseignant;
      }));
    } catch (err) {
      alert('Erreur lors de la validation.');
    }
  }

  async function handleRefuser(idEnseignant) {
    try {
      await api.put(`/admin/enseignants/${idEnseignant}/refuser`);
      setEnseignantsEnAttente(enseignantsEnAttente.filter(function(e) {
        return e.id !== idEnseignant;
      }));
    } catch (err) {
      alert('Erreur lors du refus.');
    }
  }

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="animate-spin h-8 w-8 border-4 border-accent-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8">

        {/* Bannière */}
        <div className="border-b border-hairline-strong pb-6 space-y-1 flex justify-between items-end flex-wrap gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">
              ADMIN PANEL
            </span>
            <h1 className="text-3xl font-black text-ink tracking-tight">Console de Supervision</h1>
            <p className="text-charcoal text-xs">
              Pilotez la qualité pédagogique et gérez les utilisateurs de Learnect.ma.
            </p>
          </div>
          <p className="text-[11px] font-mono text-charcoal bg-surface-card border border-hairline px-3.5 py-1.5 rounded-lg shrink-0">
            Connecté : <strong className="text-ink">{user?.prenom} {user?.nom}</strong>
          </p>
        </div>

        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg">
            {erreur}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <AdminNavigationActive ongletActif="dashboard" />

          <div className="flex-grow space-y-8">

            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-surface-card border border-hairline-strong p-5 rounded-xl space-y-1">
                <span className="text-[9px] font-mono font-bold text-mute uppercase block">UTILISATEURS TOTAL</span>
                <p className="text-2xl font-black text-ink">{stats?.total_utilisateurs ?? '—'}</p>
              </div>
              <div className="bg-surface-card border border-hairline-strong p-5 rounded-xl space-y-1">
                <span className="text-[9px] font-mono font-bold text-mute uppercase block">ENSEIGNANTS EN ATTENTE</span>
                <p className="text-2xl font-black text-accent-orange">{enseignantsEnAttente.length}</p>
              </div>
              <div className="bg-surface-card border border-hairline-strong p-5 rounded-xl space-y-1">
                <span className="text-[9px] font-mono font-bold text-mute uppercase block">RÉSERVATIONS</span>
                <p className="text-2xl font-black text-ink">{stats?.total_reservations ?? '—'}</p>
              </div>
              <div className="bg-surface-card border border-hairline-strong p-5 rounded-xl space-y-1">
                <span className="text-[9px] font-mono font-bold text-mute uppercase block">REVENUS TOTAL</span>
                <p className="text-2xl font-black text-accent-green">{stats?.total_paiements ?? '—'} MAD</p>
              </div>
            </div>

            {/* Candidatures en attente */}
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink font-mono border-b border-hairline pb-3">
                Candidatures Enseignants en attente de validation
              </h3>

              {enseignantsEnAttente.length > 0 ? (
                <div className="space-y-4">
                  {enseignantsEnAttente.map(function(candidat) {
                    return (
                      <div
                        key={candidat.id}
                        className="p-5 bg-surface-deep/30 border border-hairline rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-ink">
                            {candidat.prenom} {candidat.nom}
                          </h4>
                          <p className="text-xs text-mute font-semibold">
                            {candidat.ville} • <span className="text-accent-blue">{candidat.email}</span>
                          </p>
                          {candidat.bio && (
                            <p className="text-xs text-charcoal mt-1">"{candidat.bio}"</p>
                          )}
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <button
                            onClick={function() { handleRefuser(candidat.id); }}
                            className="p-2 px-3.5 border border-accent-red/20 bg-accent-red/10 hover:bg-accent-red text-accent-red hover:text-white rounded-lg text-xs font-bold cursor-pointer font-mono uppercase flex items-center gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Refuser
                          </button>
                          <button
                            onClick={function() { handleValider(candidat.id); }}
                            className="p-2 px-4 bg-accent-orange text-canvas hover:bg-ink text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer font-mono"
                          >
                            <CheckCircle className="h-4 w-4" />
                            VALIDER
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-surface-deep/25 rounded-xl space-y-1 text-xs">
                  <p className="text-3xl">☕</p>
                  <p className="text-mute font-bold font-mono">File d'attente propre.</p>
                  <p className="text-mute">Toutes les candidatures ont été traitées.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}