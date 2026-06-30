import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  { question: "Comment est vérifié le profil des professeurs ?", answer: "Chaque professeur soumet une CIN recto-verso et son diplôme PDF. Nos administrateurs vérifient manuellement chaque document sous 24h avant de valider le compte et d'autoriser l'affichage de l'annonce." },
  { question: "Est-ce que le premier cours est réellement offert ?", answer: "Oui ! Le premier cours est 100% offert. Cela permet de définir le rythme, analyser le niveau de l'étudiant et s'assurer d'une bonne entente pédagogique avant de débuter des séances régulières." },
  { question: "Y a-t-il des frais d'inscription ?", answer: "Aucun. L'inscription sur Learnect.ma est entièrement gratuite. Nous prélevons uniquement 10% de frais de mise en relation sur l'heure de cours réservée pour maintenir la plateforme." },
  { question: "Puis-je changer de professeur en cours d'année ?", answer: "Oui, vous êtes entièrement libre de changer de professeur à tout moment. Annulez votre réservation depuis votre espace étudiant et recherchez un nouveau profil certifié." },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq-section" className="py-24 bg-canvas border-t border-hairline-strong">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-blue font-bold block">QUESTIONS FRÉQUENTES</span>
          <h2 className="font-display-lg text-4xl md:text-5xl text-ink leading-[1.1] tracking-tight">Des réponses à vos questions.</h2>
          <p className="text-mute text-sm">Tout ce que vous devez savoir pour démarrer en toute sérénité.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="bg-surface-card border border-hairline-strong rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer hover:bg-surface-deep/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-accent-orange shrink-0" />
                    <span className="font-semibold text-sm text-ink">{faq.question}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-charcoal transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-accent-orange' : ''}`} />
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