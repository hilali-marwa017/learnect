import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FaqSection({ isDark }) {
  const [openIndex, setOpenIndex] = useState(null);

  const bg = isDark ? '#000000' : '#f8f9fc';
  const bgCard = isDark ? '#111111' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const orange = '#e04f00';
  const blue = '#1c64f2';

  const faqs = [
    { q: "Comment est vérifié le profil des professeurs ?", a: "Chaque professeur doit soumettre une CIN et ses diplômes. Nos admins vérifient manuellement chaque document sous 24h avant de valider l'annonce." },
    { q: "Le premier cours est-il vraiment offert ?", a: "Oui ! Nos tuteurs certifiés proposent une première heure de diagnostic 100% offerte pour analyser le niveau et définir le rythme de travail." },
    { q: "Y a-t-il des frais d'inscription ou un abonnement ?", a: "Aucun. L'inscription sur Learnect.ma est entièrement gratuite. Les tarifs affichés sont directs, sans surcoût caché." },
    { q: "Puis-je changer de professeur en cours d'année ?", a: "Oui, vous êtes libre de changer à tout moment si la pédagogie ou les horaires ne correspondent plus à vos besoins." },
  ];

  return (
    <section style={{ background: bg, padding: '4rem 2rem', borderTop: `1px solid ${border}` }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: blue }}>
            QUESTIONS FRÉQUENTES
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, color: textColor, margin: '0.5rem 0 0.75rem' }}>
            Des réponses à vos questions.
          </h2>
          <p style={{ fontSize: '0.85rem', color: textMuted }}>
            Tout ce que vous devez savoir pour démarrer en toute sérénité.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map(function(faq, i) {
            const isOpen = openIndex === i;
            return (
              <div key={i} style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}>
                <button
                  onClick={function() { setOpenIndex(isOpen ? null : i); }}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '1rem 1.25rem',
                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <HelpCircle size={17} color={orange} />
                    <span style={{ fontWeight: 600, color: textColor, fontSize: '0.88rem', textAlign: 'left' }}>{faq.q}</span>
                  </div>
                  <ChevronDown size={16} color={textMuted} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0 }} />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: `1px solid ${border}`, fontSize: '0.82rem', color: textMuted, lineHeight: 1.7 }}>
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