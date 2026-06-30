import React from 'react';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';

export default function StatsSection({ isDark }) {
  const stats = [
    { icon: GraduationCap, val: '450+', label: 'Tuteurs Accrédités', color: 'text-accent-orange' },
    { icon: BookOpen, val: '45+', label: 'Matières Couvertes', color: 'text-accent-blue' },
    { icon: Users, val: '3 200+', label: 'Élèves Accompagnés', color: 'text-accent-green' },
    { icon: Star, val: '4.9/5', label: 'Satisfaction Client', color: 'text-accent-yellow' },
  ];

  return (
    <div className="py-12 bg-surface-deep/20 border-y border-hairline-strong">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(function(stat, idx) {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left space-y-2 p-4 bg-surface-card rounded-xl border border-hairline-strong hover:shadow-lg transition-all duration-300 group">
                <div className="p-2 bg-surface-deep border border-hairline rounded-lg w-fit group-hover:scale-110 transition-transform">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-black text-ink tracking-tight font-mono">{stat.val}</p>
                  <p className="text-mute text-xs font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}