import React, { useState, useEffect } from 'react';
import { Star, GraduationCap, Users, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';

export default function StatsSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => setStats({
        total_enseignants: '450+',
        total_etudiants: '3 200+',
        total_reservations: '8 500+',
        total_avis: '4.9/5',
      }));
  }, []);

  const items = [
    { label: 'Tuteurs Accrédités', value: stats?.total_enseignants ?? '...', icon: GraduationCap, color: 'text-accent-orange' },
    { label: 'Élèves Accompagnés', value: stats?.total_etudiants ?? '...', icon: Users, color: 'text-accent-blue' },
    { label: 'Réservations', value: stats?.total_reservations ?? '...', icon: ShieldCheck, color: 'text-accent-green' },
    { label: 'Avis clients', value: stats?.total_avis ?? '...', icon: Star, color: 'text-accent-yellow' },
  ];

  return (
    <section className="py-12 bg-surface-deep/20 border-b border-hairline-strong">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left space-y-2 p-4 bg-surface-card rounded-xl border border-hairline-strong">
                <div className="p-2 bg-surface-deep border border-hairline rounded-lg w-fit">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-black text-ink tracking-tight font-mono">{stat.value}</p>
                  <p className="text-mute text-xs font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}