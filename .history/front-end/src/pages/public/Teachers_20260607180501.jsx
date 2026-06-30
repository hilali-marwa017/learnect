import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from '../../components/home/TeacherCard';

function Teachers() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnseignants = async () => {
      try {
        const res = await api.get('/enseignants');
        console.log('Enseignants chargés:', res.data);
        console.log('Premier enseignant:', res.data[0]);
        setEnseignants(res.data);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEnseignants();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  console.log('Rendu des enseignants, nombre:', enseignants.length);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>
            Rencontrez nos mentors certifiés d'excellence.
          </h1>
          <p style={{ color: '#6B7280' }}>
            {enseignants.length} enseignants disponibles
          </p>
        </div>

        {enseignants.length === 0 ? (
          <div className="text-center py-5">
            <p>Aucun enseignant trouvé dans l'API</p>
            <p>Vérifie http://localhost:8000/api/enseignants</p>
          </div>
        ) : (
          <div className="row g-4">
            {enseignants.map((teacher, index) => {
              console.log(`Enseignant ${index}:`, teacher);
              console.log(`User associé:`, teacher.user);
              return (
                <div key={teacher.utilisateur_id} className="col-md-6 col-lg-4">
                  <TeacherCard 
                    teacher={teacher} 
                    user={teacher.user}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Teachers;