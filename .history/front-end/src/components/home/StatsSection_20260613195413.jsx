import React from 'react'
import { Star, GraduationCap, Users, ShieldCheck } from 'lucide-react'

export default function StatsSection() {
  const stats = [
    { label: 'Tuteurs Accrédités', value: '450+', icon: GraduationCap, color: 'text-accent-orange' },
    { label: 'Matières Couvertes', value: '45+', icon: ShieldCheck, color: 'text-accent-blue' },
    { label: 'Élèves Accompagnés', value: '3,200+', icon: Users, color: 'text-accent-green' },
    { label: 'Satisfaction Client', value: '4.9/5', icon: Star, color: 'text-accent-yellow' },
  ]

  return (
    <section className="py-12 bg-surface-deep/20 border-b border-hairline-strong">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
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
            )
          })}
        </div>
      </div>
    </section>
  )
}