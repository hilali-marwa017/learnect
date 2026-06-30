import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ background: '#0f172a', padding: '48px 24px 24px', borderTop: '1px solid #1e293b' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-mortarboard" style={{ color: 'white', fontSize: '1rem' }}></i>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>Learnect<span style={{ color: '#0d6efd' }}>.ma</span></span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.6 }}>La plateforme élite de mise en relation directe élève-prof au Maroc. Commission transparente de seulement 10%.</p>
            <div style={{ background: 'rgba(13,110,253,0.1)', border: '1px solid rgba(13,110,253,0.2)', borderRadius: 10, padding: '8px 12px', fontSize: '0.68rem', fontWeight: 700, color: '#60a5fa', display: 'inline-block', marginTop: 12 }}>💡 10% de commission fixe sur toutes les réservations</div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Matières</h4>
            <Link to="/teachers?matiere=Mathématiques" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Mathématiques</Link>
            <Link to="/teachers?matiere=Physique-Chimie" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Physique-Chimie</Link>
            <Link to="/teachers?matiere=Français" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Français</Link>
            <Link to="/teachers?matiere=Anglais" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Anglais</Link>
            <Link to="/teachers?matiere=Arabe" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Arabe</Link>
            <Link to="/teachers?matiere=Informatique" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Informatique</Link>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Villes</h4>
            <Link to="/teachers?ville=Casablanca" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Cours à Casablanca</Link>
            <Link to="/teachers?ville=Rabat" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Cours à Rabat</Link>
            <Link to="/teachers?ville=Marrakech" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Cours à Marrakech</Link>
            <Link to="/teachers?ville=Tanger" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Cours à Tanger</Link>
            <Link to="/teachers?ville=Agadir" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Cours à Agadir</Link>
            <Link to="/teachers?ville=En ligne" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Cours en ligne</Link>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Plateforme</h4>
            <Link to="/register?role=enseignant" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Devenir enseignant</Link>
            <Link to="/login" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Se connecter</Link>
            <Link to="/teachers" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Trouver un prof</Link>
            <Link to="/" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Comment ça marche</Link>
            <Link to="/contact" style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8 }}>Nous contacter</Link>
          </div>
        </div>
        <div style={{ paddingTop: 20, borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '0.7rem', color: '#64748b' }}>
          © 2026 Learnect.ma · Tous droits réservés
        </div>
      </div>
    </footer>
  );
}

export default Footer;