import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

function Register() {
  // ========== HOOKS ==========
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'etudiant';

  // ========== STATES ==========
  const [villes, setVilles] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    password: '', password_confirmation: '', ville: '',
    niveau: '', budget: '', matiere: '', tarifHeure: ''
  });
  const [files, setFiles] = useState({
    cin_recto: null, cin_verso: null, diplome: null, photo: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [success, setSuccess] = useState(false);

  // ========== DONNEES STATIQUES ==========
  const niveaux = [
    'Préscolaire', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème primaire', 'Tronc Commun', '1ère année collège',
    '2ème année collège', '3ème année collège', 'Baccalauréat',
    'Licence 1', 'Licence 2', 'Licence 3', 'Master 1',
    'Master 2', 'Doctorat', 'BTS', 'DUT'
  ];

  // ========== CHARGEMENT API ==========
  useEffect(() => {
    const loadData = async () => {
      const [villesRes, matieresRes] = await Promise.all([
        api.get('/villes').catch(() => ({ data: [] })),
        api.get('/matieres').catch(() => ({ data: [] }))
      ]);
      setVilles(villesRes.data || []);
      setMatieres(matieresRes.data || []);
    };
    loadData();
  }, []);

  // ========== FONCTIONS ==========
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

    // Validation password
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

    // Validation enseignant
    if (role === 'enseignant') {
      if (!form.matiere) {
        setError('Veuillez saisir une matière.');
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

      // Ajouter tous les champs du formulaire
      Object.keys(form).forEach(key => {
        if (form[key] !== '' && form[key] !== null) {
          data.append(key, form[key]);
        }
      });

      data.append('role', role);

      // Ajouter la photo si présente
      if (files.photo) {
        data.append('photo', files.photo);
      }

      // Ajouter les documents pour enseignant
      if (role === 'enseignant') {
        if (!files.cin_recto || !files.cin_verso || !files.diplome) {
          setError('Tous les documents sont requis.');
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
      const msg = err.response?.data?.message || '';
      if (msg.includes('telephone')) setError('Numéro déjà utilisé.');
      else if (msg.includes('email')) setError('Email déjà utilisé.');
      else if (msg.includes('password')) setError('Mot de passe trop faible.');
      else if (msg.includes('cin_recto')) setError('CIN recto requis.');
      else if (msg.includes('cin_verso')) setError('CIN verso requis.');
      else if (msg.includes('diplome')) setError('Diplôme requis.');
      else setError(msg || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  // ========== PAGE SUCCÈS ==========
  if (success) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="card p-4 text-center" style={{ maxWidth: '400px' }}>
          <div className="bg-success text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
            <i className="bi bi-check-lg fs-1"></i>
          </div>
          <h3 className="fw-bold mb-2">Dossier envoyé</h3>
          <p className="text-muted small">Votre dossier est en cours de vérification</p>
          <div className="bg-light p-3 rounded mb-3 text-start">
            <p className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>CIN vérifié</p>
            <p className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Diplôme vérifié</p>
            <p><i className="bi bi-clock-history text-warning me-2"></i>Validation sous 24h</p>
          </div>
          <Link to="/login" className="btn btn-primary">Se connecter</Link>
          <Link to="/" className="btn btn-link text-muted mt-2">Retour</Link>
        </div>
      </div>
    );
  }

  // ========== FORMULAIRE PRINCIPAL ==========
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '24px', background: '#f5f5f5' }}>
      <div className="w-100" style={{ maxWidth: '550px' }}>
        
        {/* Bouton retour */}
        <div className="mb-3">
          <Link to="/" className="text-muted text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i> Retour
          </Link>
        </div>

        {/* Carte formulaire */}
        <div className="card shadow-sm">
          <div className="card-body p-4">

            {/* En-tête */}
            <div className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-mortarboard fs-4"></i>
              </div>
              <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 mb-2">
                {role === 'enseignant' ? '👨‍🏫 Enseignant' : '🎓 Étudiant'}
              </span>
              <h2 className="fw-bold fs-3 mb-1">
                {role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}
              </h2>
              <p className="text-muted">
                {role === 'enseignant' ? 'Partagez votre savoir' : 'Trouvez votre professeur'}
              </p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="alert alert-danger py-2 mb-3">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              
              {/* Photo */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Photo de profil</label>
                <input type="file" name="photo" className="form-control" accept="image/*" onChange={handleFile} />
                <small className="text-muted">Optionnel - JPG/PNG</small>
              </div>

              {/* Nom et Prénom */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Nom</label>
                  <input type="text" name="nom" className="form-control" value={form.nom} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Prénom</label>
                  <input type="text" name="prenom" className="form-control" value={form.prenom} onChange={handleChange} required />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
              </div>

              {/* Téléphone */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Téléphone</label>
                <input type="tel" name="telephone" className="form-control" value={form.telephone} onChange={handleChange} required />
              </div>

              {/* Ville avec datalist */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Ville</label>
                <input type="text" name="ville" list="villes-list" className="form-control" value={form.ville} onChange={handleChange} placeholder="Tapez ou sélectionnez" required />
                <datalist id="villes-list">
                  {villes.map((v, i) => (
                    <option key={i} value={v.nom || v} />
                  ))}
                </datalist>
              </div>

              {/* PARTIE ÉTUDIANT */}
              {role === 'etudiant' && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Niveau d'étude</label>
                    <select name="niveau" className="form-select" value={form.niveau} onChange={handleChange}>
                      <option value="">Sélectionnez</option>
                      {niveaux.map((n, i) => (
                        <option key={i} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Budget max (DH/h)</label>
                    <input type="number" name="budget" className="form-control" min="0" value={form.budget} onChange={handleChange} />
                  </div>
                </>
              )}

              {/* PARTIE ENSEIGNANT */}
              {role === 'enseignant' && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Matière</label>
                    <input type="text" name="matiere" list="matieres-list" className="form-control" value={form.matiere} onChange={handleChange} placeholder="Tapez ou sélectionnez" required />
                    <datalist id="matieres-list">
                      {matieres.map((m, i) => (
                        <option key={i} value={m.nom || m} />
                      ))}
                    </datalist>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tarif (DH/h)</label>
                    <input type="number" name="tarifHeure" className="form-control" min="50" value={form.tarifHeure} onChange={handleChange} required />
                  </div>

                  {/* Documents */}
                  <div className="border rounded p-3 mb-3">
                    <p className="fw-semibold mb-2">
                      <i className="bi bi-shield-check text-primary me-2"></i>
                      Documents requis
                    </p>
                    <div className="mb-2">
                      <input type="file" name="cin_recto" className="form-control form-control-sm" accept="image/*" onChange={handleFile} required />
                      <small>CIN Recto</small>
                    </div>
                    <div className="mb-2">
                      <input type="file" name="cin_verso" className="form-control form-control-sm" accept="image/*" onChange={handleFile} required />
                      <small>CIN Verso</small>
                    </div>
                    <div>
                      <input type="file" name="diplome" className="form-control form-control-sm" accept=".pdf" onChange={handleFile} required />
                      <small>Diplôme (PDF)</small>
                    </div>
                  </div>
                </>
              )}

              {/* Mot de passe */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Mot de passe</label>
                  <div className="input-group">
                    <input type={showPass ? 'text' : 'password'} name="password" className="form-control" value={form.password} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPass(!showPass)}>
                      <i className={`bi ${showPass ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Confirmer</label>
                  <div className="input-group">
                    <input type={showPass2 ? 'text' : 'password'} name="password_confirmation" className="form-control" value={form.password_confirmation} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPass2(!showPass2)}>
                      <i className={`bi ${showPass2 ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bouton validation */}
              <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Envoi...
                  </>
                ) : (
                  <>
                    <i className={`bi ${role === 'enseignant' ? 'bi-send-check' : 'bi-person-plus'} me-2`}></i>
                    {role === 'enseignant' ? 'Soumettre ma candidature' : 'Créer mon compte'}
                  </>
                )}
              </button>

            </form>

            <hr className="my-3" />

            {/* Lien connexion */}
            <div className="text-center">
              <span className="text-muted">Déjà un compte ?</span>
              <Link to="/login" className="text-primary text-decoration-none ms-1 fw-semibold">
                Se connecter
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;