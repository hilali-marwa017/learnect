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

  useEffect(() => {
    api.get('/matieres').then(res => setMatieres(res.data)).catch(err => console.log(err));
    api.get('/villes').then(res => setVilles(res.data)).catch(err => console.log(err));
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

  const tags = ['Anglais', 'Maths', 'Français', 'Arabe', 'Coaching Sportif', 'Physique', 'Informatique', 'SVT'];

  return (
    <section style={{ padding: '4rem 0', background: 'white' }}>
      <div className="container">
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
            Trouvez votre professeur
          </h1>
          <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '2rem' }}>
            Des milliers de professeurs qualifiés près de chez vous
          </p>

          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            {/* Div container avec ombre */}
            <div style={{
              display: 'flex',
              background: 'white',
              borderRadius: '60px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '1px solid #E2E8F0'
            }}>
              
              {/* Input 1 - Matière */}
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Essayer 'Maths'"
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
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', marginTop: '8px', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {matieresFiltrees.slice(0, 10).map(m => (
                      <div key={m.id_matiere} onMouseDown={(e) => { e.preventDefault(); selectMatiere(m.nom); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}>
                        {m.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Séparateur */}
              <div style={{ width: '1px', background: '#E2E8F0' }}></div>

              {/* Input 2 - Ville */}
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
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', marginTop: '8px', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div onMouseDown={(e) => { e.preventDefault(); selectVille('En ligne'); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}>
                      <i className="bi bi-wifi me-2" style={{ color: '#0d6efd' }}></i>En ligne (webcam)
                    </div>
                    {villesFiltrees.filter(v => v.nom !== 'En ligne').slice(0, 15).map(v => (
                      <div key={v.id_ville} onMouseDown={(e) => { e.preventDefault(); selectVille(v.nom); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}>
                        <i className="bi bi-geo-alt me-2" style={{ color: '#94A3B8' }}></i>{v.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bouton Rechercher */}
              <button type="submit" style={{
                padding: '0 28px',
                background: '#0d6efd',
                color: 'white',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                Rechercher
              </button>
            </div>
          </form>

          {/* Tags matières populaires */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '1rem' }}>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setMatiereInput(tag)}
                style={{
                  padding: '6px 16px',
                  background: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  color: '#4A5568',
                  cursor: 'pointer'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;