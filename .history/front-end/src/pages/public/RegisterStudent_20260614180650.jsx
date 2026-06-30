import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

const CITIES = ['Casablanca','Rabat','Marrakech','Tanger','Agadir','Fès','Meknès','Oujda','Kénitra','Tétouan','Salé','Mohammedia','Nador']
const NIVEAUX = ['Primaire','Collège','Lycée - Tronc Commun','Lycée - 1ère Bac','Lycée - 2ème Bac','CPGE','Université','Adulte / Formation Continue']

export default function RegisterStudent() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

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

  const bg     = '#ffffff'
  const bgSurf = '#f7f8fa'
  const bgCard = '#ffffff'
  const bdr    = '#e9ecef'
  const ink    = '#111111'
  const muted  = '#666666'
  const dimmed = '#aaaaaa'
  const orange = '#e96f2a'

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  function validateStep1() {
    const newErrors = {}
    if (form.prenom.trim().length < 3) newErrors.prenom = 'Minimum 3 caractères'
    if (form.nom.trim().length < 3) newErrors.nom = 'Minimum 3 caractères'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Email invalide'
    if (form.password.length < 8) newErrors.password = 'Minimum 8 caractères'
    if (form.password !== form.password_confirmation) newErrors.password_confirmation = 'Les mots de passe ne correspondent pas'
    if (!form.telephone.trim()) newErrors.telephone = 'Téléphone requis'
    if (!form.ville) newErrors.ville = 'Ville requise'
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

  function Field({ label, icon, name, type = 'text', placeholder }) {
    return (
      <div>
        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
          {label}
        </label>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: bgSurf,
          border: `1px solid ${errors[name] ? '#e24b4a' : bdr}`,
          borderRadius: 10, padding: '12px 14px',
          transition: 'border-color .15s',
        }}>
          <span style={{ color: dimmed, fontSize: 16, flexShrink: 0 }}>{icon}</span>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.85rem', width: '100%' }}
          />
        </div>
        {errors[name] && (
          <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors[name]}</div>
        )}
      </div>
    )
  }

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 720 }}>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ fontWeight: 800, fontSize: '1.3rem', color: ink, textDecoration: 'none' }}>
            Learn<span style={{ color: orange }}>ect.ma</span>
          </Link>
        </div>

        <div style={{ background: bgCard, border: `1px solid ${bdr}`, borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

          <div style={{ display: 'flex', borderBottom: `1px solid ${bdr}` }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '16px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: step === 1 ? orange : dimmed, borderBottom: `2px solid ${step === 1 ? orange : 'transparent'}`, transition: 'all .2s' }}>
              1. Identité &amp; Compte
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '16px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: step === 2 ? orange : dimmed, borderBottom: `2px solid ${step === 2 ? orange : 'transparent'}`, transition: 'all .2s' }}>
              2. Niveau &amp; Budget d'étudiant
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>

            {error && (
              <div style={{ background: 'rgba(226,75,74,0.06)', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 10, padding: '12px 14px', color: '#e24b4a', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <Field label="Prénom" icon="👤" name="prenom" placeholder="Ex: Amine" />
                <Field label="Nom" icon="👤" name="nom" placeholder="Ex: Benjelloun" />
                <Field label="Adresse Email" icon="✉️" name="email" type="email" placeholder="votre.email@domain.ma" />
                <Field label="Mot de passe" icon="🔒" name="password" type="password" placeholder="••••••••" />
                <Field label="Confirmer le mot de passe" icon="🔒" name="password_confirmation" type="password" placeholder="••••••••" />
                <Field label="Téléphone portable" icon="📞" name="telephone" placeholder="Ex: +212 661-234567" />

                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
                    Votre ville de résidence
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.ville ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                    <span style={{ color: dimmed, fontSize: 16, flexShrink: 0 }}>📍</span>
                    <select
                      name="ville"
                      value={form.ville}
                      onChange={handleChange}
                      style={{ background: 'none', border: 'none', outline: 'none', color: form.ville ? ink : dimmed, fontSize: '0.85rem', width: '100%', cursor: 'pointer', appearance: 'none' }}>
                      <option value="">Sélectionner une ville</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span style={{ color: dimmed, fontSize: 12, flexShrink: 0 }}>▾</span>
                  </div>
                  {errors.ville && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.ville}</div>}
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="button" onClick={handleNext}
                    style={{ background: ink, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
                      Niveau scolaire
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.niveau ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                      <span style={{ color: dimmed, fontSize: 16, flexShrink: 0 }}>🎓</span>
                      <select
                        name="niveau"
                        value={form.niveau}
                        onChange={handleChange}
                        style={{ background: 'none', border: 'none', outline: 'none', color: form.niveau ? ink : dimmed, fontSize: '0.85rem', width: '100%', cursor: 'pointer', appearance: 'none' }}>
                        <option value="">Sélectionner votre niveau</option>
                        {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <span style={{ color: dimmed, fontSize: 12, flexShrink: 0 }}>▾</span>
                    </div>
                    {errors.niveau && <div style={{ color: '#e24b4a', fontSize: '0.7rem', marginTop: 5 }}>{errors.niveau}</div>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
                      Budget par heure (MAD)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: bgSurf, border: `1px solid ${errors.budget ? '#e24b4a' : bdr}`, borderRadius: 10, padding: '12px 14px' }}>
                      <span style={{ color: dimmed, fontSize: 16, flexShrink: 0 }}>💰</span>
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