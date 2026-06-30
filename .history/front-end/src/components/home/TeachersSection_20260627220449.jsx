import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherCard from './home/TeacherCard';
import api from '../api/axios';

export default function TeachersSection({ isDark, querySubject, queryCity, activePill }) {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeachers() {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (querySubject) params.matiere = querySubject;
        if (queryCity) params.ville = queryCity;
        const res = await api.get('/enseignants', { params });
        setTeachers(res.data || []);
      } catch (e) {
        setError('Erreur lors du chargement des professeurs');
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, [querySubject, queryCity]);

  if (loading) {
    return (
      <section id="tutors-section" style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '3rem', color: isDark ? '#9ca3af' : '#6b7280' }}>
          Chargement...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="tutors-section" style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
          {error}
        </div>
      </section>
    );
  }

  return (
    <section id="tutors-section" style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {teachers.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          borderRadius: '20px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: isDark ? '#ffffff' : '#111827', marginBottom: '0.5rem' }}>
            Aucun professeur trouvé
          </div>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '1rem' }}>
            Essayez de modifier vos critères de recherche
          </p>
          {/* ✅ SUPPRIME LE BOUTON REINITIALISER ICI */}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {teachers.map(teacher => (
            <TeacherCard key={teacher.id} teacher={teacher} isDark={isDark} />
          ))}
        </div>
      )}
    </section>
  );
}