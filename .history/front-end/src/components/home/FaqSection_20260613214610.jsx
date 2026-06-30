import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FaqSection({ isDark }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Comment est vérifié le profil des professeurs ?",
      answer: "Chaque professeur doit soumettre une CIN et ses diplômes. Nos admins vérifient manuellement chaque document sous 24h avant de valider l'annonce."
    },
    {
      question: "Le premier cours est-il vraiment offert ?",
      answer: "Oui ! Nos tuteurs certifiés proposent une première heure de diagnostic 100% offerte pour analyser le niveau et définir le rythme de travail."
    },
    {
      question: "Y a-t-il des frais d'inscription ou un abonnement ?",
      answer: "Aucun. L'inscription sur Learnect.ma est entièrement gratuite. Les tarifs affichés sont directs, sans surcoût caché."
    },
    {
      question: "Puis-je changer de professeur en cours d'année ?",
      answer: "Oui, vous êtes libre de changer à tout moment si la pédagogie ou les horaires ne correspondent plus à vos besoins."
    }
  ];

  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  const bdr = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)';
  const ink = isDark ? '#fcfdff' : '#07090d';
  const charcoal = isDark ? 'rgba(252, 253, 255, 0.7)' : '#4a5568';
  const orange = '#e04f00';

  return (
    <section style={{ padding: '4rem 2rem', backgroundColor: isDark ? '#000000' : '#f8f9fc' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange, display: 'block', marginBottom: '0.5rem' }}>
            QUESTIONS FRÉQUENTES
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: ink, marginBottom: '0.5rem' }}>
            Des réponses à vos questions.
          </h2>
          <p style={{ fontSize: '0.85rem', color: charcoal }}>
            Tout ce que vous devez savoir pour démarrer en toute sérénité.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map(function(faq, i) {
            const isOpen = openIndex === i;
            return (
              <div key={i} style={{
                background: bgCard,
                border: `1px solid ${bdr}`,
                borderRadius: 12,
                overflow: 'hidden'
              }}>
                <button
                  onClick={function() { setOpenIndex(isOpen ? null : i); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <HelpCircle size={18} color={orange} />
                    <span style={{ fontWeight: 600, color: ink, fontSize: '0.85rem' }}>{faq.question}</span>
                  </div>
                  <ChevronDown size={16} color={charcoal} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 20px 20px 20px',
                    borderTop: `1px solid ${bdr}`,
                    fontSize: '0.8rem',
                    color: charcoal,
                    lineHeight: 1.6
                  }}>
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