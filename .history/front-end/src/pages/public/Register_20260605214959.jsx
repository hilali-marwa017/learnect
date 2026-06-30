import { Link } from 'react-router-dom';

function Register() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        {/* Retour */}
        <div style={{ marginBottom: '24px' }}>
          <Link to="/" style={{
            color: '#94a3b8', textDecoration: 'none',
            fontSize: '0.85rem', fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <i className="bi bi-arrow-left" /> Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(13,110,253,0.25)',
          }}>
            🎓
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: '1.6rem',
            color: '#0f172a', marginBottom: 8,
          }}>
            Rejoindre Learnect<span style={{ color: '#0d6efd' }}>.ma</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Choisissez votre profil pour commencer
          </p>
        </div>

        {/* 2 cartes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

          {/* Étudiant */}
          <Link to="/register/etudiant" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: '28px 20px',
              border: '2px solid #e2e8f0',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#0d6efd';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(13,110,253,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>

              <div style={{
                width: 56, height: 56,
                background: '#f0fdf4',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', margin: '0 auto 16px',
              }}>
                🧑‍🎓
              </div>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 20, padding: '3px 10px',
                fontSize: '0.7rem', fontWeight: 700,
                color: '#16a34a', marginBottom: 12,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                <i className="bi bi-gift-fill" />
                1er cours offert
              </div>

              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '1rem',
                color: '#0f172a', marginBottom: 8,
              }}>
                Je suis étudiant
              </h3>
              <p style={{
                color: '#64748b', fontSize: '0.8rem',
                lineHeight: 1.6, margin: 0,
              }}>
                Trouvez un prof qualifié près de chez vous
              </p>
            </div>
          </Link>

          {/* Enseignant */}
          <Link to="/register/enseignant" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: '28px 20px',
              border: '2px solid #e2e8f0',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#0d6efd';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(13,110,253,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>

              <div style={{
                width: 56, height: 56,
                background: '#eff6ff',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', margin: '0 auto 16px',
              }}>
                👨‍🏫
              </div>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 20, padding: '3px 10px',
                fontSize: '0.7rem', fontWeight: 700,
                color: '#0d6efd', marginBottom: 12,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                <i className="bi bi-patch-check-fill" />
                Profil vérifié
              </div>

              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '1rem',
                color: '#0f172a', marginBottom: 8,
              }}>
                Je suis enseignant
              </h3>
              <p style={{
                color: '#64748b', fontSize: '0.8rem',
                lineHeight: 1.6, margin: 0,
              }}>
                Partagez vos connaissances et gagnez 90% du tarif
              </p>
            </div>
          </Link>
        </div>

        {/* Déjà un compte */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{
              color: '#0d6efd', fontWeight: 700,
              textDecoration: 'none',
            }}>
              Se connecter
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;