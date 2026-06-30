import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'etudiant';

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

  const niveaux = [
    'Préscolaire', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème primaire', 'Tronc Commun', '1ère année collège',
    '2ème année collège', '3ème année collège', 'Baccalauréat',
    'Licence 1', 'Licence 2', 'Licence 3', 'Master 1',
    'Master 2', 'Doctorat', 'BTS', 'DUT'
  ];

  useEffect(() => {
    const urlVilles = 'http://localhost:8000/api/villes';
    const urlMatieres = 'http://localhost:8000/api/matieres';
    fetch(urlVilles)
      .then(response => {
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return response.json();
      })
      .then(data => setVilles(data))
      .catch(error => { console.error("Erreur villes:", error); setVilles([]); });
    fetch(urlMatieres)
      .then(response => {
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return response.json();
      })
      .then(data => setMatieres(data))
      .catch(error => { console.error("Erreur matières:", error); setMatieres([]); });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleSubmit = (e) => {
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

    const data = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== '' && form[key] !== null) data.append(key, form[key]);
    });
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

    const url = 'http://localhost:8000/api/register';
    fetch(url, {
      method: 'POST',
      body: data
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            throw new Error(errData.message || 'Erreur lors de l\'inscription');
          });
        }
        return response.json();
      })
      .then(result => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        if (role === 'enseignant') setSuccess(true);
        else navigate('/student/dashboard');
      })
      .catch(err => {
        const msg = err.message || '';
        if (msg.includes('telephone')) setError('Numéro déjà utilisé.');
        else if (msg.includes('email')) setError('Email déjà utilisé.');
        else if (msg.includes('cin_recto')) setError('CIN recto requis.');
        else if (msg.includes('cin_verso')) setError('CIN verso requis.');
        else if (msg.includes('diplome')) setError('Diplôme requis.');
        else setError(msg);
      })
      .finally(() => setLoading(false));
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '64px', height: '64px', background: '#28a745', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <i className="bi bi-check-lg" style={{ fontSize: '32px', color: 'white' }}></i>
          </div>
          <h2 style={{ marginBottom: '10px' }}>Dossier envoyé</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Votre dossier est en cours de vérification</p>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
            <p style={{ marginBottom: '10px' }}><i className="bi bi-check-circle-fill text-success me-2"></i>CIN vérifié</p>
            <p style={{ marginBottom: '10px' }}><i className="bi bi-check-circle-fill text-success me-2"></i>Diplôme vérifié</p>
            <p><i className="bi bi-clock-history text-warning me-2"></i>Validation sous 24h</p>
          </div>
          <Link to="/login" style={{ background: '#0d6efd', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Se connecter</Link>
          <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '550px', width: '100%' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#f0f0f0', color: '#666', textDecoration: 'none' }}>
              <i className="bi bi-x-lg" style={{ fontSize: '1.2rem' }}></i>
            </Link>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '48px', height: '48px', background: '#0d6efd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <i className="bi bi-mortarboard" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <span style={{ background: '#f0f0f0', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', display: 'inline-block', marginBottom: '10px' }}>
              <i className={`bi ${role === 'enseignant' ? 'bi-briefcase' : 'bi-mortarboard'} me-1`}></i>
              {role === 'enseignant' ? 'Enseignant' : 'Étudiant'}
            </span>
            <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>{role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>{role === 'enseignant' ? 'Partagez votre savoir' : 'Trouvez votre professeur'}</p>
          </div>
          {error && <div style={{ background: '#fef2f2', borderLeft: '3px solid #ef4444', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', color: '#e63a3a' }}><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>PHOTO DE PROFIL</label>
              <input type="file" name="photo" accept="image/*" onChange={handleFile} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }} />
              <small style={{ color: '#666' }}>Optionnel - JPG/PNG</small>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>NOM</label><input type="text" name="nom" value={form.nom} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} required /></div>
              <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>PRÉNOM</label><input type="text" name="prenom" value={form.prenom} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} required /></div>
            </div>
            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>EMAIL</label><input type="email" name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} required /></div>
            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>TÉLÉPHONE</label><input type="tel" name="telephone" value={form.telephone} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} required /></div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>VILLE</label>
              <input type="text" name="ville" list="villes-list" value={form.ville} onChange={handleChange} placeholder="Tapez ou sélectionnez" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} required />
              <datalist id="villes-list">{villes.map((v, i) => <option key={i} value={v.nom || v} />)}</datalist>
            </div>
            {role === 'etudiant' && (
              <>
                <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>NIVEAU D'ÉTUDE</label><select name="niveau" value={form.niveau} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}><option value="">Sélectionnez</option>{niveaux.map((n, i) => <option key={i} value={n}>{n}</option>)}</select></div>
                <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>BUDGET (DH/h)</label><input type="number" name="budget" value={form.budget} onChange={handleChange} min="0" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
              </>
            )}
            {role === 'enseignant' && (
              <>
                <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>MATIÈRE</label><input type="text" name="matiere" list="matieres-list" value={form.matiere} onChange={handleChange} placeholder="Tapez ou sélectionnez" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} required /><datalist id="matieres-list">{matieres.map((m, i) => <option key={i} value={m.nom || m} />)}</datalist></div>
                <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>TARIF (DH/h)</label><input type="number" name="tarifHeure" value={form.tarifHeure} onChange={handleChange} min="50" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} required /></div>
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                  <p style={{ marginBottom: '10px', fontWeight: '600' }}><i className="bi bi-shield-check text-primary me-2"></i>Documents requis</p>
                  <div style={{ marginBottom: '10px' }}><input type="file" name="cin_recto" accept="image/*" onChange={handleFile} style={{ width: '100%', padding: '5px' }} required /><small>CIN Recto</small></div>
                  <div style={{ marginBottom: '10px' }}><input type="file" name="cin_verso" accept="image/*" onChange={handleFile} style={{ width: '100%', padding: '5px' }} required /><small>CIN Verso</small></div>
                  <div><input type="file" name="diplome" accept=".pdf" onChange={handleFile} style={{ width: '100%', padding: '5px' }} required /><small>Diplôme (PDF)</small></div>
                </div>
              </>
            )}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>MOT DE PASSE</label><div style={{ position: 'relative' }}><input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} required /><button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}><i className={`bi ${showPass ? 'bi-eye' : 'bi-eye-slash'}`}></i></button></div></div>
              <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>CONFIRMER</label><div style={{ position: 'relative' }}><input type={showPass2 ? 'text' : 'password'} name="password_confirmation" value={form.password_confirmation} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} required /><button type="button" onClick={() => setShowPass2(!showPass2)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}><i className={`bi ${showPass2 ? 'bi-eye' : 'bi-eye-slash'}`}></i></button></div></div>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Envoi...</> : <><i className={`bi ${role === 'enseignant' ? 'bi-send-check' : 'bi-person-plus'} me-2`}></i>{role === 'enseignant' ? 'Soumettre' : 'Créer mon compte'}</>}
            </button>
          </form>
          <hr style={{ margin: '20px 0' }} />
          <div style={{ textAlign: 'center' }}><span style={{ color: '#666' }}>Déjà un compte ? </span><Link to="/login" style={{ color: '#0d6efd', textDecoration: 'none', fontWeight: '600' }}>Se connecter</Link></div>
        </div>
      </div>
    </div>
  );
}

export default Register;