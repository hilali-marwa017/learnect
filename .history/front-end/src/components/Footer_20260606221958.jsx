import { Link } from 'react-router-dom';

function Footer() {
  return(
    <footer style={{ background: '#0f172a', padding: '48px 24px 24px', borderTop: '1px solid #1e293b' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>

          {/* Brand - Learnect */}
          <div>
            <div>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',boxShadow: '0 4px 12px #0d6efd4d'}}>
                🎓
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: 'white' }}>
                Learnect<span style={{ color: '#0d6efd' }}>.ma</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.7 }}>
              La plateforme élite de mise en relation directe élève-prof au Maroc. Commission transparente de seulement 10%.
            </p>
            <div className='bi bi-lightbulb-fill pe' style={{ background: '#0d6dfd1a',border: '1px solid #0d6efd33',borderRadius: 10,padding: '8px 12px',fontSize: '0.68rem',fontWeight: 700,color: '#60a5fa', marginTop: 12}}>
              10% de commission fixe sur toutes les réservations
            </div>
          </div>

          {/* Matières */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
              Matières
            </h4>
            {['Mathématiques', 'Physique-Chimie', 'Français', 'Anglais', 'Arabe', 'Informatique'].map((m, i) => (
              <Link key={i} to={`/teachers?matiere=${m}`}
                style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', textDecoration: 'none', marginBottom: 7, fontWeight: 500, transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
                onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                {m}
              </Link>
            ))}
          </div>

          {/* Villes */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
              Villes
            </h4>
            {['Casablanca', 'Marrakech', 'Rabat', 'Tanger', 'Agadir', 'En ligne'].map((v, i) => (
              <Link key={i} to={`/teachers?ville=${v}`}
                style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', textDecoration: 'none', marginBottom: 7, fontWeight: 500, transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
                onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                Cours à {v}
              </Link>
            ))}
          </div>

          {/* Plateforme */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
              Plateforme
            </h4>
            {[
              { label: 'Devenir enseignant', to: '/register' },
              { label: 'Se connecter', to: '/login' },
              { label: 'Trouver un prof', to: '/teachers' },
              { label: 'Comment ça marche', to: '/' },
              { label: 'Nous contacter', to: '/contact' },
            ].map((l, i) => (
              <Link key={i} to={l.to}
                style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', textDecoration: 'none', marginBottom: 7, fontWeight: 500, transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
                onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer bottom */}
        <div style={{paddingTop: 20, borderTop: '1px solid #1e293b',display: 'flex',justifyContent: 'space-between',alignItems: 'center',fontSize: '0.72rem',color: '#64748b'}}>
          <p style={{ margin: 0 }}>© 2026 Learnect.ma · Tous droits réservés</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} 
              onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
              onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
              Conditions d'utilisation
            </span>
            <span>·</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
              onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
              Confidentialité
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;