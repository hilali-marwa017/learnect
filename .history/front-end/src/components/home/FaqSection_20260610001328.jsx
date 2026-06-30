// src/components/home/FaqSection.jsx
import { useState } from 'react';

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '0.8rem', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.3rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9rem' }}>
          {question}
        </span>
        <i className={`bi bi-chevron-${open ? 'up' : 'down'}`} style={{ color: '#0d6efd', fontSize: '0.85rem' }}></i>
      </button>
      {open && (
        <div style={{ padding: '0.8rem 1.3rem 1.1rem', color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.6, borderTop: '1px solid #E2E8F0' }}>
          {answer}
        </div>
      )}
    </div>
  );
}

function FaqSection() {
  const faqs = [
    { question: 'Comment fonctionne la commission de 10% sur Learnect ?', answer: "Contrairement aux plateformes traditionnelles qui prélèvent des marges opaques de 30%, Learnect applique une commission fixe de 10%. Si un cours est tarifé à 100 DH, l'enseignant reçoit exactement 90 DH nets sur son solde." },
    { question: 'Les diplômes et justificatifs des enseignants sont-ils réellement authentiques ?', answer: "Oui. Chaque enseignant soumet son CIN recto/verso et son diplôme en PDF. Notre équipe vérifie manuellement chaque dossier avant activation du profil." },
    { question: "Qu'est-ce que l'offre promotionnelle 'Premier cours offert' ?", answer: "Aucun risque : le premier cours de 30 minutes est proposé à 0 DH lors de la réservation initiale, facilitant la prise de contact sans aucun frais pour l'étudiant." },
    { question: "Comment fonctionne le mode demande inversée ?", answer: "L'étudiant publie une demande avec sa matière, son niveau et son budget. Les enseignants disponibles envoient leurs offres. L'étudiant compare et accepte la meilleure offre." }
  ];

  return (
    <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
      <div className="container">
        
        {/* Header aligné à gauche - SEULEMENT LE TITRE */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            color: '#0d6efd', 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            letterSpacing: '2px', 
            textTransform: 'uppercase' 
          }}>
            UNE QUESTION ?
          </div>
          <h2 style={{ 
            fontSize: '1.6rem', 
            fontWeight: 800, 
            color: '#0F172A', 
            marginTop: '6px' 
          }}>
            Foire Aux Questions
          </h2>
          <p style={{ 
            color: '#6B7280', 
            fontSize: '0.85rem', 
            marginTop: '6px' 
          }}>
            Tout savoir sur les cours particuliers et notre plateforme
          </p>
        </div>

        {/* FAQ items - CENTRÉS ou PLEINE LARGEUR (pas à gauche) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 800, width: '100%' }}>
            {faqs.map(function(faq, i) {
              return <FaqItem key={i} question={faq.question} answer={faq.answer} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;