import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-white text-center">
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800 }}>
            Trouvez votre <span style={{ color: '#e94560' }}>prof idéal</span>
          </h1>
          <p className="lead mt-3 mb-5" style={{ fontSize: '1.3rem', opacity: 0.85 }}>
            Des milliers d'enseignants vérifiés, disponibles à domicile ou en ligne
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/teachers" className="btn btn-danger btn-lg px-5 py-3" style={{ borderRadius: '50px', fontWeight: 700 }}>
              Trouver un prof
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-5 py-3" style={{ borderRadius: '50px', fontWeight: 700 }}>
              Devenir enseignant
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center g-4">
            {[
              { nb: '500+', label: 'Enseignants vérifiés' },
              { nb: '2000+', label: 'Étudiants satisfaits' },
              { nb: '50+', label: 'Matières disponibles' },
              { nb: '4.8/5', label: 'Note moyenne' },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <h2 style={{ color: '#e94560', fontWeight: 800, fontSize: '2.5rem' }}>{s.nb}</h2>
                <p className="text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Comment ça marche ?</h2>
          <div className="row g-4">
            {[
              { step: '1', title: 'Cherchez', desc: 'Filtrez par matière, ville, tarif et disponibilité', icon: '🔍' },
              { step: '2', title: 'Réservez', desc: 'Choisissez un créneau et réservez en quelques clics', icon: '📅' },
              { step: '3', title: 'Apprenez', desc: 'Suivez votre cours et laissez un avis', icon: '🎓' },
            ].map((item, i) => (
              <div className="col-md-4 text-center" key={i}>
                <div className="p-4 rounded-4 shadow-sm h-100" style={{ border: '2px solid #f0f0f0' }}>
                  <div style={{ fontSize: '3rem' }}>{item.icon}</div>
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 40, height: 40, background: '#e94560', color: 'white', fontWeight: 700 }}>
                    {item.step}
                  </div>
                  <h5 className="fw-bold">{item.title}</h5>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5" style={{ background: '#e94560' }}>
        <div className="container text-center text-white">
          <h2 className="fw-bold mb-3">Prêt à commencer ?</h2>
          <p className="mb-4">Inscrivez-vous gratuitement et trouvez votre premier cours</p>
          <Link to="/register" className="btn btn-light btn-lg px-5" style={{ borderRadius: '50px', fontWeight: 700, color: '#e94560' }}>
            S'inscrire maintenant
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;