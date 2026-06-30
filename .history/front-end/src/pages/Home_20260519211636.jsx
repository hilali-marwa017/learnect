import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const categories = [
  { icon: '√x', label: 'Maths' },
  { icon: '⚗️', label: 'Physique' },
  { icon: '🇫🇷', label: 'Français' },
  { icon: '🇬🇧', label: 'Anglais' },
  { icon: '🇸🇦', label: 'Arabe' },
  { icon: '💻', label: 'Informatique' },
  { icon: '🧬', label: 'SVT' },
  { icon: '📐', label: 'Géométrie' },
];

const stats = [
  { n: '500+', l: 'Enseignants' },
  { n: '2 000+', l: 'Étudiants' },
  { n: '98%', l: 'Satisfaits' },
  { n: '4.9★', l: 'Note moyenne' },
];

const howItWorks = [
  { step: '1', icon: '🔍', title: 'Cherchez', desc: 'Filtrez par matière, ville ou tarif' },
  { step: '2', icon: '📅', title: 'Réservez', desc: 'Choisissez un créneau disponible' },
  { step: '3', icon: '🎓', title: 'Apprenez', desc: 'Suivez le cours et laissez un avis' },
];

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [ville, setVille] = useState('');
  const [showVilles, setShowVilles] = useState(false);

  const villes = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'En ligne'];

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/teachers?matiere=${search}&ville=${ville}`);
  }

  return (
    <>
      {/* ── NAVBAR ── */}
      {/* utilisée depuis Layout */}

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(180deg, #FFF0E8 0%, #FFE8E0 40%, #ffffff 100%)',
        padding: '90px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* blob déco */}
        <div style={{
          position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(76,175,125,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="wrap fu">
          <h1 style={{
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 900,
            color: var(--dark),
            lineHeight: 1.1,
            letterSpacing: '-2px',
            marginBottom: 40,
          }}>
            Trouvez le<br />professeur parfait
          </h1>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} style={{
            background: 'white',
            borderRadius: 60,
            padding: '8px 8px 8px 24px',
            display: 'flex',
            alignItems: 'center',
            maxWidth: 700,
            margin: '0 auto 32px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
            gap: 8,
          }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>📚</span>
            <input
              type="text"
              placeholder='Essayer "Maths"'
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none', outline: 'none', flex: 1,
                fontSize: '1rem', fontFamily: 'Inter',
                color: 'var(--dark)', background: 'transparent',
                padding: '8px 0',
              }}
            />
            {/* divider */}
            <div style={{ width: 1, height: 28, background: 'var(--border)', flexShrink: 0 }} />

            {/* ville */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <input
                type="text"
                placeholder="Ville"
                value={ville}
                onChange={e => setVille(e.target.value)}
                onFocus={() => setShowVilles(true)}
                onBlur={() => setTimeout(() => setShowVilles(false), 150)}
                style={{
                  border: 'none', outline: 'none', width: 130,
                  fontSize: '1rem', fontFamily: 'Inter',
                  color: 'var(--dark)', background: 'transparent',
                  padding: '8px 0',
                }}
              />
              {showVilles && (
                <div style={{
                  position: 'absolute', top: 48, left: -16,
                  background: 'white', borderRadius: 14,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  zIndex: 100, minWidth: 200, overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  {villes.map(v => (
                    <div key={v} onMouseDown={() => { setVille(v); setShowVilles(false); }}
                      style={{
                        padding: '12px 20px', cursor: 'pointer',
                        fontSize: '0.93rem', fontWeight: 500,
                        transition: 'background 0.15s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background='var(--light-gray)'}
                      onMouseOut={e => e.currentTarget.style.background='white'}>
                      {v}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn-main" style={{ flexShrink: 0, padding: '14px 32px', fontSize: '0.95rem' }}>
              Rechercher
            </button>
          </form>

          {/* CATEGORIES */}
          <div style={{
            background: 'white',
            borderRadius: 60,
            padding: '16px 32px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 32,
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {categories.map((c, i) => (
              <Link key={i} to={`/teachers?matiere=${c.label}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--light-gray)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', fontWeight: 800, color: 'var(--dark)',
                  transition: 'all 0.2s',
                }}>
                  {c.icon}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--dark)' }}>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '64px 0', background: 'white' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={i} className="fu" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--green)', letterSpacing: -1 }}>{s.n}</div>
              <div style={{ color: 'var(--gray)', fontSize: '0.88rem', marginTop: 4, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMENT CA MARCHE ── */}
      <section style={{ padding: '72px 0', background: 'var(--cream)' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="badge">Simple & rapide</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: 12, letterSpacing: -0.5 }}>
              Comment ça marche ?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {howItWorks.map((s, i) => (
              <div key={i} className="card fu" style={{ padding: 36, animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 16 }}>{s.icon}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--green-light)', color: 'var(--green-dark)',
                  fontWeight: 800, fontSize: '0.85rem', marginBottom: 16,
                }}>{s.step}</div>
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: 8 }}>{s.title}</h4>
                <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '72px 24px', textAlign: 'center', background: 'white' }}>
        <div style={{
          maxWidth: 760, margin: '0 auto',
          background: 'linear-gradient(135deg, #4CAF7D, #3a9868)',
          borderRadius: 28, padding: '60px 48px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: 12, letterSpacing: -0.5 }}>
            Prêt à commencer ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', marginBottom: 32, fontSize: '1rem' }}>
            Inscrivez-vous gratuitement et trouvez votre premier cours
          </p>
          <Link to="/register" style={{
            background: 'white', color: 'var(--green-dark)',
            padding: '14px 36px', borderRadius: 50,
            fontWeight: 800, fontSize: '0.95rem',
            textDecoration: 'none', display: 'inline-block',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            transition: 'all 0.2s',
          }}
            onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; }}>
            S'inscrire gratuitement →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style='{{ background: '#1a1a1a', padding: '28px 24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.83rem', margin: 0 }}>
          © 2025 Learnect · Tous droits réservés
        </p>
      </footer>
    </>
  );
}

export default Home;