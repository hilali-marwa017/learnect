import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RegisterTeacher() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [etape, setEtape] = useState(1);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [voirPassword, setVoirPassword] = useState(false);
  const [voirConfirm, setVoirConfirm] = useState(false);

  // Étape 1 : Profil
  const [formulaire, setFormulaire] = useState({
    prenom: '', nom: '', email: '', telephone: '', ville: '',
    password: '', password_confirmation: '', matiere: '', tarifHeure: ''
  });

  // Étape 2 : Documents
  const [fichiers, setFichiers] = useState({
    cin_recto: null, cin_verso: null, diplome: null
  });

  function handleChange(e) {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  }

  function handleFichier(e) {
    setFichiers({ ...fichiers, [e.target.name]: e.target.files[0] });
  }

  function validerEtape1() {
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
    setErreur('');
    return true;
  }

  function validerEtape2() {
    if (!fichiers.cin_recto || !fichiers.cin_verso || !fichiers.diplome) {
      setErreur('Veuillez télécharger tous les documents requis');
      return false;
    }
    setErreur('');
    return true;
  }

  async function handleNext(e) {
    e.preventDefault();
    if (etape === 1 && validerEtape1()) {
      setEtape(2);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validerEtape2()) return;

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

      <div className="w-100 mb-3" style={{ maxWidth: 550 }}>
        <Link to="/" className="text-muted text-decoration-none small">
          <i className="bi bi-arrow-left me-1"></i>Retour à l'accueil
        </Link>
      </div>

      <div className="card border-0 shadow rounded-4" style={{ maxWidth: 550, width: '100%' }}>
        <div className="card-body p-4">

          <div className="text-center mb-4">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{ width: 52, height: 52 }}>
              <i className="bi bi-person-workspace fs-4"></i>
            </div>
            <h5 className="fw-bold mb-0">Devenir Enseignant</h5>
            <p className="text-muted small mt-1">Partagez vos connaissances</p>
          </div>

          {/* Indicateur d'étapes */}
          <div className="row g-0 mb-4 pb-2 border-bottom">
            <div className={`col-6 text-center pb-2 fw-bold ${etape === 1 ? 'text-primary border-bottom border-2 border-primary' : 'text-muted'}`}>
              <i className="bi bi-person-circle me-1"></i> Étape 1 : Profil
            </div>
            <div className={`col-6 text-center pb-2 fw-bold ${etape === 2 ? 'text-primary border-bottom border-2 border-primary' : 'text-muted'}`}>
              <i className="bi bi-file-earmark-text me-1"></i> Étape 2 : Documents
            </div>
          </div>

          {erreur && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              {erreur}
            </div>
          )}

          {/* ÉTAPE 1 : PROFIL */}
          {etape === 1 && (
            <form onSubmit={handleNext}>
              <div className="row g-3">

                <div className="col-6">
                  <label className="form-label small fw-semibold">Prénom</label>
                  <input type="text" name="prenom" className="form-control"
                    value={formulaire.prenom} onChange={handleChange} placeholder="Marwa" required />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Nom</label>
                  <input type="text" name="nom" className="form-control"
                    value={formulaire.nom} onChange={handleChange} placeholder="Benani" required />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Email</label>
                  <input type="email" name="email" className="form-control"
                    value={formulaire.email} onChange={handleChange} placeholder="marwa@example.com" required />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Téléphone</label>
                  <input type="tel" name="telephone" className="form-control" placeholder="06XXXXXXXX"
                    value={formulaire.telephone} onChange={handleChange} required />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Ville</label>
                  <select name="ville" className="form-select" value={formulaire.ville} onChange={handleChange} required>
                    <option value="">Sélectionner</option>
                    {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'].map(v => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Mot de passe</label>
                  <div className="input-group">
                    <input type={voirPassword ? 'text' : 'password'} name="password"
                      className="form-control" placeholder="Min. 6 caractères"
                      value={formulaire.password} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary"
                      onClick={() => setVoirPassword(!voirPassword)}>
                      <i className={`bi ${voirPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Confirmer</label>
                  <div className="input-group">
                    <input type={voirConfirm ? 'text' : 'password'} name="password_confirmation"
                      className="form-control" placeholder="Confirmer"
                      value={formulaire.password_confirmation} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary"
                      onClick={() => setVoirConfirm(!voirConfirm)}>
                      <i className={`bi ${voirConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="col-8">
                  <label className="form-label small fw-semibold">Matière principale</label>
                  <select name="matiere" className="form-select" value={formulaire.matiere} onChange={handleChange} required>
                    <option value="">Sélectionner</option>
                    {['Mathématiques', 'Physique-Chimie', 'SVT', 'Français', 'Anglais', 'Arabe', 'Informatique'].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="col-4">
                  <label className="form-label small fw-semibold">Tarif (DH/h)</label>
                  <input type="number" name="tarifHeure" className="form-control" min="50" placeholder="150"
                    value={formulaire.tarifHeure} onChange={handleChange} required />
                </div>

                <div className="col-12 mt-3">
                  <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                    SUIVANT : DÉPOSER JUSTIFICATIFS →
                  </button>
                </div>

              </div>
            </form>
          )}

          {/* ÉTAPE 2 : DOCUMENTS */}
          {etape === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-12">
                  <label className="form-label small fw-semibold">CIN RECTO</label>
                  <div className="border rounded-3 p-3 bg-white">
                    <input type="file" name="cin_recto" accept="image/*" className="form-control"
                      onChange={handleFichier} required />
                    <small className="text-muted">JPG/PNG — Max 2MB</small>
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">CIN VERSO</label>
                  <div className="border rounded-3 p-3 bg-white">
                    <input type="file" name="cin_verso" accept="image/*" className="form-control"
                      onChange={handleFichier} required />
                    <small className="text-muted">JPG/PNG — Max 2MB</small>
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">DIPLÔME</label>
                  <div className="border rounded-3 p-3 bg-white">
                    <input type="file" name="diplome" accept=".pdf" className="form-control"
                      onChange={handleFichier} required />
                    <small className="text-muted">PDF — Max 5MB</small>
                  </div>
                </div>

                <div className="col-12">
                  <div className="bg-light rounded-3 p-3 d-flex gap-2">
                    <i className="bi bi-info-circle text-primary"></i>
                    <small className="text-muted">
                      Vérification sous <strong>24h</strong> après soumission
                    </small>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="honneur" required />
                    <label className="form-check-label small text-muted" htmlFor="honneur">
                      Je certifie sur l'honneur l'exactitude des pièces fournies
                    </label>
                  </div>
                </div>

                <div className="col-12 d-flex gap-3 mt-3">
                  <button type="button" className="btn btn-outline-secondary flex-grow-1 py-2"
                    onClick={() => setEtape(1)}>
                    ← Retour
                  </button>
                  <button type="submit" className="btn btn-primary flex-grow-1 py-2" disabled={chargement}>
                    {chargement ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Soumission...</>
                    ) : (
                      'Soumettre ma candidature →'
                    )}
                  </button>
                </div>

              </div>
            </form>
          )}

          <div className="text-center mt-4 pt-2 border-top">
            <small className="text-muted">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary fw-bold text-decoration-none">
                Se connecter
              </Link>
            </small>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RegisterTeacher;