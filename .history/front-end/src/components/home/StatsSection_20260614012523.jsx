import React from 'react';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';

export default function StatsSection({ isDark }) {
  const stats = [
    { icon: GraduationCap, value: '450+', label: 'TUTEURS', color: '#e04f00' },
    { icon: BookOpen, value: '45+', label: 'MATIÈRES', color: '#1c64f2' },
    { icon: Users, value: '3 200+', label: 'ÉLÈVES', color: '#047857' },
    { icon: Star, value: '4.9/5', label: 'SATISFACTION', color: '#b45309' },
  ];

  const bg = isDark ? 'bg-black' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-100';

  return (
    <div className={`py-12 px-6 ${bg} border-t ${borderColor} border-b ${borderColor}`}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-2">
                <Icon size={28} color={s.color} />
              </div>
              <div className={`text-2xl font-bold ${textColor}`}>{s.value}</div>
              <div className={`text-xs ${textMuted} tracking-wide`}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}