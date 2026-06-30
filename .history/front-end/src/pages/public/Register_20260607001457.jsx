import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'etudiant';

  const [villes, setVilles] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '', password_confirmation: '', ville: '', niveau: '', budget: '', matiere: '', tarifHeure: '' });
  const [files, setFiles] = useState({ cin_recto: null, cin_verso: null, diplome: null, photo: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [villesRes, matieresRes] = await Promise.all([api.get('/villes').catch(() => ({ data: [] })), api.get('/matieres').catch(() => ({ data: [] }))]);
      setVilles(villesRes.data || []);
      setMatieres(matieresRes.data || []);
    };
    loadData();
  }, []);

  const niveaux = ['Préscolaire', 'CP', 'CE1', 'CE2', 'CM1', 'CM2', '6ème primaire', 'Tronc Commun', '1ère année collège', '2ème année collège', '3ème année collège', 'Baccalauréat', 'Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat', 'BTS', 'DUT'];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

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
    if (role === 'enseignant' && (!form.matiere || !form.tarifHeure || form.tarifHeure < 50)) {
      setError(role === 'enseignant' && !form.matiere ? 'Veuillez saisir une matière.' : 'Le tarif minimum est de 50 DH/h.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(form).forEach(key => form[key] && data.append(key, form[key]));
      data.append('role', role);
      if (files.photo) data.append('photo', files.photo);

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

      const res = await api.post('/register', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      role === 'enseignant' ? setSuccess(true) : navigate('/student/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('telephone')) setError('Numéro déjà utilisé.');
      else if (msg.includes('email')) setError('Email déjà utilisé.');
      else if (msg.includes('cin_recto')) setError('CIN recto requis (JPG/PNG).');
      else if (msg.includes('cin_verso')) setError('CIN verso requis (JPG/PNG).');
      else if (msg.includes('diplome')) setError('Diplôme requis (PDF).');
      else setError(msg || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="card p-4 text-center" style={{ maxWidth: '400px' }}>
          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}><i className="bi bi-check-lg fs-1"></i></div>
          <h3 className="fw-bold mb-2">Dossier envoyé</h3>
          <p className="text-muted small">Votre dossier est en cours de vérification</p>
          <div className="bg-light p-3 rounded mb-3">
            <div className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i><span className="small">CIN recto et verso vérifiés</span></div>
            <div className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i><span className="small">Diplôme authentifié</span></div>
            <div><i className="bi bi-clock-history text-warning me-2"></i><span className="small">Validation sous 24h</span></div>
          </div>
          <Link to="/login" className="btn btn-primary w-100">Se connecter</Link>
          <Link to="/" className="btn btn-link text-muted mt-2">Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="w-100" style={{ maxWidth: '500px', marginBottom: '16px' }}>
        <Link to="/" className="text-muted text-decoration-none small"><i className="bi bi-arrow-left"></i> Retour</Link>
      </div>
      <div className="card w-100" style={{ maxWidth: '500px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-1 mb-2">
              <i className={`bi ${role === 'enseignant' ? 'bi-briefcase' : 'bi-mortarboard'} me-1`}></i>
              <span className="small fw-semibold">{role === 'enseignant' ? 'Enseignant' : 'Étudiant'}</span>
            </div>
            <h2 className="fw-bold fs-4 mb-1">{role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}</h2>
            <p className="text-muted small">{role === 'enseignant' ? 'Partagez vos connaissances' : 'Trouvez votre professeur'}</p>
          </div>

          {error && <div className="alert alert-danger py-2 px-3 mb-3 small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Photo de profil</label>
              <input type="file" name="photo" accept="image/jpeg,image/png,image/jpg" onChange={handleFile} className="form-control form-control-sm" />
              <small className="text-muted">Optionnel - JPG/PNG (max 2MB)</small>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3"><label className="form-label small fw-semibold">Nom</label><input type="text" name="nom" className="form-control form-control-sm" value={form.nom} onChange={handleChange} required /></div>
              <div className="col-md-6 mb-3"><label className="form-label small fw-semibold">Prénom</label><input type="text" name="prenom" className="form-control form-control-sm" value={form.prenom} onChange={handleChange} required /></div>
            </div>

            <div className="mb-3"><label className="form-label small fw-semibold">Email</label><input type="email" name="email" className="form-control form-control-sm" value={form.email} onChange={handleChange} required /></div>
            <div className="mb-3"><label className="form-label small fw-semibold">Téléphone</label><input type="tel" name="telephone" className="form-control form-control-sm" value={form.telephone} onChange={handleChange} required /></div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Ville</label>
              <input type="text" name="ville" list="villes-list" className="form-control form-control-sm" value={form.ville} onChange={handleChange} placeholder="Tapez ou sélectionnez" required />
              <datalist id="villes-list">{villes.map(v => <option key={v.id || v.nom} value={v.nom || v} />)}</datalist>
            </div>

            {role === 'etudiant' && (
              <>
                <div className="mb-3"><label className="form-label small fw-semibold">Niveau</label><select name="niveau" className="form-select form-select-sm" value={form.niveau} onChange={handleChange}><option value="">Sélectionner</option>{niveaux.map((n, i) => <option key={i} value={n}>{n}</option>)}</select></div>
                <div className="mb-3"><label className="form-label small fw-semibold">Budget (DH/h)</label><input type="number" name="budget" className="form-control form-control-sm" min="0" value={form.budget} onChange={handleChange} /></div>
              </>
            )}

            {role === 'enseignant' && (
              <>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Matière</label>
                  <input type="text" name="matiere" list="matieres-list" className="form-control form-control-sm" value={form.matiere} onChange={handleChange} placeholder="Tapez ou sélectionnez" required />
                  <datalist id="matieres-list">{matieres.map(m => <option key={m.id || m.nom} value={m.nom || m} />)}</datalist>
                </div>
                <div className="mb-3"><label className="form-label small fw-semibold">Tarif (DH/h)</label><input type="number" name="tarifHeure" className="form-control form-control-sm" min="50" value={form.tarifHeure} onChange={handleChange} required /></div>
                <div className="border rounded p-3 mb-3">
                  <div className="mb-2"><i className="bi bi-shield-check text-primary me-2"></i><span className="small fw-bold">Documents requis</span></div>
                  <div className="mb-2"><input type="file" name="cin_recto" accept="image/*" onChange={handleFile} className="form-control form-control-sm" required /><small className="text-muted">CIN Recto</small></div>
                  <div className="mb-2"><input type="file" name="cin_verso" accept="image/*" onChange={handleFile} className="form-control form-control-sm" required /><small className="text-muted">CIN Verso</small></div>
                  <div><input type="file" name="diplome" accept=".pdf" onChange={handleFile} className="form-control form-control-sm" required /><small className="text-muted">Diplôme (PDF)</small></div>
                </div>
              </>
            )}

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold">Mot de passe</label>
                <div className="input-group">
                  <input type={showPass ? 'text' : 'password'} name="password" className="form-control form-control-sm" value={form.password} onChange={handleChange} required />
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowPass(!showPass)}><i className={`bi ${showPass ? 'bi-eye' : 'bi-eye-slash'}`}></i></button>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold">Confirmer</label>
                <div className="input-group">
                  <input type={showPass2 ? 'text' : 'password'} name="password_confirmation" className="form-control form-control-sm" value={form.password_confirmation} onChange={handleChange} required />
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowPass2(!showPass2)}><i className={`bi ${showPass2 ? 'bi-eye' : 'bi-eye-slash'}`}></i></button>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Envoi...</> : <><i className={`bi ${role === 'enseignant' ? 'bi-send-check' : 'bi-person-plus'} me-2`}></i>{role === 'enseignant' ? 'Soumettre' : 'Créer mon compte'}</>}
            </button>
          </form>

          <hr className="my-3" />
          <div className="text-center">
            <span className="small text-muted">Déjà un compte ? </span>
            <Link to="/login" className="text-primary fw-bold text-decoration-none small">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;