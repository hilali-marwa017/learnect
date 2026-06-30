export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-surface-deep/30 border-y border-hairline-strong relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-orange font-bold block">MÉTHODOLOGIE ET ACCOMPAGNEMENT</span>
          <h2 className="font-display-lg text-4xl md:text-5xl text-ink leading-[1.1] tracking-tight">Comment fonctionne Learnect&nbsp;?</h2>
          <p className="text-mute text-sm">Une mise en relation simple, rapide et entièrement sécurisée.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-surface-card border border-hairline-strong flex items-center justify-center text-xl font-bold font-mono text-accent-orange shadow-md">01</div>
            <div className="space-y-2">
              <h3 className="font-heading-sm text-lg text-ink font-bold">Cherchez le tuteur parfait</h3>
              <p className="text-charcoal text-sm leading-relaxed max-w-xs mx-auto">Renseignez la matière et votre ville pour filtrer nos professeurs.</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-surface-card rounded-2xl border border-hairline-strong flex items-center justify-center text-xl font-bold font-mono text-accent-blue shadow-md">02</div>
            <div className="space-y-2">
              <h3 className="font-heading-sm text-lg text-ink font-bold">Échangez gratuitement</h3>
              <p className="text-charcoal text-sm leading-relaxed max-w-xs mx-auto">Entrez en contact directement et bénéficiez d'une première heure offerte.</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-surface-card border border-hairline-strong flex items-center justify-center text-xl font-bold font-mono text-accent-green shadow-md">03</div>
            <div className="space-y-2">
              <h3 className="font-heading-sm text-lg text-ink font-bold">Apprenez et progressez</h3>
              <p className="text-charcoal text-sm leading-relaxed max-w-xs mx-auto">Prenez vos cours à domicile ou en ligne, sans engagement.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}