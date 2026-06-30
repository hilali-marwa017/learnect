import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function StatsSection() {
  const [stats, setStats] = useState({ totalEnseignants: 0, totalMatieres: 0, totalEtudiants: 125 });

  useEffect(() => {
    api.get('/enseignants').then(res => setStats(prev => ({ ...prev, totalEnseignants: res.data.length }))).catch(console.error);
    api.get('/matieres').then(res => setStats(prev => ({ ...prev, totalMatieres: res.data.length }))).catch(console.error);
  }, []);

  const statItems = [
    { label: 'Tuteurs Accrédités', value: stats.totalEnseignants + '+', icon: 'bi-person-check', color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Matières Couvertes', value: stats.totalMatieres + '+', icon: 'bi-book', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Élèves Accompagnés', value: stats.totalEtudiants + '+', icon: 'bi-people', color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Satisfaction Client', value: '4.9/5', icon: 'bi-star-fill', color: 'text-yellow-600', bg: 'bg-yellow-100' }
  ];

  return (
    <section className="py-12 bg-gray-50 border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((stat, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl border shadow-sm text-center md:text-left">
              <div className={`p-2 ${stat.bg} rounded-lg w-fit mx-auto md:mx-0`}>
                <i className={`bi ${stat.icon} ${stat.color}`}></i>
              </div>
              <p className="text-3xl font-black text-gray-900 mt-2">{stat.value}</p>
              <p className="text-gray-500 text-xs uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}