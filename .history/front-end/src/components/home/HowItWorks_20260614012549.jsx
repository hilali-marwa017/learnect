import React from 'react';
import { Search, MessageCircle, TrendingUp } from 'lucide-react';

export default function HowItWorks({ isDark }) {
  const steps = [
    { num: '01', icon: Search, title: 'Cherchez le tuteur parfait', desc: 'Renseignez la matière et votre ville pour filtrer les professeurs.', color: '#e04f00' },
    { num: '02', icon: MessageCircle, title: 'Échangez et offrez le diagnostic', desc: "Première heure d'évaluation totalement offerte.", color: '#1c64f2' },
    { num: '03', icon: TrendingUp, title: 'Apprenez et progressez', desc: 'Cours à domicile ou en ligne, sans engagement.', color: '#047857' },
  ];

  const bg = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  return (
    <section className={`py-16 px-6 text-center ${bg} border-t ${borderColor} border-b ${borderColor}`}>
      <div className="max-w-5xl mx-auto">
        <span className="text-xs tracking-wider font-bold text-orange-accent uppercase">MÉTHODOLOGIE</span>
        <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mt-2 mb-2`}>Comment fonctionne Learnect ?</h2>
        <p className={`text-sm ${textMuted} mb-12`}>Une mise en relation simple, rapide et sécurisée.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num}>
                <div className={`w-14 h-14 mx-auto rounded-2xl border ${borderColor} flex items-center justify-center font-mono font-bold text-xl mb-4`} style={{ color: step.color }}>
                  {step.num}
                </div>
                <Icon size={28} color={step.color} className="mx-auto mb-3" />
                <h3 className={`font-semibold ${textColor} mb-2`}>{step.title}</h3>
                <p className={`text-sm ${textMuted} px-4`}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}