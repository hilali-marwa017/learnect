import { useNavigate } from 'react-router-dom';

function TeacherCard({ teacher, user }) {
  const navigate = useNavigate();

  if (!teacher || !user) return null;

  const matiereNom = teacher.matieres && teacher.matieres.length > 0 
    ? teacher.matieres[0].nom 
    : "Professeur";

  const modality = teacher.cours_domicile && teacher.cours_enligne
    ? "Face à face & Webcam"
    : teacher.cours_enligne
    ? "Webcam"
    : "Face à face";

  return (
    <div 
      onClick={() => navigate(`/teachers/${teacher.utilisateur_id}`)}
      style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        cursor: 'pointer',
        height: '100%'
      }}
    >
      {/* Image de profil */}
      <div style={{ position: 'relative', height: '280px', background: '#EFF6FF' }}>
        {user.photo ? (
          <img 
            src={`http://localhost:8000/storage/${user.photo}`}
            alt={user.prenom}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            color: 'white'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {user.prenom ? user.prenom[0] : '👨'}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.prenom} {user.nom}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{user.ville}</div>
            </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div style={{ padding: '20px' }}>
        {/* Nom et lieu */}
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>
            {user.prenom} {user.nom}
          </h3>
          <div style={{ fontSize: '0.7rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="bi bi-geo-alt" style={{ fontSize: '0.7rem' }}></i>
            {user.ville} ({modality})
          </div>
        </div>

        {/* Note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <i className="bi bi-star-fill" style={{ color: '#f59e0b', fontSize: '0.7rem' }}></i>
          <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
            {teacher.noteMoyenne > 0 ? teacher.noteMoyenne.toFixed(1) : "5.0"}
          </span>
          <span style={{ color: '#6B7280', fontSize: '0.65rem' }}>({teacher.avisCount || 3} avis)</span>
        </div>

        {/* Titre */}
        <p style={{
          fontSize: '0.75rem',
          color: '#1e293b',
          fontWeight: 500,
          marginBottom: '12px',
          lineHeight: '1.4'
        }}>
          {teacher.titre || `${matiereNom} - Enseignant qualifié`}
        </p>

        {/* Description */}
        <p style={{
          fontSize: '0.7rem',
          color: '#6B7280',
          marginBottom: '16px',
          lineHeight: '1.5',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {teacher.description_profil || `Cours particuliers de ${matiereNom} pour tous niveaux`}
        </p>

        {/* Prix et bouton */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #E2E8F0',
          paddingTop: '16px'
        }}>
          <div>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0F172A' }}>
              {teacher.tarifHeure} DH
            </span>
            <span style={{ fontSize: '0.6rem', color: '#6B7280' }}>/H</span>
            <div style={{ fontSize: '0.6rem', color: '#f43f5e', fontWeight: 'bold' }}>
              1er cours offert
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/messages?teacher=${teacher.utilisateur_id}`); }}
            style={{
              border: '1px solid #E2E8F0',
              background: 'white',
              borderRadius: '30px',
              padding: '6px 14px',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              color: '#0d6efd',
              cursor: 'pointer'
            }}
          >
            <i className="bi bi-chat me-1"></i>Contacter
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherCard;