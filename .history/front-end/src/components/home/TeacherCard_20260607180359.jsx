// src/components/home/TeacherCard.jsx
import { useNavigate } from 'react-router-dom';

function TeacherCard({ teacher, user }) {
  const navigate = useNavigate();

  if (!teacher || !user) {
    console.log('TeacherCard: pas de données', { teacher, user });
    return null;
  }

  const matiereNom = teacher.matieres && teacher.matieres.length > 0 
    ? teacher.matieres[0].nom 
    : "Professeur";

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
      <div style={{ padding: '16px' }}>
        <h3>{user.prenom} {user.nom}</h3>
        <p>{user.ville}</p>
        <p><strong>{matiereNom}</strong></p>
        <p>{teacher.tarifHeure} DH/h</p>
        <p>Note: {teacher.noteMoyenne} ★</p>
        <button style={{ background: '#0d6efd', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px' }}>
          Voir profil
        </button>
      </div>
    </div>
  );
}

export default TeacherCard;