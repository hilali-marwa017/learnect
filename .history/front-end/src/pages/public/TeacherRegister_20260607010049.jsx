import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function TeacherRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [villes, setVilles] = useState([]);
  const [matieres, setMatieres] = useState([]);
  
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    password: '', password_confirmation: '', ville: '',
    matiere: '', tarifHeure: '', distance_max: '', langues: '',
    diplome_intitule: ''
  });
  
  const [files, setFiles] = useState({
    cin_recto: null, cin_verso: null, diplome: null, photo: null
  });
  
  const [checkboxes, setCheckboxes] = useState({
    certifie: false,
    experience: false,
    disponible: false,
    cours_enligne: false,
    cours_domicile: false,
    cours_deplacement: false
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlVilles = 'http://localhost:8000/api/villes';
    const urlMatieres = 'http://localhost:8000/api/matieres';
    fetch(urlVilles)
      .then(response => response.json())
      .then(data => setVilles(data))
      .catch(() => setVilles([]));
    fetch(urlMatieres)
      .then(response => response.json())
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
    if (!form.matiere) {
      setError('Veuillez saisir une matière.');
      return false;
    }
    if (!form.tarifHeure || form.tarifHeure < 50) {
      setError('Le tarif minimum est de 50 DH/h.');
      return false;
    }
    if (!checkboxes.cours_enligne && !checkboxes.cours_domicile && !checkboxes.cours_deplacement) {
      setError('Veuillez sélectionner au moins une modalité de cours.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!files.cin_recto) {
      setError('Veuillez télécharger votre CIN recto.');
      return false;
    }
    if (!files.cin_verso) {
      setError('Veuillez télécharger votre CIN verso.');
      return false;
    }
    if (!files.diplome) {
      setError('Veuillez télécharger votre diplôme.');
      return false;
    }
    if (!checkboxes.certifie) {
      setError('Vous devez certifier que les informations sont exactes.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (validateStep1()) {
        setError('');
        setStep(2);
        window.scrollTo(0, 0);
      }
      return;
    }
    
    if (step === 2) {
      if (!validateStep2()) return;
      
      setLoading(true);
      setError('');
      
      const data = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== '' && form[key] !== null) data.append(key, form[key]);
      });
      data.append('role', 'enseignant');
      data.append('certifie', checkboxes.certifie);
      data.append('experience', checkboxes.experience);
      data.append('disponible', checkboxes.disponible);
      data.append('cours_enligne', checkboxes.cours_enligne);
      data.append('cours_domicile', checkboxes.cours_domicile);
      data.append('cours_deplacement', checkboxes.cours_deplacement);
      
      if (files.photo) data.append('photo', files.photo);
      data.append('cin_recto', files.cin_recto);
      data.append('cin_verso', files.cin_verso);
      data.append('diplome', files.diplome);
      
      const url = 'http://localhost:8000/api/register';
      fetch(url, { method: 'POST', body: data })
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
          setSuccess(true);
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
    }
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

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    marginRight: '10px',
    cursor: 'pointer',
    accentColor: '#0d6efd'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '550px', width: '100%' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#f0f0f0', color: '#666', textDecoration: 'none' }}>
              <i className="bi bi-arrow-left" style={{ fontSize: '1.2rem' }}></i>
            </Link>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Étape {step}/2
            </span>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <div style={{ flex: 1, height: '4px', background: step >= 1 ? '#0d6efd' : '#e2e8f0', borderRadius: '2px' }}></div>
              <div style={{ flex: 1, height: '4px', background: step >= 2 ? '#0d6efd' : '#e2e8f0', borderRadius: '2px' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: step >= 1 ? '#0d6efd' : '#666' }}>Profil général</span>
              <span style={{ fontSize: '12px', color: step >= 2 ? '#0d6efd' : '#666' }}>Justificatifs</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '48px', height: '48px', background: '#0d6efd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <i className="bi bi-briefcase" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>Devenir Enseignant</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Partagez votre savoir</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', borderLeft: '2px solid #ef4444', padding: '10px 14px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#e63a3a' }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {step === 1 && (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>PHOTO DE PROFIL</label>
                  <input type="file" name="photo" accept="image/*" onChange={handleFile} style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }} />
                  <small style={{ color: '#666' }}>Optionnel - JPG/PNG</small>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>NOM</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-person"></i></span>
                      <input type="text" name="nom" value={form.nom} onChange={handleChange} style={inputStyle} required />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>PRÉNOM</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-person"></i></span>
                      <input type="text" name="prenom" value={form.prenom} onChange={handleChange} style={inputStyle} required />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-envelope"></i></span>
                    <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} required />
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>TÉLÉPHONE</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-telephone"></i></span>
                    <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} style={inputStyle} required />
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>VILLE</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-geo-alt"></i></span>
                    <input type="text" name="ville" list="villes-list" value={form.ville} onChange={handleChange} placeholder="Tapez ou sélectionnez" style={inputStyle} required />
                  </div>
                  <datalist id="villes-list">{villes.map((v, i) => <option key={i} value={v.nom || v} />)}</datalist>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>MATIÈRE</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-book"></i></span>
                    <input type="text" name="matiere" list="matieres-list" value={form.matiere} onChange={handleChange} placeholder="Tapez ou sélectionnez" style={inputStyle} required />
                  </div>
                  <datalist id="matieres-list">{matieres.map((m, i) => <option key={i} value={m.nom || m} />)}</datalist>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>TARIF (DH/h)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-cash-stack"></i></span>
                    <input type="number" name="tarifHeure" value={form.tarifHeure} onChange={handleChange} min="50" style={inputStyle} required />
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>MODALITÉS DE COURS</label>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" name="cours_enligne" checked={checkboxes.cours_enligne} onChange={handleCheckbox} style={checkboxStyle} />
                      <span><i className="bi bi-laptop me-1"></i>En ligne</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" name="cours_domicile" checked={checkboxes.cours_domicile} onChange={handleCheckbox} style={checkboxStyle} />
                      <span><i className="bi bi-house-door me-1"></i>À domicile</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" name="cours_deplacement" checked={checkboxes.cours_deplacement} onChange={handleCheckbox} style={checkboxStyle} />
                      <span><i className="bi bi-pin-map me-1"></i>Déplacement</span>
                    </label>
                  </div>
                </div>

                {checkboxes.cours_deplacement && (
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>DISTANCE MAX (km)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-signpost"></i></span>
                      <input type="number" name="distance_max" value={form.distance_max} onChange={handleChange} min="0" placeholder="Ex: 20" style={inputStyle} />
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>LANGUES PARLÉES</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-translate"></i></span>
                    <input type="text" name="langues" value={form.langues} onChange={handleChange} placeholder="Ex: Français, Anglais, Arabe" style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>MOT DE PASSE</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-lock"></i></span>
                      <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} style={{ ...inputStyle, paddingRight: '48px' }} required />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}>
                        {showPass ? <i className="bi bi-eye" style={{ fontSize: '1.1rem' }}></i> : <i className="bi bi-eye-slash" style={{ fontSize: '1.1rem' }}></i>}
                      </button>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>CONFIRMER</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-lock"></i></span>
                      <input type={showPass2 ? 'text' : 'password'} name="password_confirmation" value={form.password_confirmation} onChange={handleChange} style={{ ...inputStyle, paddingRight: '48px' }} required />
                      <button type="button" onClick={() => setShowPass2(!showPass2)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}>
                        {showPass2 ? <i className="bi bi-eye" style={{ fontSize: '1.1rem' }}></i> : <i className="bi bi-eye-slash" style={{ fontSize: '1.1rem' }}></i>}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" style={{ width: '100%', padding: '14px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Étape suivante <i className="bi bi-arrow-right"></i>
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>INTITULÉ OFFICIEL DE VOTRE DIPLÔME</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-award"></i></span>
                    <input type="text" name="diplome_intitule" value={form.diplome_intitule} onChange={handleChange} placeholder="Ex: Master en Énergétique, Licence Pro..." style={inputStyle} required />
                  </div>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px', background: '#f8fafc' }}>
                  <p style={{ marginBottom: '15px', fontWeight: '600', fontSize: '13px', color: '#334155' }}><i className="bi bi-shield-check text-primary me-2"></i>DÉPÔT DES PIÈCES D'ÉTUDES & CIN</p>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '12px', color: '#334155' }}>Carte d'Identité (Recto)</label>
                    <input type="file" name="cin_recto" accept="image/*" onChange={handleFile} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }} required />
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '12px', color: '#334155' }}>Carte d'Identité (Verso)</label>
                    <input type="file" name="cin_verso" accept="image/*" onChange={handleFile} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }} required />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '12px', color: '#334155' }}>Copie du Diplôme Supérieur (PDF ou JPG)</label>
                    <input type="file" name="diplome" accept=".pdf,image/*" onChange={handleFile} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }} required />
                  </div>
                </div>

                <div style={{ marginBottom: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" name="certifie" checked={checkboxes.certifie} onChange={handleCheckbox} style={checkboxStyle} required />
                    <label style={{ fontSize: '13px', color: '#334155' }}>Je certifie que les informations fournies sont exactes et vérifiables</label>
                  </div>
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" name="experience" checked={checkboxes.experience} onChange={handleCheckbox} style={checkboxStyle} />
                    <label style={{ fontSize: '13px', color: '#334155' }}>J'ai une expérience dans l'enseignement (optionnel)</label>
                  </div>
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" name="disponible" checked={checkboxes.disponible} onChange={handleCheckbox} style={checkboxStyle} />
                    <label style={{ fontSize: '13px', color: '#334155' }}>Je suis disponible pour des cours</label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button type="button" onClick={() => { setStep(1); setError(''); window.scrollTo(0, 0); }} style={{ flex: 1, padding: '14px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <i className="bi bi-arrow-left me-2"></i>Retour
                  </button>
                  <button type="submit" disabled={loading} style={{ flex: 2, padding: '14px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {loading ? <><span className="spinner-border spinner-border-sm"></span> Envoi...</> : <><i className="bi bi-send-check me-2"></i>Soumettre mon dossier</>}
                  </button>
                </div>
              </>
            )}
          </form>

          <hr style={{ margin: '20px 0' }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#666' }}>Déjà membre de la communauté ? </span>
            <Link to="/login" style={{ color: '#0d6efd', textDecoration: 'none', fontWeight: '600' }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherRegister;