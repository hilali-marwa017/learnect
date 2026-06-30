import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('etudiant');
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    password: '', password_confirmation: '', ville: '',
    niveau: '', budget: ''
  });
  const [files, setFiles] = useState({ photo: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

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

    const data = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== '' && form[key] !== null) data.append(key, form[key]);
    });
    data.append('role', role);
    if (files.photo) data.append('photo', files.photo);

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
        navigate('/student/dashboard');
      })
      .catch(err => {
        const msg = err.message || '';
        if (msg.includes('telephone')) setError('Numéro déjà utilisé.');
        else if (msg.includes('email')) setError('Email déjà utilisé.');
        else setError(msg);
      })
      .finally(() => setLoading(false));
  };

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

  const niveaux = [
    'Préscolaire', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème primaire', 'Tronc Commun', '1ère année collège',
    '2ème année collège', '3ème année collège', 'Baccalauréat',
    'Licence 1', 'Licence 2', 'Licence 3', 'Master 1',
    'Master 2', 'Doctorat', 'BTS', 'DUT'
  ];

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
            <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>Créer un compte</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Rejoignez la communauté Learnect</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', borderLeft: '2px solid #ef4444', padding: '10px 14px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#e63a3a' }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>TYPE DE COMPTE</label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="role" value="etudiant" checked={role === 'etudiant'} onChange={(e) => setRole(e.target.value)} style={{ width: '18px', height: '18px', accentColor: '#0d6efd' }} />
                  <span><i className="bi bi-mortarboard me-1"></i>Étudiant</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="role" value="enseignant" checked={role === 'enseignant'} onChange={(e) => setRole(e.target.value)} style={{ width: '18px', height: '18px', accentColor: '#0d6efd' }} />
                  <span><i className="bi bi-briefcase me-1"></i>Enseignant</span>
                </label>
              </div>
            </div>

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
                <input type="text" name="ville" value={form.ville} onChange={handleChange} placeholder="Votre ville" style={inputStyle} required />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>NIVEAU D'ÉTUDE</label>
              <select name="niveau" value={form.niveau} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', background: '#f8fafc' }}>
                <option value="">Sélectionnez</option>
                {niveaux.map((n, i) => <option key={i} value={n}>{n}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>BUDGET (DH/h)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}><i className="bi bi-cash"></i></span>
                <input type="number" name="budget" value={form.budget} onChange={handleChange} min="0" style={inputStyle} />
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

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <><span className="spinner-border spinner-border-sm"></span> Envoi...</> : <><i className="bi bi-person-plus me-2"></i>Créer mon compte</>}
            </button>

            {role === 'enseignant' && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  <i className="bi bi-info-circle me-1"></i>
                  Vous serez redirigé vers un formulaire complémentaire pour finaliser votre profil enseignant
                </p>
              </div>
            )}
          </form>

          <hr style={{ margin: '20px 0' }} />
          <div style={{ textAlign: 'center' }}><span style={{ color: '#666' }}>Déjà un compte ? </span><Link to="/login" style={{ color: '#0d6efd', textDecoration: 'none', fontWeight: '600' }}>Se connecter</Link></div>
        </div>
      </div>
    </div>
  );
}

export default Register;