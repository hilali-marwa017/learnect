import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ background: '#0f172a', padding: '40px 24px 24px', borderTop: '1px solid #1e293b' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* 4 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 30, marginBottom: 30 }}>

          {/* Colonne 1 - Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ 
                width: 36, height: 36, 
                background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', 
                borderRadius: 10, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(13,110,253,0.3)'
              }}>
                🎓
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1rem', color: 'white' }}>
                Learnect<span style={{ color: '#0d6efd' }}>.ma</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.6, marginBottom: 12 }}>
              Plateforme de mise en relation élève-prof au Maroc. Commission transparente de 10%.
            </p>
            <div style={{ 
              background: 'rgba(13,110,253,0.1)', 
              border: '1px solid rgba(13,110,253,0.2)', 
              borderRadius: 8, 
              padding: '6px 10px', 
              fontSize: '0.65rem', 
              fontWeight: 700, 
              color: '#60a5fa'
            }}>
              💡 10% de commission fixe
            </div>
          </div>

          {/* Colonne 2 - Matières */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Matières
            </h4>
            <Link to="/teachers?matiere=Mathématiques" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Mathématiques</Link>
            <Link to="/teachers?matiere=Physique-Chimie" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Physique-Chimie</Link>
            <Link to="/teachers?matiere=Français" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Français</Link>
            <Link to="/teachers?matiere=Anglais" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Anglais</Link>
            <Link to="/teachers?matiere=Arabe" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Arabe</Link>
            <Link to="/teachers?matiere=Informatique" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Informatique</Link>
          </div>

          {/* Colonne 3 - Villes */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Villes
            </h4>
            <Link to="/teachers?ville=Casablanca" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Cours à Casablanca</Link>
            <Link to="/teachers?ville=Rabat" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Cours à Rabat</Link>
            <Link to="/teachers?ville=Marrakech" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Cours à Marrakech</Link>
            <Link to="/teachers?ville=Tanger" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Cours à Tanger</Link>
            <Link to="/teachers?ville=Agadir" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Cours à Agadir</Link>
            <Link to="/teachers?ville=En ligne" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Cours en ligne</Link>
          </div>

          {/* Colonne 4 - Plateforme */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Plateforme
            </h4>
            <Link to="/register?role=enseignant" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Devenir enseignant</Link>
            <Link to="/login" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Se connecter</Link>
            <Link to="/teachers" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Trouver un prof</Link>
            <Link to="/" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Comment ça marche</Link>
            <Link to="/contact" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 6 }}>Nous contacter</Link>
          </div>
        </div>

        {/* Footer bottom */}
        <div style={{ paddingTop: 20, borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#64748b' }}>
          <p>© 2026 Learnect.ma · Tous droits réservés</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ cursor: 'pointer' }}>Conditions</span>
            <span>·</span>
            <span style={{ cursor: 'pointer' }}>Confidentialité</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;