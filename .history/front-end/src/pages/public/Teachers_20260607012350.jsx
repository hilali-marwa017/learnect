// src/pages/public/Teachers.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from '../../components/home/TeacherCard';
import TeacherMap from '../../components/TeacherMap';

function Teachers() {
  const [searchParams] = useSearchParams();
  const [enseignants, setEnseignants] = useState([]);
  const [filteredEnseignants, setFilteredEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  // Filtres
  const [filters, setFilters] = useState({
    matiere: searchParams.get('search') || '',
    ville: searchParams.get('ville') || '',
    enligne: searchParams.get('enligne') === 'true',
    tarif_max: '',
    note_min: ''
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

    if (filters.tarif_max) {
      filtered = filtered.filter(prof => prof.tarifHeure <= parseInt(filters.tarif_max));
    }

    if (filters.note_min) {
      filtered = filtered.filter(prof => prof.noteMoyenne >= parseFloat(filters.note_min));
    }

    setFilteredEnseignants(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleCitySelect = (city) => {
    setFilters({ ...filters, ville: city });
    setSelectedCity(city);
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* Hero + Filtres */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Trouvez votre professeur
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            {filteredEnseignants.length} professeurs disponibles
          </p>

          {/* Barre de filtres */}
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                name="matiere"
                className="form-control"
                placeholder="Matière"
                value={filters.matiere}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2">
              <select name="ville" className="form-select" value={filters.ville} onChange={handleFilterChange}>
                <option value="">Toutes les villes</option>
                <option value="En ligne">En ligne (webcam)</option>
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Tanger">Tanger</option>
                <option value="Fès">Fès</option>
                <option value="Agadir">Agadir</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="tarif_max"
                className="form-control"
                placeholder="Tarif max (DH)"
                value={filters.tarif_max}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2">
              <select name="note_min" className="form-select" value={filters.note_min} onChange={handleFilterChange}>
                <option value="">Note minimum</option>
                <option value="4.5">4.5+ étoiles</option>
                <option value="4">4+ étoiles</option>
                <option value="3.5">3.5+ étoiles</option>
              </select>
            </div>
            <div className="col-md-2">
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

          {/* Toggle Vue Liste / Carte */}
          <div className="mt-4 d-flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              <i className="bi bi-list-ul me-1"></i> Liste
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              <i className="bi bi-map me-1"></i> Carte
            </button>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <>
            {viewMode === 'map' ? (
              <div>
                <TeacherMap
                  enseignants={filteredEnseignants}
                  selectedCity={filters.ville}
                  onCitySelect={handleCitySelect}
                />
                <div className="row g-4 mt-4">
                  {filteredEnseignants.map(prof => (
                    <div key={prof.utilisateur_id} className="col-md-4">
                      <TeacherCard prof={prof} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {filteredEnseignants.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <i className="bi bi-search" style={{ fontSize: '3rem', color: '#CBD5E1' }}></i>
                    <p className="mt-3 text-muted">Aucun professeur trouvé</p>
                    <p className="small text-muted">Essayez de modifier vos critères</p>
                  </div>
                ) : (
                  filteredEnseignants.map(prof => (
                    <div key={prof.utilisateur_id} className="col-md-4">
                      <TeacherCard prof={prof} />
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Teachers;