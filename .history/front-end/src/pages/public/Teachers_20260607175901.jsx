import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from '../../components/home/TeacherCard';

function Teachers() {
  const [enseignants, setEnseignants] = useState([]);
  const [filteredEnseignants, setFilteredEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMatiere, setSearchMatiere] = useState('');
  const [searchVille, setSearchVille] = useState('');
  const [filterEnLigne, setFilterEnLigne] = useState(false);
  const [maxTarif, setMaxTarif] = useState(300);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadEnseignants();
  }, []);

  useEffect(() => {
    filterEnseignants();
  }, [enseignants, searchMatiere, searchVille, filterEnLigne, maxTarif]);

  const loadEnseignants = async () => {
    try {
      const res = await api.get('/enseignants');
      setEnseignants(res.data);
      setFilteredEnseignants(res.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEnseignants = () => {
    let filtered = [...enseignants];

    if (searchMatiere) {
      filtered = filtered.filter(prof =>
        prof.matieres?.some(m => 
          m.nom.toLowerCase().includes(searchMatiere.toLowerCase())
        )
      );
    }

    if (searchVille) {
      filtered = filtered.filter(prof => 
        prof.user?.ville?.toLowerCase().includes(searchVille.toLowerCase())
      );
    }

    if (filterEnLigne) {
      filtered = filtered.filter(prof => prof.cours_enligne === true);
    }

    filtered = filtered.filter(prof => prof.tarifHeure <= maxTarif);

    setFilteredEnseignants(filtered);
  };

  const resetFilters = () => {
    setSearchMatiere('');
    setSearchVille('');
    setFilterEnLigne(false);
    setMaxTarif(300);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)', padding: '4rem 0', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
              Nos Enseignants Certifiés
            </h1>
            <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '2rem' }}>
              Tous nos enseignants sont vérifiés et diplômés des meilleures institutions marocaines
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div><span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{enseignants.length}</span><br />Enseignants</div>
              <div><span style={{ fontSize: '1.5rem', fontWeight: 700 }}>10+</span><br />Villes</div>
              <div><span style={{ fontSize: '1.5rem', fontWeight: 700 }}>4.8★</span><br />Note moyenne</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        
        {/* Barre de recherche */}
        <div style={{ background: 'white', borderRadius: '60px', padding: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, position: 'relative', minWidth: 200 }}>
              <i className="bi bi-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></i>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher une matière..."
                value={searchMatiere}
                onChange={(e) => setSearchMatiere(e.target.value)}
                style={{ padding: '12px 16px 12px 44px', border: 'none', borderRadius: '60px', background: '#F8FAFC' }}
              />
            </div>
            <div style={{ flex: 2, position: 'relative', minWidth: 180 }}>
              <i className="bi bi-geo-alt" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></i>
              <input
                type="text"
                className="form-control"
                placeholder="Ville"
                value={searchVille}
                onChange={(e) => setSearchVille(e.target.value)}
                style={{ padding: '12px 16px 12px 44px', border: 'none', borderRadius: '60px', background: '#F8FAFC' }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{ padding: '12px 20px', background: '#F8FAFC', border: 'none', borderRadius: '60px', cursor: 'pointer' }}
            >
              <i className="bi bi-sliders2"></i> Filtres
            </button>
            <button
              onClick={resetFilters}
              style={{ padding: '12px 20px', background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }}
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div className="row g-4">
              <div className="col-md-6">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>
                  BUDGET MAXIMUM (DH/h)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={maxTarif}
                    onChange={(e) => setMaxTarif(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ background: '#0d6efd', color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>
                    {maxTarif} DH
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>
                  MODALITÉ
                </label>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="enLigne"
                    checked={filterEnLigne}
                    onChange={(e) => setFilterEnLigne(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="enLigne">
                    <i className="bi bi-wifi me-1"></i> Cours en ligne uniquement
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Résultats */}
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#6B7280' }}>
            <strong style={{ color: '#0F172A' }}>{filteredEnseignants.length}</strong> professeurs trouvés
          </p>
        </div>

        {filteredEnseignants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '24px' }}>
            <i className="bi bi-search" style={{ fontSize: '3rem', color: '#CBD5E1' }}></i>
            <h3 style={{ marginTop: '1rem', fontSize: '1.2rem' }}>Aucun enseignant trouvé</h3>
            <p style={{ color: '#6B7280' }}>Essayez de modifier vos critères de recherche</p>
            <button onClick={resetFilters} className="btn btn-primary">Réinitialiser les filtres</button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredEnseignants.map(teacher => (
              <div key={teacher.utilisateur_id} className="col-md-6 col-lg-4">
                <TeacherCard teacher={teacher} user={teacher.user} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Teachers;