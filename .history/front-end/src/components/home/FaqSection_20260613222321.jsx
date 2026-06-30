import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FaqSection({ isDark }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "Comment est vérifié le profil des professeurs ?", a: "Chaque professeur doit soumettre une CIN et ses diplômes. Nos admins vérifient manuellement chaque document sous 24h avant de valider l'annonce." },
    { q: "Le premier cours est-il vraiment offert ?", a: "Oui ! Nos tuteurs certifiés proposent une première heure de diagnostic 100% offerte pour analyser le niveau et définir le rythme de travail." },
    { q: "Y a-t-il des frais d'inscription ou un abonnement ?", a: "Aucun. L'inscription sur Learnect.ma est entièrement gratuite. Les tarifs affichés sont directs, sans surcoût caché." },
    { q: "Puis-je changer de professeur en cours d'année ?", a: "Oui, vous êtes libre de changer à tout moment si la pédagogie ou les horaires ne correspondent plus à vos besoins." }
  ];

  const bg = isDark ? '#000000' : '#f8f9fc';
  const bgCard = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const orange = '#e04f00';

  return (
    <section style={{ background: bg, padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color: orange }}>QUESTIONS FRÉQUENTES</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: textColor }}>Des réponses à vos questions.</h2>
          <p style={{ fontSize: '0.85rem', color: textMuted }}>Tout ce que vous devez savoir pour démarrer en toute sérénité.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setOpenIndex(isOpen ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <HelpCircle size={18} color={orange} />
                    <span style={{ fontWeight: 600, color: textColor, fontSize: '0.85rem' }}>{faq.q}</span>
                  </div>
                  <ChevronDown size={16} color={textMuted} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {isOpen && <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: `1px solid ${border}`, fontSize: '0.8rem', color: textMuted }}>{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}