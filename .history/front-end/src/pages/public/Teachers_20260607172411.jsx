import { useState, useEffect } from 'react';
import api from '../../api/axios';
import TeacherCard from '../../components/TeacherCard';

function Teachers() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enseignants')
      .then(res => setEnseignants(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        {enseignants.map(teacher => (
          <div key={teacher.utilisateur_id} className="col-md-6 col-lg-4">
            <TeacherCard 
              teacher={teacher} 
              user={teacher.user}
              onSelect={(id) => console.log('Selected teacher:', id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teachers;