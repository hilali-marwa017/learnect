function FeaturesSection() {
  const features = [
    {
      icon: 'bi-shield-check',
      title: 'Diplômes validés à la main',
      desc: 'CIN recto/verso + diplôme PDF vérifiés manuellement par notre équipe avant activation.',
    },
    {
      icon: 'bi-gift',
      title: '1er cours offert pour l\'étudiant',
      desc: 'Aucun risque : le premier cours est proposé à 0 DH lors de la réservation initiale.',
    },
  ];

  return (
    <section style={{ padding: '5rem 0', background: 'white' }}>
      <div className="container">
        <div className="text-center mb-5">
          <div style={{ color: '#0d6efd', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
            MODÈLE ÉTHIQUE & TRANSPARENT
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Qu'est-ce qui rend Learnect différent ?
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: 6 }}>
            Une charte basée sur la transparence des prix et l'excellence académique
          </p>
        </div>

        <div className="row g-4">
          {/* Grande carte bleue */}
          <div className="col-md-5">
            <div style={{ background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', borderRadius: 16, padding: '2rem', height: '100%' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '5px 12px', display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, color: 'white', marginBottom: '1rem', letterSpacing: 1 }}>
                COMMISSION TRANSPARENTE : 10%
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: 'white', fontSize: '1.2rem', marginBottom: '0.8rem', lineHeight: 1.4 }}>
                Pas de frais cachés ou de prélèvements opaques de 30%
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                La sécurité est notre priorité. L'administrateur vérifie rigoureusement chaque diplôme supérieur et pièces d'identité des professeurs avant mise en ligne.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontSize: '0.82rem', fontWeight: 600 }}>
                <i className="bi bi-cash-coin"></i>
                Rétribution directe garantie à 90%
              </div>
            </div>
          </div>

          {/* 2 petites cartes */}
          <div className="col-md-7">
            <div className="row g-4 h-100">
              {features.map((f, i) => (
                <div key={i} className="col-6">
                  <div style={{ background: 'white', borderRadius: 16, padding: '1.8rem 1.5rem', border: '1px solid #E2E8F0', height: '100%' }}>
                    <div style={{ width: 44, height: 44, background: '#EFF6FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
                      <i className={`bi ${f.icon}`} style={{ fontSize: '1.2rem', color: '#0d6efd' }}></i>
                    </div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#0F172A', fontSize: '0.9rem', marginBottom: 6 }}>
                      {f.title}
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;