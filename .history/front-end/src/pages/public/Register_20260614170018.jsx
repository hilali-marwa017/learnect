import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { GraduationCap, User, BookOpen, CheckCircle, ArrowRight, Mail, Lock, Phone, MapPin, DollarSign, FileText } from 'lucide-react'

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Fès', 'Agadir',
  'Oujda', 'Meknès', 'Kénitra', 'Tétouan', 'Salé', 'Mohammedia', 'Nador'
]

const STUDENT_LEVELS = [
  'Primaire', 'Collège', 'Lycée', 'Baccalauréat', 'CPGE', 'Université', 'Formation Professionnelle'
]

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  // Role: 'teacher' by default
  const [role, setRole] = useState('teacher')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Shared fields
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telephone, setTelephone] = useState('')
  const [ville, setVille] = useState('Casablanca')

  // Teacher-only fields
  const [titre, setTitre] = useState('')
  const [diplome, setDiplome] = useState('')
  const [tarif, setTarif] = useState(150)
  const [langues, setLangues] = useState('Français, Arabe')
  const [descriptionProfil, setDescriptionProfil] = useState('')
  const [descriptionCours, setDescriptionCours] = useState('')
  const [coursDomicile, setCoursDomicile] = useState(false)
  const [coursDeplacement, setCoursDeplacement] = useState(false)
  const [coursEnligne, setCoursEnligne] = useState(true)

  // Student-only fields
  const [niveau, setNiveau] = useState('Collège')
  const [budget, setBudget] = useState(150)

  // ── Styles ──────────────────────────────────────────────
  const bg = '#ffffff'
  const text = '#07090d'
  const muted = '#718096'
  const border = 'rgba(0,0,0,0.10)'
  const card = '#f8f9fc'
  const orange = '#e04f00'

  const inputStyle = {
    width: '100%',
    padding: '11px 12px 11px 38px',
    background: '#f4f4f6',
    border: `1px solid ${border}`,
    borderRadius: '10px',
    color: text,
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: muted,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '6px'
  }

  const fieldWrap = { marginBottom: '1rem', position: 'relative' }

  const iconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#aaa'
  }

  // ── Validation ───────────────────────────────────────────
  const validateStep1 = () => {
    if (!prenom.trim() || !nom.trim() || !email.trim() || !password.trim() || !telephone.trim()) {
      setError('Veuillez remplir tous les champs.')
      return false
    }
    if (!email.includes('@')) {
      setError('Email invalide.')
      return false
    }
    setError('')
    return true
  }

  const validateStep2Teacher = () => {
    if (!titre.trim() || !diplome.trim()) {
      setError('Veuillez remplir le titre et le diplôme.')
      return false
    }
    if (!descriptionProfil.trim() || !descriptionCours.trim()) {
      setError('Veuillez rédiger vos descriptions.')
      return false
    }
    if (!coursDomicile && !coursDeplacement && !coursEnligne) {
      setError('Sélectionnez au moins une modalité de cours.')
      return false
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (role === 'teacher' && !validateStep2Teacher()) return

    setLoading(true)
    try {
      const payload = role === 'teacher'
        ? { role, prenom, nom, email, password, telephone, ville, titre, diplome, tarif, langues, descriptionProfil, descriptionCours, coursDomicile, coursDeplacement, coursEnligne }
        : { role, prenom, nom, email, password, telephone, ville, niveau, budget }

      await register(payload)
      navigate(role === 'teacher' ? '/teacher' : '/student')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  // ── Total steps ──────────────────────────────────────────
  const totalSteps = role === 'teacher' ? 2 : 2

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '560px', background: bg, border: `1px solid ${border}`, borderRadius: '20px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '2rem 2rem 1.5rem', borderBottom: `1px solid ${border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}>
            <GraduationCap size={22} color={orange} />
            <span style={{ fontWeight: 800, fontSize: '1rem', color: text }}>
              Learn<span style={{ color: orange }}>ect</span>.ma
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: text, marginBottom: '0.3rem' }}>Créer un compte</h1>
          <p style={{ fontSize: '0.83rem', color: muted }}>Rejoignez la plateforme de soutien scolaire n°1 au Maroc.</p>

          {/* Role Toggle */}
          <div style={{ display: 'flex', background: card, border: `1px solid ${border}`, borderRadius: '12px', padding: '4px', marginTop: '1.2rem' }}>
            <button
              onClick={() => { setRole('teacher'); setStep(1); setError('') }}
              style={{
                flex: 1, padding: '9px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                background: role === 'teacher' ? '#fff' : 'transparent',
                color: role === 'teacher' ? text : muted,
                boxShadow: role === 'teacher' ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
              }}
            >
              <BookOpen size={15} color={role === 'teacher' ? orange : '#aaa'} />
              Professeur / Tuteur
            </button>
            <button
              onClick={() => { setRole('student'); setStep(1); setError('') }}
              style={{
                flex: 1, padding: '9px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                background: role === 'student' ? '#fff' : 'transparent',
                color: role === 'student' ? text : muted,
                boxShadow: role === 'student' ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
              }}
            >
              <User size={15} color={role === 'student' ? '#1c64f2' : '#aaa'} />
              Élève / Étudiant
            </button>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: '3px', borderRadius: '99px',
                background: step >= s ? orange : '#e2e8f0',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', color: muted, marginTop: '6px' }}>
            Étape {step} sur {totalSteps} — {step === 1 ? 'Identité & Compte' : role === 'teacher' ? 'Pédagogie & Présentation' : 'Niveau & Budget'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', borderBottom: `1px solid rgba(220,38,38,0.2)`, color: '#dc2626', fontSize: '0.82rem', padding: '10px 2rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem 2rem' }}>

          {/* ── STEP 1: Identité ── */}
          {step === 1 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Prénom</label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={iconStyle} />
                    <input style={inputStyle} type="text" placeholder="Amine" value={prenom} onChange={e => setPrenom(e.target.value)} required />
                  </div>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Nom</label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={iconStyle} />
                    <input style={inputStyle} type="text" placeholder="Benjelloun" value={nom} onChange={e => setNom(e.target.value)} required />
                  </div>
                </div>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Adresse Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={iconStyle} />
                  <input style={inputStyle} type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={iconStyle} />
                  <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Téléphone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={iconStyle} />
                    <input style={inputStyle} type="tel" placeholder="+212 6XX-XXXXXX" value={telephone} onChange={e => setTelephone(e.target.value)} required />
                  </div>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Ville</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} style={iconStyle} />
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={ville} onChange={e => setVille(e.target.value)}>
                      {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 TEACHER ── */}
          {step === 2 && role === 'teacher' && (
            <div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Titre de votre annonce</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={14} style={iconStyle} />
                  <input style={inputStyle} type="text" placeholder="Ex: Professeur de Mathématiques - CPGE" value={titre} onChange={e => setTitre(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Diplôme</label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={14} style={iconStyle} />
                    <input style={inputStyle} type="text" placeholder="Ex: Master ENS" value={diplome} onChange={e => setDiplome(e.target.value)} required />
                  </div>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Tarif / heure (MAD)</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} style={iconStyle} />
                    <input style={inputStyle} type="number" min={30} max={1000} value={tarif} onChange={e => setTarif(Number(e.target.value))} required />
                  </div>
                </div>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Langues maîtrisées</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={14} style={iconStyle} />
                  <input style={inputStyle} type="text" placeholder="Ex: Français, Arabe, Anglais" value={langues} onChange={e => setLangues(e.target.value)} />
                </div>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Description de votre profil</label>
                <textarea
                  rows={3}
                  placeholder="Présentez votre parcours et votre expérience..."
                  value={descriptionProfil}
                  onChange={e => setDescriptionProfil(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '12px', resize: 'none' }}
                  required
                />
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Description de votre cours</label>
                <textarea
                  rows={3}
                  placeholder="Votre méthode pédagogique, matières enseignées..."
                  value={descriptionCours}
                  onChange={e => setDescriptionCours(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '12px', resize: 'none' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Modalités de cours</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'À domicile', value: coursDomicile, set: setCoursDomicile },
                    { label: 'Je me déplace', value: coursDeplacement, set: setCoursDeplacement },
                    { label: 'En ligne', value: coursEnligne, set: setCoursEnligne },
                  ].map(opt => (
                    <label key={opt.label} style={{
                      display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px',
                      borderRadius: '10px', border: `1px solid ${opt.value ? orange : border}`,
                      background: opt.value ? `${orange}0d` : card,
                      cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: text, userSelect: 'none'
                    }}>
                      <input type="checkbox" checked={opt.value} onChange={e => opt.set(e.target.checked)} style={{ accentColor: orange }} />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 STUDENT ── */}
          {step === 2 && role === 'student' && (
            <div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Niveau scolaire</label>
                <div style={{ position: 'relative' }}>
                  <BookOpen size={14} style={iconStyle} />
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={niveau} onChange={e => setNiveau(e.target.value)}>
                    {STUDENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Budget max / heure (MAD)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={14} style={iconStyle} />
                  <input style={inputStyle} type="number" min={20} max={1000} value={budget} onChange={e => setBudget(Number(e.target.value))} required />
                </div>
              </div>

              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: muted, margin: 0, lineHeight: 1.6 }}>
                  ✅ <strong style={{ color: text }}>Première heure offerte</strong> — Votre premier cours d'évaluation est totalement gratuit.<br />
                  ✅ <strong style={{ color: text }}>Sans engagement</strong> — Annulez à tout moment.
                </p>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            {step === 2 ? (
              <button type="button" onClick={() => { setStep(1); setError('') }} style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '10px', padding: '11px 20px', fontWeight: 600, fontSize: '0.82rem', color: muted, cursor: 'pointer' }}>
                Retour
              </button>
            ) : (
              <span style={{ fontSize: '0.8rem', color: muted }}>
                Déjà un compte ?{' '}
                <span style={{ color: orange, cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>
                  Se connecter
                </span>
              </span>
            )}

            {step === 1 ? (
              <button type="button" onClick={handleNext} style={{ background: text, color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Continuer <ArrowRight size={15} />
              </button>
            ) : (
              <button type="submit" disabled={loading} style={{ background: orange, color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontWeight: 700, fontSize: '0.82rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} />
                {loading ? 'Inscription...' : role === 'teacher' ? 'Créer mon compte Tuteur' : 'Créer mon compte Étudiant'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}