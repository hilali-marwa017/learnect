// src/components/home/FeaturesSection.jsx
function FeaturesSection() {
  const features = [
    { icon: 'bi-shield-check', title: 'Vérification Rigoureuse des Diplômes', desc: 'Chaque enseignant fournit CIN recto/verso + diplôme certifié. Validation manuelle par notre équipe admin avant publication.', badge: 'SÉCURITÉ MAXIMALE' },
    { icon: 'bi-gift', title: 'Premier Cours Gratuit Garanti', desc: 'Découvrez la plateforme sans risque. Le premier cours de 30 minutes est entièrement offert pour tout nouvel étudiant.', badge: 'OFFRE UNIQUE' },
    { icon: 'bi-cash-coin', title: 'Commission Transparente 10%', desc: "Seulement 10% de commission sur chaque cours. L'enseignant reçoit 90% directement sur son compte.", badge: 'PRIX JUSTE' },
    { icon: 'bi-chat-dots', title: 'Messagerie Intégrée', desc: 'Communication directe entre étudiants et enseignants. Suivez vos échanges en temps réel.', badge: 'RAPIDE & FLUIDE' },
    { icon: 'bi-calendar-check', title: 'Agenda Intelligent', desc: 'Gérez vos créneaux disponibles en un clic. Réservation automatique et synchronisation.', badge: 'GAIN DE TEMPS' },
    { icon: 'bi-graph-up', title: 'Suivi de Progression', desc: 'Tableau de bord personnalisé. Visualisez vos cours, avis et revenus en temps réel.', badge: 'STATISTIQUES' }
  ];

  return (
    <section style={{ padding: '5rem 0', background: '#F8FAFC' }}>
      <div className="container">
        <div className="text-center mb-5">
          <div style={{ color: '#0d6efd', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
            POURQUOI CHOISIR LEARNECT ?
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Une plateforme qui révolutionne
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.95rem', marginTop: 6, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Découvrez les avantages exclusifs de notre solution de cours particuliers
          </p>
        </div>

        <div className="row g-4">
          {features.map(function(f, i) {
            return (
              <div key={i} className="col-md-4 col-lg-4">
                <div style={{ background: 'white', borderRadius: 20, padding: '1.8rem', border: '1px solid #E2E8F0', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ width: 50, height: 50, background: '#EFF6FF', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`bi ${f.icon}`} style={{ fontSize: '1.5rem', color: '#0d6efd' }}></i>
                    </div>
                    <span style={{ background: '#EFF6FF', color: '#0d6efd', padding: '4px 10px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700 }}>
                      {f.badge}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#0F172A', fontSize: '1.1rem', marginBottom: 8 }}>
                    {f.title}
                  </h3>
                  <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;