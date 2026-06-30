import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, GraduationCap, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminNavigation({ ongletActif }) {
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