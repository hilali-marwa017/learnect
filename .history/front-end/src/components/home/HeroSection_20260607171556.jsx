import { useState, useEffect, useRef } from 'react';
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
  const [coursEnLigne, setCoursEnLigne] = useState(false);

  const matiereRef = useRef(null);
  const villeRef = useRef(null);

  useEffect(() => {
    api.get('/matieres').then(res => setMatieres(res.data)).catch(err => console.log(err));
    api.get('/villes').then(res => setVilles(res.data)).catch(err => console.log(err));
  }, []);

  const matieresFiltrees = matieres.filter(m => m.nom.toLowerCase().includes(matiereInput.toLowerCase()));
  const villesFiltrees = villes.filter(v => v.nom.toLowerCase().includes(villeInput.toLowerCase()));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const isOnline = coursEnLigne || villeInput.toLowerCase().includes('en ligne');
    navigate(`/teachers?search=${matiereInput}&ville=${isOnline ? '' : villeInput}&enligne=${isOnline}`);
  };

  const selectMatiere = (nom) => {
    setMatiereInput(nom);
    setShowMatiere(false);
  };

  const selectVille = (nom, isOnline = false) => {
    setVilleInput(nom);
    setCoursEnLigne(isOnline);
    setShowVille(false);
  };

  const displayMatieres = [
    { label: "Anglais", search: "Anglais" },
    { label: "Maths", search: "Mathématiques" },
    { label: "Français", search: "Français" },
    { label: "Arabe", search: "Arabe" },
    { label: "Coaching Sportif", search: "Sport" },
    { label: "Physique - Chimie", search: "Physique-Chimie" },
    { label: "Soutien scolaire", search: "Soutien Scolaire" },
    { label: "Espagnol", search: "Espagnol" },
    { label: "SVT", search: "SVT" },
    { label: "Comptabilité", search: "Comptabilité" }
  ];

  const suggestedVilles = [
    { label: 'Casablanca', type: 'city' },
    { label: 'Rabat', type: 'city' },
    { label: 'Marrakech', type: 'city' },
    { label: 'Tanger', type: 'city' },
    { label: 'Fès', type: 'city' },
    { label: 'Agadir', type: 'city' }
  ];

  return (
    <section style={{ padding: '3rem 0', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
      <div className="container py-4 text-center">
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '1rem', lineHeight: 1.2 }}>
          Trouvez votre{' '}
          <span style={{ color: '#0d6efd' }}>professeur parfait</span>
        </h1>

        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ borderRadius: '40px', background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.8)', padding: '6px' }}>
            
            <form onSubmit={handleSearchSubmit} style={{ background: 'white', borderRadius: '32px', padding: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              
              {/* Input Matière */}
              <div ref={matiereRef} style={{ flex: 1, position: 'relative', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-book" style={{ fontSize: '1rem', color: '#0d6efd' }}></i>
                <input
                  type="text"
                  value={matiereInput}
                  onChange={(e) => { setMatiereInput(e.target.value); setShowMatiere(true); }}
                  onFocus={() => { setShowMatiere(true); setShowVille(false); }}
                  placeholder='Essayer "Maths"'
                  style={{ width: '100%', border: 'none', fontSize: '0.85rem', outline: 'none', background: 'transparent', fontWeight: 600, color: '#334155' }}
                />
                {showMatiere && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '24px', marginTop: '8px', zIndex: 1000, maxHeight: '300px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', padding: '8px' }}>
                    {displayMatieres
                      .filter(m => !matiereInput || m.label.toLowerCase().includes(matiereInput.toLowerCase()))
                      .map((m, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => { selectMatiere(m.search); setMatiereInput(m.label); }}
                          style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent', borderRadius: '12px', fontSize: '0.85rem', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <i className="bi bi-search" style={{ fontSize: '0.75rem', color: '#94A3B8' }}></i>
                          <span>{m.label}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Séparateur */}
              <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }}></div>

              {/* Input Ville */}
              <div ref={villeRef} style={{ flex: 1, position: 'relative', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-geo-alt" style={{ fontSize: '1rem', color: '#0d6efd' }}></i>
                <input
                  type="text"
                  value={villeInput}
                  onChange={(e) => { setVilleInput(e.target.value); setShowVille(true); }}
                  onFocus={() => { setShowVille(true); setShowMatiere(false); }}
                  placeholder="Adresse ou ville"
                  style={{ width: '100%', border: 'none', fontSize: '0.85rem', outline: 'none', background: 'transparent', fontWeight: 600, color: '#334155' }}
                />
                {showVille && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '24px', marginTop: '8px', zIndex: 1000, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', padding: '12px' }}>
                    <button
                      type="button"
                      onClick={() => { selectVille('Autour de moi', false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}
                    >
                      Autour de moi
                    </button>
                    <button
                      type="button"
                      onClick={() => { selectVille('En ligne', true); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}
                    >
                      En ligne
                    </button>
                    {villeInput && (
                      <>
                        <div style={{ height: '1px', background: '#F1F5F9', margin: '8px 0' }}></div>
                        {suggestedVilles
                          .filter(v => v.label.toLowerCase().includes(villeInput.toLowerCase()))
                          .map((v, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => { selectVille(v.label, false); }}
                              style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent', borderRadius: '12px', fontSize: '0.85rem', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                              <span>{v.label}</span>
                              <span style={{ fontSize: '0.65rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: '20px', color: '#64748b' }}>Maroc</span>
                            </button>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" style={{ padding: '10px 24px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Rechercher
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;