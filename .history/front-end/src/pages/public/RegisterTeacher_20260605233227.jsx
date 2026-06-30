import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RegisterTeacher() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', ville: '',
    password: '', password_confirmation: '', matiere: '', tarifHeure: ''
  });
  const [files, setFiles] = useState({
    cin_recto: null, cin_verso: null, diplome: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(e, type) {
    const file = e.target.files[0];
    if (file) setFiles({ ...files, [type]: file });
  }

  function validateForm() {
    const { prenom, nom, email, telephone, ville, password, password_confirmation, matiere, tarifHeure } = form;
    if (!prenom || !nom || !email || !telephone || !ville || !password || !matiere || !tarifHeure) {
      setError('Tous les champs sont obligatoires');
      return false;
    }
    if (password !== password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (Number(tarifHeure) < 50) {
      setError('Le tarif minimum est de 50 DH/h');
      return false;
    }
    if (!files.cin_recto || !files.cin_verso || !files.diplome) {
      setError('Veuillez télécharger tous les documents requis');
      return false;
    }
    setError('');
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      data.append('role', 'enseignant');
      data.append('cin_recto', files.cin_recto);
      data.append('cin_verso', files.cin_verso);
      data.append('diplome', files.diplome);

      await register(data);
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
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
            <div className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 mb-2">
              <i className="bi bi-briefcase"></i>
              <span className="small fw-semibold">Enseignant</span>
            </div>
            <h5 className="fw-bold mb-0">Devenir Enseignant</h5>
            <p className="text-muted small mt-1">Partagez vos connaissances</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Prénom</label>
                <input type="text" name="prenom" className="form-control" placeholder="Marwa"
                  value={form.prenom} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Nom</label>
                <input type="text" name="nom" className="form-control" placeholder="Benani"
                  value={form.nom} onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold">Email</label>
                <input type="email" name="email" className="form-control" placeholder="marwa@example.com"
                  value={form.email} onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Téléphone</label>
                <input type="tel" name="telephone" className="form-control" placeholder="+212 6XX XXX XXX"
                  value={form.telephone} onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Ville</label>
                <select name="ville" className="form-select" value={form.ville} onChange={handleChange} required>
                  <option value="">Sélectionner</option>
                  {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Mot de passe</label>
                <div className="input-group">
                  <input type={showPassword ? 'text' : 'password'} name="password"
                    className="form-control" placeholder="Min. 6 caractères"
                    value={form.password} onChange={handleChange} required />
                  <button type="button" className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Confirmer</label>
                <div className="input-group">
                  <input type={showConfirm ? 'text' : 'password'} name="password_confirmation"
                    className="form-control" placeholder="Confirmer"
                    value={form.password_confirmation} onChange={handleChange} required />
                  <button type="button" className="btn btn-outline-secondary"
                    onClick={() => setShowConfirm(!showConfirm)}>
                    <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="col-md-8">
                <label className="form-label small fw-semibold">Matière principale</label>
                <select name="matiere" className="form-select" value={form.matiere} onChange={handleChange} required>
                  <option value="">Sélectionner une discipline...</option>
                  {['Mathématiques', 'Physique-Chimie', 'SVT', 'Français', 'Anglais', 'Arabe', 'Informatique'].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold">Tarif (DH/h)</label>
                <input type="number" name="tarifHeure" className="form-control" min="50" placeholder="150"
                  value={form.tarifHeure} onChange={handleChange} required />
              </div>

              {/* Documents */}
              <div className="col-12 mt-2">
                <div className="bg-light rounded-3 p-3">
                  <p className="small fw-bold text-primary mb-2"><i className="bi bi-shield-check me-1"></i>Documents requis</p>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">CIN Recto</label>
                      <input type="file" className="form-control form-control-sm" accept="image/*"
                        onChange={(e) => handleFile(e, 'cin_recto')} required />
                      <small className="text-muted">JPG/PNG — Max 2MB</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">CIN Verso</label>
                      <input type="file" className="form-control form-control-sm" accept="image/*"
                        onChange={(e) => handleFile(e, 'cin_verso')} required />
                      <small className="text-muted">JPG/PNG — Max 2MB</small>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Diplôme</label>
                      <input type="file" className="form-control form-control-sm" accept=".pdf"
                        onChange={(e) => handleFile(e, 'diplome')} required />
                      <small className="text-muted">PDF — Max 5MB</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vérification 24h */}
              <div className="col-12">
                <div className="bg-light rounded-3 p-2 d-flex gap-2 align-items-center">
                  <i className="bi bi-info-circle text-primary"></i>
                  <small className="text-muted">Vérification sous <strong>24h</strong> après soumission</small>
                </div>
              </div>

              {/* Checkbox */}
              <div className="col-12">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="certification" required />
                  <label className="form-check-label small text-muted" htmlFor="certification">
                    Je certifie sur l'honneur l'exactitude des pièces fournies
                  </label>
                </div>
              </div>

              {/* Bouton */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={loading}>
                  {loading ? 'Soumission...' : 'Soumettre ma candidature →'}
                </button>
              </div>

            </div>
          </form>

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