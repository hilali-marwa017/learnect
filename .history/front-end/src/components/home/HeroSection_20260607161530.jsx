import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function HeroSection() {
  const navigate = useNavigate();

  const [matiereInput, setMatiereInput] = useState('');
  const [villeInput, setVilleInput] = useState('');
  const [matieres, setMatieres] = useState([]);
  const [villes, setVilles] = useState([]);
  const [showMatiere, setShowMatiere] = useState(false);
  const [showVille, setShowVille] = useState(false);

  // Données par défaut (fallback)
  const defaultMatieres = [
    { id_matiere: 1, nom: 'Maths', categorie: 'Sciences' },
    { id_matiere: 2, nom: 'Français', categorie: 'Langues' },
    { id_matiere: 3, nom: 'Anglais', categorie: 'Langues' },
    { id_matiere: 4, nom: 'Arabe', categorie: 'Langues' },
    { id_matiere: 5, nom: 'Physique-Chimie', categorie: 'Sciences' },
    { id_matiere: 6, nom: 'SVT', categorie: 'Sciences' },
    { id_matiere: 7, nom: 'Informatique', categorie: 'Sciences' },
    { id_matiere: 8, nom: 'Coaching Sportif', categorie: 'Sport' },
    { id_matiere: 9, nom: 'Histoire-Géo', categorie: 'Lettres' },
    { id_matiere: 10, nom: 'Philosophie', categorie: 'Lettres' }
  ];

  const defaultVilles = [
    { id_ville: 1, nom: 'Casablanca' },
    { id_ville: 2, nom: 'Rabat' },
    { id_ville: 3, nom: 'Marrakech' },
    { id_ville: 4, nom: 'Tanger' },
    { id_ville: 5, nom: 'Fès' },
    { id_ville: 6, nom: 'Agadir' },
    { id_ville: 7, nom: 'Meknès' },
    { id_ville: 8, nom: 'Oujda' },
    { id_ville: 9, nom: 'Tétouan' },
    { id_ville: 10, nom: 'Kenitra' }
  ];

  useEffect(() => {
    // Charger les matières avec fallback
    api.get('/matieres')
      .then(res => setMatieres(res.data))
      .catch(err => {
        console.log('API matières non disponible, utilisation données par défaut');
        setMatieres(defaultMatieres);
      });
    
    // Charger les villes avec fallback
    api.get('/villes')
      .then(res => setVilles(res.data))
      .catch(err => {
        console.log('API villes non disponible, utilisation données par défaut');
        setVilles(defaultVilles);
      });
  }, []);

  const matieresFiltrees = matieres.filter(m => m.nom.toLowerCase().includes(matiereInput.toLowerCase()));
  const villesFiltrees = villes.filter(v => v.nom.toLowerCase().includes(villeInput.toLowerCase()));

  const handleSubmit = (e) => {
    e.preventDefault();
    const isOnline = villeInput.toLowerCase().includes('en ligne');
    navigate(`/teachers?search=${matiereInput}&ville=${isOnline ? '' : villeInput}&enligne=${isOnline}`);
  };

  const selectMatiere = (nom) => {
    setMatiereInput(nom);
    setShowMatiere(false);
  };

  const selectVille = (nom) => {
    setVilleInput(nom);
    setShowVille(false);
  };

  const tags = matieres.slice(0, 8).map(m => m.nom);

  return (
    <section style={{ padding: '5rem 0', background: '#F8FAFC' }}>
      <div className="container">
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.8rem' }}>
            TROUVEZ LE <span style={{ color: '#0d6efd' }}>PROFESSEUR PARFAIT</span>
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#6B7280', marginBottom: '2rem' }}>
            Des milliers de professeurs qualifiés près de chez vous
          </p>

          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              background: 'white',
              borderRadius: '60px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              border: '1px solid #E2E8F0'
            }}>
              
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="fr"
                  value={matiereInput}
                  onChange={e => { setMatiereInput(e.target.value); setShowMatiere(true); }}
                  onFocus={() => setShowMatiere(true)}
                  onBlur={() => setTimeout(() => setShowMatiere(false), 200)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: 'none',
                    fontSize: '0.95rem',
                    outline: 'none',
                    background: 'white'
                  }}
                />
                {showMatiere && matieresFiltrees.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    marginTop: '8px',
                    zIndex: 1000,
                    maxHeight: '250px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    {matieresFiltrees.slice(0, 15).map(m => (
                      <div
                        key={m.id_matiere}
                        onMouseDown={(e) => { e.preventDefault(); selectMatiere(m.nom); }}
                        style={{ padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}
                      >
                        {m.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ width: '1px', background: '#E2E8F0' }}></div>

              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Adresse ou ville"
                  value={villeInput}
                  onChange={e => { setVilleInput(e.target.value); setShowVille(true); }}
                  onFocus={() => setShowVille(true)}
                  onBlur={() => setTimeout(() => setShowVille(false), 200)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: 'none',
                    fontSize: '0.95rem',
                    outline: 'none',
                    background: 'white'
                  }}
                />
                {showVille && villesFiltrees.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    marginTop: '8px',
                    zIndex: 1000,
                    maxHeight: '250px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <div
                      onMouseDown={(e) => { e.preventDefault(); selectVille('En ligne'); }}
                      style={{ padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}
                    >
                      <i className="bi bi-wifi me-2" style={{ color: '#0d6efd' }}></i>En ligne (webcam)
                    </div>
                    {villesFiltrees.slice(0, 15).map(v => (
                      <div
                        key={v.id_ville}
                        onMouseDown={(e) => { e.preventDefault(); selectVille(v.nom); }}
                        style={{ padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}
                      >
                        <i className="bi bi-geo-alt me-2" style={{ color: '#94A3B8' }}></i>{v.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" style={{
                padding: '0 32px',
                background: '#0d6efd',
                color: 'white',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                <i className="bi bi-search me-2"></i>Rechercher
              </button>
            </div>
          </form>

          {/* Tags matières */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '1.5rem' }}>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setMatiereInput(tag)}
                style={{
                  padding: '8px 20px',
                  background: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '40px',
                  fontSize: '0.85rem',
                  color: '#4A5568',
                  cursor: 'pointer'
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Lien enseignant */}
          <div style={{ marginTop: '2rem' }}>
            <Link to="/register?role=enseignant" style={{ color: '#0d6efd', textDecoration: 'none', fontSize: '0.9rem' }}>
              <i className="bi bi-briefcase me-1"></i> Vous êtes enseignant ? Rejoignez la plateforme
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;