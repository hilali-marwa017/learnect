import { Link } from 'react-router-dom';

const matieres = ['Mathématiques','Physique','Arabe','Français','Anglais','Informatique','SVT','Histoire'];

const steps = [
  { icon: '🔍', step: '01', title: 'Cherchez', desc: 'Filtrez par matière, ville, tarif et disponibilité' },
  { icon: '📅', step: '02', title: 'Réservez', desc: 'Choisissez un créneau et réservez en quelques clics' },
  { icon: '🎓', step: '03', title: 'Apprenez', desc: 'Suivez votre cours et laissez un avis honnête' },
];

const stats = [
  { nb: '500+', label: 'Enseignants vérifiés' },
  { nb: '2000+', label: 'Étudiants satisfaits' },
  { nb: '50+', label: 'Matières disponibles' },
  { nb: '4.8', label: 'Note moyenne ★' },
];

function Home() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1B2B5E 0%, #2d4a9e 60%, #1B2B5E 100%)',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cercles décoratifs */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,107,53,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

            {/* LEFT */}
            <div className="fade-up">
              <span className="badge-custom mb-4" style={{ background: 'rgba(255,107,53,0.2)', color: '#FF6B35' }}>
                🇲🇦 Plateforme N°1 au Maroc
              </span>
              <h1 style={{ fontSize: '3.2rem', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
                Trouvez votre<br />
                <span style={{ color: '#FF6B35' }}>prof idéal</span><br />
                en 2 minutes
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 40 }}>
                Des enseignants vérifiés, des cours à domicile ou en ligne,<br />
                pour tous les niveaux et toutes les matières.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/teachers" className="btn-primary-custom fade-up delay-1">
                  🔍 Trouver un prof
                </Link>
                <Link to="/register" className="btn-outline-custom fade-up delay-2"
                  style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                  Devenir enseignant →
                </Link>
              </div>
            </div>

            {/* RIGHT — floating card */}
            <div className="fade-up delay-2 d-none d-md-block">
              <div style={{
                background: 'white',
                borderRadius: 24,
                padding: 32,
                boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
              }}>
                <p style={{ fontWeight: 700, color: '#1B2B5E', marginBottom: 20, fontSize: '1.05rem' }}>
                  🎯 Cours populaires
                </p>
                {['Mathématiques — 80 DH/h','Physique-Chimie — 70 DH/h','Anglais — 60 DH/h','Informatique — 90 DH/h'].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none',
                  }}>
                    <span style={{ color: '#374151', fontWeight: 500 }}>{item.split('—')[0]}</span>
                    <span style={{ color: '#FF6B35', fontWeight: 700, fontSize: '0.9rem' }}>
                      {item.split('—')[1]}
                    </span>
                  </div>
                ))}
                <Link to="/teachers" className="btn-primary-custom mt-4" style={{ width: '100%', textAlign: 'center' }}>
                  Voir tous les profs
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────── */}
      <section style={{ background: 'white', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {stats.map((s, i) => (
              <div key={i} className="fade-up" style={{ textAlign: 'center', padding: '32px 16px', borderRadius: 16, background: 'var(--light)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FF6B35' }}>{s.nb}</div>
                <div style={{ color: '#6B7280', fontWeight: 500, marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MATIERES ─────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--light)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge-custom mb-3">Nos matières</span>
            <h2 className="section-title">Toutes les matières</h2>
            <p style={{ color: '#6B7280', marginTop: 12 }}>Des profs qualifiés pour chaque discipline</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {matieres.map((m, i) => (
              <Link key={i} to="/teachers" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white',
                  padding: '12px 28px',
                  borderRadius: 50,
                  fontWeight: 600,
                  color: '#1B2B5E',
                  boxShadow: '0 2px 12px rgba(27,43,94,0.08)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                  onMouseOver={e => { e.currentTarget.style.background='#FF6B35'; e.currentTarget.style.color='white'; }}
                  onMouseOut={e => { e.currentTarget.style.background='white'; e.currentTarget.style.color='#1B2B5E'; }}>
                  {m}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT CA MARCHE ────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="badge-custom mb-3">Simple & rapide</span>
            <h2 className="section-title">Comment ça marche ?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {steps.map((s, i) => (
              <div key={i} className="card-custom fade-up" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>{s.icon}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--accent-light)', color: '#FF6B35',
                  fontWeight: 900, fontSize: '1rem', marginBottom: 20,
                }}>
                  {s.step}
                </div>
                <h4 style={{ fontWeight: 800, color: '#1B2B5E', marginBottom: 12 }}>{s.title}</h4>
                <p style={{ color: '#6B7280', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #FF6B35, #e85a25)',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: 16 }}>
            Prêt à commencer ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: 40 }}>
            Rejoignez des milliers d'étudiants qui apprennent avec Learnect
          </p>
          <Link to="/register" style={{
            background: 'white', color: '#FF6B35',
            padding: '16px 48px', borderRadius: 50,
            fontWeight: 800, fontSize: '1.1rem',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.transform='translateY(-3px)'}
            onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
            S'inscrire gratuitement 🚀
          </Link>
        </div>
      </section>

  
    </div>
  );
}

export default Home;    