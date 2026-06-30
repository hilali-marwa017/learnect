import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'etudiant';

  const [villes, setVilles] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    password: '', password_confirmation: '', ville: '',
    niveau: '', budget: '', matiere: '', tarifHeure: ''
  });
  const [files, setFiles] = useState({ cin_recto: null, cin_verso: null, diplome: null, photo: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [success, setSuccess] = useState(false);

  // Charger villes et matieres depuis API (seeders)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [villesRes, matieresRes] = await Promise.all([
          api.get('/villes').catch(() => ({ data: [] })),
          api.get('/matieres').catch(() => ({ data: [] }))
        ]);
        setVilles(villesRes.data || []);
        setMatieres(matieresRes.data || []);
      } catch (err) {
        console.error('Erreur chargement:', err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const niveauxEtudes = [
    'Préscolaire', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème primaire', 'Tronc Commun', '1ère année collège', '2ème année collège', '3ème année collège',
    'Tronc Commun Scientifique', 'Tronc Commun Lettres',
    '1ère année bac Sciences Maths', '1ère année bac Sciences Exp', '1ère année bac Lettres',
    '2ème année bac Sciences Maths', '2ème année bac Sciences Physiques', '2ème année bac SVT',
    '2ème année bac Sciences Economiques', '2ème année bac Lettres',
    'Baccalauréat', 'Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat',
    'Classes Préparatoires', 'BTS', 'DUT', 'Formation Continue'
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const getErrorMessage = (message) => {
    if (message.includes('telephone has already been taken')) return 'Ce numéro de téléphone est déjà utilisé.';
    if (message.includes('email has already been taken')) return 'Cet email est déjà utilisé.';
    if (message.includes('password')) return 'Le mot de passe doit contenir au moins 8 caractères.';
    if (message.includes('cin_recto')) return 'Le fichier CIN recto est requis (JPG/PNG).';
    if (message.includes('cin_verso')) return 'Le fichier CIN verso est requis (JPG/PNG).';
    if (message.includes('diplome')) return 'Le fichier diplôme est requis (PDF).';
    return message || 'Erreur lors de l\'inscription.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      setLoading(false);
      return;
    }

    if (role === 'enseignant') {
      if (!form.matiere) {
        setError('Veuillez saisir ou sélectionner une matière.');
        setLoading(false);
        return;
      }
      if (!form.tarifHeure || form.tarifHeure < 50) {
        setError('Le tarif minimum est de 50 DH/h.');
        setLoading(false);
        return;
      }
    }

    try {
      const data = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== '') {
          data.append(key, form[key]);
        }
      });
      data.append('role', role);

      if (files.photo) data.append('photo', files.photo);

      if (role === 'enseignant') {
        if (!files.cin_recto) {
          setError('Veuillez télécharger votre CIN recto.');
          setLoading(false);
          return;
        }
        if (!files.cin_verso) {
          setError('Veuillez télécharger votre CIN verso.');
          setLoading(false);
          return;
        }
        if (!files.diplome) {
          setError('Veuillez télécharger votre diplôme (PDF).');
          setLoading(false);
          return;
        }
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
      const backendMessage = err.response?.data?.message;
      setError(getErrorMessage(backendMessage));
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="text-center mb-3">
            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
              <i className="bi bi-check-lg fs-1"></i>
            </div>
            <h3 className="fw-bold mb-2">Dossier envoyé</h3>
            <p className="text-muted small">Votre dossier est en cours de vérification</p>
          </div>
          <div className="bg-light p-3 mb-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-check-circle-fill text-success"></i>
              <span className="small">CIN recto et verso vérifiés</span>
            </div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-check-circle-fill text-success"></i>
              <span className="small">Diplôme authentifié</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-clock-history text-warning"></i>
              <span className="small">Validation sous 24h</span>
            </div>
          </div>
          <Link to="/login" className="btn btn-primary w-100 py-2">Se connecter</Link>
          <Link to="/" className="btn btn-link text-muted mt-2 w-100 text-decoration-none small">
            <i className="bi bi-arrow-left me-1"></i>Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '24px' }}>
      
      <div className="w-100" style={{ maxWidth: '500px', marginBottom: '16px' }}>
        <Link to="/" className="text-muted text-decoration-none small">
          <i className="bi bi-arrow-left"></i> Retour
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body p-4">
          
          <div className="text-center mb-4">
            <div className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-1 mb-2">
              <i className={`bi ${role === 'enseignant' ? 'bi-briefcase' : 'bi-mortarboard'}`}></i>
              <span className="small fw-semibold ps-2">{role === 'enseignant' ? 'Enseignant' : 'Étudiant'}</span>
            </div>

            <h2 className="fw-bold fs-4 mb-1">
              {role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}
            </h2>
            <p className="text-muted small">
              {role === 'enseignant' ? 'Partagez vos connaissances' : 'Trouvez votre professeur'}
            </p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <span className="small">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary mb-1">Photo de profil</label>
              <input type="file" name="photo" accept="image/jpeg,image/png,image/jpg" onChange={handleFile} className="form-control form-control-sm py-2" />
              <small className="text-muted">Optionnel - JPG/PNG (max 2MB)</small>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold text-secondary mb-1">Nom</label>
                <input type="text" name="nom" className="form-control form-control-sm py-2" value={form.nom} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold text-secondary mb-1">Prénom</label>
                <input type="text" name="prenom" className="form-control form-control-sm py-2" value={form.prenom} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary mb-1">Email</label>
              <input type="email" name="email" className="form-control form-control-sm py-2" value={form.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary mb-1">Téléphone</label>
              <input type="tel" name="telephone" className="form-control form-control-sm py-2" value={form.telephone} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary mb-1">Ville</label>
              <input 
                type="text" 
                name="ville" 
                list="villes-list"
                className="form-control form-control-sm py-2" 
                value={form.ville} 
                onChange={handleChange} 
                placeholder="Tapez ou sélectionnez votre ville"
                required 
              />
              <datalist id="villes-list">
                {villes.map(ville => (
                  <option key={ville.id || ville.nom} value={ville.nom || ville}>{ville.nom || ville}</option>
                ))}
              </datalist>
            </div>

            {role === 'etudiant' && (
              <>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary mb-1">Niveau d'étude</label>
                  <select name="niveau" className="form-select form-select-sm py-2" value={form.niveau} onChange={handleChange}>
                    <option value="">Sélectionner votre niveau</option>
                    {niveauxEtudes.map((niveau, index) => (
                      <option key={index} value={niveau}>{niveau}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary mb-1">Budget (DH/h)</label>
                  <input type="number" name="budget" className="form-control form-control-sm py-2" placeholder="Ex: 100" min="0" value={form.budget} onChange={handleChange} />
                </div>
              </>
            )}

            {role === 'enseignant' && (
              <>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary mb-1">Matière</label>
                  <input 
                    type="text" 
                    name="matiere" 
                    list="matieres-list"
                    className="form-control form-control-sm py-2" 
                    value={form.matiere} 
                    onChange={handleChange} 
                    placeholder="Tapez ou sélectionnez votre matière"
                    required 
                  />
                  <datalist id="matieres-list">
                    {matieres.map(matiere => (
                      <option key={matiere.id || matiere.nom} value={matiere.nom || matiere}>{matiere.nom || matiere}</option>
                    ))}
                  </datalist>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary mb-1">Tarif (DH/h)</label>
                  <input type="number" name="tarifHeure" className="form-control form-control-sm py-2" min="50" placeholder="Minimum 50 DH" value={form.tarifHeure} onChange={handleChange} required />
                </div>

                <div className="border rounded p-3 mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-shield-check text-primary"></i>
                    <span className="small fw-bold text-primary">Documents requis</span>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-secondary mb-1">CIN Recto</label>
                    <input type="file" name="cin_recto" accept="image/jpeg,image/png,image/jpg" onChange={handleFile} className="form-control form-control-sm" required />
                    <small className="text-muted">JPG/PNG (max 2MB)</small>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-secondary mb-1">CIN Verso</label>
                    <input type="file" name="cin_verso" accept="image/jpeg,image/png,image/jpg" onChange={handleFile} className="form-control form-control-sm" required />
                    <small className="text-muted">JPG/PNG (max 2MB)</small>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-secondary mb-1">Diplôme</label>
                    <input type="file" name="diplome" accept=".pdf" onChange={handleFile} className="form-control form-control-sm" required />
                    <small className="text-muted">PDF (max 5MB)</small>
                  </div>
                </div>
              </>
            )}

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold text-secondary mb-1">Mot de passe</label>
                <div className="input-group">
                  <input 
                    type={showPass ? 'text' : 'password'} 
                    name="password" 
                    className="form-control form-control-sm py-2" 
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                  />
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm" 
                    onClick={() => setShowPass(!showPass)}
                    style={{ border: '1px solid #ced4da', borderLeft: 'none' }}
                  >
                    <i className={`bi ${showPass ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                  </button>
                </div>
                <small className="text-muted">Minimum 8 caractères</small>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold text-secondary mb-1">Confirmer</label>
                <div className="input-group">
                  <input 
                    type={showPass2 ? 'text' : 'password'} 
                    name="password_confirmation" 
                    className="form-control form-control-sm py-2" 
                    value={form.password_confirmation} 
                    onChange={handleChange} 
                    required 
                  />
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm" 
                    onClick={() => setShowPass2(!showPass2)}
                    style={{ border: '1px solid #ced4da', borderLeft: 'none' }}
                  >
                    <i className={`bi ${showPass2 ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Envoi...</>
              ) : (
                <><i className={`bi ${role === 'enseignant' ? 'bi-send-check' : 'bi-person-plus'} me-2`}></i>
                {role === 'enseignant' ? 'Soumettre ma candidature' : 'Créer mon compte'}</>
              )}
            </button>
          </form>

          <hr className="my-3" />

          <div className="text-center">
            <p className="small text-muted mb-0">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary fw-bold text-decoration-none">
                <i className="bi bi-box-arrow-in-right me-1"></i>Se connecter
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;