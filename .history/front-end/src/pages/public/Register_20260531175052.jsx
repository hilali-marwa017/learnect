import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'etudiant';

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', password: '',
    password_confirmation: '', ville: '', role: role,
  });
  const [files, setFiles] = useState({ cin_recto: null, cin_verso: null, diplome: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas !');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(form).forEach(key => data.append(key, form[key]));

      if (role === 'enseignant') {
        data.append('cin_recto', files.cin_recto);
        data.append('cin_verso', files.cin_verso);
        data.append('diplome', files.diplome);
      }

      const res = await api.post('/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (role === 'enseignant') {
        setSuccess(true);
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
    setLoading(false);
  };

  // Page succès enseignant
  if (success) {
    return (
      <div className="page-auth">
        <div className="carte-auth" style={{ textAlign: 'center' }}>
          <div className="logo-auth" style={{ background: '#2563EB' }}>
            <i className="bi bi-check-lg" style={{ fontSize: '1.5rem' }}></i>
          </div>
          <h2 className="fw-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Dossier envoyé !</h2>
          <p className="text-muted mb-4">
            Votre dossier est en cours de vérification par notre équipe.
            Vous recevrez une confirmation dès validation.
          </p>
          <div className="bg-light rounded-3 p-3 mb-4 text-start">
            {['CIN recto & verso vérifiés', 'Diplôme authentifié', 'Profil activé par admin'].map(item => (
              <div key={item} className="d-flex align-items-center gap-2 mb-2 text-success">
                <i className="bi bi-check-circle-fill"></i>
                <span className="small fw-medium">{item}</span>
              </div>
            ))}
          </div>
          <Link to="/login" className="btn btn-primary w-100 py-2 fw-bold">Se connecter</Link>
          <Link to="/" className="btn btn-link text-muted mt-2 text-decoration-none">← Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-auth">
      <div className="carte-auth">
        
        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-mortarboard"></i>
              </div>
              <span className="fw-bold fs-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Learnect<span className="text-primary">.ma</span>
              </span>
            </div>
          </Link>

          {/* Badge rôle */}
          <div className={`badge-premium d-inline-flex align-items-center gap-2 mb-2`}>
            <i className={`bi ${role === 'enseignant' ? 'bi-briefcase' : 'bi-mortarboard'}`}></i>
            {role === 'enseignant' ? 'Inscription Enseignant' : 'Inscription Étudiant'}
          </div>

          <h1 className="fw-bold fs-3 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}
          </h1>
          <p className="text-muted small">
            {role === 'enseignant'
              ? 'Partagez vos connaissances sur Learnect'
              : 'Trouvez votre prof idéal dès aujourd\'hui'}
          </p>
        </div>

        {/* Formulaire */}
        <div className="card border-0 shadow-sm rounded-4 p-3">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span className="small">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label"><i className="bi bi-person text-primary me-1"></i> Nom</label>
                <input type="text" name="nom" className="form-control" placeholder="Benani" value={form.nom} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label"><i className="bi bi-person-badge text-primary me-1"></i> Prénom</label>
                <input type="text" name="prenom" className="form-control" placeholder="Marwa" value={form.prenom} onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label"><i className="bi bi-envelope text-primary me-1"></i> Email</label>
                <input type="email" name="email" className="form-control" placeholder="marwa@example.com" value={form.email} onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label"><i className="bi bi-geo-alt text-primary me-1"></i> Ville</label>
                <select name="ville" className="form-select" value={form.ville} onChange={handleChange} required>
                  <option value="">Choisir une ville</option>
                  {['Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Tanger', 'Agadir', 'Meknès', 'Oujda'].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label"><i className="bi bi-lock text-primary me-1"></i> Mot de passe</label>
                <div className="password-wrapper">
                  <input type={showPass ? 'text' : 'password'} name="password" className="form-control" placeholder="Min. 8 caractères" value={form.password} onChange={handleChange} required />
                  <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                    <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label"><i className="bi bi-lock-fill text-primary me-1"></i> Confirmer</label>
                <div className="password-wrapper">
                  <input type={showPass2 ? 'text' : 'password'} name="password_confirmation" className="form-control" placeholder="Confirmer" value={form.password_confirmation} onChange={handleChange} required />
                  <button type="button" className="password-toggle" onClick={() => setShowPass2(!showPass2)}>
                    <i className={`bi ${showPass2 ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Documents enseignant */}
              {role === 'enseignant' && (
                <div className="col-12">
                  <div className="bg-light rounded-3 p-3">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <i className="bi bi-shield-check text-primary"></i>
                      <span className="fw-bold text-primary">Documents obligatoires</span>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small"><i className="bi bi-credit-card text-primary me-1"></i> CIN Recto</label>
                      <div className="border border-dashed rounded-3 p-2 d-flex align-items-center gap-2 bg-white">
                        <i className="bi bi-image text-primary"></i>
                        <input type="file" name="cin_recto" accept="image/*" onChange={handleFile} className="form-control form-control-sm border-0" required />
                      </div>
                      <small className="text-muted">JPG/PNG — Max 2MB</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small"><i className="bi bi-credit-card-2-back text-primary me-1"></i> CIN Verso</label>
                      <div className="border border-dashed rounded-3 p-2 d-flex align-items-center gap-2 bg-white">
                        <i className="bi bi-image text-primary"></i>
                        <input type="file" name="cin_verso" accept="image/*" onChange={handleFile} className="form-control form-control-sm border-0" required />
                      </div>
                      <small className="text-muted">JPG/PNG — Max 2MB</small>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small"><i className="bi bi-file-earmark-pdf text-danger me-1"></i> Diplôme</label>
                      <div className="border border-dashed rounded-3 p-2 d-flex align-items-center gap-2 bg-white">
                        <i className="bi bi-file-pdf text-danger"></i>
                        <input type="file" name="diplome" accept=".pdf" onChange={handleFile} className="form-control form-control-sm border-0" required />
                      </div>
                      <small className="text-muted">PDF uniquement — Max 5MB</small>
                    </div>

                    <div className="mt-3 p-2 bg-white rounded-3 d-flex gap-2">
                      <i className="bi bi-info-circle text-muted"></i>
                      <small className="text-muted">Votre profil sera vérifié sous <strong>24h</strong>.</small>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-12 mt-3">
                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span> Envoi en cours...</>
                  ) : (
                    <><i className={`bi ${role === 'enseignant' ? 'bi-send-check' : 'bi-person-plus'} me-2`}></i>
                    {role === 'enseignant' ? 'Soumettre ma candidature' : 'Créer mon compte'}</>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="text-center mt-3">
            <hr className="my-3" />
            <p className="text-muted small mb-0">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary fw-bold text-decoration-none">
                <i className="bi bi-box-arrow-in-right me-1"></i>Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-3">
          <Link to="/" className="text-muted text-decoration-none small">
            <i className="bi bi-arrow-left me-1"></i>Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;