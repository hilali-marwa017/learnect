import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherCard({ teacher, user }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  if (!user || !teacher) return null;

  // Vérification de sécurité pour matieres
  const matiereNom = teacher.matieres && teacher.matieres.length > 0 
    ? teacher.matieres[0].nom 
    : teacher.matiere || "Professeur";

  const modality = teacher.cours_domicile && teacher.cours_enligne
    ? "Face à face & Webcam"
    : teacher.cours_enligne
    ? "Webcam"
    : "Face à face";

  const handleCardClick = () => {
    navigate(`/teachers/${teacher.utilisateur_id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleContactClick = (e) => {
    e.stopPropagation();
    navigate(`/messages?teacher=${teacher.utilisateur_id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        cursor: 'pointer',
        height: '100%',
        transition: 'none'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden' }}>
        {user.photo ? (
          <img 
            src={`http://localhost:8000/storage/${user.photo}`} 
            alt={`${user.prenom} ${user.nom}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem',
            fontWeight: 'bold'
          }}>
            {user.prenom ? user.prenom[0] : 'P'}
          </div>
        )}

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, #0f172a, rgba(15,23,42,0.4), transparent)',
          padding: '16px',
          textAlign: 'left'
        }}>
          <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>
            {user.prenom} {user.nom}
          </h4>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="bi bi-geo-alt"></i>
            {user.ville} ({modality})
          </span>
        </div>

        <button
          onClick={handleLikeClick}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(15,23,42,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <i className={`bi bi-heart${isLiked ? '-fill' : ''}`} style={{ fontSize: '1rem', color: isLiked ? '#f43f5e' : 'white' }}></i>
        </button>
      </div>

      <div style={{ padding: '16px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="bi bi-star-fill" style={{ color: '#f59e0b', fontSize: '0.8rem' }}></i>
            <span style={{ fontWeight: 'bold', color: '#0F172A' }}>
              {teacher.noteMoyenne > 0 ? teacher.noteMoyenne.toFixed(1) : "5.0"}
            </span>
            <span style={{ color: '#6B7280', fontSize: '0.7rem' }}>({teacher.avisCount || 3} avis)</span>
          </div>
          {teacher.estVerifie && (
            <span style={{
              background: '#f3e8ff',
              color: '#7e22ce',
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '0.6rem',
              fontWeight: 'bold'
            }}>
              <i className="bi bi-stars me-1"></i>Ambassadeur
            </span>
          )}
        </div>

        <p style={{
          color: '#1e293b',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          {matiereNom}
        </p>

        <p style={{
          color: '#6B7280',
          fontSize: '0.75rem',
          marginBottom: '16px',
          lineHeight: '1.5',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {teacher.titre || teacher.description_profil || 'Professeur expérimenté'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
          <div>
            <span style={{ fontWeight: 'bold', color: '#0F172A', fontSize: '1.1rem' }}>
              {teacher.tarifHeure} DH
            </span>
            <span style={{ fontSize: '0.6rem', color: '#6B7280' }}>/H</span>
            <div style={{ fontSize: '0.65rem', color: '#f43f5e', fontWeight: 'bold' }}>
              1er cours offert
            </div>
          </div>
          <button
            onClick={handleContactClick}
            style={{
              padding: '8px 16px',
              borderRadius: '30px',
              border: '1px solid #0d6efd',
              background: 'white',
              color: '#0d6efd',
              fontSize: '0.7rem',
              fontWeight: '600',
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