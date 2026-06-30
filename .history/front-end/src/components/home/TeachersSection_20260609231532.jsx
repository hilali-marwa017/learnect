// src/components/home/TeachersSection.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function TeachersSection() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enseignants')
      .then(res => {
        setTeachers(res.data.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
        <div className="container text-center">
          <div className="spinner-border text-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
      <div className="container">
        
        <div className="text-center mb-4">
          <div style={{ color: '#0d6efd', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
            NOS PROFESSEURS
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            Des professeurs particuliers évalués
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '8px' }}>
            Tous vérifiés et certifiés par notre équipe
          </p>
        </div>

        <div className="row g-4">
          {teachers.map(teacher => (
            <div key={teacher.utilisateur_id} className="col-md-6 col-lg-4">
              <Link to={`/teachers/${teacher.utilisateur_id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '1.2rem',
                  border: '1px solid #E2E8F0',
                  height: '100%'
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      {teacher.user?.prenom?.[0]}{teacher.user?.nom?.[0]}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '2px' }}>
                            {teacher.user?.prenom} {teacher.user?.nom}
                          </h3>
                          <p style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '4px' }}>
                            <i className="bi bi-geo-alt" style={{ fontSize: '0.65rem', marginRight: '2px' }}></i>
                            {teacher.user?.ville} {teacher.cours_enligne && '· webcam'}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="bi bi-star-fill" style={{ color: '#fbbf24', fontSize: '12px' }}></i>
                            <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#0F172A' }}>5.0</span>
                            <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>({Math.floor(Math.random() * 50) + 1} avis)</span>
                          </div>
                        </div>
                      </div>
                      
                      <p style={{
                        fontSize: '0.8rem',
                        color: '#334155',
                        marginTop: '8px',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexWrap: 'wrap'
                      }}>
                        <i className="bi bi-book" style={{ color: '#0d6efd', fontSize: '0.7rem' }}></i>
                        {teacher.matieres?.[0]?.nom || 'Professeur'}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <div>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                            {teacher.tarifHeure} MAD
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>/h</span>
                        </div>
                        <div style={{
                          background: '#EFF6FF',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: '#0d6efd'
                        }}>
                          1er cours offert
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link to="/teachers" style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'transparent',
            border: '2px solid #0d6efd',
            borderRadius: '40px',
            color: '#0d6efd',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            Voir tous les professeurs →
          </Link>
        </div>

        <div className="text-center mt-5">
          <div style={{
            background: '#EFF6FF',
            borderRadius: '16px',
            padding: '1.5rem',
            borderLeft: '4px solid #0d6efd'
          }}>
            <i className="bi bi-quote" style={{ fontSize: '1.5rem', color: '#0d6efd', opacity: 0.5 }}></i>
            <p style={{ fontSize: '0.9rem', color: '#334155', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
              "Plus de 5000 élèves ont attribué une note de 5 étoiles à leur professeur sur Learnect"
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
              {[...Array(5)].map((_, i) => (
                <i key={i} className="bi bi-star-fill" style={{ color: '#fbbf24', fontSize: '12px' }}></i>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeachersSection;