import { Link } from 'react-router-dom';

const matieres = [
  { emoji: '📐', nom: 'Mathématiques' },
  { emoji: '⚗️', nom: 'Physique-Chimie' },
  { emoji: '🌍', nom: 'Histoire-Géo' },
  { emoji: '💻', nom: 'Informatique' },
  { emoji: '🇫🇷', nom: 'Français' },
  { emoji: '🇬🇧', nom: 'Anglais' },
  { emoji: '🧬', nom: 'SVT' },
  { emoji: '📖', nom: 'Arabe' },
];

const stats = [
  { n: '500+', l: 'Enseignants vérifiés' },
  { n: '2K+',  l: 'Étudiants actifs' },
  { n: '98%',  l: 'Taux de satisfaction' },
  { n: '4.9★', l: 'Note moyenne' },
];

function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ padding: '100px 0 80px', overflow: 'hidden', position: 'relative' }}>
        {/* bg blob */}
        <div style={{
          position: 'absolute', top: -200, right: -200,
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,71,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <span className="badge fu">✦ Plateforme éducative #1 au Maroc</span>
            <h1 className="title-xl fu d1" style={{ marginTop: 20, marginBottom: 20 }}>
              Trouvez le<br />
              <span className="text-grad">prof parfait</span><br />
              pour vous.
            </h1>
            <p className="fu d2" style={{ color: 'var(--gray)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: 36, maxWidth: 440 }}>
              Des milliers d'enseignants qualifiés, vérifiés et disponibles —
              à domicile, en déplacement ou en ligne.
            </p>
            <div className="fu d3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/teachers" className="btn-grad">Trouver un prof →</Link>
              <Link to="/register" className="btn-ghost">Devenir enseignant</Link>
            </div>
            {/* mini stats */}
            <div className="fu d4" style={{ display: 'flex', gap: 32, marginTop: 48 }}>
              {stats.slice(0,3).map((s,i) => (
                <div key={i}>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--dark)' }}>{s.n}</div>
                  <div style={{ color: 'var(--gray)', fontSize: '0.8rem', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FLOATING CARD */}
          <div className="float fu d2" style={{ position: 'relative' }}>
            <div style={{
              background: 'white',
              borderRadius: var(--radius-lg),
              border: '1px solid var(--border)',
              padding: 28,
              boxShadow: 'var(--shadow-lg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cours disponibles</span>
                <span className="badge">En ligne</span>
              </div>
              {[
                { n: 'Sara Benali',    m: 'Mathématiques', p: '80 DH/h', r: '4.9' },
                { n: 'Youssef Alami',  m: 'Physique',       p: '70 DH/h', r: '4.8' },
                { n: 'Fatima Zahra',   m: 'Anglais',        p: '60 DH/h', r: '5.0' },
              ].map((t, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0',
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                }}>
                  <div className="avatar" style={{ width: 40, height: 40, minWidth: 40, fontSize: '0.9rem' }}>
                    {t.n[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.n}</div>
                    <div style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{t.m}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.p}</div>
                    <div style={{ fontSize: '0.75rem', color: '#FBBF24' }}>★ {t.r}</div>
                  </div>
                </div>
              ))}
              <Link to="/teachers" className="btn-grad" style={{ width: '100%', textAlign: 'center', marginTop: 16, display: 'block' }}>
                Voir tous les profs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MATIERES ── */}
      <section style={{ padding: '80px 0', background: 'var(--light)' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge">Matières</span>
            <h2 className="title-lg" style={{ marginTop: 16 }}>Toutes les disciplines</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {matieres.map((m, i) => (
              <Link key={i} to="/teachers" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', border: '1.5px solid var(--border)',
                  borderRadius: 50, padding: '10px 22px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontWeight: 600, fontSize: '0.9rem', color: 'var(--dark)',
                  transition: 'all 0.25s', cursor: 'pointer',
                }}
                  onMouseOver={e => {
                    e.currentTarget.style.background='var(--grad)';
                    e.currentTarget.style.color='white';
                    e.currentTarget.style.borderColor='transparent';
                    e.currentTarget.style.transform='translateY(-2px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background='white';
                    e.currentTarget.style.color='var(--dark)';
                    e.currentTarget.style.borderColor='var(--border)';
                    e.currentTarget.style.transform='translateY(0)';
                  }}>
                  <span>{m.emoji}</span> {m.nom}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge">Simple</span>
            <h2 className="title-lg" style={{ marginTop: 16 }}>3 étapes pour commencer</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { e: '🔍', n: '01', t: 'Cherchez', d: 'Filtrez par matière, ville, tarif et disponibilité' },
              { e: '📅', n: '02', t: 'Réservez', d: 'Choisissez un créneau et réservez instantanément' },
              { e: '🎓', n: '03', t: 'Apprenez', d: 'Suivez votre cours et laissez un avis' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: 36 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{s.e}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(108,71,255,0.1), rgba(255,71,163,0.1))',
                  color: 'var(--p1)', fontWeight: 800, fontSize: '0.85rem', marginBottom: 16,
                }}>{s.n}</div>
                <h4 style={{ fontWeight: 800, marginBottom: 10, fontSize: '1.1rem' }}>{s.t}</h4>
                <p style={{ color: 'var(--gray)', lineHeight: 1.7, fontSize: '0.92rem' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'var(--grad)',
          borderRadius: var(--radius-lg),
          padding: '72px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: -0.8 }}>
            Prêt à apprendre ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: 36 }}>
            Rejoignez Learnect gratuitement et trouvez votre premier cours aujourd'hui.
          </p>
          <Link to="/register" style={{
            background: 'white', color: 'var(--p1)',
            padding: '14px 40px', borderRadius: 50,
            fontWeight: 800, fontSize: '1rem',
            textDecoration: 'none', display: 'inline-block',
            transition: 'all 0.3s',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
            onMouseOver={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.2)'; }}
            onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)'; }}>
            S'inscrire gratuitement 🚀
          </Link>
        </div>
      </section>

      <footer style={{ background: 'var(--dark)', padding: '28px 24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: 0 }}>
          © 2025 Learnect · Tous droits réservés
        </p>
      </footer>
    </>
  );
}

export default Home;