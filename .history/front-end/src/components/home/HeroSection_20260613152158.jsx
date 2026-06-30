import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function HeroSection({ querySubject, setQuerySubject, queryCity, setQueryCity, activeSubjectFilter, setActiveSubjectFilter, onSearchSubmit }) {
  const navigate = useNavigate();
  const [matieres, setMatieres] = useState([]);
  const [villes, setVilles] = useState([]);
  const [showMatiere, setShowMatiere] = useState(false);
  const [showVille, setShowVille] = useState(false);
  const [matiereInput, setMatiereInput] = useState('');
  const [villeInput, setVilleInput] = useState('');

  useEffect(function() {
    api.get('/matieres').then(function(res) {
      setMatieres(res.data);
    }).catch(function(err) {
      console.log(err);
    });

    api.get('/villes').then(function(res) {
      setVilles(res.data);
    }).catch(function(err) {
      console.log(err);
    });
  }, []);

  function getMatieresFiltrees() {
    return matieres.filter(function(m) {
      return m.nom.toLowerCase().includes(matiereInput.toLowerCase());
    });
  }

  function getVillesFiltrees() {
    return villes.filter(function(v) {
      return v.nom.toLowerCase().includes(villeInput.toLowerCase());
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setQuerySubject(matiereInput);
    setQueryCity(villeInput);
    onSearchSubmit();
  }

  function selectMatiere(nom) {
    setMatiereInput(nom);
    setShowMatiere(false);
  }

  function selectVille(nom) {
    setVilleInput(nom);
    setShowVille(false);
  }

  const SUBJECT_PILLS = ['Maths', 'Anglais', 'Arabe', 'Physique', 'Français', 'SVT', 'Code'];

  return (
    <section className="relative pt-32 pb-24 atmospheric-glow-orange overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-8 space-y-8 animate-in fade-in duration-500">
        
        <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-orange font-bold animate-pulse">
          Soutien Scolaire d'Exception au Maroc
        </span>

        <h1 className="font-display-xxl text-5xl md:text-7xl lg:text-8xl text-ink leading-[1.05] tracking-tight max-w-4xl mx-auto">
          Trouvez le professeur parfait
        </h1>

        <p className="font-subtitle text-lg md:text-xl text-charcoal max-w-2xl mx-auto leading-relaxed">
          Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.
        </p>

        <div className="relative max-w-3xl mx-auto bg-surface-card border border-hairline-strong p-3 flex flex-col md:flex-row items-center gap-3 rounded-xl shadow-2xl">
          
          <div className="flex-1 flex items-center gap-3 px-3 w-full relative">
            <i className="bi bi-search h-5 w-5 text-charcoal shrink-0"></i>
            <input
              type="text"
              value={matiereInput}
              onFocus={() => setShowMatiere(true)}
              onBlur={() => setTimeout(() => setShowMatiere(false), 200)}
              onChange={(e) => setMatiereInput(e.target.value)}
              className="bg-transparent border-none text-ink placeholder:text-stone w-full py-2.5 text-sm outline-none"
              placeholder="Quelle matière ? (Ex: Maths, Code, Français...)"
            />
            {showMatiere && getMatieresFiltrees().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                {getMatieresFiltrees().slice(0, 10).map(function(m) {
                  return (
                    <button key={m.id_matiere} type="button" onClick={() => selectMatiere(m.nom)} className="w-full text-left px-4 py-2.5 text-xs text-ink hover:bg-accent-orange-glow hover:text-accent-orange font-semibold transition-colors flex items-center gap-2 cursor-pointer">
                      <i className="bi bi-search h-3 w-3 text-accent-orange shrink-0"></i>
                      <span>{m.nom}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-hairline-strong hidden md:block" />

          <div className="flex-1 flex items-center gap-3 px-3 w-full relative">
            <i className="bi bi-geo-alt h-5 w-5 text-charcoal shrink-0"></i>
            <input
              type="text"
              value={villeInput}
              onFocus={() => setShowVille(true)}
              onBlur={() => setTimeout(() => setShowVille(false), 200)}
              onChange={(e) => setVilleInput(e.target.value)}
              className="bg-transparent border-none text-ink placeholder:text-stone w-full py-2.5 text-sm outline-none"
              placeholder="À Casablanca, Rabat, Marrakech..."
            />
            {showVille && (
              <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface-card border border-hairline-strong rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto text-left">
                <button type="button" onClick={() => selectVille('En ligne')} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-accent-orange hover:bg-accent-orange-glow transition-colors cursor-pointer">
                  En ligne
                </button>
                {getVillesFiltrees().slice(0, 15).map(function(v) {
                  return (
                    <button key={v.id_ville} type="button" onClick={() => selectVille(v.nom)} className="w-full text-left px-4 py-2.5 text-xs text-charcoal hover:bg-accent-orange-glow hover:text-accent-orange transition-colors flex items-center justify-between cursor-pointer">
                      <span>{v.nom}</span>
                      <span className="text-[10px] text-mute">Maroc</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button onClick={handleSubmit} className="w-full md:w-auto bg-ink text-canvas px-8 py-3.5 rounded-lg font-button-md font-bold hover:bg-ash transition-all transform active:scale-95 cursor-pointer shrink-0">
            Rechercher
          </button>
        </div>

        <div className="pt-2">
          <span className="text-[10px] text-mute uppercase font-caption tracking-widest block mb-3">Accès Rapide</span>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {SUBJECT_PILLS.map(function(pill) {
              return (
                <button key={pill} onClick={() => { setMatiereInput(pill); setShowMatiere(false); onSearchSubmit(); }} className="px-4 py-1.5 rounded-full border text-xs font-medium tracking-wide transition-all cursor-pointer border-hairline bg-surface-deep/40 text-charcoal hover:border-hairline-strong hover:text-ink">
                  {pill}
                </button>
              );
            })}
            {(activeSubjectFilter || querySubject || queryCity) && (
              <button onClick={() => { setMatiereInput(''); setVilleInput(''); setActiveSubjectFilter(null); onSearchSubmit(); }} className="px-3 py-1.5 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-xs font-semibold hover:bg-accent-red-glow transition-all flex items-center gap-1.5 cursor-pointer">
                <i className="bi bi-arrow-repeat h-3.5 w-3.5"></i>
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-canvas to-transparent" />
    </section>
  );
}

export default HeroSection;