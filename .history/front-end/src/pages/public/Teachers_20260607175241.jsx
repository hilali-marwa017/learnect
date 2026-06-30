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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Rencontrez nos mentors certifiés d'excellence.
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', maxWidth: 650, margin: '0 auto' }}>
            Tous nos enseignants sont issus des meilleures universités, grandes écoles marocaines partenaires & CPGE nationales.
          </p>
        </div>

        {/* Grille des enseignants */}
        {enseignants.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-person-workspace" style={{ fontSize: '3rem', color: '#CBD5E1' }}></i>
            <p className="mt-3 text-muted">Aucun enseignant disponible pour le moment</p>
            <Link to="/register?role=enseignant" className="btn btn-primary mt-2">
              Devenir enseignant →
            </Link>
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