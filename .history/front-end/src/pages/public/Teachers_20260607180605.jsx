import { useState, useEffect } from 'react';
import api from '../../api/axios';
import TeacherCard from '../../components/home/TeacherCard';

function Teachers() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnseignants = async () => {
      try {
        const res = await api.get('/enseignants');
        console.log('API response:', res.data);
        console.log('Number of teachers:', res.data.length);
        
        // Vérifie que chaque teacher a un user
        if (res.data.length > 0) {
          console.log('First teacher:', res.data[0]);
          console.log('First teacher user:', res.data[0].user);
        }
        
        setEnseignants(res.data);
      } catch (err) {
        console.error('Erreur chargement:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEnseignants();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  // Affiche le nombre d'enseignants
  console.log('Rendering teachers, count:', enseignants.length);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container">
        <h1 className="text-center mb-4">Enseignants ({enseignants.length})</h1>
        
        <div className="row g-4">
          {enseignants.map((teacher, index) => {
            console.log(`Mapping teacher ${index}:`, teacher);
            return (
              <div key={teacher.utilisateur_id || index} className="col-md-4">
                <TeacherCard teacher={teacher} user={teacher.user} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Teachers;