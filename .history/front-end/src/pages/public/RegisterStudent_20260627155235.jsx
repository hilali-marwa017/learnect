import { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, GraduationCap, Wallet, X, UserPlus, Eye, EyeOff } from 'lucide-react';
import api from '../../api/axios';

// liste des villes par defaut 
const CITIES = ['Casablanca','Rabat','Marrakech','Tanger','Agadir','Fes','Meknes','Oujda','Kenitra','Tetouan','Sale','Mohammedia','Nador'];

// liste des niveaux scolaires
const NIVEAUX = ['Primaire','College','Lycee - Tronc Commun','Lycee - 1ere Bac','Lycee - 2eme Bac','CPGE','Universite','Adulte / Formation Continue'];

// composant champ de saisie reutilisable
function Field({ label, icon: Icon, name, type, placeholder, value, onChange, error, showToggle, onToggle, showPass, isDark }) {
  const bgSurf = isDark ? '#1a1a1c' : '#f7f8fa';
  const bdr = isDark ? '#ffffff14' : '#e9ecef';
  const ink = isDark ? '#ffffff' : '#111111';
  const muted = isDark ? '#a1a4a5' : '#666666';
  const dimmed = isDark ? '#6b7280' : '#aaaaaa';

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: '1px solid ' + (error ? '#e24b4a' : bdr), borderRadius: 10, padding: '12px 14px' }}>
        <Icon size={16} color={dimmed} style={{ flexShrink: 0 }} />
        <input
          type={showToggle ? (showPass ? 'text' : 'password') : (type || 'text')}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }}/>
        {showToggle && (
          <button type="button" onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dimmed, padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {showPass ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
      </div>
      {error && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{error}</div>}
    </div>
  );
}

export default function RegisterStudent() {
  const navigate = useNavigate();
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  // couleurs
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const bgSurf = isDark ? '#1a1a1c' : '#f7f8fa';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const bdr = isDark ? 'rgba(255,255,255,0.08)' : '#e9ecef';
  const ink = isDark ? '#ffffff' : '#111111';
  const muted  = isDark ? '#a1a4a5' : '#666666';
  const dimmed = isDark ? '#6b7280' : '#aaaaaa';
  const orange = '#e96f2a';

  // etats formulaire multi-etapes
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [villes, setVilles] = useState(CITIES);

  // donnees du formulaire
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', password: '', password_confirmation: '',
    telephone: '', ville: '', niveau: '', budget: '',
  });

  // charger les villes depuis l'api
  useEffect(() => {
    api.get('/villes')
      .then(res => {
        const noms = res.data.map(v => v.nom || v).filter(Boolean); // Supprimer les valeurs vides null undef...
        if (noms.length > 0) setVilles(noms);
      })
      .catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleCitySelect(city) {
    setForm({ ...form, ville: city });
    setShowCityDrop(false);
  }

  function getFilteredCities() {
    if (!form.ville) return villes;
    return villes.filter(c => c.toLowerCase().includes(form.ville.toLowerCase()));
  }

  // validation etape 1
  function validateStep1() {
    const newErrors = {};
    if (form.prenom.trim().length < 3) newErrors.prenom = 'Minimum 3 caracteres';
    if (form.nom.trim().length < 3) newErrors.nom  = 'Minimum 3 caracteres';
    if (!form.email.includes('@')) newErrors.email  = 'Email invalide';
    if (form.password.length < 8)  newErrors.password = 'Minimum 8 caracteres';
    if (form.password !== form.password_confirmation) newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    if (!form.telephone.trim()) newErrors.telephone = 'Telephone requis';
    if (!form.ville)  newErrors.ville = 'Ville requise';
    return newErrors;
  }

  // validation etape 2
  function validateStep2() {
    const newErrors = {};
    if (!form.niveau) newErrors.niveau = 'Niveau requis';
    if (!form.budget || Number(form.budget) < 0) newErrors.budget = 'Budget invalide';
    return newErrors;
  }

  function handleNext() {
    const v = validateStep1();
    setErrors(v);
    if (Object.keys(v).length === 0) setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  // soumission finale
  async function handleSubmit(e) {
    e.preventDefault();
    const v = validateStep2();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    setError('');
    try {
      const data = {
        nom: form.nom, prenom: form.prenom, email: form.email,
        password: form.password, password_confirmation: form.password_confirmation,
        telephone: form.telephone, ville: form.ville,
        role: 'etudiant', niveau: form.niveau, budget: form.budget,
      };
      const res = await api.post('/register', data);
      // sauvegarder token et user dans localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue, veuillez reessayer.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 720 }}>
        <div style={{ background: bgCard, border: '1px solid ' + bdr, borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid ' + bdr }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: orange + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserPlus size={20} color={orange} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: ink }}>Rejoindre Learnect en tant qu'Etudiant</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted, marginTop: 2 }}>Soutien scolaire de confiance sur mesure</div>
              </div>
            </div>
            <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dimmed, padding: 4, borderRadius: 8, display: 'flex' }}>
              <X size={20} />
            </button>
          </div>

          {/* Onglets etapes */}
          <div style={{ display: 'flex', borderBottom: '1px solid ' + bdr }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: step === 1 ? orange : dimmed, borderBottom: '2px solid ' + (step === 1 ? orange : 'transparent') }}>
              1. Identite et Compte
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: step === 2 ? orange : dimmed, borderBottom: '2px solid ' + (step === 2 ? orange : 'transparent') }}>
              2. Niveau et Budget
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>

            {/* erreur globale */}
            {error && (
              <div style={{ background: '#e24b4a0f06)', border: '1px solid #e24b4a33', borderRadius: 10, padding: '12px 14px', color: '#e24b4a', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            {/* etape 1*/}
            {step === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <Field label="Prenom" icon={User} name="prenom" value={form.prenom} onChange={handleChange} error={errors.prenom} isDark={isDark} />
                <Field label="Nom" icon={User} name="nom" value={form.nom} onChange={handleChange} error={errors.nom} isDark={isDark} />
                <Field label="Adresse Email" icon={Mail} name="email" type="email" placeholder="votre.email@domain.ma" value={form.email} onChange={handleChange} error={errors.email} isDark={isDark} />
                <Field label="Telephone portable" icon={Phone} name="telephone" value={form.telephone} onChange={handleChange} error={errors.telephone} isDark={isDark} />
                <Field label="Mot de passe" icon={Lock} name="password" value={form.password} onChange={handleChange} error={errors.password} showToggle={true} showPass={showPass} onToggle={() => setShowPass(p => !p)} isDark={isDark} />
                <Field label="Confirmer le mot de passe" icon={Lock} name="password_confirmation" value={form.password_confirmation} onChange={handleChange} error={errors.password_confirmation} showToggle={true} showPass={showPass2} onToggle={() => setShowPass2(p => !p)} isDark={isDark} />

                {/* ville */}
                <div style={{ position: 'relative', gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
                    Votre ville de residence
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: '1px solid ' + (errors.ville ? '#e24b4a' : bdr), borderRadius: 10, padding: '12px 14px' }}>
                    <MapPin size={16} color={dimmed} style={{ flexShrink: 0 }} />
                    <input
                      type="text"
                      name="ville"
                      value={form.ville}
                      onChange={handleChange}
                      onFocus={() => setShowCityDrop(true)}
                      onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
                      placeholder="Tapez ou choisissez votre ville"
                      style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }}
                    />
                  </div>
                  {errors.ville && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.ville}</div>}

                  {/* Dropdown villes */}
                  {showCityDrop && getFilteredCities().length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, background: bgCard, border: '1px solid ' + bdr, borderRadius: 10, zIndex: 50, maxHeight: 220, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                      {getFilteredCities().map(city => (
                        <div key={city} onMouseDown={() => handleCitySelect(city)} style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: ink }}
                          onMouseEnter={e => e.currentTarget.style.background = bgSurf}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <MapPin size={14} color={orange} /> {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="button" onClick={handleNext} style={{ background: ink, color: bg, border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {/* ── Etape 2 : niveau et budget ── */}
            {step === 2 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                  {/* Niveau scolaire */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Niveau scolaire</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: '1px solid ' + (errors.niveau ? '#e24b4a' : bdr), borderRadius: 10, padding: '12px 14px' }}>
                      <GraduationCap size={16} color={dimmed} style={{ flexShrink: 0 }} />
                      <select name="niveau" value={form.niveau} onChange={handleChange} style={{ background: 'none', border: 'none', outline: 'none', color: form.niveau ? ink : dimmed, fontSize: '0.85rem', width: '100%', cursor: 'pointer', appearance: 'none' }}>
                        <option value="">-- Selectionner --</option>
                        {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    {errors.niveau && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.niveau}</div>}
                  </div>

                  {/* Budget par heure */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Budget par heure (MAD)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: '1px solid ' + (errors.budget ? '#e24b4a' : bdr), borderRadius: 10, padding: '12px 14px' }}>
                      <Wallet size={16} color={dimmed} style={{ flexShrink: 0 }} />
                      <input type="number" name="budget" min="0" step="10" value={form.budget} onChange={handleChange} style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }} />
                      <span style={{ color: dimmed, fontSize: '0.75rem', flexShrink: 0 }}>MAD/h</span>
                    </div>
                    {errors.budget && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.budget}</div>}
                  </div>
                </div>

                {/* Recapitulatif */}
                <div style={{ marginTop: '1.5rem', background: bgSurf, border: '1px solid ' + bdr, borderRadius: 12, padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Recapitulatif</div>
                  <div style={{ fontSize: '0.82rem', color: ink, lineHeight: 1.7 }}>
                    <strong>{form.prenom} {form.nom}</strong> — {form.email}<br />
                    {form.ville} · {form.telephone}
                  </div>
                </div>

                {/* Boutons navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button type="button" onClick={handleBack} style={{ background: 'none', color: ink, border: '1px solid ' + bdr, borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    Retour
                  </button>
                  <button type="submit" disabled={loading} style={{ background: orange, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Creation...' : 'Creer mon compte'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: muted }}>
          Deja un compte ? <Link to="/login" style={{ color: orange, fontWeight: 700, textDecoration: 'none' }}>Se connecter</Link>
        </div>
      </div>
    </div>
  );
}