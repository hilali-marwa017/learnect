export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-blue-600 font-bold">CONFIANCE & INTÉGRITÉ</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">Qualité garantie, transparence totale.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 border rounded-2xl">
            <div className="p-3 bg-white border rounded-xl w-fit mb-4">
              <i className="bi bi-shield-check text-2xl text-blue-600"></i>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Processus de vérification strict</h4>
            <p className="text-gray-600">Nous vérifions manuellement l'identité, l'authenticité des diplômes d'État et l'expérience académique de chaque enseignant.</p>
          </div>

          <div className="p-8 bg-gray-50 border rounded-2xl">
            <div className="p-3 bg-white border rounded-xl w-fit mb-4">
              <i className="bi bi-calculator text-2xl text-green-600"></i>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Zéro commission cachée</h4>
            <p className="text-gray-600">Seulement 10% de frais fixes de mise en relation. Pas d'abonnement ou de frais cachés.</p>
          </div>

          <div className="p-8 bg-gray-50 border rounded-2xl">
            <div className="p-3 bg-white border rounded-xl w-fit mb-4">
              <i className="bi bi-chat-dots text-2xl text-yellow-600"></i>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Mise en relation directe</h4>
            <p className="text-gray-600">Échangez gratuitement avec votre tuteur potentiel via notre messagerie sécurisée.</p>
          </div>
        </div>
      </div>
    </section>
  );
}