import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { GraduationCap, User, Mail, Lock, Phone, MapPin, BookOpen, DollarSign, FileText, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

const CITIES = ['Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Fès', 'Agadir', 'Oujda', 'Meknès', 'Kénitra', 'Tétouan', 'Salé', 'Mohammedia', 'Nador']

export default function RegisterTeacher() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telephone, setTelephone] = useState('')
  const [ville, setVille] = useState('Casablanca')
  const [titre, setTitre] = useState('')
  const [diplome, setDiplome] = useState('')
  const [tarif, setTarif] = useState(150)
  const [langues, setLangues] = useState('Français, Arabe')
  const [descriptionProfil, setDescriptionProfil] = useState('')
  const [descriptionCours, setDescriptionCours] = useState('')
  const [coursDomicile, setCoursDomicile] = useState(false)
  const [coursDeplacement, setCoursDeplacement] = useState(false)
  const [coursEnligne, setCoursEnligne] = useState(true)

  const orange = '#e04f00'
  const text = '#07090d'
  const muted = '#718096'
  const border = 'rgba(0,0,0,0.10)'
  const card = '#f8f9fc'

  const inputStyle = {
    width: '100%', padding: '11px 12px 11px 38px',
    background: '#f4f4f6', border: `1px solid ${border}`,
    borderRadius: '10px', color: text, fontSize: '0.85rem',
    outline: 'none', boxSizing: 'border-box'
  }
  const labelStyle = {
    display: 'block', fontSize: '0.7rem', fontWeight: 700,
    color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px'
  }
  const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' }

  const validateStep1 = () => {
    if (!prenom.trim() || !nom.trim() || !email.trim() || !password.trim() || !telephone.trim()) {
      setError('Veuillez remplir tous les champs.'); return false
    }
    if (!email.includes('@')) { setError('Email invalide.'); return false }
    setError(''); return true
  }

  const validateStep2 = () => {
    if (!titre.trim() || !diplome.trim()) { setError('Titre et diplôme requis.'); return false }
    if (!descriptionProfil.trim() || !descriptionCours.trim()) { setError('Veuillez rédiger vos descriptions.'); return false }
    if (!coursDomicile && !coursDeplacement && !coursEnligne) { setError('Sélectionnez au moins une modalité.'); return false }
    setError(''); return true
  }

  const handleNext = () => { if (validateStep1()) setStep(2) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return
    setLoading(true)
    try {
      await register({ role: 'enseignant', prenom, nom, email, password, telephone, ville, titre, diplome, tarif, langues, descriptionProfil, descriptionCours, coursDomicile, coursDeplacement, coursEnligne })
      navigate('/teacher')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '560px', background: '#fff', border: `1px solid ${border}`, borderRadius: '20px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '1.8rem 2rem 1.4rem', borderBottom: `1px solid ${border}` }}>
          <button onClick={() => step === 1 ? navigate('/register') : setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: muted, fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', padding: 0 }}>
            <ArrowLeft size={15} /> {step === 1 ? 'Retour au choix' : 'Étape précédente'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem' }}>
            <div style={{ width: '36px', height: '36px', background: `${orange}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color={orange} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: text, margin: 0 }}>Inscription Tuteur</h1>
              <p style={{ fontSize: '0.72rem', color: muted, margin: 0 }}>Étape {step} sur 2 — {step === 1 ? 'Identité & Compte' : 'Pédagogie & Présentation'}</p>
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
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem 2rem' }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Prénom</label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={iconStyle} />
                    <input style={inputStyle} type="text" placeholder="Amine" value={prenom} onChange={e => setPrenom(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Nom</label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={iconStyle} />
                    <input style={inputStyle} type="text" placeholder="Benjelloun" value={nom} onChange={e => setNom(e.target.value)} />
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={iconStyle} />
                  <input style={inputStyle} type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={iconStyle} />
                  <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={iconStyle} />
                    <input style={inputStyle} type="tel" placeholder="+212 6XX-XXXXXX" value={telephone} onChange={e => setTelephone(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Ville</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} style={iconStyle} />
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={ville} onChange={e => setVille(e.target.value)}>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Titre de votre annonce</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={14} style={iconStyle} />
                  <input style={inputStyle} type="text" placeholder="Ex: Prof de Maths CPGE" value={titre} onChange={e => setTitre(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Diplôme</label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={14} style={iconStyle} />
                    <input style={inputStyle} type="text" placeholder="Ex: Master ENS" value={diplome} onChange={e => setDiplome(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Tarif / heure (MAD)</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} style={iconStyle} />
                    <input style={inputStyle} type="number" min={30} max={1000} value={tarif} onChange={e => setTarif(Number(e.target.value))} />
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Langues</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={14} style={iconStyle} />
                  <input style={inputStyle} type="text" placeholder="Français, Arabe, Anglais" value={langues} onChange={e => setLangues(e.target.value)} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Description de votre profil</label>
                <textarea rows={3} placeholder="Votre parcours et expérience..." value={descriptionProfil} onChange={e => setDescriptionProfil(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '12px', resize: 'none' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Description de votre cours</label>
                <textarea rows={3} placeholder="Votre méthode pédagogique..." value={descriptionCours} onChange={e => setDescriptionCours(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '12px', resize: 'none' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Modalités de cours</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'À domicile', value: coursDomicile, set: setCoursDomicile },
                    { label: 'Je me déplace', value: coursDeplacement, set: setCoursDeplacement },
                    { label: 'En ligne', value: coursEnligne, set: setCoursEnligne },
                  ].map(opt => (
                    <label key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', borderRadius: '10px', border: `1px solid ${opt.value ? orange : border}`, background: opt.value ? `${orange}0d` : card, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: text, userSelect: 'none' }}>
                      <input type="checkbox" checked={opt.value} onChange={e => opt.set(e.target.checked)} style={{ accentColor: orange }} />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            {step === 1 ? (
              <button type="button" onClick={handleNext} style={{ background: text, color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Continuer <ArrowRight size={15} />
              </button>
            ) : (
              <button type="submit" disabled={loading} style={{ background: orange, color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontWeight: 700, fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} />
                {loading ? 'Inscription...' : 'Créer mon compte Tuteur'}
              </button>
            )}
          </div>

          {step === 1 && (
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: muted, marginTop: '1rem' }}>
              Déjà un compte ?{' '}
              <span style={{ color: orange, cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>Se connecter</span>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}