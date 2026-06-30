import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function Teachers() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEnseignants = async () => {
      try {
        const res = await api.get('/enseignants');
        console.log('DONNEES BRUTES:', res.data);
        console.log('NOMBRE:', res.data.length);
        setEnseignants(res.data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEnseignants();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner-border text-primary"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <p>Erreur: {error}</p>
        <p>Vérifie que le backend tourne sur http://localhost:8000</p>
      </div>
    );
  }

  // Affichage SIMPLE sans TeacherCard pour tester
  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-center">Enseignants ({enseignants.length})</h1>
      
      {/* Affichage simple en tableau */}
      <div className="container">
        <div className="row">
          {enseignants.map(teacher => (
            <div key={teacher.utilisateur_id} className="col-md-4 mb-3">
              <div className="card p-3">
                <h4>{teacher.user?.prenom} {teacher.user?.nom}</h4>
                <p><strong>Ville:</strong> {teacher.user?.ville}</p>
                <p><strong>Tarif:</strong> {teacher.tarifHeure} DH/h</p>
                <p><strong>Note:</strong> {teacher.noteMoyenne} ★</p>
                <p><strong>Matière:</strong> {teacher.matieres?.[0]?.nom || 'Non défini'}</p>
                <p><strong>Vérifié:</strong> {teacher.estVerifie ? '✅ Oui' : '❌ Non'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Teachers;