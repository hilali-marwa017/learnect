import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function Register() {
  const navigate = useNavigate();

  // States
  const [isEnseignant, setIsEnseignant] = useState(false);
  const [villes, setVilles] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    password: '', password_confirmation: '', ville_id: '',
    niveau: '', budget: '', matiere_id: '', tarifHeure: ''
  });
  const [files, setFiles] = useState({ cin_recto: null, cin_verso: null, diplome: null, photo: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [success, setSuccess] = useState(false);

  // Charger villes et matières
  useEffect(() => {
    const loadData = async () => {
      try {
        const [villesRes, matieresRes] = await Promise.all([
          api.get('/villes'),
          api.get('/matieres')
        ]);
        setVilles(villesRes.data);
        setMatieres(matieresRes.data);
      } catch (err) {
        console.error('Erreur chargement:', err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Niveaux d'études
  const niveaux = [
    'Primaire', 'Collège', 'Lycée', 'Baccalauréat',
    'Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat'
  ];

  // Handlers
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
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError('Mot de passe: minimum 8 caractères');
      setLoading(false);
      return;
    }

    if (isEnseignant) {
      if (!form.matiere_id) {
        setError('Veuillez sélectionner une matière');
        setLoading(false);
        return;
      }
      if (!form.tarifHeure || form.tarifHeure < 50) {
        setError('Tarif minimum: 50 DH/h');
        setLoading(false);
        return;
      }
    }

    try {
      const data = new FormData();
      Object.keys(form).forEach(key => data.append(key, form[key]));
      data.append('role', isEnseignant ? 'enseignant' : 'etudiant');

      if (files.photo) data.append('photo', files.photo);

      if (isEnseignant) {
        if (!files.cin_recto || !files.cin_verso || !files.diplome) {
          setError('Tous les documents sont requis');
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

      if (isEnseignant) {
        setSuccess(true);
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
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
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card text-center p-4" style={{ maxWidth: '400px' }}>
          <div className="mb-3">
            <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-check-lg fs-1"></i>
            </div>
            <h4>Dossier envoyé</h4>
            <p className="text-muted">Votre dossier est en cours de vérification</p>
          </div>
          <Link to="/login" className="btn btn-primary">Se connecter</Link>
          <Link to="/" className="btn btn-link mt-2">Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <div className="mb-3">
        <Link to="/" className="text-muted text-decoration-none">
          <i className="bi bi-arrow-left"></i> Retour
        </Link>
      </div>

      <div className="card">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h3>Learnect.ma</h3>
            <p className="text-muted">Créer un compte</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="enseignant"
                  checked={isEnseignant}
                  onChange={(e) => setIsEnseignant(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="enseignant">
                  Je suis enseignant
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nom</label>
                <input type="text" name="nom" className="form-control" value={form.nom} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Prénom</label>
                <input type="text" name="prenom" className="form-control" value={form.prenom} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Téléphone</label>
              <input type="tel" name="telephone" className="form-control" value={form.telephone} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Ville</label>
              <select name="ville_id" className="form-select" value={form.ville_id} onChange={handleChange} required>
                <option value="">Sélectionner</option>
                <option value="webcam">En ligne (webcam)</option>
                {villes.map(ville => (
                  <option key={ville.id} value={ville.id}>{ville.nom}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Photo (optionnel)</label>
              <input type="file" name="photo" className="form-control" accept="image/*" onChange={handleFile} />
            </div>

            {!isEnseignant && (
              <>
                <div className="mb-3">
                  <label className="form-label">Niveau</label>
                  <select name="niveau" className="form-select" value={form.niveau} onChange={handleChange}>
                    <option value="">Sélectionner</option>
                    {niveaux.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Budget (DH/h)</label>
                  <input type="number" name="budget" className="form-control" min="0" value={form.budget} onChange={handleChange} />
                </div>
              </>
            )}

            {isEnseignant && (
              <>
                <div className="mb-3">
                  <label className="form-label">Matière</label>
                  <select name="matiere_id" className="form-select" value={form.matiere_id} onChange={handleChange} required>
                    <option value="">Sélectionner</option>
                    {matieres.map(matiere => (
                      <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tarif (DH/h)</label>
                  <input type="number" name="tarifHeure" className="form-control" min="50" value={form.tarifHeure} onChange={handleChange} required />
                </div>

                <div className="border rounded p-3 mb-3">
                  <h6 className="mb-3">Documents requis</h6>
                  <div className="mb-2">
                    <label className="form-label small">CIN Recto</label>
                    <input type="file" name="cin_recto" className="form-control form-control-sm" accept="image/*" onChange={handleFile} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">CIN Verso</label>
                    <input type="file" name="cin_verso" className="form-control form-control-sm" accept="image/*" onChange={handleFile} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Diplôme (PDF)</label>
                    <input type="file" name="diplome" className="form-control form-control-sm" accept=".pdf" onChange={handleFile} required />
                  </div>
                </div>
              </>
            )}

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Mot de passe</label>
                <div className="input-group">
                  <input type={showPass ? 'text' : 'password'} name="password" className="form-control" value={form.password} onChange={handleChange} required />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPass(!showPass)}>
                    <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Confirmer</label>
                <div className="input-group">
                  <input type={showPass2 ? 'text' : 'password'} name="password_confirmation" className="form-control" value={form.password_confirmation} onChange={handleChange} required />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPass2(!showPass2)}>
                    <i className={`bi ${showPass2 ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Chargement...' : 'Créer mon compte'}
            </button>
          </form>

          <hr className="my-3" />

          <div className="text-center">
            <span className="text-muted">Déjà un compte ? </span>
            <Link to="/login" className="text-primary">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;