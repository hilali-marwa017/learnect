import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Phone, MapPin, BookOpen, DollarSign, FileText, ArrowRight, ArrowLeft, CheckCircle, Upload, Camera, File, Shield } from 'lucide-react';

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Fès', 'Agadir',
  'Oujda', 'Meknès', 'Kénitra', 'Tétouan', 'Salé', 'Mohammedia', 'Nador'
];

export default function RegisterTeacher() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', ville: 'Casablanca',
    password: '', password_confirmation: '',
    titre: '', diplome: '', tarifHeure: '', langues: '',
    description_profil: '', description_cours: '',
    distance_max: ''
  });

  const [checkboxes, setCheckboxes] = useState({
    cours_enligne: true,
    cours_domicile: false,
    cours_deplacement: false,
    certifie: false
  });

  const [files, setFiles] = useState({
    photo: null,
    cin_recto: null,
    cin_verso: null,
    diplome: null
  });

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const orange = '#e04f00';
  const text = '#07090d';
  const muted = '#718096';
  const border = 'rgba(0,0,0,0.10)';
  const card = '#f8f9fc';

  const inputStyle = {
    width: '100%', padding: '12px 12px 12px 40px',
    background: '#f4f4f6', border: `1px solid ${border}`,
    borderRadius: '10px', color: text, fontSize: '0.85rem',
    outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', fontSize: '0.7rem', fontWeight: 700,
    color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px'
  };

  const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCheckbox = (e) => setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });
  const handleFile = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const validateStep1 = () => {
    if (!form.nom.trim() || !form.prenom.trim() || !form.email.trim() || !form.telephone.trim()) {
      setError('Veuillez remplir tous les champs.'); return false;
    }
    if (!form.email.includes('@')) { setError('Email invalide.'); return false; }
    if (form.password !== form.password_confirmation) { setError('Les mots de passe ne correspondent pas.'); return false; }
    if (form.password.length < 8) { setError('Mot de passe doit contenir au moins 8 caractères.'); return false; }
    if (!form.titre.trim()) { setError('Veuillez saisir un titre.'); return false; }
    if (!form.diplome.trim()) { setError('Veuillez saisir votre diplôme.'); return false; }
    if (!form.tarifHeure || form.tarifHeure < 50) { setError('Tarif minimum 50 DH/h.'); return false; }
    setError(''); return true;
  };

  const validateStep2 = () => {
    if (!files.cin_recto) { setError('CIN recto requis.'); return false; }
    if (!files.cin_verso) { setError('CIN verso requis.'); return false; }
    if (!files.diplome) { setError('Diplôme requis.'); return false; }
    if (!checkboxes.certifie) { setError('Vous devez certifier les informations.'); return false; }
    if (!form.description_profil.trim()) { setError('Description du profil requise.'); return false; }
    if (!form.description_cours.trim()) { setError('Description du cours requise.'); return false; }
    setError(''); return true;
  };

  const handleNext = () => { if (validateStep1()) { setStep(2); window.scrollTo(0, 0); } };
  const handleBack = () => { setStep(1); window.scrollTo(0, 0); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { handleNext(); return; }
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    Object.keys(form).forEach(key => { if (form[key]) formData.append(key, form[key]); });
    formData.append('role', 'enseignant');
    formData.append('cours_enligne', checkboxes.cours_enligne ? '1' : '0');
    formData.append('cours_domicile', checkboxes.cours_domicile ? '1' : '0');
    formData.append('cours_deplacement', checkboxes.cours_deplacement ? '1' : '0');
    formData.append('certifie', checkboxes.certifie ? '1' : '0');
    if (files.photo) formData.append('photo', files.photo);
    formData.append('cin_recto', files.cin_recto);
    formData.append('cin_verso', files.cin_verso);
    formData.append('diplome', files.diplome);

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur inscription');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(true);
    } catch (err) {
      if (err.message.includes('telephone')) setError('Numéro déjà utilisé.');
      else if (err.message.includes('email')) setError('Email déjà utilisé.');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f2' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '64px', height: '64px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle size={32} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dossier envoyé !</h2>
          <p style={{ color: muted, marginBottom: '1.5rem' }}>Votre dossier est en cours de vérification par notre équipe.</p>
          <Link to="/login" style={{ background: orange, color: '#fff', padding: '10px 24px', borderRadius: '40px', textDecoration: 'none', display: 'inline-block' }}>Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '560px', background: '#fff', border: `1px solid ${border}`, borderRadius: '24px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '1.8rem 2rem 1.4rem', borderBottom: `1px solid ${border}` }}>
          <button onClick={() => step === 1 ? navigate('/register') : handleBack()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: muted, fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', padding: 0 }}>
            <ArrowLeft size={15} /> {step === 1 ? 'Retour au choix' : 'Étape précédente'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem' }}>
            <div style={{ width: '36px', height: '36px', background: `${orange}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color={orange} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: text, margin: 0 }}>Inscription Tuteur</h1>
              <p style={{ fontSize: '0.72rem', color: muted, margin: 0 }}>Étape {step} sur 2 — {step === 1 ? 'Identité & Pédagogie' : 'Documents & Vérification'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ flex: 1, height: '3px', borderRadius: '99px', background: step >= s ? orange : '#e2e8f0', transition: 'background 0.3s' }} />
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', borderBottom: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', fontSize: '0.82rem', padding: '10px 2rem' }}>
            <Shield size={14} style={{ display: 'inline', marginRight: '6px' }} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem 2rem' }}>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Prénom</label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={iconStyle} />
                    <input style={inputStyle} type="text" name="prenom" placeholder="Amine" value={form.prenom} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Nom</label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={iconStyle} />
                    <input style={inputStyle} type="text" name="nom" placeholder="Benjelloun" value={form.nom} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={iconStyle} />
                  <input style={inputStyle} type="email" name="email" placeholder="votre@email.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={iconStyle} />
                    <input style={inputStyle} type="tel" name="telephone" placeholder="+212 6XX-XXXXXX" value={form.telephone} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Ville</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} style={iconStyle} />
                    <select name="ville" style={{ ...inputStyle, cursor: 'pointer' }} value={form.ville} onChange={handleChange}>
                      {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Titre de votre annonce</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={14} style={iconStyle} />
                  <input style={inputStyle} type="text" name="titre" placeholder="Ex: Professeur de Mathématiques" value={form.titre} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Diplôme</label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={14} style={iconStyle} />
                    <input style={inputStyle} type="text" name="diplome" placeholder="Ex: Master ENS" value={form.diplome} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Tarif / heure (MAD)</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} style={iconStyle} />
                    <input style={inputStyle} type="number" name="tarifHeure" min="50" placeholder="150" value={form.tarifHeure} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Langues maîtrisées</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={14} style={iconStyle} />
                  <input style={inputStyle} type="text" name="langues" placeholder="Français, Arabe, Anglais" value={form.langues} onChange={handleChange} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Modalités de cours</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: card, borderRadius: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" name="cours_enligne" checked={checkboxes.cours_enligne} onChange={handleCheckbox} /> En ligne
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: card, borderRadius: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" name="cours_domicile" checked={checkboxes.cours_domicile} onChange={handleCheckbox} /> À domicile
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: card, borderRadius: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" name="cours_deplacement" checked={checkboxes.cours_deplacement} onChange={handleCheckbox} /> Déplacement
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Description de votre profil</label>
                <textarea name="description_profil" rows="3" placeholder="Votre parcours et expérience..." value={form.description_profil} onChange={handleChange} style={{ ...inputStyle, padding: '10px', resize: 'none' }} required />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Description de votre cours</label>
                <textarea name="description_cours" rows="3" placeholder="Votre méthode pédagogique..." value={form.description_cours} onChange={handleChange} style={{ ...inputStyle, padding: '10px', resize: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Mot de passe</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} style={iconStyle} />
                    <input style={inputStyle} type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {showPass ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Confirmer</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} style={iconStyle} />
                    <input style={inputStyle} type={showPass2 ? 'text' : 'password'} name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowPass2(!showPass2)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {showPass2 ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" style={{ width: '100%', background: orange, color: '#fff', border: 'none', borderRadius: '40px', padding: '14px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Continuer <ArrowRight size={16} />
              </button>
            </>
          )}

          {/* STEP 2 - Documents */}
          {step === 2 && (
            <>
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <File size={16} color={orange} /> DOCUMENTS REQUIS
                </p>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Photo de profil</label>
                  <input type="file" name="photo" onChange={handleFile} accept="image/*" style={{ width: '100%', padding: '8px', border: `1px solid ${border}`, borderRadius: '8px' }} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ ...labelStyle, fontSize: '0.7rem' }}>CIN Recto</label>
                  <input type="file" name="cin_recto" onChange={handleFile} accept="image/*" required style={{ width: '100%', padding: '8px', border: `1px solid ${border}`, borderRadius: '8px' }} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ ...labelStyle, fontSize: '0.7rem' }}>CIN Verso</label>
                  <input type="file" name="cin_verso" onChange={handleFile} accept="image/*" required style={{ width: '100%', padding: '8px', border: `1px solid ${border}`, borderRadius: '8px' }} />
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Diplôme (PDF)</label>
                  <input type="file" name="diplome" onChange={handleFile} accept=".pdf" required style={{ width: '100%', padding: '8px', border: `1px solid ${border}`, borderRadius: '8px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="certifie" checked={checkboxes.certifie} onChange={handleCheckbox} required />
                  <span style={{ fontSize: '0.85rem' }}>Je certifie que les informations fournies sont exactes et vérifiables</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={handleBack} style={{ flex: 1, background: 'transparent', border: `1px solid ${border}`, borderRadius: '40px', padding: '12px', fontWeight: 600, cursor: 'pointer' }}>Retour</button>
                <button type="submit" disabled={loading} style={{ flex: 2, background: orange, color: '#fff', border: 'none', borderRadius: '40px', padding: '12px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Envoi...' : 'Soumettre mon dossier'}
                </button>
              </div>
            </>
          )}
        </form>

        <hr style={{ margin: '0 2rem', borderColor: border }} />
        <div style={{ textAlign: 'center', padding: '1rem 2rem 1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: muted }}>Déjà un compte ?</span>
          <Link to="/login" style={{ color: orange, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', marginLeft: '4px' }}>Se connecter</Link>
        </div>
      </div>
    </div>
  );
}