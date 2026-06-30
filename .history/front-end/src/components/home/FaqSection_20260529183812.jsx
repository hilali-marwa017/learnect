import React, { useState } from 'react';

function FaqSection() {
  const [expanded, setExpanded] = useState(null);

  const faqs = [
    {
      q: "Comment fonctionne la commission de 10% sur Learnect ?",
      a: "Learnect applique une commission fixe et transparente de 10% sur chaque cours, réservée uniquement au maintien technique des serveurs de mise en relation. Il n'y a aucun intermédiaire ni frais cachés supplémentaires."
    },
    {
      q: "Les diplômes et justificatifs des enseignants sont-ils réellement vérifiés ?",
      a: "Absolument. Lors de son adhésion, chaque enseignant est dans l'obligation de justifier ses diplômes nationaux ou internationaux ainsi que sa carte d'identité, validés de façon manuelle par notre équipe administrative."
    },
    {
      q: "Qu'est-ce que la garantie « Premier cours d'essai offert » ?",
      a: "Afin de favoriser la découverte réciproque sans coût initial, le premier entretien ou séance de cadrage d'agenda est proposé à 0 DH lors de la confirmation d'un créneau."
    },
    {
      q: "Quels sont les niveaux d'enseignement pris en charge ?",
      a: "Nous couvrons l'ensemble des programmes d'études scolaires au Maroc : Collège, Lycée, préparation active aux examens régionaux ainsi qu au Baccalauréat d'excellence (scientifique, économique ou littéraire)."
    }
  ];

  function toggleFaq(idx) {
    if (expanded === idx) {
      setExpanded(null);
    } else {
      setExpanded(idx);
    }
  }

  return (
    <section className="py-5 bg-white">
      <div className="container px-3" style={{ maxWidth: '760px' }}>
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary text-uppercase px-2 py-1 fw-bold mb-2" style={{ fontSize: '9px', letterSpacing: '0.4px' }}>
            Questions Fréquentes
          </span>
          <h2 className="fw-black text-dark mt-1" style={{ fontSize: '26px' }}>
            Des réponses claires à vos interrogations.
          </h2>
        </div>

        <div className="d-flex flex-column gap-2 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = expanded === idx;
            return (
              <div key={idx} className="bg-light rounded-3 border overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-100 btn text-start d-flex align-items-center justify-content-between p-3 border-0 shadow-none text-dark fw-bold"
                  style={{ fontSize: '13.5px', background: 'transparent' }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <span className="text-primary">?</span>
                    <span>{faq.q}</span>
                  </span>
                  <span style={{ 
                    transition: 'transform 0.25s', 
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' 
                  }}>
                    &gt;
                  </span>
                </button>

                {isOpen && (
                  <div className="p-3 bg-white border-top text-secondary small" style={{ lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection