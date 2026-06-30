import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RegisterTeacher() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [voirPassword, setVoirPassword] = useState(false);
  const [voirConfirm, setVoirConfirm] = useState(false);

  const [formulaire, setFormulaire] = useState({
    prenom: '', nom: '', email: '', telephone: '', ville: '',
    password: '', password_confirmation: '', matiere: '', tarifHeure: ''
  });
  const [fichiers, setFichiers] = useState({
    cin_recto: null, cin_verso: null, diplome: null
  });

  function handleChange(e) {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  }

  function handleFichier(e, type) {
    const file = e.target.files[0];
    if (file) setFichiers({ ...fichiers, [type]: file });
  }

  function validerFormulaire() {
    const { prenom, nom, email, telephone, ville, password, password_confirmation, matiere, tarifHeure } = formulaire;
    if (!prenom || !nom || !email || !telephone || !ville || !password || !matiere || !tarifHeure) {
      setErreur('Tous les champs sont obligatoires');
      return false;
    }
    if (password !== password_confirmation) {
      setErreur('Les mots de passe ne correspondent pas');
      return false;
    }
    if (password.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (Number(tarifHeure) < 50) {
      setErreur('Le tarif minimum est de 50 DH/h');
      return false;
    }
    if (!fichiers.cin_recto || !fichiers.cin_verso || !fichiers.diplome) {
      setErreur('Veuillez télécharger tous les documents requis');
      return false;
    }
    setErreur('');
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validerFormulaire()) return;

    setChargement(true);
    try {
      const donnees = new FormData();
      Object.entries(formulaire).forEach(([cle, valeur]) => donnees.append(cle, valeur));
      donnees.append('role', 'enseignant');
      donnees.append('cin_recto', fichiers.cin_recto);
      donnees.append('cin_verso', fichiers.cin_verso);
      donnees.append('diplome', fichiers.diplome);

      await register(donnees);
      navigate('/teacher/dashboard');
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '100vh' }}>

      <div className="w-100 mb-3" style={{ maxWidth: 580 }}>
        <Link to="/" className="text-muted text-decoration-none small">
          <i className="bi bi-arrow-left me-1"></i>Retour à l'accueil
        </Link>
      </div>

      <div className="card border-0 shadow rounded-4" style={{ maxWidth: 580, width: '100%' }}>
        <div className="card-body p-4">

          <div className="text-center mb-4">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{ width: 52, height: 52 }}>
              <i className="bi bi-mortarboard fs-4"></i>
            </div>
            <div className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 mb-2">
              <i className="bi bi-briefcase"></i>
              <span className="small fw-semibold">Enseignant</span>
            </div>
            <h5 className="fw-bold mb-0">Devenir Enseignant</h5>
            <p className="text-muted small mt-1">Partagez vos connaissances</p>
          </div>

          {erreur && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-6">
                <label className="form-label small fw-semibold">NOM</label>
                <input type="text" name="nom" className="form-control" placeholder="Benani" value={formulaire.nom} onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">PRÉNOM</label>
                <input type="text" name="prenom" className="form-control" placeholder="Marwa" value={formulaire.prenom} onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold">EMAIL</label>
                <input type="email" name="email" className="form-control" placeholder="marwa@example.com" value={formulaire.email} onChange={handleChange} required />
              </div>

              <div className="col-6">
                <label className="form-label small fw-semibold">TÉLÉPHONE</label>
                <input type="tel" name="telephone" className="form-control" placeholder="+212 6XX XXX XXX" value={formulaire.telephone} onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">VILLE</label>
                <select name="ville" className="form-select" value={formulaire.ville} onChange={handleChange} required>
                  <option value="">Sélectionner</option>
                  {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="col-6">
                <label className="form-label small fw-semibold">MOT DE PASSE</label>
                <div className="input-group">
                  <input type={voirPassword ? 'text' : 'password'} name="password" className="form-control" placeholder="Min. 6 caractères" value={formulaire.password} onChange={handleChange} required />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setVoirPassword(!voirPassword)}>
                    <i className={`bi ${voirPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">CONFIRMER</label>
                <div className="input-group">
                  <input type={voirConfirm ? 'text' : 'password'} name="password_confirmation" className="form-control" placeholder="Confirmer" value={formulaire.password_confirmation} onChange={handleChange} required />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setVoirConfirm(!voirConfirm)}>
                    <i className={`bi ${voirConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="col-8">
                <label className="form-label small fw-semibold">MATIÈRE PRINCIPALE</label>
                <select name="matiere" className="form-select" value={formulaire.matiere} onChange={handleChange} required>
                  <option value="">Sélectionner une discipline...</option>
                  {['Mathématiques', 'Physique-Chimie', 'SVT', 'Français', 'Anglais', 'Arabe', 'Informatique'].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="col-4">
                <label className="form-label small fw-semibold">TARIF (DH/h)</label>
                <input type="number" name="tarifHeure" className="form-control" min="50" placeholder="120" value={formulaire.tarifHeure} onChange={handleChange} required />
              </div>

              {/* Documents */}
              <div className="col-12 mt-2">
                <div className="bg-light rounded-3 p-3">
                  <p className="small fw-bold text-primary mb-2"><i className="bi bi-shield-check me-1"></i>Documents requis</p>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">CIN RECTO</label>
                      <div className="border rounded-3 p-2 bg-white">
                        <input type="file" name="cin_recto" accept="image/*" className="form-control form-control-sm" onChange={(e) => handleFichier(e, 'cin_recto')} required />
                        <small className="text-muted">JPG/PNG — Max 2MB</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">CIN VERSO</label>
                      <div className="border rounded-3 p-2 bg-white">
                        <input type="file" name="cin_verso" accept="image/*" className="form-control form-control-sm" onChange={(e) => handleFichier(e, 'cin_verso')} required />
                        <small className="text-muted">JPG/PNG — Max 2MB</small>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">DIPLÔME</label>
                      <div className="border rounded-3 p-2 bg-white">
                        <input type="file" name="diplome" accept=".pdf" className="form-control form-control-sm" onChange={(e) => handleFichier(e, 'diplome')} required />
                        <small className="text-muted">PDF — Max 5MB</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CHECKBOX */}
              <div className="col-12 mt-3">
                <div style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <input type="checkbox" id="certification" required style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#0d6efd' }} />
                  <label htmlFor="certification" style={{ margin: 0, cursor: 'pointer', fontSize: '0.85rem', color: '#1e293b' }}>
                    Je certifie sur l'honneur l'exactitude des pièces fournies
                  </label>
                </div>
              </div>

              <div className="col-12 mt-3">
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={chargement}>
                  {chargement ? 'Soumission...' : 'Soumettre ma candidature →'}
                </button>
              </div>

            </div>
          </form>

          <div className="text-center mt-4 pt-2 border-top">
            <small className="text-muted">Déjà un compte ? <Link to="/login" className="text-primary fw-bold text-decoration-none">Se connecter</Link></small>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RegisterTeacher; // ← TRÈS IMPORTANT !