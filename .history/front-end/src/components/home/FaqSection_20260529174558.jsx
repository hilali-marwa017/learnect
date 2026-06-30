import { useState } from 'react'

export default function FaqSection() {
  const [elementOuvert, setElementOuvert] = useState(null)

  const listeFaq = [
    {
      question: 'Comment fonctionne la commission de 10% sur Learnect ?',
      reponse: "Learnect applique une commission fixe et transparente de 10% sur chaque cours, réservée uniquement au maintien technique des serveurs de mise en relation. Il n'y a aucun frais caché supplémentaire."
    },
    {
      question: "Les diplômes des enseignants sont-ils réellement vérifiés ?",
      reponse: "Absolument. Lors de son adhésion, chaque enseignant doit justifier ses diplômes ainsi que sa carte d'identité nationale (CIN), validés manuellement par notre équipe administrative."
    },
    {
      question: "En quoi consiste la garantie « Premier cours offert » ?",
      reponse: "Pour favoriser la découverte réciproque sans coût initial, le premier cours est proposé à 0 DH lors de la confirmation d'un créneau par un nouvel étudiant."
    },
    {
      question: "Quels sont les niveaux d'enseignement pris en charge ?",
      reponse: "Nous couvrons l'ensemble des programmes scolaires au Maroc : Collège, Lycée, préparation aux examens régionaux ainsi qu'au Baccalauréat (scientifique, économique ou littéraire)."
    }
  ]

  return (
    <section className="py-5 bg-light">
      <div className="container" style={{ maxWidth: '800px' }}>

        <div className="text-center mb-4">
          <span className="badge bg-primary text-uppercase px-3 py-2 mb-2" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
            Questions Fréquentes
          </span>
          <h2 className="fw-bold text-dark">Des réponses claires à vos interrogations</h2>
        </div>

        {/* Liste FAQ - standard OFPPT : accordéon simple avec useState */}
        <div className="d-flex flex-column gap-2">
          {listeFaq.map((item, index) => {
            const estOuvert = elementOuvert === index
            return (
              <div key={index} className="card border rounded-3 overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setElementOuvert(estOuvert ? null : index)}
                  className="btn btn-light text-start fw-bold p-3 w-100 shadow-none d-flex justify-content-between align-items-center border-0"
                  style={{ fontSize: '14px' }}
                >
                  <span>❓ {item.question}</span>
                  <span className="text-primary ms-2">{estOuvert ? '▼' : '►'}</span>
                </button>

                {estOuvert && (
                  <div className="card-body bg-white border-top text-secondary small" style={{ lineHeight: '1.7' }}>
                    {item.reponse}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}