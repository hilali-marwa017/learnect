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
        console.log('Données reçues:', res.data);
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

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>
            Rencontrez nos mentors certifiés d'excellence
          </h1>
          <p style={{ color: '#6B7280' }}>
            Tous nos enseignants sont issus des meilleures universités
          </p>
        </div>

        {enseignants.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-person" style={{ fontSize: '3rem', color: '#CBD5E1' }}></i>
            <p className="mt-3">Aucun enseignant trouvé</p>
            <p className="text-muted small">Vérifie que le backend Laravel est démarré sur port 8000</p>
          </div>
        ) : (
          <div className="row g-4">
            {enseignants.map(teacher => (
              <div key={teacher.utilisateur_id} className="col-md-6 col-lg-4">
                <TeacherCard teacher={teacher} user={teacher.user} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Teachers;