import React from 'react'
import { ShieldCheck, Scale, Flame } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section id="verification-section" className="py-24 bg-canvas relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-accent-blue-glow/20 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-blue font-bold block">CONFIANCE & INTÉGRITÉ</span>
          <h2 className="font-display-lg text-4xl md:text-5xl text-ink leading-[1.1] tracking-tight">Qualité garantie, transparence totale.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, color: 'text-accent-blue', hoverBorder: 'hover:border-accent-blue/30', hoverBg: 'group-hover:bg-accent-blue-glow', title: 'Processus de vérification strict', desc: 'Nous vérifions manuellement l\'identité, l\'authenticité des diplômes et l\'expérience académique de chaque enseignant.' },
            { icon: Scale, color: 'text-accent-green', hoverBorder: 'hover:border-accent-green/30', hoverBg: 'group-hover:bg-accent-green-glow', title: 'Zéro commission cachée', desc: 'Seulement 10% de frais fixes de mise en relation. Pas d\'abonnement ou de frais cachés.' },
            { icon: Flame, color: 'text-accent-yellow', hoverBorder: 'hover:border-accent-yellow/30', hoverBg: 'group-hover:bg-accent-orange-glow', title: 'Mise en relation directe', desc: 'Échangez via notre messagerie sécurisée, définissez vos objectifs, puis réservez votre première heure offerte.' },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className={`flex flex-col gap-5 p-8 bg-surface-card border border-hairline-strong rounded-2xl ${item.hoverBorder} hover:shadow-lg transition-all group`}>
                <div className={`p-3 bg-surface-deep border border-hairline-strong rounded-xl ${item.hoverBg} w-fit transition-colors shrink-0`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-heading-sm text-lg text-ink font-semibold">{item.title}</h4>
                  <p className="text-charcoal text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}