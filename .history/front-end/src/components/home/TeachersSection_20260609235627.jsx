// src/components/home/TeachersSection.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from './TeacherCard';

function TeachersSection() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(function() {
    chargerEnseignants();
  }, []);

  function chargerEnseignants() {
    setLoading(true);
    setError('');
    
    api.get('/enseignants')
      .then(function(response) {
        const actifs = [];
        for (let i = 0; i < response.data.length; i++) {
          const e = response.data[i];
          if (e.estVerifie === true && e.statut_annonce === 'en_ligne') {
            actifs.push(e);
          }
        }
        
        const premiersEnseignants = [];
        for (let i = 0; i < actifs.length && i < 6; i++) {
          premiersEnseignants.push(actifs[i]);
        }
        
        setEnseignants(premiersEnseignants);
        setLoading(false);
      })
      .catch(function(err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les professeurs');
        setLoading(false);
      });
  }

  function renderStars() {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i key={i} className="bi bi-star-fill" style={{ color: '#fbbf24', fontSize: '12px' }}></i>
      );
    }
    return stars;
  }

  if (loading === true) {
    return (
      <section style={{ padding: '3rem 0', background: '#F8FAFC' }}>
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error !== '') {
    return (
      <section style={{ padding: '3rem 0', background: '#F8FAFC' }}>
        <div className="container text-center">
          <p style={{ color: '#DC2626' }}>{error}</p>
        </div>
      </section>
    );
  }

  if (enseignants.length === 0) {
    return (
      <section style={{ padding: '3rem 0', background: '#F8FAFC' }}>
        <div className="container text-center">
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            border: '1px solid #E2E8F0'
          }}>
            <i className="bi bi-person-x" style={{ fontSize: '3rem', color: '#94A3B8' }}></i>
            <h3 style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#334155' }}>
              Aucun professeur disponible
            </h3>
            <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
              Pour l'instant, aucun professeur n'est encore inscrit.<br />
              Sois le premier à rejoindre Learnect !
            </p>
            <Link to="/register?role=enseignant" className="btn btn-primary mt-3">
              Devenir enseignant
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
      <div className="container">
        
        <div className="text-center mb-4">
          <div style={{ 
            color: '#0d6efd', 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            letterSpacing: '2px', 
            textTransform: 'uppercase' 
          }}>
            NOS PROFESSEURS
          </div>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800, 
            color: '#0F172A', 
            marginTop: '6px' 
          }}>
            Des professeurs particuliers évalués
          </h2>
          <p style={{ 
            color: '#6B7280', 
            fontSize: '0.9rem', 
            marginTop: '8px' 
          }}>
            Tous vérifiés et certifiés par notre équipe
          </p>
        </div>

        <div className="row g-4">
          {enseignants.map(function(enseignant) {
            return (
              <div key={enseignant.utilisateur_id} className="col-md-6 col-lg-4">
                <TeacherCard enseignant={enseignant} />
              </div>
            );
          })}
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
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#334155', 
              maxWidth: '500px', 
              margin: '0 auto', 
              lineHeight: 1.5 
            }}>
              "Des milliers d'élèves ont attribué une note de 5 étoiles à leur professeur sur Learnect"
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
              {renderStars()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeachersSection;