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
              ✓
            </div>
            <h3 className="fw-bold mb-2">Dossier envoyé</h3>
            <p className="text-muted small">Votre dossier est en cours de vérification</p>
          </div>
          <div className="bg-light p-3 mb-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-success">✓</span>
              <span className="small">CIN recto et verso vérifiés</span>
            </div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-success">✓</span>
              <span className="small">Diplôme authentifié</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-warning">⏰</span>
              <span className="small">Validation sous 24h</span>
            </div>
          </div>
          <Link to="/login" className="btn btn-primary w-100 py-2">Se connecter</Link>
          <Link to="/" className="btn btn-link text-muted mt-2 w-100 text-decoration-none small">Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      
      <div style={{ maxWidth: '500px', width: '100%', marginBottom: '16px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#6c757d',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px 0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          ← Retour
        </button>
      </div>

      <div style={{ maxWidth: '500px', width: '100%', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '24px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ 
              display: 'inline-block',
              backgroundColor: '#0d6efd',
              color: 'white',
              borderRadius: '8px',
              padding: '8px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>🎓</span>
            </div>

            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(108,117,125,0.1)',
              color: '#6c757d',
              borderRadius: '20px',
              padding: '4px 12px',
              marginBottom: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {role === 'enseignant' ? 'Enseignant' : 'Étudiant'}
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
              {role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}
            </h2>
            <p style={{ color: '#6c757d', fontSize: '12px', margin: 0 }}>
              {role === 'enseignant' ? 'Partagez vos connaissances' : 'Trouvez votre professeur'}
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '8px 12px', borderRadius: '4px', marginBottom: '16px', fontSize: '12px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Photo de profil</label>
              <input type="file" name="photo" accept="image/jpeg,image/png,image/jpg" onChange={handleFile} style={{ width: '100%', padding: '6px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px' }} />
              <small style={{ color: '#6c757d', fontSize: '10px' }}>Optionnel - JPG/PNG (max 2MB)</small>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Nom</label>
                <input type="text" name="nom" style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px' }} value={form.nom} onChange={handleChange} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Prénom</label>
                <input type="text" name="prenom" style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px' }} value={form.prenom} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Email</label>
              <input type="email" name="email" style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px' }} value={form.email} onChange={handleChange} required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Téléphone</label>
              <input type="tel" name="telephone" style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px' }} value={form.telephone} onChange={handleChange} required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Ville</label>
              <input 
                type="text" 
                name="ville" 
                list="villes-list"
                style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px' }} 
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
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Niveau d'étude</label>
                  <select name="niveau" style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px' }} value={form.niveau} onChange={handleChange}>
                    <option value="">Sélectionner votre niveau</option>
                    {niveauxEtudes.map((niveau, index) => (
                      <option key={index} value={niveau}>{niveau}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Budget (DH/h)</label>
                  <input type="number" name="budget" style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px' }} placeholder="Ex: 100" min="0" value={form.budget} onChange={handleChange} />
                </div>
              </>
            )}

            {role === 'enseignant' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Matière</label>
                  <input 
                    type="text" 
                    name="matiere" 
                    list="matieres-list"
                    style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px' }} 
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
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Tarif (DH/h)</label>
                  <input type="number" name="tarifHeure" style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px' }} min="50" placeholder="Minimum 50 DH" value={form.tarifHeure} onChange={handleChange} required />
                </div>

                <div style={{ border: '1px solid #dee2e6', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ color: '#0d6efd' }}>📄</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0d6efd' }}>Documents requis</span>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>CIN Recto</label>
                    <input type="file" name="cin_recto" accept="image/jpeg,image/png,image/jpg" onChange={handleFile} style={{ width: '100%', padding: '4px', fontSize: '14px' }} required />
                    <small style={{ color: '#6c757d', fontSize: '10px' }}>JPG/PNG (max 2MB)</small>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>CIN Verso</label>
                    <input type="file" name="cin_verso" accept="image/jpeg,image/png,image/jpg" onChange={handleFile} style={{ width: '100%', padding: '4px', fontSize: '14px' }} required />
                    <small style={{ color: '#6c757d', fontSize: '10px' }}>JPG/PNG (max 2MB)</small>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Diplôme</label>
                    <input type="file" name="diplome" accept=".pdf" onChange={handleFile} style={{ width: '100%', padding: '4px', fontSize: '14px' }} required />
                    <small style={{ color: '#6c757d', fontSize: '10px' }}>PDF (max 5MB)</small>
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Mot de passe</label>
                <div style={{ display: 'flex' }}>
                  <input type={showPass ? 'text' : 'password'} name="password" style={{ flex: 1, padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px 0 0 4px' }} value={form.password} onChange={handleChange} required />
                  <button type="button" style={{ padding: '8px 12px', border: '1px solid #ced4da', borderLeft: 'none', borderRadius: '0 4px 4px 0', backgroundColor: 'white' }} onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                <small style={{ color: '#6c757d', fontSize: '10px' }}>Minimum 8 caractères</small>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', display: 'block' }}>Confirmer</label>
                <div style={{ display: 'flex' }}>
                  <input type={showPass2 ? 'text' : 'password'} name="password_confirmation" style={{ flex: 1, padding: '8px', fontSize: '14px', border: '1px solid #ced4da', borderRadius: '4px 0 0 4px' }} value={form.password_confirmation} onChange={handleChange} required />
                  <button type="button" style={{ padding: '8px 12px', border: '1px solid #ced4da', borderLeft: 'none', borderRadius: '0 4px 4px 0', backgroundColor: 'white' }} onClick={() => setShowPass2(!showPass2)}>
                    {showPass2 ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }} disabled={loading}>
              {loading ? '⏳ Envoi...' : (role === 'enseignant' ? '📤 Soumettre ma candidature' : '➕ Créer mon compte')}
            </button>
          </form>

          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #dee2e6' }} />

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6c757d' }}>Déjà un compte ? </span>
            <Link to="/login" style={{ color: '#0d6efd', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}>
              Se connecter
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;