import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import TeacherCard from '../../components/home/TeacherCard';

// Données mockées pour tester
const mockTeachers = [
  {
    utilisateur_id: 1,
    tarifHeure: 180,
    noteMoyenne: 4.8,
    estVerifie: true,
    avisCount: 3,
    matiere: "Mathématiques",
    titre: "Professeur Agrégé de Mathématiques",
    description_profil: "Préparation intensive aux Classes Préparatoires et examens nationaux",
    cours_domicile: true,
    cours_enligne: true,
    user: {
      prenom: "Sofia",
      nom: "Benani",
      ville: "Casablanca",
      photo: null
    }
  },
  {
    utilisateur_id: 2,
    tarifHeure: 200,
    noteMoyenne: 4.9,
    estVerifie: true,
    avisCount: 3,
    matiere: "Physique-Chimie",
    titre: "Spécialiste en Physique-Chimie",
    description_profil: "Excellence Lycée, CPGE & Facultés",
    cours_domicile: true,
    cours_enligne: true,
    user: {
      prenom: "Amine",
      nom: "Chraïbi",
      ville: "Marrakech",
      photo: null
    }
  },
  {
    utilisateur_id: 3,
    tarifHeure: 150,
    noteMoyenne: 5.0,
    estVerifie: true,
    avisCount: 3,
    matiere: "SVT",
    titre: "Professeur Expérimentée de SVT",
    description_profil: "Terminale Bac SMB & PC Français/Arabe",
    cours_domicile: true,
    cours_enligne: true,
    user: {
      prenom: "Leila",
      nom: "Moukrim",
      ville: "Rabat",
      photo: null
    }
  }
];

function Teachers() {
  const [searchParams] = useSearchParams();
  const [enseignants, setEnseignants] = useState([]);
  const [filteredEnseignants, setFilteredEnseignants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);

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
    setLoading(true);
    try {
      const res = await api.get('/enseignants');
      if (res.data && res.data.length > 0) {
        setEnseignants(res.data);
        setFilteredEnseignants(res.data);
      } else {
        // Si pas de données, utiliser les mock
        setEnseignants(mockTeachers);
        setFilteredEnseignants(mockTeachers);
        setUseMock(true);
      }
    } catch (err) {
      console.error('Erreur chargement, utilisation des données mockées');
      setEnseignants(mockTeachers);
      setFilteredEnseignants(mockTeachers);
      setUseMock(true);
    } finally {
      setLoading(false);
    }
  };

  const filterEnseignants = () => {
    let filtered = [...enseignants];

    if (filters.matiere) {
      filtered = filtered.filter(prof =>
        prof.matiere?.toLowerCase().includes(filters.matiere.toLowerCase())
      );
    }

    if (filters.ville && filters.ville !== 'En ligne') {
      filtered = filtered.filter(prof => prof.user?.ville === filters.ville);
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
          <div style={{ marginBottom: '0.5rem', color: '#0d6efd', fontSize: '0.75rem', fontWeight: 600 }}>
            À L'AFFICHE CE MOIS-CI
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Rencontrez nos super-enseignants
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            Enseignants chevronnés, agrégés ou issus de grandes écoles
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
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Tanger">Tanger</option>
              </select>
            </div>
            <div className="col-md-auto">
              <Link to="/teachers" className="btn btn-outline-primary">
                Parcourir tout l'annuaire scolaire →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {filteredEnseignants.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-person-workspace" style={{ fontSize: '3rem', color: '#CBD5E1' }}></i>
            <p className="mt-3 text-muted">Aucun enseignant disponible pour le moment</p>
            <Link to="/register?role=enseignant" className="btn btn-primary">
              Devenir le premier enseignant →
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

      {useMock && (
        <div className="text-center py-3">
          <small className="text-muted">⚠️ Données de démonstration (API non disponible)</small>
        </div>
      )}
    </div>
  );
}

export default Teachers;