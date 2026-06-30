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
          <div className="flex flex-col gap-5 p-8 bg-surface-card border border-hairline-strong rounded-2xl">
            <div className="p-3 bg-surface-deep border border-hairline-strong rounded-xl w-fit">
              <svg className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div className="space-y-2">
              <h4 className="font-heading-sm text-lg text-ink font-semibold">Processus de vérification strict</h4>
              <p className="text-charcoal text-sm leading-relaxed">Nous vérifions manuellement l'identité, l'authenticité des diplômes d'État et l'expérience académique de chaque enseignant.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-8 bg-surface-card border border-hairline-strong rounded-2xl">
            <div className="p-3 bg-surface-deep border border-hairline-strong rounded-xl w-fit">
              <svg className="h-6 w-6 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="space-y-2">
              <h4 className="font-heading-sm text-lg text-ink font-semibold">Zéro commission cachée</h4>
              <p className="text-charcoal text-sm leading-relaxed">Seulement 10% de frais fixes de mise en relation. Pas d'abonnement ou de frais cachés.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-8 bg-surface-card border border-hairline-strong rounded-2xl">
            <div className="p-3 bg-surface-deep border border-hairline-strong rounded-xl w-fit">
              <svg className="h-6 w-6 text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="space-y-2">
              <h4 className="font-heading-sm text-lg text-ink font-semibold">Mise en relation directe</h4>
              <p className="text-charcoal text-sm leading-relaxed">Échangez gratuitement avec votre tuteur potentiel via notre messagerie sécurisée.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}