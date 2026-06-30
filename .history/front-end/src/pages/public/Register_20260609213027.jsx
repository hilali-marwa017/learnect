import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'etudiant';
  const [step, setStep] = useState(1);

  const [villes, setVilles] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    password: '', password_confirmation: '', ville: '',
    niveau: '', budget: '', matiere: '', tarifHeure: '',
    distance_max: '', langues: ''
  });
  const [files, setFiles] = useState({
    cin_recto: null, cin_verso: null, diplome: null, photo: null
  });
  const [checkboxes, setCheckboxes] = useState({
    certifie: false,
    cours_enligne: false,
    cours_domicile: false,
    cours_deplacement: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [success, setSuccess] = useState(false);

  const niveaux = [
    'Préscolaire', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème primaire', 'Tronc Commun', '1ère année collège',
    '2ème année collège', '3ème année collège', 'Baccalauréat',
    'Licence 1', 'Licence 2', 'Licence 3', 'Master 1',
    'Master 2', 'Doctorat', 'BTS', 'DUT'
  ];

  useEffect(() => {
    fetch('http://localhost:8000/api/villes')
      .then(res => res.json())
      .then(data => setVilles(data))
      .catch(() => setVilles([]));
    fetch('http://localhost:8000/api/matieres')
      .then(res => res.json())
      .then(data => setMatieres(data))
      .catch(() => setMatieres([]));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });
  const handleCheckbox = (e) => setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });

  const validateStep1 = () => {
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return false;
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return false;
    }
    if (role === 'enseignant') {
      if (!form.matiere) {
        setError('Veuillez saisir une matière.');
        return false;
      }
      if (!form.tarifHeure || form.tarifHeure < 50) {
        setError('Le tarif minimum est de 50 DH/h.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setError('');
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (role === 'enseignant' && step === 1) {
      handleNext();
      return;
    }

    setLoading(true);
    setError('');

    if (role === 'enseignant') {
      if (!files.cin_recto) { setError('CIN recto requis.'); setLoading(false); return; }
      if (!files.cin_verso) { setError('CIN verso requis.'); setLoading(false); return; }
      if (!files.diplome) { setError('Diplôme requis.'); setLoading(false); return; }
      if (!checkboxes.certifie) { setError('Vous devez certifier les informations.'); setLoading(false); return; }
    }

    const formData = new FormData();
    
    Object.keys(form).forEach(key => {
      if (form[key] !== '' && form[key] !== null) {
        formData.append(key, form[key]);
      }
    });
    
    formData.append('role', role);
    formData.append('certifie', checkboxes.certifie ? '1' : '0');
    formData.append('cours_enligne', checkboxes.cours_enligne ? '1' : '0');
    formData.append('cours_domicile', checkboxes.cours_domicile ? '1' : '0');
    formData.append('cours_deplacement', checkboxes.cours_deplacement ? '1' : '0');
    
    if (files.photo) {
      formData.append('photo', files.photo);
    }
    
    if (role === 'enseignant') {
      formData.append('cin_recto', files.cin_recto);
      formData.append('cin_verso', files.cin_verso);
      formData.append('diplome', files.diplome);
    }

    fetch('http://localhost:8000/api/register', {
      method: 'POST',
      body: formData
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de l\'inscription');
        }
        return data;
      })
      .then(result => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        if (role === 'enseignant') {
          setSuccess(true);
        } else {
          navigate('/etudiant/dashboard');
        }
      })
      .catch(err => {
        const msg = err.message || '';
        if (msg.includes('telephone')) {
          setError('Numéro de téléphone déjà utilisé.');
        } else if (msg.includes('email')) {
          setError('Email déjà utilisé.');
        } else {
          setError(msg);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (success) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <div className="card p-4 text-center" style={{ maxWidth: '400px', borderRadius: '16px' }}>
          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
            <i className="bi bi-check-lg fs-1"></i>
          </div>
          <h3 className="fw-bold mb-2">Dossier envoyé</h3>
          <p className="text-muted mb-3">Votre dossier est en cours de vérification</p>
          <Link to="/login" className="btn btn-primary w-100" style={{ textDecoration: 'none' }}>Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f5f5f5', padding: '24px' }}>
      <div className="card" style={{ maxWidth: '550px', width: '100%', borderRadius: '16px' }}>
        <div className="card-body p-4">
          
          <div className="d-flex align-items-center mb-3">
            <Link to="/" className="text-muted text-decoration-none" style={{ color: '#6c757d' }}>
              <i className="bi bi-x-lg fs-4"></i>
            </Link>
            {role === 'enseignant' && (
              <span className="small text-muted ms-auto">Étape {step}/2</span>
            )}
          </div>

          {role === 'enseignant' && step === 1 && (
            <div className="mb-4">
              <div className="progress" style={{ height: '4px' }}>
                <div className="progress-bar bg-primary" style={{ width: '50%' }}></div>
              </div>
            </div>
          )}

          <div className="text-center mb-4">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
              <i className={`bi ${role === 'enseignant' ? 'bi-briefcase fs-5' : 'bi-mortarboard fs-5'}`}></i>
            </div>
            <h3 className="fw-bold mb-1">{role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}</h3>
            <p className="text-muted small">{role === 'enseignant' ? 'Partagez votre savoir' : 'Trouvez votre professeur'}</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small" style={{ borderRadius: '8px' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {step === 1 && (
              <>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">PHOTO DE PROFIL</label>
                  <input type="file" name="photo" className="form-control" accept="image/*" onChange={handleFile} style={{ borderRadius: '8px' }} />
                  <small className="text-muted">Optionnel - JPG/PNG</small>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold text-secondary">NOM</label>
                    <input type="text" name="nom" className="form-control" value={form.nom} onChange={handleChange} required style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold text-secondary">PRÉNOM</label>
                    <input type="text" name="prenom" className="form-control" value={form.prenom} onChange={handleChange} required style={{ borderRadius: '8px' }} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">EMAIL</label>
                  <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required style={{ borderRadius: '8px' }} />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">TÉLÉPHONE</label>
                  <input type="tel" name="telephone" className="form-control" value={form.telephone} onChange={handleChange} required style={{ borderRadius: '8px' }} />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">VILLE</label>
                  <input type="text" name="ville" list="villes-list" className="form-control" value={form.ville} onChange={handleChange} placeholder="Tapez ou sélectionnez" required style={{ borderRadius: '8px' }} />
                  <datalist id="villes-list">{villes.map(v => <option key={v.id} value={v.nom} />)}</datalist>
                </div>

                {role === 'etudiant' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">NIVEAU D'ÉTUDE</label>
                      <select name="niveau" className="form-select" value={form.niveau} onChange={handleChange} style={{ borderRadius: '8px' }}>
                        <option value="">Sélectionnez</option>
                        {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">BUDGET (DH/h)</label>
                      <input type="number" name="budget" className="form-control" min="0" value={form.budget} onChange={handleChange} style={{ borderRadius: '8px' }} />
                    </div>
                  </>
                )}

                {role === 'enseignant' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">MATIÈRE</label>
                      <input type="text" name="matiere" list="matieres-list" className="form-control" value={form.matiere} onChange={handleChange} placeholder="Tapez ou sélectionnez" required style={{ borderRadius: '8px' }} />
                      <datalist id="matieres-list">{matieres.map(m => <option key={m.id} value={m.nom} />)}</datalist>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">TARIF (DH/h)</label>
                      <input type="number" name="tarifHeure" className="form-control" min="50" value={form.tarifHeure} onChange={handleChange} required style={{ borderRadius: '8px' }} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">MODALITÉS DE COURS</label>
                      <div className="d-flex gap-3 flex-wrap">
                        <div className="form-check">
                          <input type="checkbox" name="cours_enligne" className="form-check-input" checked={checkboxes.cours_enligne} onChange={handleCheckbox} />
                          <label className="form-check-label">En ligne (webcam)</label>
                        </div>
                        <div className="form-check">
                          <input type="checkbox" name="cours_domicile" className="form-check-input" checked={checkboxes.cours_domicile} onChange={handleCheckbox} />
                          <label className="form-check-label">À domicile</label>
                        </div>
                        <div className="form-check">
                          <input type="checkbox" name="cours_deplacement" className="form-check-input" checked={checkboxes.cours_deplacement} onChange={handleCheckbox} />
                          <label className="form-check-label">Déplacement</label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold text-secondary">MOT DE PASSE</label>
                    <div className="input-group">
                      <input type={showPass ? 'text' : 'password'} name="password" className="form-control" value={form.password} onChange={handleChange} required style={{ borderRadius: '8px 0 0 8px' }} />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPass(!showPass)} style={{ borderRadius: '0 8px 8px 0' }}>
                        <i className={`bi ${showPass ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold text-secondary">CONFIRMER</label>
                    <div className="input-group">
                      <input type={showPass2 ? 'text' : 'password'} name="password_confirmation" className="form-control" value={form.password_confirmation} onChange={handleChange} required style={{ borderRadius: '8px 0 0 8px' }} />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPass2(!showPass2)} style={{ borderRadius: '0 8px 8px 0' }}>
                        <i className={`bi ${showPass2 ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" style={{ borderRadius: '8px' }}>
                  {role === 'enseignant' ? 'Étape suivante →' : (loading ? 'Envoi...' : 'Créer mon compte')}
                </button>
              </>
            )}

            {role === 'enseignant' && step === 2 && (
              <>
                <div className="border rounded p-3 mb-3 bg-light" style={{ borderRadius: '8px' }}>
                  <p className="fw-semibold mb-3 small"><i className="bi bi-shield-check text-primary me-2"></i>DOCUMENTS REQUIS</p>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">CIN Recto</label>
                    <input type="file" name="cin_recto" className="form-control" accept="image/*" onChange={handleFile} required style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">CIN Verso</label>
                    <input type="file" name="cin_verso" className="form-control" accept="image/*" onChange={handleFile} required style={{ borderRadius: '8px' }} />
                  </div>
                  <div>
                    <label className="form-label small fw-semibold">Diplôme (PDF)</label>
                    <input type="file" name="diplome" className="form-control" accept=".pdf" onChange={handleFile} required style={{ borderRadius: '8px' }} />
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input type="checkbox" name="certifie" className="form-check-input" checked={checkboxes.certifie} onChange={handleCheckbox} required />
                  <label className="form-check-label small">Je certifie que les informations fournies sont exactes et vérifiables</label>
                </div>

                <div className="d-flex gap-3">
                  <button type="button" className="btn btn-outline-secondary flex-grow-1" onClick={() => { setStep(1); setError(''); }} style={{ borderRadius: '8px' }}>
                    ← Retour
                  </button>
                  <button type="submit" className="btn btn-primary flex-grow-2" disabled={loading} style={{ borderRadius: '8px' }}>
                    {loading ? 'Envoi...' : 'Soumettre mon dossier'}
                  </button>
                </div>
              </>
            )}
          </form>

          <hr className="my-3" />
          <div className="text-center">
            <span className="small text-muted">Déjà un compte ?</span>
            <Link to="/login" className="text-primary text-decoration-none ms-1 small fw-semibold" style={{ color: '#0d6efd' }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;