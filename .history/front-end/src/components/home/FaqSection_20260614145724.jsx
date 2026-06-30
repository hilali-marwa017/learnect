import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FaqSection({ isDark }) {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Comment est vérifié le profil des professeurs ?", a: "Chaque professeur doit soumettre une CIN et ses diplômes. Vérification manuelle sous 24h." },
    { q: "Le premier cours est-il vraiment offert ?", a: "Oui, première heure de diagnostic 100% offerte." },
    { q: "Y a-t-il des frais d'inscription ?", a: "Aucun. Inscription gratuite." },
    { q: "Puis-je changer de professeur ?", a: "Oui, à tout moment sans frais." },
  ];

  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const card = isDark ? '#1a1a1c' : '#ffffff';
  const orange = '#e04f00';

  function toggle(i) { setOpen(open === i ? null : i); }

  return (
    <section style={{ background: bg, padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: text, marginBottom: '2rem', textAlign: 'center' }}>Des réponses à vos questions.</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
                <button onClick={() => toggle(i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HelpCircle size={18} color={orange} />
                    <span style={{ fontWeight: 600, color: text }}>{f.q}</span>
                  </div>
                  <ChevronDown size={16} color={orange} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {isOpen && <div style={{ padding: '0 1.25rem 1rem 1.25rem', fontSize: '0.85rem', color: muted, borderTop: `1px solid ${border}` }}>{f.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}