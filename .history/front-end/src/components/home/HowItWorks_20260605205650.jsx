// src/components/home/HowItWorks.jsx
import { Link } from 'react-router-dom';

function HowItWorks() {
  const steps = [
    {
      num: '1', icon: 'bi-search',
      title: 'Recherchez',
      desc: 'Entrez votre matière et votre ville. Filtrez par tarif, note et type de cours.',
    },
    {
      num: '2', icon: 'bi-calendar-check',
      title: 'Réservez',
      desc: 'Choisissez un créneau disponible et confirmez votre réservation en quelques clics.',
    },
    {
      num: '3', icon: 'bi-mortarboard',
      title: 'Apprenez',
      desc: 'Premier cours offert ! Payez uniquement si vous êtes satisfait du professeur.',
    },
  ];

  return (
    <section style={{ padding: '5rem 0', background: '#F8FAFC' }}>
      <div className="container">
        <div className="text-center mb-5">
          <div style={{
            color: '#0d6efd', fontSize: '0.75rem',
            fontWeight: 700, letterSpacing: 2,
            textTransform: 'uppercase', marginBottom: 6,
          }}>
            SIMPLE & RAPIDE
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.8rem', fontWeight: 800,
            color: '#0F172A', letterSpacing: '-0.5px',
          }}>
            Comment ça marche ? 
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: 6 }}>
            Trouvez un prof en 3 étapes simples
          </p>
        </div>

        <div className="row g-4 mb-4">
          {steps.map((step, i) => (
            <div key={i} className="col-md-4">
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '2rem 1.5rem',
                textAlign: 'center',
                border: '1px solid #E2E8F0',
                height: '100%',
              }}>
                <div style={{
                  width: 48, height: 48,
                  background: '#0d6efd',
                  color: 'white', borderRadius: '50%',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900, fontSize: '1.2rem',
                  margin: '0 auto 1rem',
                }}>
                  {step.num}
                </div>
                <i className={`bi ${step.icon}`} style={{
                  fontSize: '1.8rem',
                  color: '#0d6efd',
                  marginBottom: '0.8rem',
                  display: 'block',
                }} />
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '1rem',
                  color: '#0F172A', marginBottom: 6,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  color: '#6B7280', fontSize: '0.88rem',
                  lineHeight: 1.6, margin: 0,
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mode demande inversée */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: '2rem 2.5rem',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: 52, height: 52,
            background: '#EFF6FF',
            borderRadius: 12,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <i className="bi bi-megaphone" style={{
              fontSize: '1.4rem', color: '#0d6efd',
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, color: '#0F172A',
              marginBottom: 4, fontSize: '1rem',
            }}>
              Mode demande inversée
            </h3>
            <p style={{
              color: '#6B7280', margin: 0,
              lineHeight: 1.7, fontSize: '0.88rem',
            }}>
              Publiez votre demande avec votre budget et recevez des offres
              directement des profs disponibles. Comparez et choisissez le meilleur !
            </p>
          </div>
          <Link to="/register?role=etudiant" style={{
            background: '#0F172A', color: 'white',
            padding: '11px 22px', borderRadius: 10,
            fontWeight: 700, textDecoration: 'none',
            whiteSpace: 'nowrap', fontSize: '0.88rem',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <i className="bi bi-send" />
            Publier ma demande
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;