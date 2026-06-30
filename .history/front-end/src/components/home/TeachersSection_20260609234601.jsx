import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from './TeacherCard';

function TeachersSection() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    chargerEnseignants();
  }, []);

  const chargerEnseignants = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/enseignants');
      // Filtrer seulement les enseignants vérifiés et avec annonce en ligne
      const actifs = response.data.filter(
        e => e.estVerifie === true && e.statut_annonce === 'en_ligne'
      );
      setEnseignants(actifs.slice(0, 6)); // 6 premiers seulement
    } catch (err) {
      console.error('Erreur chargement enseignants:', err);
      setError('Impossible de charger les professeurs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  if (error) {
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
          <p style={{ color: '#6B7280' }}>Aucun professeur disponible pour le moment</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
      <div className="container">
        
        {/* Header */}
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

        {/* Grille des professeurs */}
        <div className="row g-4">
          {enseignants.map((enseignant) => (
            <div key={enseignant.utilisateur_id} className="col-md-6 col-lg-4">
              <TeacherCard enseignant={enseignant} />
            </div>
          ))}
        </div>

        {/* Bouton voir plus */}
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

        {/* Citation */}
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