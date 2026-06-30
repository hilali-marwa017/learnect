export default function HowItWorks() {
  const etapes = [
    {
      numero: '1',
      icone: '🔍',
      titre: 'Recherchez librement',
      description: 'Filtrez par discipline académique ou par ville pour trouver le professeur idéal correspondant à vos besoins.'
    },
    {
      numero: '2',
      icone: '📅',
      titre: 'Réservez une date',
      description: 'Sélectionnez un créneau disponible, fixez une date et envoyez votre demande de confirmation au professeur.'
    },
    {
      numero: '3',
      icone: '✅',
      titre: 'Direct & Transparent',
      description: 'Discutez directement avec votre prof, organisez vos cours à domicile ou en ligne. Commission unique de 10%.'
    }
  ]

  return (
    <section className="py-5 bg-white border-bottom">
      <div className="container">

        <div className="text-center mb-5">
          <span className="badge bg-primary text-uppercase px-3 py-2 mb-2" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
            Comment ça marche
          </span>
          <h2 className="fw-bold text-dark">Réservation simple et 100% sécurisée</h2>
          <p className="text-muted small mt-2">
            Un processus innovant développé pour le système éducatif marocain
          </p>
        </div>

        <div className="row g-4">
          {etapes.map((etape, index) => (
            <div key={index} className="col-12 col-md-4 text-center">
              <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '16px' }}>
                {/* Numéro d'étape */}
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3 fw-bold"
                  style={{ width: '48px', height: '48px', fontSize: '18px' }}
                >
                  {etape.numero}
                </div>
                <div style={{ fontSize: '36px' }} className="mb-3">{etape.icone}</div>
                <h5 className="fw-bold text-dark mb-2">{etape.titre}</h5>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                  {etape.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}