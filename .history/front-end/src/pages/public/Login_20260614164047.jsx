import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight, Lightbulb } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'enseignant') navigate('/enseignant/dashboard')
      else navigate('/etudiant/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        background: '#141416',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr'
      }}>

        {/* LEFT PANEL */}
        <div style={{
          background: '#111113',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }}>
          {/* Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2.5rem' }}>
              <div style={{
                width: '40px', height: '40px',
                background: '#e04f00',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <GraduationCap size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                  Learnect<span style={{ color: '#e04f00' }}>.ma</span>
                </div>
                <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Portail académique marocain
                </div>
              </div>
            </div>

            {/* Astuce */}
            <div style={{
              background: 'rgba(224,79,0,0.08)',
              border: '1px solid rgba(224,79,0,0.2)',
              borderRadius: '12px',
              padding: '1rem 1.2rem',
              display: 'flex',
              gap: '10px',
              marginBottom: '2rem'
            }}>
              <Lightbulb size={18} color="#e04f00" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: 1.6, margin: 0 }}>
                Astuce : Tapez <strong style={{ color: '#fff' }}>"admin"</strong> pour ouvrir la session Admin, <strong style={{ color: '#fff' }}>"teacher"</strong> pour l'Enseignant, ou inscrivez-vous en tant qu'étudiant.
              </p>
            </div>
          </div>

          {/* Bottom tagline */}
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: '0.75rem' }}>
              Réussissez vos examens<br />avec nos tuteurs d'élite.
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, margin: 0 }}>
              Plateforme préférée pour le soutien scolaire personnalisé au Maroc.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
              Authentification
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
              Veuillez saisir votre e-mail pour accéder à vos panels sécurisés
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.3)',
              color: '#f87171',
              fontSize: '0.82rem',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '1.2rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Adresse Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="#555" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom prenom@domain.ma / admin / teacher"
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '13px',
                  paddingBottom: '13px',
                  background: '#1c1c1e',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Mot de passe
              </label>
              <span style={{ fontSize: '0.78rem', color: '#e04f00', cursor: 'pointer' }}>Perdu ?</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="#555" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '44px',
                  paddingTop: '13px',
                  paddingBottom: '13px',
                  background: '#1c1c1e',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 0 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              background: '#fff',
              color: '#0a0a0c',
              border: 'none',
              borderRadius: '10px',
              padding: '14px',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '1.5rem'
            }}
          >
            <ArrowRight size={16} />
            {loading ? 'Connexion...' : 'Ouvrir ma session sécurisée'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#666', margin: 0 }}>
            Pas encore adhérent ?{' '}
            <Link to="/register" style={{ color: '#e04f00', fontWeight: 600, textDecoration: 'none' }}>
              Créer un espace gratuit
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}