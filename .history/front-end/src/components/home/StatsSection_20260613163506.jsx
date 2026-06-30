import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function StatsSection() {
  var [stats, setStats] = useState({
    totalEnseignants: 0,
    totalMatieres: 0,
    totalEtudiants: 0,
    noteMoyenne: 4.9
  });

  useEffect(function() {
    // Récupérer les enseignants (route publique)
    api.get('/enseignants')
      .then(function(response) {
        setStats(function(prev) {
          return { ...prev, totalEnseignants: response.data.length };
        });
      })
      .catch(function(err) {
        console.error('Erreur enseignants:', err);
      });

    // Récupérer les matières (route publique)
    api.get('/matieres')
      .then(function(response) {
        setStats(function(prev) {
          return { ...prev, totalMatieres: response.data.length };
        });
      })
      .catch(function(err) {
        console.error('Erreur matieres:', err);
      });

    // Récupérer les étudiants via /users (si accessible sans auth)
    api.get('/users')
      .then(function(response) {
        if (Array.isArray(response.data)) {
          var etudiants = response.data.filter(function(u) { return u.role === 'etudiant'; });
          setStats(function(prev) {
            return { ...prev, totalEtudiants: etudiants.length };
          });
        }
      })
      .catch(function(err) {
        console.error('Erreur etudiants:', err);
        // Valeur par défaut si la route n'existe pas
        setStats(function(prev) {
          return { ...prev, totalEtudiants: 150 };
        });
      });
  }, []);

  var statItems = [
    { label: 'Tuteurs Accrédités', value: stats.totalEnseignants + '+', bg: 'bg-orange-100', color: 'text-orange-600' },
    { label: 'Matières Couvertes', value: stats.totalMatieres + '+', bg: 'bg-blue-100', color: 'text-blue-600' },
    { label: 'Élèves Accompagnés', value: stats.totalEtudiants + '+', bg: 'bg-green-100', color: 'text-green-600' },
    { label: 'Satisfaction Client', value: stats.noteMoyenne + '/5', bg: 'bg-yellow-100', color: 'text-yellow-600' }
  ];

  return (
    <section className="py-12 bg-gray-50 border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map(function(stat, idx) {
            return (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left space-y-2 p-4 bg-white rounded-xl border shadow-sm">
                <div className={`p-2 ${stat.bg} rounded-lg w-fit`}>
                  <div className={`h-5 w-5 ${stat.color}`}>
                    {idx === 0 && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    {idx === 1 && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                    {idx === 2 && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                    {idx === 3 && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 tracking-tight font-mono">{stat.value}</p>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}