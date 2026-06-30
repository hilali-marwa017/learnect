import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherCard({ teacher, user }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  if (!teacher || !user) {
    return null;
  }

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
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        cursor: 'pointer',
        height: '100%'
      }}
    >
      <div style={{ position: 'relative', height: '260px', background: '#0d6efd' }}>
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
            {user.prenom ? user.prenom[0] : 'P'}
          </div>
        )}
        
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          padding: '16px',
          color: 'white'
        }}>
          <h4 style={{ margin: 0, fontSize: '1rem' }}>{user.prenom} {user.nom}</h4>
          <small>{user.ville} • {modality}</small>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: isLiked ? '#f43f5e' : 'white',
            cursor: 'pointer'
          }}
        >
          <i className={`bi bi-heart${isLiked ? '-fill' : ''}`}></i>
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <i className="bi bi-star-fill" style={{ color: '#f59e0b' }}></i>
          <strong>{teacher.noteMoyenne || '5.0'}</strong>
          <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>({teacher.avisCount || 3} avis)</span>
        </div>

        <h5 style={{ margin: '8px 0', fontSize: '0.9rem' }}>{matiereNom}</h5>
        
        <p style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '16px' }}>
          {teacher.titre || teacher.description_profil || 'Professeur expérimenté'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
          <div>
            <strong style={{ fontSize: '1.1rem' }}>{teacher.tarifHeure} DH</strong>
            <span style={{ fontSize: '0.7rem', color: '#f43f5e', display: 'block' }}>1er cours offert</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/messages?teacher=${teacher.utilisateur_id}`); }}
            style={{ border: '1px solid #0d6efd', background: 'white', borderRadius: '20px', padding: '6px 12px', fontSize: '0.7rem' }}
          >
            <i className="bi bi-chat"></i> Contacter
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherCard;