import { useState } from 'react';
import { Link } from 'react-router-dom';
import TeacherCard from '../../components/home/TeacherCard';

// Données mockées pour tester l'affichage
const mockEnseignants = [
  {
    utilisateur_id: 1,
    tarifHeure: 180,
    noteMoyenne: 4.8,
    estVerifie: true,
    avisCount: 3,
    matieres: [{ nom: "Mathématiques" }],
    titre: "Professeur Agrégé de Mathématiques",
    description_profil: "Préparation intensive aux Classes Préparatoires",
    cours_domicile: true,
    cours_enligne: true,
    user: {
      prenom: "Sofia",
      nom: "Benani",
      ville: "Casablanca",
      photo: null
    }
  },
  {
    utilisateur_id: 2,
    tarifHeure: 200,
    noteMoyenne: 4.9,
    estVerifie: true,
    avisCount: 3,
    matieres: [{ nom: "Physique-Chimie" }],
    titre: "Spécialiste en Physique-Chimie",
    description_profil: "Excellence Lycée, CPGE & Facultés",
    cours_domicile: true,
    cours_enligne: true,
    user: {
      prenom: "Amine",
      nom: "Chraibi",
      ville: "Marrakech",
      photo: null
    }
  },
  {
    utilisateur_id: 3,
    tarifHeure: 150,
    noteMoyenne: 5.0,
    estVerifie: true,
    avisCount: 3,
    matieres: [{ nom: "SVT" }],
    titre: "Professeur Expérimentée de SVT",
    description_profil: "Terminale Bac SMB & PC",
    cours_domicile: true,
    cours_enligne: true,
    user: {
      prenom: "Leila",
      nom: "Moukrim",
      ville: "Rabat",
      photo: null
    }
  },
  {
    utilisateur_id: 4,
    tarifHeure: 220,
    noteMoyenne: 5.0,
    estVerifie: true,
    avisCount: 5,
    matieres: [{ nom: "Informatique" }],
    titre: "Expert en Programmation",
    description_profil: "Python, Java, JavaScript",
    cours_domicile: false,
    cours_enligne: true,
    user: {
      prenom: "Tarik",
      nom: "Alaoui",
      ville: "Tanger",
      photo: null
    }
  }
];

function Teachers() {
  const [enseignants] = useState(mockEnseignants);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ color: '#0d6efd', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            À L'AFFICHE CE MOIS-CI
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Rencontrez nos super-enseignants
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
            Enseignants chevronnés, agrégés ou issus de grandes écoles
          </p>
          <Link to="/teachers" style={{ color: '#0d6efd', textDecoration: 'none' }}>
            Parcourir tout l'annuaire scolaire →
          </Link>
        </div>

        {/* Grille des enseignants */}
        <div className="row g-4">
          {enseignants.map(teacher => (
            <div key={teacher.utilisateur_id} className="col-md-6 col-lg-3">
              <TeacherCard teacher={teacher} user={teacher.user} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Teachers;