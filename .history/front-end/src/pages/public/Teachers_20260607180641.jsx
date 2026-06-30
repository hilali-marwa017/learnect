import { useState } from 'react';
import TeacherCard from '../../components/home/TeacherCard';

// Données mockées pour tester l'affichage
const MOCK_TEACHERS = [
  {
    utilisateur_id: 1,
    tarifHeure: 180,
    noteMoyenne: 4.8,
    estVerifie: true,
    matieres: [{ nom: "Mathématiques" }],
    titre: "Professeur Agrégé",
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
    matieres: [{ nom: "Physique-Chimie" }],
    titre: "Spécialiste Physique",
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
    matieres: [{ nom: "SVT" }],
    titre: "Professeure SVT",
    user: {
      prenom: "Leila",
      nom: "Moukrim",
      ville: "Rabat",
      photo: null
    }
  }
];

function Teachers() {
  // Utiliser les données mockées directement
  const enseignants = MOCK_TEACHERS;
  const loading = false;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container">
        <h1 className="text-center mb-4">Enseignants ({enseignants.length})</h1>
        
        <div className="row g-4">
          {enseignants.map((teacher) => (
            <div key={teacher.utilisateur_id} className="col-md-4">
              <TeacherCard teacher={teacher} user={teacher.user} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Teachers;