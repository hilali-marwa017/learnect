import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from './TeacherCard';

function TeachersSection() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    async function loadEnseignants() {
      try {
        const res = await api.get('/enseignants');
        setEnseignants(res.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEnseignants();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#0d6efd', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            RENCONTRES VEDETTES
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
            Rencontrez nos mentors certifiés d'excellence.
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.85rem', maxWidth: 600, margin: '0 auto' }}>
            Tous nos enseignants sont issus des meilleures universités, grandes écoles marocaines partenaires & CPGE nationales.
          </p>
        </div>

        {enseignants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Aucun enseignant disponible</p>
            <Link to="/register?role=enseignant" className="btn btn-primary">
              Devenir enseignant
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {enseignants.map(function(prof) {
              return (
                <div key={prof.utilisateur_id} className="col-md-6 col-lg-3">
                  <TeacherCard teacher={prof} user={prof.user} />
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/teachers" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0d6efd', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
            Voir tous nos enseignants
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TeachersSection;