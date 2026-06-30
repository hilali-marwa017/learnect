import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from '../../components/TeacherCard';

function Teachers() {
  const [searchParams] = useSearchParams();
  const [enseignants, setEnseignants] = useState([]);
  const [filteredEnseignants, setFilteredEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    matiere: searchParams.get('search') || '',
    ville: searchParams.get('ville') || '',
    enligne: searchParams.get('enligne') === 'true'
  });

  useEffect(() => {
    loadEnseignants();
  }, []);

  useEffect(() => {
    filterEnseignants();
  }, [enseignants, filters]);

  const loadEnseignants = async () => {
    try {
      const res = await api.get('/enseignants');
      setEnseignants(res.data);
      setFilteredEnseignants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterEnseignants = () => {
    let filtered = [...enseignants];

    if (filters.matiere) {
      filtered = filtered.filter(prof =>
        prof.matieres?.some(m => 
          m.nom.toLowerCase().includes(filters.matiere.toLowerCase())
        )
      );
    }

    if (filters.ville && filters.ville !== 'En ligne') {
      filtered = filtered.filter(prof => prof.user?.ville === filters.ville);
    }

    if (filters.enligne) {
      filtered = filtered.filter(prof => prof.cours_enligne === true);
    }

    setFilteredEnseignants(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Trouvez votre professeur
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            {filteredEnseignants.length} professeurs disponibles
          </p>

          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                name="matiere"
                className="form-control"
                placeholder="Matière"
                value={filters.matiere}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <select name="ville" className="form-select" value={filters.ville} onChange={handleFilterChange}>
                <option value="">Toutes les villes</option>
                <option value="En ligne">En ligne (webcam)</option>
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Tanger">Tanger</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="enligne"
                  checked={filters.enligne}
                  onChange={(e) => setFilters({ ...filters, enligne: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="enligne">
                  Cours en ligne uniquement
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {filteredEnseignants.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-search" style={{ fontSize: '3rem', color: '#CBD5E1' }}></i>
            <p className="mt-3 text-muted">Aucun professeur trouvé</p>
            <Link to="/register?role=enseignant" className="btn btn-primary mt-2">
              Devenir enseignant
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {filteredEnseignants.map(teacher => (
              <div key={teacher.utilisateur_id} className="col-md-6 col-lg-4">
                <TeacherCard 
                  teacher={teacher} 
                  user={teacher.user}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Teachers;