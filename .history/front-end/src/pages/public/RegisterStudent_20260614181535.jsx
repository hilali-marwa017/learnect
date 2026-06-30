import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Phone, MapPin, GraduationCap, Wallet, X, UserPlus } from 'lucide-react'
import api from '../../api/axios'

const CITIES = ['Casablanca','Rabat','Marrakech','Tanger','Agadir','Fès','Meknès','Oujda','Kénitra','Tétouan','Salé','Mohammedia','Nador']
const NIVEAUX = ['Primaire','Collège','Lycée - Tronc Commun','Lycée - 1ère Bac','Lycée - 2ème Bac','CPGE','Université','Adulte / Formation Continue']

// ── Theme tokens (light par défaut) ─────────────────────────────
const bg     = '#ffffff'
const bgSurf = '#f7f8fa'
const bgCard = '#ffffff'
const bdr    = '#e9ecef'
const ink    = '#111111'
const muted  = '#666666'
const dimmed = '#aaaaaa'
const orange = '#e96f2a'

// ── Field component (défini HORS du composant parent !) ─────────
function Field({ label, icon: Icon, name, type = 'text', placeholder, value, onChange, error }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: bgSurf,
        border: `1px solid ${error ? '#e24b4a' : bdr}`,
        borderRadius: 10, padding: '12px 14px',
        transition: 'border-color .15s',
      }}>
        <Icon size={16} color={dimmed} style={{ flexShrink: 0 }} />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }}
        />
      </div>
      {error && (
        <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{error}</div>
      )}
    </div>
  )
}

export default function RegisterStudent() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [showCityDrop, setShowCityDrop] = useState(false)

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

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  function handleCitySelect(city) {
    setForm(prev => ({ ...prev, ville: city }))
    if (errors.ville) setErrors(prev => ({ ...prev, ville: null }))
    setShowCityDrop(false)
  }

  function getFilteredCities() {
    if (!form.ville) return CITIES.slice(0, 8)
    return CITIES.filter(c => c.toLowerCase().includes(form.ville.toLowerCase())).slice(0, 8)
  }

  function validateStep1() {
    const newErrors = {}
    if (form.prenom.trim().length < 3) newErrors.prenom = 'Minimum 3 caractères'
    if (form.nom.trim().length < 3) newErrors.nom = 'Minimum 3 caractères'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Email invalide'
    if (form.password.length < 8) newErrors.password = 'Minimum 8 caractères'
    if (form.password !== form.password_confirmation) newErrors.password_confirmation = 'Les mots de passe ne correspondent pas'
    if (!form.telephone.trim()) newErrors.telephone = 'Téléphone requis'
    if (!form.ville.trim()) newErrors.ville = 'Ville requise'
    return newErrors
  }

  function validateStep2() {
    const newErrors = {}
    if (!form.niveau) newErrors.niveau = 'Niveau requis'
    if (!form.budget || Number(form.budget) < 0) newErrors.budget = 'Budget invalide'
    return newErrors
  }

  function handleNext() {
    const v = validateStep1()
    setErrors(v)
    if (Object.keys(v).length === 0) setStep(2)
  }

  function handleBack() {
    setStep(1)
  }

  // ── Submit (méthode DAIF) ────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    const v = validateStep2()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setLoading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('nom', form.nom)
      fd.append('prenom', form.prenom)
      fd.append('email', form.email)
      fd.append('password', form.password)
      fd.append('password_confirmation', form.password_confirmation)
      fd.append('telephone', form.telephone)
      fd.append('ville', form.ville)
      fd.append('role', 'etudiant')
      fd.append('niveau', form.niveau)
      fd.append('budget', form.budget)

      const res = await api.post('/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/student')
    } catch (err) {
      const resp = err.response?.data
      if (resp?.errors) {
        const flat = {}
        Object.keys(resp.errors).forEach(k => { flat[k] = resp.errors[k][0] })
        setErrors(flat)
        if (['nom','prenom','email','password','telephone','ville'].some(k => flat[k])) {
          setStep(1)
        }
      } else {
        setError(resp?.message || 'Une erreur est survenue, veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 720 }}>

        <div style={{ background: bgCard, border: `1px solid ${bdr}`, borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

          {/* ── Card Header ──────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: `1px solid ${bdr}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${orange}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserPlus size={20} color={orange} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: ink }}>
                  Rejoindre Learnect en tant qu'Étudiant
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted, marginTop: 2 }}>
                  Soutien scolaire de confiance sur mesure
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dimmed, padding: 4, borderRadius: 8, display: 'flex' }}>
              <X size={20} />
            </button>
          </div>

          {/* ── Steps tabs ───────────────────────────────────── */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${bdr}` }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: step === 1 ? orange : dimmed, borderBottom: `2px solid ${step === 1 ? orange : 'transparent'}`, transition: 'all .2s' }}>
              1. Identité &amp; Compte
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: step === 2 ? orange : dimmed, borderBottom: `2px solid ${step === 2 ? orange : 'transparent'}`, transition: 'all .2s' }}>
              2. Niveau &amp; Budget d'étudiant
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>

            {error && (
              <div style={{ background: 'rgba(226,75,74,0.06)', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 10, padding: '12px 14px', color: '#e24b4a', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            {/* ── STEP 1 ───────────────────────────────────── */}
            {step === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <Field label="Prénom" icon={User} name="prenom" placeholder="Ex: Amine" value={form.prenom} onChange={handleChange} error={errors.prenom} />
                <Field label="Nom" icon={User} name="nom" placeholder="Ex: Benjelloun" value={form.nom} onChange={handleChange} error={errors.nom} />
                <Field label="Adresse Email" icon={Mail} name="email" type="email" placeholder="votre.email@domain.ma" value={form.email} onChange={handleChange} error={errors.email} />
                <Field label="Mot de passe" icon={Lock} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} error={errors.password} />
                <Field label="Confirmer le mot de passe" icon={Lock} name="password_confirmation" type="password" placeholder="••••••••" value={form.password_confirmation} onChange={handleChange} error={errors.password_confirmation} />
                <Field label="Téléphone portable" icon={Phone} name="telephone" placeholder="Ex: +212 661-234567" value={form.telephone} onChange={handleChange} error={errors.telephone} />

                {/* Ville : input éditable + dropdown de suggestions */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
                    Votre ville de résidence
                  </label>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: bgSurf,
                    border: `1px solid ${errors.ville ? '#e24b4a' : bdr}`,
                    borderRadius: 10, padding: '12px 14px',
                    transition: 'border-color .15s',
                  }}>
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

                  {showCityDrop && getFilteredCities().length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
                      background: bgCard, border: `1px solid ${bdr}`, borderRadius: 10,
                      zIndex: 50, maxHeight: 220, overflowY: 'auto',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    }}>
                      {getFilteredCities().map(city => (
                        <div
                          key={city}
                          onMouseDown={() => handleCitySelect(city)}
                          style={{
                            padding: '10px 14px', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', gap: 10, fontSize: '0.85rem', color: ink,
                            transition: 'background .1s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = bgSurf}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <MapPin size={14} color={orange} />
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="button" onClick={handleNext}
                    style={{ background: ink, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2 ───────────────────────────────────── */}
            {step === 2 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
                      Niveau scolaire
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.niveau ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                      <GraduationCap size={16} color={dimmed} style={{ flexShrink: 0 }} />
                      <select
                        name="niveau"
                        value={form.niveau}
                        onChange={handleChange}
                        style={{ background: 'none', border: 'none', outline: 'none', color: form.niveau ? ink : dimmed, fontSize: '0.85rem', width: '100%', cursor: 'pointer', appearance: 'none' }}>
                        <option value="">Sélectionner votre niveau</option>
                        {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    {errors.niveau && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.niveau}</div>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
                      Budget par heure (MAD)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.budget ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                      <Wallet size={16} color={dimmed} style={{ flexShrink: 0 }} />
                      <input
                        type="number"
                        name="budget"
                        min="0"
                        step="10"
                        value={form.budget}
                        onChange={handleChange}
                        placeholder="Ex: 150"
                        style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }}
                      />
                      <span style={{ color: dimmed, fontSize: '0.75rem', flexShrink: 0 }}>MAD/h</span>
                    </div>
                    {errors.budget && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.budget}</div>}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', background: bgSurf, border: `1px solid ${bdr}`, borderRadius: 12, padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
                    Récapitulatif
                  </div>
                  <div style={{ fontSize: '0.82rem', color: ink, lineHeight: 1.7 }}>
                    <strong>{form.prenom} {form.nom}</strong> — {form.email}<br />
                    {form.ville} · {form.telephone}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button type="button" onClick={handleBack}
                    style={{ background: 'none', color: ink, border: `1px solid ${bdr}`, borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    ← Retour
                  </button>
                  <button type="submit" disabled={loading}
                    style={{ background: orange, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Création...' : 'Créer mon compte'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: muted }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: orange, fontWeight: 700, textDecoration: 'none' }}>Se connecter</Link>
        </div>
      </div>
    </div>
  )
}