import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  GraduationCap, User, Mail, Lock, Phone, MapPin, BookOpen, 
  DollarSign, FileText, ArrowRight, ArrowLeft, CheckCircle, 
  Upload, Camera, File, Shield, Eye, EyeOff, X, Search
} from 'lucide-react';

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Fès', 'Agadir',
  'Oujda', 'Meknès', 'Kénitra', 'Tétouan', 'Salé', 'Mohammedia', 'Nador'
];

export default function RegisterTeacher() {
  const navigate = useNavigate();
  const context = useOutletContext();
  const isDark = context?.isDark || false;
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', ville: '',
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

  // Couleurs dynamiques selon le thème
  const orange = '#e04f00';
  const bgPage = isDark ? '#0a0a0c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)';
  const card = isDark ? '#1a1a1c' : '#f8f9fc';
  const bgInput = isDark ? '#1a1a1c' : '#ffffff';
  const iconColor = isDark ? '#6b7280' : '#9ca3af';
  const placeholderColor = isDark ? '#6b7280' : '#9ca3af';
  const dropBg = isDark ? '#1a1a1c' : '#ffffff';
  const dropHover = isDark ? '#2a2a2a' : '#f5f5f5';

  const inputStyle = {
    width: '100%', padding: '14px 14px 14px 42px',
    background: bgInput, border: `1px solid ${border}`,
    borderRadius: '10px', color: text, fontSize: '0.85rem',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block', fontSize: '0.7rem', fontWeight: 700,
    color: iconColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px'
  };

  const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: iconColor };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCheckbox = (e) => setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });
  const handleFile = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleCitySelect = (city) => {
    setForm({ ...form, ville: city });
    setShowCityDrop(false);
  };

  const getFilteredCities = () => {
    if (!form.ville) return MOROCCAN_CITIES.slice(0, 8);
    return MOROCCAN_CITIES.filter(c => c.toLowerCase().includes(form.ville.toLowerCase())).slice(0, 8);
  };

  const validateStep1 = () => {
    if (!form.prenom.trim()) { setError('Prénom requis.'); return false; }
    if (!form.nom.trim()) { setError('Nom requis.'); return false; }
    if (!form.email.trim()) { setError('Email requis.'); return false; }
    if (!form.email.includes('@')) { setError('Email invalide.'); return false; }
    if (!form.telephone.trim()) { setError('Téléphone requis.'); return false; }
    if (!form.ville.trim()) { setError('Ville requise.'); return false; }
    if (!form.password) { setError('Mot de passe requis.'); return false; }
    if (form.password !== form.password_confirmation) { setError('Les mots de passe ne correspondent pas.'); return false; }
    if (form.password.length < 8) { setError('Mot de passe doit contenir au moins 8 caractères.'); return false; }
    if (!form.titre.trim()) { setError('Titre requis.'); return false; }
    if (!form.diplome.trim()) { setError('Diplôme requis.'); return false; }
    if (!form.tarifHeure || form.tarifHeure < 50) { setError('Tarif minimum 50 DH/h.'); return false; }
    setError(''); return true;
  };

  const handleNext = () => { 
    if (validateStep1()) { 
      setStep(2); 
      window.scrollTo(0, 0); 
    } 
  };

  const handleBack = () => { 
    setStep(1); 
    window.scrollTo(0, 0); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { 
      handleNext(); 
      return; 
    }
    if (!files.cin_recto) { setError('CIN recto requis.'); return; }
    if (!files.cin_verso) { setError('CIN verso requis.'); return; }
    if (!files.diplome) { setError('Diplôme requis.'); return; }
    if (!checkboxes.certifie) { setError('Vous devez certifier les informations.'); return; }

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
        <div style={{ background: bgPage, borderRadius: '24px', padding: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '64px', height: '64px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle size={32} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: text }}>Dossier envoyé !</h2>
          <p style={{ color: muted, marginBottom: '1.5rem' }}>Votre dossier est en cours de vérification par notre équipe.</p>
          <Link to="/login" style={{ background: orange, color: '#fff', padding: '10px 24px', borderRadius: '40px', textDecoration: 'none', display: 'inline-block' }}>Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bgPage, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '560px', background: bgPage, borderRadius: '24px', overflow: 'hidden', border: `1px solid ${border}` }}>

        {/* Header avec X pour revenir à l'accueil */}
        <div style={{ padding: '1.5rem 2rem 0.5rem 2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '8px', color: iconColor }}
            title="Retour à l'accueil"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0 2rem 2rem 2rem' }}>
          {/* Header content */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', background: `${orange}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} color={orange} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: text, margin: 0 }}>Inscription Tuteur</h1>
                <p style={{ fontSize: '0.72rem', color: muted, margin: 0 }}>Étape {step} sur 2 — {step === 1 ? 'Identité & Pédagogie' : 'Documents & Vérification'}</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }}>
              {[1, 2].map(s => (
                <div key={s} style={{ flex: 1, height: '3px', borderRadius: '99px', background: step >= s ? orange : (isDark ? '#333' : '#e2e8f0'), transition: 'background 0.3s' }} />
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.08)', border: `1px solid rgba(220,38,38,0.2)`, borderRadius: '10px', color: '#dc2626', fontSize: '0.82rem', padding: '10px 16px', marginBottom: '1rem' }}>
              <Shield size={14} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                {/* 2 colonnes: Prénom + Nom */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>PRÉNOM</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={iconStyle} />
                      <input style={inputStyle} type="text" name="prenom" placeholder="Ex: Amine" value={form.prenom} onChange={handleChange} required />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>NOM</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={iconStyle} />
                      <input style={inputStyle} type="text" name="nom" placeholder="Ex: Benjelloun" value={form.nom} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>ADRESSE EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={iconStyle} />
                    <input style={inputStyle} type="email" name="email" placeholder="votre.email@domain.ma" value={form.email} onChange={handleChange} required />
                  </div>
                </div>

                {/* Téléphone + Ville avec dropdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>TÉLÉPHONE PORTABLE</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={iconStyle} />
                      <input style={inputStyle} type="tel" name="telephone" placeholder="Ex: +212 661-234567" value={form.telephone} onChange={handleChange} required />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>VILLE PRINCIPALE D'ENSEIGNEMENT</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={iconStyle} />
                      <input 
                        value={form.ville}
                        onChange={(e) => setForm({ ...form, ville: e.target.value })}
                        onFocus={() => setShowCityDrop(true)}
                        onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
                        placeholder="Sélectionnez votre ville"
                        style={{ ...inputStyle, cursor: 'text' }}
                      />
                      {showCityDrop && getFilteredCities().length > 0 && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '100%', 
                          left: 0, 
                          right: 0, 
                          marginTop: '8px', 
                          background: dropBg, 
                          border: `1px solid ${border}`, 
                          borderRadius: '12px', 
                          zIndex: 200, 
                          maxHeight: '250px', 
                          overflowY: 'auto', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                          {getFilteredCities().map((city, i) => (
                            <div 
                              key={i} 
                              onMouseDown={() => handleCitySelect(city)} 
                              style={{ 
                                padding: '10px 16px', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                color: text, 
                                fontSize: '0.85rem',
                                transition: 'background 0.1s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = dropHover}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <MapPin size={14} color={orange} /> {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2 colonnes: Mot de passe + Confirmation */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>MOT DE PASSE</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={iconStyle} />
                      <input style={inputStyle} type={showPass ? 'text' : 'password'} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: iconColor }}>
                        {showPass ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>CONFIRMER</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={iconStyle} />
                      <input style={inputStyle} type={showPass2 ? 'text' : 'password'} name="password_confirmation" placeholder="••••••••" value={form.password_confirmation} onChange={handleChange} required />
                      <button type="button" onClick={() => setShowPass2(!showPass2)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: iconColor }}>
                        {showPass2 ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>TITRE DE VOTRE ANNONCE</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} style={iconStyle} />
                    <input style={inputStyle} type="text" name="titre" placeholder="Ex: Professeur de Mathématiques - CPGE" value={form.titre} onChange={handleChange} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>DIPLÔME</label>
                    <div style={{ position: 'relative' }}>
                      <GraduationCap size={16} style={iconStyle} />
                      <input style={inputStyle} type="text" name="diplome" placeholder="Ex: Master ENS" value={form.diplome} onChange={handleChange} required />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>TARIF / HEURE (MAD)</label>
                    <div style={{ position: 'relative' }}>
                      <DollarSign size={16} style={iconStyle} />
                      <input style={inputStyle} type="number" name="tarifHeure" min="50" placeholder="150" value={form.tarifHeure} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>LANGUES MAÎTRISÉES</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} style={iconStyle} />
                    <input style={inputStyle} type="text" name="langues" placeholder="Français, Arabe, Anglais" value={form.langues} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>MODALITÉS DE COURS</label>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: card, border: `1px solid ${border}`, borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', color: text }}>
                      <input type="checkbox" name="cours_enligne" checked={checkboxes.cours_enligne} onChange={handleCheckbox} /> En ligne
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: card, border: `1px solid ${border}`, borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', color: text }}>
                      <input type="checkbox" name="cours_domicile" checked={checkboxes.cours_domicile} onChange={handleCheckbox} /> À domicile
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: card, border: `1px solid ${border}`, borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', color: text }}>
                      <input type="checkbox" name="cours_deplacement" checked={checkboxes.cours_deplacement} onChange={handleCheckbox} /> Déplacement
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>DESCRIPTION DE VOTRE PROFIL</label>
                  <textarea name="description_profil" rows="3" placeholder="Présentez votre parcours, votre expérience et votre passion pour l'enseignement..." value={form.description_profil} onChange={handleChange} style={{ ...inputStyle, padding: '12px', resize: 'none', color: text }} required />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>DESCRIPTION DE VOTRE COURS</label>
                  <textarea name="description_cours" rows="3" placeholder="Décrivez votre méthode pédagogique, les matières enseignées, et comment vous aidez vos élèves à progresser..." value={form.description_cours} onChange={handleChange} style={{ ...inputStyle, padding: '12px', resize: 'none', color: text }} />
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
                  <p style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', color: text }}>
                    <File size={16} color={orange} /> DOCUMENTS REQUIS
                  </p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>PHOTO DE PROFIL</label>
                    <div style={{ position: 'relative' }}>
                      <Camera size={16} style={iconStyle} />
                      <input type="file" name="photo" onChange={handleFile} accept="image/*" style={{ ...inputStyle, paddingLeft: '42px', paddingTop: '10px', paddingBottom: '10px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>CIN RECTO</label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={16} style={iconStyle} />
                      <input type="file" name="cin_recto" onChange={handleFile} accept="image/*" required style={{ ...inputStyle, paddingLeft: '42px', paddingTop: '10px', paddingBottom: '10px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>CIN VERSO</label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={16} style={iconStyle} />
                      <input type="file" name="cin_verso" onChange={handleFile} accept="image/*" required style={{ ...inputStyle, paddingLeft: '42px', paddingTop: '10px', paddingBottom: '10px' }} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>DIPLÔME (PDF)</label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={16} style={iconStyle} />
                      <input type="file" name="diplome" onChange={handleFile} accept=".pdf" required style={{ ...inputStyle, paddingLeft: '42px', paddingTop: '10px', paddingBottom: '10px' }} />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: text }}>
                    <input type="checkbox" name="certifie" checked={checkboxes.certifie} onChange={handleCheckbox} required />
                    <span style={{ fontSize: '0.85rem' }}>Je certifie que les informations fournies sont exactes et vérifiables</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={handleBack} style={{ flex: 1, background: 'transparent', border: `1px solid ${border}`, borderRadius: '40px', padding: '12px', fontWeight: 600, cursor: 'pointer', color: text }}>Retour</button>
                  <button type="submit" disabled={loading} style={{ flex: 2, background: orange, color: '#fff', border: 'none', borderRadius: '40px', padding: '12px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Envoi...' : 'Soumettre mon dossier'}
                  </button>
                </div>
              </>
            )}
          </form>

          <hr style={{ margin: '1.5rem 0 1rem', borderColor: border }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: muted }}>Déjà un compte ?</span>
            <Link to="/login" style={{ color: orange, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', marginLeft: '4px' }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}