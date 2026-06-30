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
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px' 
      }}>
        <div style={{ 
          maxWidth: '400px', 
          width: '100%', 
          background: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '24px', 
          padding: '32px', 
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, #059669, #10b981)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px' 
          }}>
            <i className="bi bi-check-lg" style={{ fontSize: '32px', color: 'white' }}></i>
          </div>
          <h3 style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '8px', color: '#1f2937' }}>Dossier envoyé</h3>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>Votre dossier est en cours de vérification</p>
          <Link 
            to="/login" 
            style={{ 
              display: 'block', 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', 
              color: 'white', 
              textAlign: 'center', 
              padding: '12px', 
              borderRadius: '12px', 
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '16px' 
    }}>
      {/* Cercles décoratifs */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        top: '10%',
        left: '5%'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        bottom: '10%',
        right: '5%'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        top: '50%',
        right: '15%'
      }}></div>

      {/* Carte principale Glassmorphism */}
      <div style={{ 
        maxWidth: '550px', 
        width: '100%', 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '32px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ padding: '32px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Link to="/" style={{ color: '#6B7280', textDecoration: 'none' }}>
              <i className="bi bi-x-lg" style={{ fontSize: '20px' }}></i>
            </Link>
            {role === 'enseignant' && (
              <span style={{ 
                fontSize: '12px', 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '20px',
                marginLeft: 'auto'
              }}>
                Étape {step}/2
              </span>
            )}
          </div>

          {/* Progress bar */}
          {role === 'enseignant' && step === 1 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
                <div style={{ width: '50%', height: '6px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '3px' }}></div>
              </div>
            </div>
          )}

          {/* Titre */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', 
              borderRadius: '18px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 12px' 
            }}>
              <i className={`bi ${role === 'enseignant' ? 'bi-briefcase' : 'bi-mortarboard'}`} style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <h3 style={{ fontWeight: 'bold', fontSize: '22px', marginBottom: '6px', color: '#1f2937' }}>
              {role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              {role === 'enseignant' ? 'Partagez votre savoir et gagnez de l\'argent' : 'Trouvez votre professeur idéal'}
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div style={{ 
              background: '#FEF2F2', 
              borderLeft: '3px solid #EF4444', 
              padding: '10px 14px', 
              borderRadius: '12px', 
              marginBottom: '20px', 
              fontSize: '12px', 
              color: '#991B1B' 
            }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: '8px' }}></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {step === 1 && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    PHOTO DE PROFIL
                  </label>
                  <input 
                    type="file" 
                    name="photo" 
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1.5px solid #E2E8F0', 
                      borderRadius: '14px', 
                      background: '#F8FAFC',
                      fontSize: '13px'
                    }} 
                    accept="image/*" 
                    onChange={handleFile} 
                  />
                  <small style={{ fontSize: '10px', color: '#94A3B8', display: 'block', marginTop: '4px' }}>
                    Optionnel - JPG/PNG
                  </small>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      NOM
                    </label>
                    <input 
                      type="text" 
                      name="nom" 
                      style={{ 
                        width: '100%', 
                        padding: '12px 14px', 
                        border: '1.5px solid #E2E8F0', 
                        borderRadius: '14px', 
                        fontSize: '14px',
                        background: '#F8FAFC'
                      }} 
                      value={form.nom} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      PRÉNOM
                    </label>
                    <input 
                      type="text" 
                      name="prenom" 
                      style={{ 
                        width: '100%', 
                        padding: '12px 14px', 
                        border: '1.5px solid #E2E8F0', 
                        borderRadius: '14px', 
                        fontSize: '14px',
                        background: '#F8FAFC'
                      }} 
                      value={form.prenom} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    EMAIL
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      border: '1.5px solid #E2E8F0', 
                      borderRadius: '14px', 
                      fontSize: '14px',
                      background: '#F8FAFC'
                    }} 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    TÉLÉPHONE
                  </label>
                  <input 
                    type="tel" 
                    name="telephone" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      border: '1.5px solid #E2E8F0', 
                      borderRadius: '14px', 
                      fontSize: '14px',
                      background: '#F8FAFC'
                    }} 
                    value={form.telephone} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    VILLE
                  </label>
                  <input 
                    type="text" 
                    name="ville" 
                    list="villes-list" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      border: '1.5px solid #E2E8F0', 
                      borderRadius: '14px', 
                      fontSize: '14px',
                      background: '#F8FAFC'
                    }} 
                    value={form.ville} 
                    onChange={handleChange} 
                    placeholder="Tapez ou sélectionnez" 
                    required 
                  />
                  <datalist id="villes-list">{villes.map(v => <option key={v.id} value={v.nom} />)}</datalist>
                </div>

                {role === 'etudiant' && (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        NIVEAU D'ÉTUDE
                      </label>
                      <select 
                        name="niveau" 
                        style={{ 
                          width: '100%', 
                          padding: '12px 14px', 
                          border: '1.5px solid #E2E8F0', 
                          borderRadius: '14px', 
                          fontSize: '14px',
                          background: '#F8FAFC'
                        }} 
                        value={form.niveau} 
                        onChange={handleChange}
                      >
                        <option value="">Sélectionnez</option>
                        {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        BUDGET (DH/h)
                      </label>
                      <input 
                        type="number" 
                        name="budget" 
                        style={{ 
                          width: '100%', 
                          padding: '12px 14px', 
                          border: '1.5px solid #E2E8F0', 
                          borderRadius: '14px', 
                          fontSize: '14px',
                          background: '#F8FAFC'
                        }} 
                        min="0" 
                        value={form.budget} 
                        onChange={handleChange} 
                      />
                    </div>
                  </>
                )}

                {role === 'enseignant' && (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        MATIÈRE
                      </label>
                      <input 
                        type="text" 
                        name="matiere" 
                        list="matieres-list" 
                        style={{ 
                          width: '100%', 
                          padding: '12px 14px', 
                          border: '1.5px solid #E2E8F0', 
                          borderRadius: '14px', 
                          fontSize: '14px',
                          background: '#F8FAFC'
                        }} 
                        value={form.matiere} 
                        onChange={handleChange} 
                        placeholder="Tapez ou sélectionnez" 
                        required 
                      />
                      <datalist id="matieres-list">{matieres.map(m => <option key={m.id} value={m.nom} />)}</datalist>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        TARIF (DH/h)
                      </label>
                      <input 
                        type="number" 
                        name="tarifHeure" 
                        style={{ 
                          width: '100%', 
                          padding: '12px 14px', 
                          border: '1.5px solid #E2E8F0', 
                          borderRadius: '14px', 
                          fontSize: '14px',
                          background: '#F8FAFC'
                        }} 
                        min="50" 
                        value={form.tarifHeure} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        MODALITÉS DE COURS
                      </label>
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', background: '#F8FAFC', padding: '10px 14px', borderRadius: '14px', border: '1.5px solid #E2E8F0' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <input type="checkbox" name="cours_enligne" checked={checkboxes.cours_enligne} onChange={handleCheckbox} /> En ligne
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <input type="checkbox" name="cours_domicile" checked={checkboxes.cours_domicile} onChange={handleCheckbox} /> À domicile
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <input type="checkbox" name="cours_deplacement" checked={checkboxes.cours_deplacement} onChange={handleCheckbox} /> Déplacement
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      MOT DE PASSE
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showPass ? 'text' : 'password'} 
                        name="password" 
                        style={{ 
                          width: '100%', 
                          padding: '12px 14px', 
                          paddingRight: '45px', 
                          border: '1.5px solid #E2E8F0', 
                          borderRadius: '14px', 
                          fontSize: '14px',
                          background: '#F8FAFC'
                        }} 
                        value={form.password} 
                        onChange={handleChange} 
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPass(!showPass)} 
                        style={{ 
                          position: 'absolute', 
                          right: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          background: 'none', 
                          border: 'none', 
                          color: '#94A3B8', 
                          cursor: 'pointer' 
                        }}
                      >
                        <i className={`bi ${showPass ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                      </button>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      CONFIRMER
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showPass2 ? 'text' : 'password'} 
                        name="password_confirmation" 
                        style={{ 
                          width: '100%', 
                          padding: '12px 14px', 
                          paddingRight: '45px', 
                          border: '1.5px solid #E2E8F0', 
                          borderRadius: '14px', 
                          fontSize: '14px',
                          background: '#F8FAFC'
                        }} 
                        value={form.password_confirmation} 
                        onChange={handleChange} 
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPass2(!showPass2)} 
                        style={{ 
                          position: 'absolute', 
                          right: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          background: 'none', 
                          border: 'none', 
                          color: '#94A3B8', 
                          cursor: 'pointer' 
                        }}
                      >
                        <i className={`bi ${showPass2 ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '14px', 
                    fontWeight: 'bold', 
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {role === 'enseignant' ? 'Étape suivante →' : (loading ? 'Envoi...' : 'Créer mon compte')}
                </button>
              </>
            )}

            {role === 'enseignant' && step === 2 && (
              <>
                <div style={{ 
                  border: '1.5px solid #E2E8F0', 
                  borderRadius: '16px', 
                  padding: '16px', 
                  marginBottom: '20px', 
                  background: '#F8FAFC' 
                }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '14px', fontSize: '12px', color: '#475569' }}>
                    <i className="bi bi-shield-check" style={{ color: '#667eea', marginRight: '8px' }}></i>
                    DOCUMENTS REQUIS
                  </p>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      CIN Recto
                    </label>
                    <input 
                      type="file" 
                      name="cin_recto" 
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        border: '1.5px solid #E2E8F0', 
                        borderRadius: '12px', 
                        background: 'white',
                        fontSize: '13px'
                      }} 
                      accept="image/*" 
                      onChange={handleFile} 
                      required 
                    />
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      CIN Verso
                    </label>
                    <input 
                      type="file" 
                      name="cin_verso" 
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        border: '1.5px solid #E2E8F0', 
                        borderRadius: '12px', 
                        background: 'white',
                        fontSize: '13px'
                      }} 
                      accept="image/*" 
                      onChange={handleFile} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Diplôme (PDF)
                    </label>
                    <input 
                      type="file" 
                      name="diplome" 
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        border: '1.5px solid #E2E8F0', 
                        borderRadius: '12px', 
                        background: 'white',
                        fontSize: '13px'
                      }} 
                      accept=".pdf" 
                      onChange={handleFile} 
                      required 
                    />
                  </div>
                </div>

                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  marginBottom: '24px', 
                  fontSize: '13px',
                  background: '#F8FAFC',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid #E2E8F0'
                }}>
                  <input type="checkbox" name="certifie" checked={checkboxes.certifie} onChange={handleCheckbox} required />
                  Je certifie que les informations fournies sont exactes et vérifiables
                </label>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button 
                    type="button" 
                    style={{ 
                      flex: 1, 
                      padding: '12px', 
                      background: '#F1F5F9', 
                      border: '1.5px solid #E2E8F0', 
                      borderRadius: '14px', 
                      fontWeight: '600',
                      cursor: 'pointer',
                      color: '#475569'
                    }} 
                    onClick={() => { setStep(1); setError(''); }}
                  >
                    ← Retour
                  </button>
                  <button 
                    type="submit" 
                    style={{ 
                      flex: 2, 
                      padding: '12px', 
                      background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '14px', 
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }} 
                    disabled={loading}
                  >
                    {loading ? 'Envoi...' : 'Soumettre mon dossier'}
                  </button>
                </div>
              </>
            )}
          </form>

          <hr style={{ margin: '24px 0 20px', border: 'none', borderTop: '1px solid #E2E8F0' }} />
          <div style={{ textAlign: 'center', fontSize: '13px' }}>
            <span style={{ color: '#6B7280' }}>Déjà un compte ?</span>
            <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', marginLeft: '6px', fontWeight: '600' }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;