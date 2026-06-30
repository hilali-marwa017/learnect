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
    if (password.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères');
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (etape === 1) {
      if (validerEtape1()) setEtape(2);
      return;
    }
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

      <div className="w-100 mb-3" style={{ maxWidth: 580 }}>
        <Link to="/register" className="text-muted text-decoration-none small">
          <i className="bi bi-arrow-left me-1"></i>Retour au choix du profil
        </Link>
      </div>

      <div className="card border-0 shadow rounded-4" style={{ maxWidth: 580, width: '100%' }}>
        <div className="card-body p-4">

          <div className="text-center mb-4">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{ width: 52, height: 52, fontSize: '1.4rem' }}>
              👨‍🏫
            </div>
            <h5 className="fw-bold mb-0">Inscription Enseignant</h5>
            <p className="text-muted small mt-1">Partagez votre savoir</p>
          </div>

          {/* Indicateur étapes */}
          <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
            {[{ num: 1, label: 'Profil' }, { num: 2, label: 'Documents' }].map((e, i) => (
              <div key={e.num} className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: 34, height: 34, fontSize: 14,
                    background: etape >= e.num ? '#0d6efd' : '#e9ecef',
                    color: etape >= e.num ? 'white' : '#6c757d'
                  }}
                >
                  {etape > e.num ? '✓' : e.num}
                </div>
                <span className="small fw-semibold" style={{ color: etape >= e.num ? '#0d6efd' : '#6c757d' }}>
                  {e.label}
                </span>
                {i < 1 && (
                  <div style={{ width: 40, height: 2, background: etape > 1 ? '#0d6efd' : '#e9ecef' }}></div>
                )}
              </div>
            ))}
          </div>

          {erreur && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill"></i>
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Étape 1 : Profil */}
            {etape === 1 && (
              <div className="row g-3">

                <div className="col-6">
                  <label className="form-label small fw-semibold">Prénom</label>
                  <input type="text" name="prenom" className="form-control"
                    value={formulaire.prenom} onChange={handleChange} required />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Nom</label>
                  <input type="text" name="nom" className="form-control"
                    value={formulaire.nom} onChange={handleChange} required />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Email</label>
                  <input type="email" name="email" className="form-control"
                    value={formulaire.email} onChange={handleChange} required />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Téléphone</label>
                  <input type="tel" name="telephone" className="form-control" placeholder="06XXXXXXXX"
                    value={formulaire.telephone} onChange={handleChange} required />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Ville</label>
                  <select name="ville" className="form-select" value={formulaire.ville} onChange={handleChange} required>
                    <option value="">Choisir...</option>
                    {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'].map(v => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>

                {/* Mot de passe avec oeil */}
                <div className="col-6">
                  <label className="form-label small fw-semibold">Mot de passe</label>
                  <div className="input-group">
                    <input
                      type={voirPassword ? 'text' : 'password'}
                      name="password"
                      className="form-control"
                      placeholder="8 caractères min."
                      value={formulaire.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setVoirPassword(!voirPassword)}
                    >
                      {/* oeil barré = caché | oeil normal = visible */}
                      <i className={`bi ${voirPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Confirmer avec oeil */}
                <div className="col-6">
                  <label className="form-label small fw-semibold">Confirmer</label>
                  <div className="input-group">
                    <input
                      type={voirConfirm ? 'text' : 'password'}
                      name="password_confirmation"
                      className="form-control"
                      placeholder="••••••••"
                      value={formulaire.password_confirmation}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setVoirConfirm(!voirConfirm)}
                    >
                      {/* oeil barré = caché | oeil normal = visible */}
                      <i className={`bi ${voirConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="col-8">
                  <label className="form-label small fw-semibold">Matière principale</label>
                  <select name="matiere" className="form-select" value={formulaire.matiere} onChange={handleChange} required>
                    <option value="">Choisir...</option>
                    {['Mathématiques', 'Physique-Chimie', 'SVT', 'Français', 'Anglais', 'Arabe', 'Informatique', 'Économie', 'Philosophie'].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="col-4">
                  <label className="form-label small fw-semibold">Tarif (DH/h)</label>
                  <input type="number" name="tarifHeure" className="form-control" min="50" placeholder="Ex : 150"
                    value={formulaire.tarifHeure} onChange={handleChange} required />
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                    Continuer → Documents
                  </button>
                </div>

              </div>
            )}

            {/* Étape 2 : Documents */}
            {etape === 2 && (
              <div className="row g-3">

                <div className="col-6">
                  <label className="form-label small fw-semibold">CIN Recto</label>
                  <input type="file" name="cin_recto" accept="image/*"
                    className="form-control" onChange={handleFichier} required />
                  <small className="text-muted">JPG/PNG — Max 2MB</small>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">CIN Verso</label>
                  <input type="file" name="cin_verso" accept="image/*"
                    className="form-control" onChange={handleFichier} required />
                  <small className="text-muted">JPG/PNG — Max 2MB</small>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Diplôme (PDF)</label>
                  <input type="file" name="diplome" accept=".pdf"
                    className="form-control" onChange={handleFichier} required />
                  <small className="text-muted">PDF — Max 5MB</small>
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="honneur" required />
                    <label className="form-check-label small text-muted" htmlFor="honneur">
                      Je certifie sur l'honneur l'exactitude des pièces fournies
                    </label>
                  </div>
                </div>

                <div className="col-12 d-flex gap-2">
                  <button type="button" className="btn btn-outline-secondary fw-bold flex-grow-1"
                    onClick={() => setEtape(1)}>
                    ← Retour
                  </button>
                  <button type="submit" className="btn btn-primary fw-bold flex-grow-1" disabled={chargement}>
                    {chargement
                      ? <><span className="spinner-border spinner-border-sm me-2"></span>Soumission...</>
                      : 'Soumettre ma candidature →'
                    }
                  </button>
                </div>

              </div>
            )}

          </form>

        </div>
      </div>
    </div>
  );
}

export default RegisterTeacher;