import { Link } from 'react-router-dom';

function Register() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 140px)',
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 35px -12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef',
      }}>
        
        {/* Bouton retour */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: '#94a3b8',
            textDecoration: 'none',
          }}>
            ← Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <i className="bi bi-person-plus" style={{ fontSize: '24px', color: 'white' }}></i>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a2e' }}>
            Rejoindre Learnect.ma
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
            Choisissez votre profil pour continuer
          </p>
        </div>

        {/* Cartes de choix */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Carte Étudiant */}
          <Link to="/register/etudiant" style={{ textDecoration: 'none' }}>
            <div style={{
              border: '2px solid #e9ecef',
              borderRadius: '16px',
              padding: '28px 20px',
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = '#0d6efd';
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px' }}>
                Je suis élève
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Trouver le professeur idéal
              </p>
            </div>
          </Link>

          {/* Carte Enseignant */}
          <Link to="/register/enseignant" style={{ textDecoration: 'none' }}>
            <div style={{
              border: '2px solid #e9ecef',
              borderRadius: '16px',
              padding: '28px 20px',
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = '#0d6efd';
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👨‍🏫</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px' }}>
                Je suis enseignant
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Donner des cours et gagner de l'argent
              </p>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e9ecef' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#0d6efd', fontWeight: '600', textDecoration: 'none' }}>
              Se connecter
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;