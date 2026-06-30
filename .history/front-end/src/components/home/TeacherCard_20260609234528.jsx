// src/components/home/TeacherCard.jsx
import { Link } from 'react-router-dom';

function TeacherCard({ enseignant }) {
  // Vérifier si les données existent
  if (!enseignant || !enseignant.user) {
    return null;
  }

  const user = enseignant.user;
  const premiereMatiere = enseignant.matieres?.[0]?.nom || 'Professeur';
  const tarif = enseignant.tarifHeure || 0;
  const note = enseignant.noteMoyenne || 0;
  const nbAvis = enseignant.avis?.length || 0;

  return (
    <Link to={`/enseignants/${user.utilisateur_id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '1.2rem',
        border: '1px solid #E2E8F0',
        height: '100%',
        transition: 'none'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          
          {/* Avatar */}
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            flexShrink: 0
          }}>
            {user.prenom?.[0]}{user.nom?.[0]}
          </div>
          
          {/* Infos */}
          <div style={{ flex: 1 }}>
            
            {/* En-tête */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '2px' }}>
                  {user.prenom} {user.nom}
                </h3>
                <p style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '4px' }}>
                  <i className="bi bi-geo-alt" style={{ fontSize: '0.65rem', marginRight: '2px' }}></i>
                  {user.ville} {enseignant.cours_enligne && '· webcam'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="bi bi-star-fill" style={{ color: note >= 4 ? '#fbbf24' : '#94A3B8', fontSize: '12px' }}></i>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#0F172A' }}>{note || 'Nouveau'}</span>
                  {nbAvis > 0 && (
                    <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>({nbAvis} avis)</span>
                  )}
                </div>
                {enseignant.estVerifie && (
                  <span style={{
                    fontSize: '0.6rem',
                    background: '#EFF6FF',
                    color: '#0d6efd',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    display: 'inline-block',
                    marginTop: '4px'
                  }}>
                    <i className="bi bi-patch-check-fill" style={{ fontSize: '0.55rem', marginRight: '2px' }}></i>
                    Vérifié
                  </span>
                )}
              </div>
            </div>
            
            {/* Matière */}
            <p style={{
              fontSize: '0.75rem',
              color: '#334155',
              marginTop: '8px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexWrap: 'wrap'
            }}>
              <i className="bi bi-book" style={{ color: '#0d6efd', fontSize: '0.7rem' }}></i>
              {premiereMatiere} - {enseignant.titre?.substring(0, 50) || 'Cours particuliers de qualité'}
            </p>
            
            {/* Prix + 1er cours offert */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                  {tarif} MAD
                </span>
                <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>/h</span>
              </div>
              <div style={{
                background: '#EFF6FF',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: '#0d6efd'
              }}>
                1er cours offert
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TeacherCard;