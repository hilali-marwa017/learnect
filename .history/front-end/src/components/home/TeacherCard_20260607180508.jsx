import { useNavigate } from 'react-router-dom';

function TeacherCard({ teacher, user }) {
  const navigate = useNavigate();

  // Log pour déboguer
  console.log('TeacherCard reçoit:', { teacher, user });

  if (!teacher || !user) {
    console.error('TeacherCard: données manquantes', { teacher, user });
    return (
      <div style={{ border: '1px solid red', padding: '10px', margin: '10px' }}>
        Erreur: Données manquantes
      </div>
    );
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
      </div>
    </div>
  );
}

export default TeacherCard;