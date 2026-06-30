import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ background: '#020617', padding: '48px 24px 24px', borderTop: '1px solid #1e293b' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>

          {/* brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, background: '#059669', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🎓</div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: 'white' }}>
                Learnect<span style={{ color: '#059669' }}>.ma</span>
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.78rem', lineHeight: 1.7 }}>
              La plateforme élite de mise en relation directe élève-prof au Maroc. 10% de commission unique, transparente.
            </p>
            <div style={{ background: '#0d2a1f', border: '1px solid #064e3b', borderRadius: 10, padding: '8px 12px', fontSize: '0.68rem', fontWeight: 700, color: '#34d399', marginTop: 12 }}>
              💡 10% de commission fixe sur toutes les réservations
            </div>
          </div>

          {/* matières */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>Matières</h4>
            {['Mathématiques', 'Physique-Chimie', 'Français', 'Anglais', 'Arabe', 'Informatique'].map((m, i) => (
              <Link key={i} to={`/teachers?matiere=${m}`}
                style={{ display: 'block', color: '#64748b', fontSize: '0.78rem', textDecoration: 'none', marginBottom: 7, fontWeight: 500 }}
                onMouseOver={e => e.currentTarget.style.color = '#34d399'}
                onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                {m}
              </Link>
            ))}
          </div>

          {/* villes */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>Villes</h4>
            {['Casablanca', 'Marrakech', 'Rabat', 'Tanger', 'Agadir', 'En ligne'].map((v, i) => (
              <Link key={i} to={`/teachers?ville=${v}`}
                style={{ display: 'block', color: '#64748b', fontSize: '0.78rem', textDecoration: 'none', marginBottom: 7, fontWeight: 500 }}
                onMouseOver={e => e.currentTarget.style.color = '#34d399'}
                onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                Cours à {v}
              </Link>
            ))}
          </div>

          {/* liens */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>Plateforme</h4>
            {[
              { label: 'Devenir enseignant', to: '/register' },
              { label: 'Se connecter', to: '/login' },
              { label: 'Trouver un prof', to: '/teachers' },
              { label: 'Comment ça marche', to: '/' },
            ].map((l, i) => (
              <Link key={i} to={l.to}
                style={{ display: 'block', color: '#64748b', fontSize: '0.78rem', textDecoration: 'none', marginBottom: 7, fontWeight: 500 }}
                onMouseOver={e => e.currentTarget.style.color = '#34d399'}
                onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: 20, borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#475569' }}>
          <p style={{ margin: 0 }}>© 2025 Learnect.ma · Tous droits réservés</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ cursor: 'pointer' }}>Conditions d'utilisation</span>
            <span>·</span>
            <span style={{ cursor: 'pointer' }}>Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer