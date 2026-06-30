import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherCard({ teacher, user, onSelect }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  if (!user || !teacher) return null;

  const modality = teacher.cours_domicile && teacher.cours_enligne
    ? "Face à face & Webcam"
    : teacher.cours_enligne
    ? "Webcam"
    : "Face à face";

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(teacher.utilisateur_id);
    } else {
      navigate(`/teachers/${teacher.utilisateur_id}`);
    }
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
        height: '100%'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '320px', overflow: 'hidden' }}>
        {user.photo ? (
          <img 
            src={user.photo} 
            alt={`${user.prenom} ${user.nom}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
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
            {user.prenom?.toLowerCase()} {user.nom?.toLowerCase()}
          </h4>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="bi bi-geo-alt" style={{ fontSize: '0.7rem' }}></i>
            <span>{user.ville} ({modality})</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleLikeClick}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(15,23,42,0.45)',
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

      <div style={{ padding: '12px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#f59e0b' }}>
            <i className="bi bi-star-fill" style={{ fontSize: '0.7rem' }}></i>
            <span style={{ color: '#0F172A' }}>{teacher.noteMoyenne > 0 ? teacher.noteMoyenne.toFixed(1) : "5.0"}</span>
            <span style={{ color: '#6B7280' }}>({teacher.avisCount || 3} avis)</span>
          </div>
          {teacher.estVerifie ? (
            <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '2px 8px', borderRadius: '20px', fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="bi bi-stars"></i>
              <span>Ambassadeur</span>
            </span>
          ) : (
            <span style={{ background: '#eff6ff', color: '#0d6efd', padding: '2px 8px', borderRadius: '20px', fontSize: '0.6rem' }}>
              Confirmé
            </span>
          )}
        </div>

        <p style={{
          color: '#6B7280',
          fontSize: '0.75rem',
          marginBottom: '12px',
          lineHeight: '1.4',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          <strong style={{ color: '#0F172A' }}>{teacher.matiere}</strong> — {teacher.titre || teacher.description_profil || 'Professeur expérimenté'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
          <div>
            <span style={{ fontWeight: 'bold', color: '#0F172A', fontSize: '1rem' }}>
              {teacher.tarifHeure} DH<span style={{ fontWeight: 'normal', fontSize: '0.65rem', color: '#6B7280' }}>/H</span>
            </span>
            <span style={{ color: '#f43f5e', fontSize: '0.6rem', marginLeft: '8px' }}>• 1er cours offert</span>
          </div>
          <button
            type="button"
            onClick={handleContactClick}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid #E2E8F0',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <i className="bi bi-chat" style={{ fontSize: '0.8rem', color: '#0d6efd' }}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherCard;