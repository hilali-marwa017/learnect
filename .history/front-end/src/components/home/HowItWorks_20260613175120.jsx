export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50 border-y">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-orange-600 font-bold">MÉTHODOLOGIE ET ACCOMPAGNEMENT</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">Comment fonctionne Learnect ?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="h-16 w-16 bg-white border rounded-2xl flex items-center justify-center text-2xl font-bold text-orange-600 shadow-md mx-auto">01</div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">Cherchez le tuteur parfait</h3>
            <p className="text-gray-600 mt-2">Renseignez la matière et votre ville pour filtrer nos professeurs.</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-white border rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-600 shadow-md mx-auto">02</div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">Échangez gratuitement</h3>
            <p className="text-gray-600 mt-2">Entrez en contact directement et bénéficiez d'une première heure offerte.</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-white border rounded-2xl flex items-center justify-center text-2xl font-bold text-green-600 shadow-md mx-auto">03</div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">Apprenez et progressez</h3>
            <p className="text-gray-600 mt-2">Prenez vos cours à domicile ou en ligne, sans engagement.</p>
          </div>
        </div>
      </div>
    </section>
  );
}