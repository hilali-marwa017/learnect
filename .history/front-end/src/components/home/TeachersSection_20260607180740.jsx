import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from './TeacherCard';

function TeachersSection() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnseignants = async () => {
      try {
        const res = await api.get('/enseignants');
        console.log('Enseignants chargés:', res.data);
        setEnseignants(res.data.slice(0, 4)); // Prendre les 4 premiers
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
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <section style={{ padding: '5rem 0', background: '#F8FAFC' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ color: '#0d6efd', fontSize: '0.72rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: '4px' }}>
              À L'AFFICHE CE MOIS-CI
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Rencontrez nos super-enseignants
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '4px', marginBottom: 0 }}>
              Enseignants chevronnés, agrégés ou issus de grandes écoles
            </p>
          </div>
          <Link to="/teachers" style={{ color: '#0d6efd', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Parcourir tout l'annuaire scolaire
            <i className="bi bi-arrow-right" />
          </Link>
        </div>

        {enseignants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
            <i className="bi bi-person-workspace" style={{ fontSize: '3rem', color: '#BFDBFE', display: 'block', marginBottom: '1rem' }} />
            <p>Aucun enseignant disponible pour le moment</p>
            <Link to="/register?role=enseignant" className="btn btn-primary">Devenir le premier enseignant →</Link>
          </div>
        ) : (
          <div className="row g-4">
            {enseignants.map(prof => (
              <div key={prof.utilisateur_id} className="col-md-6 col-lg-3">
                <TeacherCard teacher={prof} user={prof.user} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TeachersSection;