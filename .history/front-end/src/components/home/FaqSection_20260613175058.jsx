import { useState } from 'react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Comment est vérifié le profil des professeurs ?",
      answer: "Chaque professeur souhaitant proposer ses cours particuliers sur Learnect doit soumettre une pièce d'identité officielle (CIN), ses diplômes universitaires. Nos administrateurs vérifient manuellement chaque document sous 24h."
    },
    {
      question: "Est-ce que le premier cours avec le professeur est réellement offert ?",
      answer: "Oui ! Sur Learnect, nos tuteurs certifiés proposent une première heure de diagnostic méthodologique et d'évaluation 100% offerte."
    },
    {
      question: "Y a-t-il des frais d'inscription ou un abonnement mensuel obligatoire ?",
      answer: "Absolument aucun. L'inscription sur Learnect.ma est entièrement gratuite."
    },
    {
      question: "Puis-je changer de professeur en cours d'année ?",
      answer: "Oui, vous êtes entièrement libre de changer de professeur à tout moment."
    }
  ];

  return (
    <section className="py-24 bg-white border-t">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-blue-600 font-bold">QUESTIONS FRÉQUENTES</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">Des réponses à vos questions.</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="bg-white border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-6 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <i className="bi bi-question-circle text-orange-500"></i>
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </div>
                  <i className={`bi bi-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 text-gray-600 border-t">
                    {faq.answer}
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