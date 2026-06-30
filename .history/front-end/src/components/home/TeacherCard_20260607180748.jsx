import { useNavigate } from 'react-router-dom';

function TeacherCard({ teacher, user }) {
  const navigate = useNavigate();

  // Vérification des données
  if (!teacher || !user) {
    console.log('TeacherCard: données manquantes', { teacher, user });
    return (
      <div style={{ border: '1px solid red', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
        <p>Données indisponibles</p>
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
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{user.prenom} {user.nom}</h3>
        <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '8px' }}>
          <i className="bi bi-geo-alt"></i> {user.ville}
        </p>
        <p><strong>{matiereNom}</strong></p>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0d6efd' }}>{teacher.tarifHeure} DH<span style={{ fontSize: '0.8rem' }}>/H</span></p>
        <p>⭐ {teacher.noteMoyenne} / 5</p>
      </div>
    </div>
  );
}

export default TeacherCard;