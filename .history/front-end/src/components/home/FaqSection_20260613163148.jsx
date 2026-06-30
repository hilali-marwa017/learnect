import { useState } from 'react';

export default function FaqSection() {
  var [openIndex, setOpenIndex] = useState(null);

  var faqs = [
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
      answer: "Absolument aucun. L'inscription sur Learnect.ma est entièrement gratuite. Nous prélevons uniquement des frais d'exploitation minimes sur l'heure de cours réservée."
    },
    {
      question: "Puis-je changer de professeur en cours d'année ?",
      answer: "Oui, vous êtes entièrement libre de changer de professeur à tout moment."
    }
  ];

  return (
    <section id="faq-section" className="py-24 bg-canvas border-t border-hairline-strong relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-blue font-bold block">QUESTIONS FRÉQUENTES</span>
          <h2 className="font-display-lg text-4xl md:text-5xl text-ink leading-[1.1] tracking-tight">Des réponses à vos questions.</h2>
          <p className="text-mute text-sm">Tout ce que vous devez savoir pour démarrer vos heures de soutien scolaire.</p>
        </div>

        <div className="space-y-4">
          {faqs.map(function(faq, index) {
            var isOpen = openIndex === index;
            return (
              <div key={index} className="bg-surface-card border border-hairline-strong rounded-xl overflow-hidden">
                <button onClick={function() { setOpenIndex(isOpen ? null : index); }} className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <svg className="h-4.5 w-4.5 text-accent-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-semibold text-sm text-ink">{faq.question}</span>
                  </div>
                  <svg className={`h-4.5 w-4.5 text-charcoal transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent-orange' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 text-xs text-charcoal leading-relaxed border-t border-hairline">
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