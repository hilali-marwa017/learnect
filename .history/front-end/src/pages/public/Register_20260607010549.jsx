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
      window.scrollTo(0, 0);
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

    if (role === 'enseignant' && !files.cin_recto) {
      setError('Veuillez télécharger votre CIN recto.');
      setLoading(false);
      return;
    }
    if (role === 'enseignant' && !files.cin_verso) {
      setError('Veuillez télécharger votre CIN verso.');
      setLoading(false);
      return;
    }
    if (role === 'enseignant' && !files.diplome) {
      setError('Veuillez télécharger votre diplôme.');
      setLoading(false);
      return;
    }
    if (role === 'enseignant' && !checkboxes.certifie) {
      setError('Vous devez certifier les informations.');
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== '' && form[key] !== null) data.append(key, form[key]);
    });
    data.append('role', role);
    data.append('certifie', checkboxes.certifie);
    data.append('cours_enligne', checkboxes.cours_enligne);
    data.append('cours_domicile', checkboxes.cours_domicile);
    data.append('cours_deplacement', checkboxes.cours_deplacement);
    if (files.photo) data.append('photo', files.photo);
    if (role === 'enseignant') {
      data.append('cin_recto', files.cin_recto);
      data.append('cin_verso', files.cin_verso);
      data.append('diplome', files.diplome);
    }

    fetch('http://localhost:8000/api/register', { method: 'POST', body: data })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            throw new Error(errData.message || 'Erreur');
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
        else setError(msg);
      })
      .finally(() => setLoading(false));
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#28a745', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <i className="bi bi-check-lg" style={{ fontSize: '32px', color: 'white' }}></i>
          </div>
          <h2>Dossier envoyé</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>En cours de vérification</p>
          <Link to="/login" style={{ background: '#0d6efd', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', display: 'block' }}>Se connecter</Link>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '0.9rem',
    outline: 'none',
    background: '#f8fafc',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '550px', width: '100%' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Link to="/" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', textDecoration: 'none' }}>
              <i className="bi bi-x-lg"></i>
            </Link>
            {role === 'enseignant' && (
              <span style={{ fontSize: '12px', color: '#666' }}>Étape {step}/2</span>
            )}
          </div>

          {role === 'enseignant' && step === 1 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
                <div style={{ width: '50%', height: '4px', background: '#0d6efd', borderRadius: '2px' }}></div>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '48px', height: '48px', background: '#0d6efd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <i className={`bi ${role === 'enseignant' ? 'bi-briefcase' : 'bi-mortarboard'}`} style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <h2 style={{ fontSize: '24px' }}>{role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}</h2>
            <p style={{ color: '#666' }}>{role === 'enseignant' ? 'Partagez votre savoir' : 'Trouvez votre professeur'}</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', borderLeft: '2px solid #ef4444', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', color: '#e63a3a' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* STEP 1 - Commun à tous */}
            <div style={{ display: step === 1 ? 'block' : 'none' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '5px', display: 'block' }}>PHOTO</label>
                <input type="file" name="photo" accept="image/*" onChange={handleFile} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>NOM</label>
                  <input type="text" name="nom" value={form.nom} onChange={handleChange} style={inputStyle} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>PRÉNOM</label>
                  <input type="text" name="prenom" value={form.prenom} onChange={handleChange} style={inputStyle} required />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>EMAIL</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px' }}><i className="bi bi-envelope"></i></span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} required />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>TÉLÉPHONE</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px' }}><i className="bi bi-telephone"></i></span>
                  <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} style={inputStyle} required />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>VILLE</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px' }}><i className="bi bi-geo-alt"></i></span>
                  <input type="text" name="ville" list="villes-list" value={form.ville} onChange={handleChange} style={inputStyle} required />
                </div>
                <datalist id="villes-list">{villes.map(v => <option key={v.id} value={v.nom} />)}</datalist>
              </div>

              {role === 'etudiant' && (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>NIVEAU</label>
                    <select name="niveau" value={form.niveau} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                      <option value="">Sélectionnez</option>
                      {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>BUDGET (DH/h)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '12px' }}><i className="bi bi-cash"></i></span>
                      <input type="number" name="budget" value={form.budget} onChange={handleChange} style={inputStyle} />
                    </div>
                  </div>
                </>
              )}

              {role === 'enseignant' && (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>MATIÈRE</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '12px' }}><i className="bi bi-book"></i></span>
                      <input type="text" name="matiere" list="matieres-list" value={form.matiere} onChange={handleChange} style={inputStyle} required />
                    </div>
                    <datalist id="matieres-list">{matieres.map(m => <option key={m.id} value={m.nom} />)}</datalist>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>TARIF (DH/h)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '12px' }}><i className="bi bi-cash-stack"></i></span>
                      <input type="number" name="tarifHeure" value={form.tarifHeure} onChange={handleChange} min="50" style={inputStyle} required />
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>MODALITÉS</label>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <label><input type="checkbox" name="cours_enligne" checked={checkboxes.cours_enligne} onChange={handleCheckbox} /> En ligne</label>
                      <label><input type="checkbox" name="cours_domicile" checked={checkboxes.cours_domicile} onChange={handleCheckbox} /> À domicile</label>
                      <label><input type="checkbox" name="cours_deplacement" checked={checkboxes.cours_deplacement} onChange={handleCheckbox} /> Déplacement</label>
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>MOT DE PASSE</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '12px' }}><i className="bi bi-lock"></i></span>
                    <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} style={{ ...inputStyle, paddingRight: '40px' }} required />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '12px', border: 'none', background: 'none' }}>
                      <i className={`bi ${showPass ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>CONFIRMER</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '12px' }}><i className="bi bi-lock"></i></span>
                    <input type={showPass2 ? 'text' : 'password'} name="password_confirmation" value={form.password_confirmation} onChange={handleChange} style={{ ...inputStyle, paddingRight: '40px' }} required />
                    <button type="button" onClick={() => setShowPass2(!showPass2)} style={{ position: 'absolute', right: '10px', top: '12px', border: 'none', background: 'none' }}>
                      <i className={`bi ${showPass2 ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                {role === 'enseignant' ? 'Étape suivante →' : (loading ? 'Envoi...' : 'Créer mon compte')}
              </button>
            </div>

            {/* STEP 2 - Documents (enseignant uniquement) */}
            {role === 'enseignant' && step === 2 && (
              <>
                <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '15px' }}><i className="bi bi-shield-check text-primary me-2"></i>Documents requis</p>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px' }}>CIN Recto</label>
                    <input type="file" name="cin_recto" accept="image/*" onChange={handleFile} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }} required />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px' }}>CIN Verso</label>
                    <input type="file" name="cin_verso" accept="image/*" onChange={handleFile} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px' }}>Diplôme (PDF)</label>
                    <input type="file" name="diplome" accept=".pdf" onChange={handleFile} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }} required />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" name="certifie" checked={checkboxes.certifie} onChange={handleCheckbox} required />
                    <span style={{ fontSize: '13px' }}>Je certifie que les informations sont exactes</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button type="button" onClick={() => { setStep(1); setError(''); window.scrollTo(0, 0); }} style={{ flex: 1, padding: '14px', background: '#f0f0f0', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
                    ← Retour
                  </button>
                  <button type="submit" disabled={loading} style={{ flex: 2, padding: '14px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? 'Envoi...' : 'Soumettre mon dossier'}
                  </button>
                </div>
              </>
            )}
          </form>

          <hr style={{ margin: '20px 0' }} />
          <div style={{ textAlign: 'center' }}>
            <span>Déjà un compte ? </span>
            <Link to="/login" style={{ color: '#0d6efd', textDecoration: 'none' }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;