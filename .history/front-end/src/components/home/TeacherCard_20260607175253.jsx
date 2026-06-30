import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherCard({ teacher, user }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

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
        height: '100%',
        transition: 'none'
      }}
    >
      {/* Image section */}
      <div style={{ position: 'relative', height: '240px', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)' }}>
        {user.photo ? (
          <img 
            src={user.photo} 
            alt={user.prenom}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem',
            fontWeight: 'bold'
          }}>
            {user.prenom ? user.prenom[0] : '👨‍🏫'}
          </div>
        )}
        
        {/* Info overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          padding: '16px',
          color: 'white'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
            {user.prenom} {user.nom}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', opacity: 0.8 }}>
            {user.ville} ({modality})
          </p>
        </div>

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            color: isLiked ? '#f43f5e' : 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className={`bi bi-heart${isLiked ? '-fill' : ''}`} style={{ fontSize: '1rem' }}></i>
        </button>
      </div>

      {/* Content section */}
      <div style={{ padding: '16px' }}>
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <i className="bi bi-star-fill" style={{ color: '#f59e0b', fontSize: '0.8rem' }}></i>
          <span style={{ fontWeight: 'bold', color: '#0F172A' }}>
            {teacher.noteMoyenne > 0 ? teacher.noteMoyenne.toFixed(1) : "5.0"}
          </span>
          <span style={{ color: '#6B7280', fontSize: '0.7rem' }}>({teacher.avisCount || 3} avis)</span>
          
          {teacher.estVerifie && (
            <span style={{
              background: '#f3e8ff',
              color: '#7e22ce',
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              marginLeft: 'auto'
            }}>
              <i className="bi bi-stars me-1"></i>Pro
            </span>
          )}
        </div>

        {/* Matière */}
        <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>
          {matiereNom}
        </h4>

        {/* Description */}
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

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #E2E8F0',
          paddingTop: '12px'
        }}>
          <div>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0F172A' }}>
              {teacher.tarifHeure} DH
            </span>
            <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>/H</span>
            <div style={{ fontSize: '0.65rem', color: '#f43f5e', fontWeight: 'bold' }}>
              1er cours offert
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/messages?teacher=${teacher.utilisateur_id}`); }}
            style={{
              border: '1px solid #0d6efd',
              background: 'white',
              borderRadius: '30px',
              padding: '6px 14px',
              fontSize: '0.7rem',
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