import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Phone, MapPin, GraduationCap, Wallet, X, UserPlus, Eye, EyeOff } from 'lucide-react'
import api from '../../api/axios'
import { useOutletContext } from 'react-router-dom'

const CITIES = ['Casablanca','Rabat','Marrakech','Tanger','Agadir','Fès','Meknès','Oujda','Kénitra','Tétouan','Salé','Mohammedia','Nador']
const NIVEAUX = ['Primaire','Collège','Lycée - Tronc Commun','Lycée - 1ère Bac','Lycée - 2ème Bac','CPGE','Université','Adulte / Formation Continue']

export default function RegisterStudent() {
  const navigate = useNavigate()
  const context = useOutletContext()
  const isDark = context?.isDark ?? false

  // --- TON DESIGN SYSTEM (CONSERVÉ À L'IDENTIQUE) ---
  const bg = isDark ? '#0a0a0c' : '#ffffff'
  const bgSurf = isDark ? '#1a1a1c' : '#f7f8fa'
  const bgCard = isDark ? '#1a1a1c' : '#ffffff'
  const bdr = isDark ? 'rgba(255,255,255,0.08)' : '#e9ecef'
  const ink = isDark ? '#ffffff' : '#111111'
  const muted = isDark ? '#a1a4a5' : '#666666'
  const dimmed = isDark ? '#6b7280' : '#aaaaaa'
  const orange = '#e96f2a'

  // --- LOGIQUE D'ÉTAT CLASSIQUE ---
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')       // Erreur globale API
  const [errors, setErrors] = useState({})     // Erreurs de validation (Objet classique)
  const [showCityDrop, setShowCityDrop] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    password_confirmation: '',
    telephone: '',
    ville: '',
    niveau: '',
    budget: '',
  })

  // Fonction HandleChange standard apprise en cours
  function handleChange(e) {
    const name = e.target.name
    const value = e.target.value
    setForm({ ...form, [name]: value })
  }

  function handleCitySelect(city) {
    setForm({ ...form, ville: city })
    setShowCityDrop(false)
  }

  // Filtrage écrit de manière simple et linéaire
  function getFilteredCities() {
    if (form.ville === '') {
      return CITIES
    }
    return CITIES.filter(function(city) {
      return city.toLowerCase().includes(form.ville.toLowerCase())
    })
  }

  // Fonctions de validation académiques (méthode EFM/Projet)
  function validateStep1() {
    let localErrors = {}
    
    if (form.prenom.trim() === '') {
      localErrors.prenom = 'Le prénom est obligatoire.'
    } else if (form.prenom.trim().length < 3) {
      localErrors.prenom = 'Minimum 3 caractères.'
    }

    if (form.nom.trim() === '') {
      localErrors.nom = 'Le nom est obligatoire.'
    } else if (form.nom.trim().length < 3) {
      localErrors.nom = 'Minimum 3 caractères.'
    }

    if (form.email.trim() === '') {
      localErrors.email = 'L\'email est obligatoire.'
    } else if (!form.email.includes('@')) {
      localErrors.email = 'L\'adresse email est invalide.'
    }

    if (form.telephone.trim() === '') {
      localErrors.telephone = 'Le numéro de téléphone est requis.'
    }

    if (form.password === '') {
      localErrors.password = 'Le mot de passe est obligatoire.'
    } else if (form.password.length < 8) {
      localErrors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
    }

    if (form.password_confirmation === '') {
      localErrors.password_confirmation = 'Veuillez confirmer votre mot de passe.'
    } else if (form.password !== form.password_confirmation) {
      localErrors.password_confirmation = 'Les mots de passe ne correspondent pas.'
    }

    if (form.ville === '') {
      localErrors.ville = 'La ville de résidence est requise.'
    }

    return localErrors
  }

  function validateStep2() {
    let localErrors = {}
    if (form.niveau === '') {
      localErrors.niveau = 'Le niveau scolaire est requis.'
    }
    if (form.budget === '') {
      localErrors.budget = 'Le budget est requis.'
    } else if (Number(form.budget) < 0) {
      localErrors.budget = 'Le budget ne peut pas être négatif.'
    }
    return localErrors
  }

  function handleNext() {
    const step1Errors = validateStep1()
    setErrors(step1Errors)
    // Si l'objet d'erreurs est vide, on passe à l'étape suivante
    if (Object.keys(step1Errors).length === 0) {
      setStep(2)
    }
  }

  function handleBack() {
    setStep(1)
  }

  // Soumission finale et traitement classique des erreurs Laravel
  async function handleSubmit(e) {
    e.preventDefault()
    const step2Errors = validateStep2()
    setErrors(step2Errors)
    
    if (Object.keys(step2Errors).length > 0) return

    setLoading(true)
    setError('')

    // Payload structuré clairement
    const dataToSend = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      telephone: form.telephone,
      ville: form.ville,
      role: 'etudiant',
      niveau: form.niveau,
      budget: form.budget,
    }

    try {
      const res = await api.post('/register', dataToSend)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/student')
    } catch (err) {
      // Récupération classique des erreurs de validation globales ou Laravel Back-End
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors)
      } else {
        setError(err.response?.data?.message || 'Une erreur est survenue.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 720 }}>
        <div style={{ background: bgCard, border: `1px solid ${bdr}`, borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: `1px solid ${bdr}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${orange}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserPlus size={20} color={orange} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: ink }}>Rejoindre Learnect en tant qu'Étudiant</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted, marginTop: 2 }}>Soutien scolaire de confiance sur mesure</div>
              </div>
            </div>
            <button type="button" onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dimmed, padding: 4, borderRadius: 8, display: 'flex' }}>
              <X size={20} />
            </button>
          </div>

          {/* Onglets Étapes */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${bdr}` }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: step === 1 ? orange : dimmed, borderBottom: `2px solid ${step === 1 ? orange : 'transparent'}` }}>
              1. Identité &amp; Compte
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: step === 2 ? orange : dimmed, borderBottom: `2px solid ${step === 2 ? orange : 'transparent'}` }}>
              2. Niveau &amp; Budget d'étudiant
            </div>
          </div>

          {/* Formulaire Principal */}
          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
            {error && (
              <div style={{ background: 'rgba(226,75,74,0.06)', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 10, padding: '12px 14px', color: '#e24b4a', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            {/* ÉTAPE 1 : Identité en JSX linéaire standard OFPPT */}
            {step === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                
                {/* Champ Prénom */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Prénom</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.prenom ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                    <User size={16} color={dimmed} style={{ flexShrink: 0 }} />
                    <input type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Votre prénom" style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }} />
                  </div>
                  {errors.prenom && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.prenom}</div>}
                </div>

                {/* Champ Nom */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Nom</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.nom ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                    <User size={16} color={dimmed} style={{ flexShrink: 0 }} />
                    <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Votre nom" style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }} />
                  </div>
                  {errors.nom && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.nom}</div>}
                </div>

                {/* Champ Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Adresse Email</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.email ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                    <Mail size={16} color={dimmed} style={{ flexShrink: 0 }} />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="votre.email@domain.ma" style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }} />
                  </div>
                  {errors.email && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.email}</div>}
                </div>

                {/* Champ Téléphone */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Téléphone portable</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.telephone ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                    <Phone size={16} color={dimmed} style={{ flexShrink: 0 }} />
                    <input type="text" name="telephone" value={form.telephone} onChange={handleChange} placeholder="0600000000" style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }} />
                  </div>
                  {errors.telephone && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.telephone}</div>}
                </div>

                {/* Champ Mot de passe */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Mot de passe</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.password ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                    <Lock size={16} color={dimmed} style={{ flexShrink: 0 }} />
                    <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dimmed, padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      {showPass ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                  {errors.password && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.password}</div>}
                </div>

                {/* Champ Confirmation Mot de passe */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Confirmer le mot de passe</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.password_confirmation ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                    <Lock size={16} color={dimmed} style={{ flexShrink: 0 }} />
                    <input type={showPass2 ? 'text' : 'password'} name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="••••••••" style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }} />
                    <button type="button" onClick={() => setShowPass2(!showPass2)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dimmed, padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      {showPass2 ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                  {errors.password_confirmation && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.password_confirmation}</div>}
                </div>

                {/* Champ Ville avec autocomplétion linéaire */}
                <div style={{ position: 'relative', gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Votre ville de résidence</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.ville ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                    <MapPin size={16} color={dimmed} style={{ flexShrink: 0 }} />
                    <input type="text" name="ville" value={form.ville} onChange={handleChange} onFocus={() => setShowCityDrop(true)} onBlur={() => setTimeout(() => setShowCityDrop(false), 200)} placeholder="Tapez ou choisissez votre ville" style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }} />
                  </div>
                  {errors.ville && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.ville}</div>}
                  
                  {showCityDrop && getFilteredCities().length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, background: bgCard, border: `1px solid ${bdr}`, borderRadius: 10, zIndex: 50, maxHeight: 220, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                      {getFilteredCities().map(city => (
                        <div key={city} onMouseDown={() => handleCitySelect(city)} style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: ink }} onMouseEnter={e => e.currentTarget.style.background = bgSurf} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <MapPin size={14} color={orange} />
                          {city}
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

            {/* ÉTAPE 2 */}
            {step === 2 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Niveau scolaire</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.niveau ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                      <GraduationCap size={16} color={dimmed} style={{ flexShrink: 0 }} />
                      <select name="niveau" value={form.niveau} onChange={handleChange} style={{ background: 'none', border: 'none', outline: 'none', color: form.niveau ? ink : dimmed, fontSize: '0.85rem', width: '100%', cursor: 'pointer', appearance: 'none' }}>
                        <option value="">-- Sélectionner --</option>
                        {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    {errors.niveau && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.niveau}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Budget par heure (MAD)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.budget ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                      <Wallet size={16} color={dimmed} style={{ flexShrink: 0 }} />
                      <input type="number" name="budget" min="0" step="10" value={form.budget} onChange={handleChange} style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }} />
                      <span style={{ color: dimmed, fontSize: '0.75rem', flexShrink: 0 }}>MAD/h</span>
                    </div>
                    {errors.budget && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.budget}</div>}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', background: bgSurf, border: `1px solid ${bdr}`, borderRadius: 12, padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Récapitulatif</div>
                  <div style={{ fontSize: '0.82rem', color: ink, lineHeight: 1.7 }}>
                    <strong>{form.prenom} {form.nom}</strong> — {form.email}<br />
                    {form.ville} · {form.telephone}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button type="button" onClick={handleBack} style={{ background: 'none', color: ink, border: `1px solid ${bdr}`, borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    ← Retour
                  </button>
                  <button type="submit" disabled={loading} style={{ background: orange, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Création...' : 'Créer mon compte'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: muted }}>
          Déjà un compte ? <Link to="/login" style={{ color: orange, fontWeight: 700, textDecoration: 'none' }}>Se connecter</Link>
        </div>
      </div>
    </div>
  )
}