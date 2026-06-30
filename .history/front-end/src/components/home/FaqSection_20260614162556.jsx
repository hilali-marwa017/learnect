import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Shield, Gift, CreditCard, RefreshCw } from 'lucide-react';

export default function FaqSection({ isDark }) {
  const [open, setOpen] = useState(null);
  
  const faqs = [
    { 
      q: "Comment est vérifié le profil des professeurs ?", 
      icon: Shield,
      a: "Chaque professeur souhaitant rejoindre Learnect doit soumettre : une pièce d'identité officielle (CIN), ses diplômes universitaires les plus élevés, un casier judiciaire récent, et justifier d'au moins 2 ans d'expérience dans l'enseignement. Nos administrateurs vérifient manuellement chaque document sous 24h ouvrables. Seuls les profils validés obtiennent le badge 'Vérifié' et peuvent proposer leurs cours sur notre plateforme. Cette rigueur nous permet de garantir un niveau d'excellence et de sécurité à nos étudiants."
    },
    { 
      q: "Le premier cours est-il vraiment offert ?", 
      icon: Gift,
      a: "Absolument ! Chez Learnect, nous croyons fermement que la relation entre l'élève et le professeur est primordiale. C'est pourquoi tous nos tuteurs certifiés proposent une première séance de diagnostic et de méthodologie entièrement GRATUITE d'une durée de 45 à 60 minutes. Cette séance permet d'évaluer le niveau de l'étudiant, d'identifier ses forces et faiblesses, de définir une feuille de route personnalisée, et de s'assurer d'une bonne complicité pédagogique. Aucun engagement n'est requis après ce cours offert."
    },
    { 
      q: "Y a-t-il des frais d'inscription ou d'abonnement ?", 
      icon: CreditCard,
      a: "Aucun ! L'inscription sur Learnect.ma est et restera entièrement gratuite pour les élèves et les parents. Vous ne payez que les heures de cours que vous réservez. Les tarifs affichés sont ceux des professeurs, sans aucun supplément caché. Nous prélevons une commission de mise en relation de seulement 10% sur l'enseignant, ce qui nous permet de maintenir notre infrastructure technologique (messagerie sécurisée, planning en ligne, support client 7j/7). Pas d'abonnement mensuel, pas de frais de dossier, pas de surprise."
    },
    { 
      q: "Puis-je changer de professeur en cours d'année ?", 
      icon: RefreshCw,
      a: "Oui, vous êtes entièrement libre de changer de professeur à tout moment, sans aucune pénalité. Si vous estimez que la pédagogie, le rythme ou la personnalité de l'enseignant ne correspondent plus à vos besoins, notre équipe d'assistance vous orientera vers un autre tuteur certifié dans les 24h. Nous avons plus de 450 professeurs dans 45+ matières et 70+ villes marocaines. Votre satisfaction est notre priorité absolue. Vous pouvez également consulter les avis (5 étoiles pour 95% de nos profs) pour faire le meilleur choix."
    },
  ];

  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#4a5568';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const card = isDark ? '#1a1a1c' : '#ffffff';
  const orange = '#e04f00';

  function toggle(i) { 
    setOpen(open === i ? null : i); 
  }

  return (
    <section style={{ background: bg, padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Titre et sous-titre */}
        <div style={{ marginBottom: '3rem', textAlign: 'left' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: text, margin: '0 0 0.5rem 0' }}>
            Des réponses à vos questions
          </h2>
          <p style={{ fontSize: '0.95rem', color: muted, margin: 0, maxWidth: '600px' }}>
            Tout ce que vous devez savoir pour démarrer en toute sérénité
          </p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const Icon = f.icon;
            return (
              <div 
                key={i} 
                style={{ 
                  background: card, 
                  border: `1px solid ${border}`, 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button 
                  onClick={() => toggle(i)} 
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '1.25rem 1.5rem', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#1f1f23' : '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={20} color={orange} />
                    <span style={{ fontWeight: 600, color: text, fontSize: '1rem' }}>{f.q}</span>
                  </div>
                  <ChevronDown 
                    size={18} 
                    color={orange} 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.3s ease' 
                    }} 
                  />
                </button>
                
                {isOpen && (
                  <div style={{ 
                    padding: '0 1.5rem 1.5rem 1.5rem', 
                    fontSize: '0.9rem', 
                    color: muted, 
                    lineHeight: 1.6,
                    borderTop: `1px solid ${border}`,
                    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
                  }}>
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pied de FAQ */}
        <div style={{ 
          marginTop: '3rem', 
          textAlign: 'center', 
          paddingTop: '2rem', 
          borderTop: `1px solid ${border}` 
        }}>
          <p style={{ fontSize: '0.8rem', color: muted }}>
            Vous avez encore des questions ? 
            <span style={{ color: orange, cursor: 'pointer' }} onClick={() => window.location.href = '/contact'}> Contactez notre équipe</span>
          </p>
        </div>

      </div>
    </section>
  );
}