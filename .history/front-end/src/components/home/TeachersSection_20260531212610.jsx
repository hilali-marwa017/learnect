// src/components/home/TeachersSection.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from './TeacherCard';

function TeachersSection() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/enseignants');
        setEnseignants(res.data.slice(0, 3));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section style={{ padding: '5rem 0', background: '#F8FAFC' }}>
      <div className="container">

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2rem',
          flexWrap: 'wrap', gap: 8,
        }}>
          <div>
            <div style={{
              color: '#0d6efd', fontSize: '0.72rem',
              fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', marginBottom: 4,
            }}>
              À L'AFFICHE CE MOIS-CI
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.6rem', fontWeight: 800,
              color: '#0F172A', margin: 0,
            }}>
              Rencontrez nos super-enseignants
            </h2>
            <p style={{
              color: '#6B7280', fontSize: '0.85rem',
              marginTop: 4, marginBottom: 0,
            }}>
              Enseignants chevronnés, agrégés ou issus de grandes écoles
            </p>
          </div>
          <Link to="/teachers" style={{
            color: '#0d6efd', fontWeight: 700,
            textDecoration: 'none', fontSize: '0.88rem',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            Parcourir tout l'annuaire scolaire
            <i className="bi bi-arrow-right" />
          </Link>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="text-center py-5">
            <div style={{
              width: 36, height: 36,
              border: '3px solid #BFDBFE',
              borderTopColor: '#0d6efd',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto',
            }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : enseignants.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '3rem',
            color: '#6B7280',
          }}>
            <i className="bi bi-person-workspace" style={{
              fontSize: '3rem', color: '#BFDBFE',
              display: 'block', marginBottom: '1rem',
            }} />
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              Aucun enseignant disponible pour le moment
            </p>
            <Link to="/register?role=enseignant" style={{
              background: '#0d6efd', color: 'white',
              padding: '9px 20px', borderRadius: 8,
              textDecoration: 'none', fontWeight: 600,
              fontSize: '0.88rem',
            }}>
              Devenir le premier enseignant →
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {enseignants.map(prof => (
              <div key={prof.utilisateur_id} className="col-md-4">
                <TeacherCard prof={prof} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TeachersSection;