import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RegisterStudent() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formulaire, setFormulaire] = useState({
    prenom: '', nom: '', email: '', telephone: '', ville: '',
    password: '', password_confirmation: ''
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [voirPassword, setVoirPassword] = useState(false);
  const [voirConfirm, setVoirConfirm] = useState(false);

  function handleChange(e) {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');

    if (formulaire.password !== formulaire.password_confirmation) {
      setErreur('Les mots de passe ne correspondent pas');
      return;
    }
    if (formulaire.password.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setChargement(true);
    try {
      await register({ ...formulaire, role: 'etudiant' });
      navigate('/etudiant/dashboard');
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '100vh' }}>

      <div className="w-100 mb-3" style={{ maxWidth: 500 }}>
        <Link to="/" className="text-muted text-decoration-none small">
          <i className="bi bi-arrow-left me-1"></i>Retour à l'accueil
        </Link>
      </div>

      <div className="card border-0 shadow rounded-4" style={{ maxWidth: 500, width: '100%' }}>
        <div className="card-body p-4">

          <div className="text-center mb-4">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{ width: 52, height: 52 }}>
              <i className="bi bi-person-graduation fs-4"></i>
            </div>
            <h5 className="fw-bold mb-0">Inscription Étudiant</h5>
            <p className="text-muted small mt-1">Trouvez le professeur idéal</p>
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

              <div className="col-6">
                <label className="form-label small fw-semibold">Mot de passe</label>
                <div className="input-group">
                  <input type={voirPassword ? 'text' : 'password'} name="password"
                    className="form-control" placeholder="8 caractères min."
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

              <div className="col-12">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="cgv" required />
                  <label className="form-check-label small text-muted" htmlFor="cgv">
                    J'accepte les conditions générales
                  </label>
                </div>
              </div>

              <div className="col-12 mt-2">
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={chargement}>
                  {chargement ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
                  ) : (
                    <><i className="bi bi-person-check me-2"></i>Créer mon compte élève</>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="text-center mt-3 pt-2 border-top">
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

export default RegisterStudent;