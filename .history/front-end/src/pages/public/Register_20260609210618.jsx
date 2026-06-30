import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

function Register() {
  const navigate = useNavigate(); // accceder au dashboard apres inscription
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'etudiant'; // check role is enseignant default etudiant
  const [step, setStep] = useState(1);// 2 etapes pour inscription enseignant

  const [villes, setVilles] = useState([]);//sotcker les villes et les matieres depuis api
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
    fetch('http://localhost:8000/api/villes') //get villes,matieres from server 
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
    if (validateStep1()){ //verifier si infos vrai
      setError('');//supprimer les erreur
      setStep(2); //step2
    }
  };

  //empecher reload
  const handleSubmit = (e) =>{ 
    e.preventDefault();
    
    if (role === 'enseignant' && step === 1){
      handleNext();
      return;
    }

    setLoading(true);//envoi...
    setError('');

    if (role === 'enseignant'){
      if (!files.cin_recto) {setError('CIN recto requis.'); setLoading(false); return; }
      if (!files.cin_verso) {setError('CIN verso requis.'); setLoading(false); return; }
      if (!files.diplome) {setError('Diplôme requis.'); setLoading(false); return; }
      if (!checkboxes.certifie) {setError('Vous devez certifier les informations.'); setLoading(false); return; }
    }

    const data = new FormData();
    Object.keys(form).forEach(key => { //key : nom du champ
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
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '400px', background: 'white', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="bi bi-check-lg" style={{ fontSize: '32px', color: 'white' }}></i>
          </div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Dossier envoyé</h3>
          <p style={{ color: '#6B7280', marginBottom: '16px' }}>Votre dossier est en cours de vérification</p>
          <Link to="/login" style={{ display: 'block', background: '#0d6efd', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '8px', textDecoration: 'none' }}>Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ maxWidth: '500px', width: '100%', background: 'white', borderRadius: '16px' }}>
        <div style={{ padding: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Link to="/" style={{ color: '#6B7280' }}>
              <i className="bi bi-x-lg" style={{ fontSize: '20px' }}></i>
            </Link>
            {role === 'enseignant' && (
              <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: 'auto' }}>Étape {step}/2</span>
            )}
          </div>

          {role === 'enseignant' && step === 1 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '4px' }}>
                <div style={{ width: '50%', height: '4px', background: '#0d6efd', borderRadius: '4px' }}></div>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', background: '#0d6efd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <i className={`bi ${role === 'enseignant' ? 'bi-briefcase' : 'bi-mortarboard'}`} style={{ fontSize: '20px', color: 'white' }}></i>
            </div>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>{role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}</h3>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>{role === 'enseignant' ? 'Partagez votre savoir' : 'Trouvez votre professeur'}</p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', borderLeft: '3px solid #DC2626', padding: '8px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#991B1B' }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: '8px' }}></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {step === 1 && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>PHOTO DE PROFIL</label>
                  <input type="file" name="photo" style={{ width: '100%', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '8px' }} accept="image/*" onChange={handleFile} />
                  <small style={{ fontSize: '10px', color: '#94A3B8' }}>Optionnel - JPG/PNG</small>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>NOM</label>
                    <input type="text" name="nom" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px' }} value={form.nom} onChange={handleChange} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>PRÉNOM</label>
                    <input type="text" name="prenom" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px' }} value={form.prenom} onChange={handleChange} required />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>EMAIL</label>
                  <input type="email" name="email" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px' }} value={form.email} onChange={handleChange} required />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>TÉLÉPHONE</label>
                  <input type="tel" name="telephone" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px' }} value={form.telephone} onChange={handleChange} required />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>VILLE</label>
                  <input type="text" name="ville" list="villes-list" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px' }} value={form.ville} onChange={handleChange} placeholder="Tapez ou sélectionnez" required />
                  <datalist id="villes-list">{villes.map(v => <option key={v.id} value={v.nom} />)}</datalist>
                </div>

                {role === 'etudiant' && (
                  <>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>NIVEAU D'ÉTUDE</label>
                      <select name="niveau" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px' }} value={form.niveau} onChange={handleChange}>
                        <option value="">Sélectionnez</option>
                        {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>BUDGET (DH/h)</label>
                      <input type="number" name="budget" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px' }} min="0" value={form.budget} onChange={handleChange} />
                    </div>
                  </>
                )}

                {role === 'enseignant' && (
                  <>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>MATIÈRE</label>
                      <input type="text" name="matiere" list="matieres-list" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px' }} value={form.matiere} onChange={handleChange} placeholder="Tapez ou sélectionnez" required />
                      <datalist id="matieres-list">{matieres.map(m => <option key={m.id} value={m.nom} />)}</datalist>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>TARIF (DH/h)</label>
                      <input type="number" name="tarifHeure" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px' }} min="50" value={form.tarifHeure} onChange={handleChange} required />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>MODALITÉS DE COURS</label>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <input type="checkbox" name="cours_enligne" checked={checkboxes.cours_enligne} onChange={handleCheckbox} /> En ligne
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <input type="checkbox" name="cours_domicile" checked={checkboxes.cours_domicile} onChange={handleCheckbox} /> À domicile
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <input type="checkbox" name="cours_deplacement" checked={checkboxes.cours_deplacement} onChange={handleCheckbox} /> Déplacement
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>MOT DE PASSE</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPass ? 'text' : 'password'} name="password" style={{ width: '100%', padding: '8px 12px', paddingRight: '40px', border: '1px solid #E2E8F0', borderRadius: '8px' }} value={form.password} onChange={handleChange} required />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                        <i className={`bi ${showPass ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                      </button>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', display: 'block' }}>CONFIRMER</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPass2 ? 'text' : 'password'} name="password_confirmation" style={{ width: '100%', padding: '8px 12px', paddingRight: '40px', border: '1px solid #E2E8F0', borderRadius: '8px' }} value={form.password_confirmation} onChange={handleChange} required />
                      <button type="button" onClick={() => setShowPass2(!showPass2)} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                        <i className={`bi ${showPass2 ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {role === 'enseignant' ? 'Étape suivante →' : (loading ? 'Envoi...' : 'Créer mon compte')}
                </button>
              </>
            )}

            {role === 'enseignant' && step === 2 && (
              <>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', marginBottom: '16px', background: '#F8FAFC' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '11px' }}><i className="bi bi-shield-check" style={{ color: '#0d6efd', marginRight: '8px' }}></i>DOCUMENTS REQUIS</p>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>CIN Recto</label>
                    <input type="file" name="cin_recto" style={{ width: '100%', padding: '6px', border: '1px solid #E2E8F0', borderRadius: '8px' }} accept="image/*" onChange={handleFile} required />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>CIN Verso</label>
                    <input type="file" name="cin_verso" style={{ width: '100%', padding: '6px', border: '1px solid #E2E8F0', borderRadius: '8px' }} accept="image/*" onChange={handleFile} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Diplôme (PDF)</label>
                    <input type="file" name="diplome" style={{ width: '100%', padding: '6px', border: '1px solid #E2E8F0', borderRadius: '8px' }} accept=".pdf" onChange={handleFile} required />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '12px' }}>
                  <input type="checkbox" name="certifie" checked={checkboxes.certifie} onChange={handleCheckbox} required />
                  Je certifie que les informations fournies sont exactes et vérifiables
                </label>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer' }} onClick={() => { setStep(1); setError(''); }}>
                    ← Retour
                  </button>
                  <button type="submit" style={{ flex: 2, padding: '10px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }} disabled={loading}>
                    {loading ? 'Envoi...' : 'Soumettre mon dossier'}
                  </button>
                </div>
              </>
            )}
          </form>

          <hr style={{ margin: '16px 0' }} />
          <div style={{ textAlign: 'center', fontSize: '12px' }}>
            <span style={{ color: '#6B7280' }}>Déjà un compte ?</span>
            <Link to="/login" style={{ color: '#0d6efd', textDecoration: 'none', marginLeft: '6px', fontWeight: 'bold' }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;